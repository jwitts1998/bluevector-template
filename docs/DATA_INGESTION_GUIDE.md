# Data Ingestion Guide

**Version**: 1.0.0
**Last Updated**: March 2026

## Overview

The data ingestion platform provides a reusable pipeline for collecting, processing, and serving structured data from multiple sources. It combines web scraping, API connectors, and web search into a unified pipeline using medallion architecture (bronze/silver/gold).

### When to Use

- Collecting data from external websites (products, people, competitors)
- Ingesting content from documentation sites or knowledge bases
- Pulling structured data from third-party APIs
- Building search + scrape workflows
- Any feature that needs external data as input

### Architecture

```
Input Channels                    Processing Pipeline                    Output
┌──────────────────┐             ┌──────────────────────────────────┐
│ Firecrawl        │─scrape──┐   │ Bronze    → Silver    → Gold    │   → Project features
│ Stagehand        │─interact┤   │ (raw)       (clean)    (ready)  │   → Marketing portal
│ Jina Reader      │─read────┤   │ immutable   validated  enriched │   → Analytics
│ API connectors   │─pull────┘   │ append-only deduped    resolved │   → Search index
│ Web search       │─find+scrape └──────────────────────────────────┘
└──────────────────┘
```

---

## Quick Start

### 1. Enable Firecrawl MCP

Add to your `.mcp.json`:

```json
{
  "firecrawl": {
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "firecrawl-mcp"],
    "env": { "FIRECRAWL_API_KEY": "${FIRECRAWL_API_KEY}" }
  }
}
```

### 2. Install SDKs

```bash
# Firecrawl (managed scraping)
npm install @mendable/firecrawl-js

# Stagehand (interactive scraping)
npm install @browserbasehq/stagehand
npx playwright install chromium

# Zod (schema validation for silver layer)
npm install zod
```

### 3. Set Environment Variables

```bash
FIRECRAWL_API_KEY=fc-your-key          # From firecrawl.dev
ANTHROPIC_API_KEY=sk-ant-your-key      # For Stagehand AI (or use OPENAI_API_KEY)
```

---

## Medallion Architecture

### Bronze Layer (Raw)

Raw data exactly as collected. **Never modified after creation.**

```typescript
// Bronze record schema
interface BronzeRecord {
  id: string;
  source_url: string;
  source_type: 'scrape' | 'api' | 'search' | 'webhook';
  raw_content: string;          // HTML, JSON, or markdown
  content_hash: string;         // SHA-256 for deduplication
  content_format: 'html' | 'json' | 'markdown' | 'text';
  collected_at: Date;
  collection_metadata: {
    tool: string;               // 'firecrawl' | 'stagehand' | 'jina' | 'api'
    response_status: number;
    duration_ms: number;
  };
}
```

**Rules**: Store everything. Don't transform. Content hash enables dedup.

### Silver Layer (Cleaned)

Validated, parsed, deduplicated. Schema-on-write with Zod.

```typescript
import { z } from 'zod';

// Define entity schemas
const PersonSchema = z.object({
  name: z.string(),
  title: z.string().optional(),
  company: z.string().optional(),
  email: z.string().email().optional(),
  linkedin_url: z.string().url().optional(),
  bio: z.string().optional(),
});

const ProductSchema = z.object({
  name: z.string(),
  price: z.number(),
  currency: z.string().default('USD'),
  description: z.string().optional(),
  url: z.string().url(),
  image_url: z.string().url().optional(),
  seller: z.string().optional(),
});

// Promote bronze → silver
function promoteToBronze(bronze: BronzeRecord, entityType: string) {
  const schema = schemas[entityType];
  const parsed = schema.safeParse(extractedData);

  if (!parsed.success) {
    // Log validation failure, keep in bronze for retry
    return null;
  }

  return {
    source_bronze_id: bronze.id,
    entity_type: entityType,
    parsed_data: parsed.data,
    confidence_score: calculateConfidence(parsed),
    processed_at: new Date(),
  };
}
```

### Gold Layer (Enriched)

Cross-source entity resolution, enrichment, aggregation.

```typescript
// Merge person data from multiple silver records
function enrichPerson(silverRecords: SilverRecord[]): GoldRecord {
  const merged = {
    name: pickBestValue(silverRecords, 'name'),
    title: pickBestValue(silverRecords, 'title'),
    company: pickBestValue(silverRecords, 'company'),
    email: pickBestValue(silverRecords, 'email'),
    profiles: silverRecords.map(r => r.parsed_data.url).filter(Boolean),
    bio: mergeBios(silverRecords),
  };

  return {
    entity_type: 'person',
    source_silver_ids: silverRecords.map(r => r.id),
    data: merged,
    enrichment_metadata: {
      sources_count: silverRecords.length,
      last_enriched_at: new Date(),
    },
  };
}
```

---

## Input Channels

### Firecrawl (Default Choice)

```typescript
import Firecrawl from '@mendable/firecrawl-js';
const app = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY });

// 1. Scrape single URL → markdown
const doc = await app.scrapeUrl('https://example.com', {
  formats: ['markdown'],
});
// → Store doc.markdown in bronze as content_format: 'markdown'

// 2. Crawl entire site
const crawl = await app.crawlUrl('https://docs.example.com', {
  limit: 100,           // Max pages
  scrapeOptions: { formats: ['markdown'] },
});
// → Store each page as a bronze record

// 3. Search + scrape
const results = await app.search('auction laptops site:ebay.com', {
  limit: 10,
});
// → Store each result as a bronze record

// 4. Structured extraction with LLM
const extracted = await app.scrapeUrl('https://example.com/products', {
  formats: ['extract'],
  extract: {
    schema: z.object({
      products: z.array(z.object({
        name: z.string(),
        price: z.string(),
        description: z.string(),
      })),
    }),
  },
});
// → Store raw in bronze, parsed extraction goes directly to silver
```

