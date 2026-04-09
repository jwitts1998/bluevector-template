---
description: Guides medallion architecture decisions and scraping tool selection for data ingestion tasks.
paths:
  - tasks/*.yml
  - src/**/ingest*
  - src/**/scrape*
  - src/**/pipeline*
  - src/**/collect*
  - src/**/bronze*
  - src/**/silver*
  - src/**/gold*
---

# Data Ingestion Patterns

## Medallion Architecture

When implementing data storage for collected or scraped data, use the three-layer pattern:

1. **Bronze**: Raw data as collected. Immutable, append-only, timestamped, content-hashed. Never transform at this stage.
2. **Silver**: Cleaned, validated with Zod, deduplicated by content hash. Schema-on-write — validate before promoting.
3. **Gold**: Enriched, aggregated, entity-resolved, consumption-ready. Domain-specific types.

**Never skip layers. Never mutate bronze. Silver promotion requires passing quality gates.**

## Scraping Tool Selection

| Scenario | Tool | Why |
|----------|------|-----|
| Known API available | API connector | Fastest, most reliable, structured data |
| Simple page, need text | Jina Reader (`r.jina.ai`) | Zero setup, instant markdown |
| JS-rendered page | Firecrawl `scrapeUrl` | Handles rendering + anti-bot |
| Entire site crawl | Firecrawl `crawlUrl` | Built-in queue, sitemap following |
| Structured data extraction | Firecrawl `scrapeUrl` + `extract` | LLM extraction built-in |
| Login required | Stagehand | AI-driven browser interaction |
| Multi-step flow | Stagehand | act/extract/observe pattern |
| Find pages first | Firecrawl `search` or Jina `s.jina.ai` | Search + scrape |
| Custom scraping logic | Playwright / Cheerio / Crawlee | Full control, more code |

## Quality Gates

**Bronze → Silver:**
- Zod schema validation passes
- Required fields present and non-empty
- Content hash is unique (no existing silver record from same source with same hash)

**Silver → Gold:**
- Referential integrity (source silver records exist)
- Business rules pass (domain-specific validation)
- Freshness check (silver data is not stale)

## Anti-Patterns

- Storing scraped data directly in gold layer (skipping bronze/silver)
- Building custom Playwright scrapers when Firecrawl handles the use case
- Using Stagehand for simple static pages (overkill — use Firecrawl or Jina)
- Mutating bronze records after creation (bronze is immutable append-only)
- Hardcoding selectors without fallback extraction strategy
- Scraping without rate limiting or robots.txt respect
