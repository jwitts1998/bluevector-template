# Backend Service Example — PaymentAPI

A complete walkthrough of using the multi-agent system template for a **net-new backend service idea**, from clone to development.

## The Idea

"I need a payment processing API for e-commerce — handle charges, refunds, webhooks, with Stripe integration."

## Step 1: Clone and Setup

```bash
git clone https://github.com/jwitts1998/multi-agent-system-template.git payment-api
cd payment-api
./setup.sh
```

**Setup answers**:

| Prompt | Value |
|--------|-------|
| Project name | PaymentAPI |
| One-line description | Payment processing REST API for e-commerce platforms |
| Project type | backend-service |
| Primary language | TypeScript |
| Framework | Express |
| Database | PostgreSQL |
| Architecture | Layered Architecture |
| Test framework | Jest |
| Test coverage target | 90 |
| Remove template files? | y |

Verify setup:

```bash
./validate.sh
```

## Step 2: Flush the Idea

```
idea-to-pdb subagent

I want to build PaymentAPI — a payment processing REST API for e-commerce.

Core idea: Accept payment requests, process them through Stripe, store
transaction records, and send webhooks on status changes. Support charges,
refunds, and subscription billing.

Target users: E-commerce platforms integrating via REST API.
Success in 30 days: Working API that can process a test charge through
Stripe and return a receipt.
Constraints: Express + TypeScript, PostgreSQL with Prisma, Stripe SDK.
Security is critical — PCI compliance awareness needed.
MVP first.
```

Output: `docs/product_design/paymentapi_pdb.md`

## Step 3: Create Tasks from the PDB

```
pdb-to-tasks subagent

Read docs/product_design/paymentapi_pdb.md and decompose it into epics and task files.
```

Result:

```
tasks/
├── 00_phase0_build_prep.yml           # Project scaffolding, DB setup, Stripe config
├── 01_payment_processing.yml          # Charge endpoint, Stripe integration, receipts
├── 02_refunds_and_disputes.yml        # Refund endpoint, dispute handling
├── 03_webhooks.yml                    # Webhook delivery, retry logic, signing
├── 04_subscription_billing.yml        # Recurring charges, plan management (Phase 2)
└── 05_reporting_and_analytics.yml     # Transaction reports, dashboards (Phase 2)
```

Example task:

```yaml
epic: E01_Payment_Processing
feature: Charge_Endpoint

context:
  phase: 1
  spec_refs:
    - "PDB: docs/product_design/paymentapi_pdb.md — Section 3.2: Payment Processing"
    - "PDB: docs/product_design/paymentapi_pdb.md — Section 6: Data Architecture"

tasks:
  - id: E01_T1_define_payment_schema
    title: "Define payment data schema and API contract (schema-first)"
    type: chore
    status: todo
    priority: high
    agent_roles:
      - implementation
      - documentation
    description: >
      Define Prisma schema for transactions, API contract for POST /api/v1/payments,
      and error response shapes.
    acceptance_criteria:
      - "Prisma schema created with Transaction, Refund, Webhook models"
      - "API contract documented with request/response shapes"
      - "Error codes and responses defined"

  - id: E01_T2_implement_charge_endpoint
    title: "Implement POST /api/v1/payments charge endpoint"
    type: story
    status: todo
    priority: high
    agent_roles:
      - implementation
      - security
    description: >
      Create payment processing endpoint: validate input, create Stripe charge,
      store transaction, return receipt.
    acceptance_criteria:
      - "Endpoint validates payment data (amount, currency, source)"
      - "Integrates with Stripe Charges API"
      - "Stores transaction in database"
      - "Returns structured receipt"
      - "Rate limiting enabled"
      - "Input sanitization passes security audit"
    blocked_by:
      - E01_T1_define_payment_schema
```

## Step 4: Begin Development

Work through tasks using the multi-agent workflow:

```
1. Implementation Agent → implements endpoint
2. security-auditor → audits input validation, auth, rate limiting
3. node-specialist → provides Express/TypeScript patterns
4. code-reviewer → reviews code quality
5. test-writer → creates integration tests
```

## Resulting Workflow

```
Clone repo
    ↓
./setup.sh (backend-service, Express, TypeScript)
    ↓
idea-to-pdb subagent → docs/product_design/paymentapi_pdb.md
    ↓
pdb-to-tasks subagent → tasks/00-05_*.yml
    ↓
Pick first task → implement → security audit → review → test → done
```

## Success Metrics

- Response time < 200ms (p95)
- Test coverage > 90%
- No security vulnerabilities (audited)
- API documented (OpenAPI)
- All sensitive data encrypted
- Rate limiting on all endpoints