### Stagehand (Interactive Sites)

```typescript
import { Stagehand } from '@browserbasehq/stagehand';
import { z } from 'zod';

const stagehand = new Stagehand({ env: 'LOCAL' });
await stagehand.init();

// Login flow
await stagehand.page.goto('https://auction-site.com/login');
await stagehand.page.act('type "user@email.com" in the email field');
await stagehand.page.act('type "password123" in the password field');
await stagehand.page.act('click the Sign In button');

// Navigate to target
await stagehand.page.act('click on "Active Auctions"');

// Extract structured data
const auctions = await stagehand.page.extract({
  instruction: 'extract all auction listings with title, current bid, time remaining, and seller',
  schema: z.object({
    listings: z.array(z.object({
      title: z.string(),
      current_bid: z.string(),
      time_remaining: z.string(),
      seller: z.string(),
    })),
  }),
});
// → Store page HTML in bronze, extracted data in silver

await stagehand.close();
```

### Jina AI Reader (Quick + Simple)

```typescript
// URL → markdown (no SDK needed)
const res = await fetch('https://r.jina.ai/https://example.com/about');
const markdown = await res.text();
// → Store in bronze as content_format: 'markdown'

// Web search
const search = await fetch('https://s.jina.ai/Jackson+Wittenberg+founder');
const results = await search.text();
// → Store in bronze, parse results to silver
```

### API Connectors

```typescript
// Polling connector pattern
async function pollAPI(config: {
  url: string;
  interval: number;
  cursor?: string;
}) {
  const params = new URLSearchParams();
  if (config.cursor) params.set('since', config.cursor);

  const res = await fetch(`${config.url}?${params}`);
  const data = await res.json();

  // Store in bronze
  await storeBronze({
    source_url: config.url,
    source_type: 'api',
    raw_content: JSON.stringify(data),
    content_format: 'json',
    collection_metadata: {
      tool: 'api',
      response_status: res.status,
      cursor: data.next_cursor,
    },
  });

  return data.next_cursor; // For next poll
}
```

---

## Use Case Recipes

### Person Research

Collect all available info about a person from multiple sources.

```
1. Search: Firecrawl search("John Doe software engineer") → find relevant URLs
2. Scrape: Firecrawl scrapeUrl for each URL → bronze records
3. Parse: Extract person data (name, title, company, bio) → silver records
4. Resolve: Merge silver records from different sources → gold person record
```

### Auction Product Monitoring

Track products and prices from auction sites.

```
1. Login: Stagehand to authenticate on auction site
2. Navigate: Stagehand act("go to electronics auctions")
3. Extract: Stagehand extract with ProductSchema → silver records
4. Schedule: Run daily, content hash dedup prevents duplicates
5. Enrich: Gold layer tracks price history over time
```

### Competitor Research

Gather competitor positioning for marketing.

```
1. Crawl: Firecrawl crawlUrl on competitor site → bronze records
2. Search: Firecrawl search("competitor vs [your product]") → more bronze
3. Parse: Extract positioning, features, pricing → silver records
4. Feed: Gold layer feeds into marketing portal's product context
```

### Content Ingestion

Build a knowledge base from documentation sites.

```
1. Map: Firecrawl mapUrl to discover all documentation pages
2. Crawl: Firecrawl crawlUrl with markdown format → bronze records
3. Clean: Parse markdown, extract sections, validate → silver records
4. Index: Gold layer structures content for search/RAG
```

---

## Agent Integration

| Concern | Agent | When |
|---------|-------|------|
| Pipeline orchestration | `@data-ingestion` | Designing the overall pipeline |
| Scraping implementation | `@web-scraping-specialist` | Configuring Firecrawl, Stagehand, selectors |
| Data modeling | `@schema-data` | Bronze/silver/gold table schemas |
| dbt transformations | `@data-science-specialist` | Medallion layer dbt models |
| API connectors | `@api-connections` | Third-party API integration |

### Task File Example

```yaml
- id: INGEST_T1_person_pipeline
  title: "Build person research pipeline"
  description: "Multi-source person data collection with entity resolution"
  agent_roles: [implementation, testing]
  domain_agents:
    - data-ingestion     # primary — pipeline orchestration
    - schema-data        # supporting — bronze/silver/gold schemas
  acceptance_criteria:
    - "Firecrawl search finds relevant URLs for a person"
    - "Bronze records store raw content with content hash"
    - "Silver records pass PersonSchema Zod validation"
    - "Gold records merge data from multiple sources"
```

---

## Troubleshooting

| Issue | Likely Cause | Fix |
|-------|-------------|-----|
| Firecrawl returns empty | Site blocks scraping | Try with `waitFor` option or switch to Stagehand |
| Stagehand can't find element | Page structure changed | Use `observe()` to see current page state |
| High dedup rate | Same content collected repeatedly | Check polling interval, add cursor-based incremental |
| Silver validation failures | Schema drift on source site | Update Zod schema, check bronze data samples |
| Slow pipeline | Too many sequential requests | Add concurrency, batch bronze writes |
| Rate limit errors | Hitting source API/site limits | Configure rate limiter, add backoff delays |
