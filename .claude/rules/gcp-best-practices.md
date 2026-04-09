# GCP Best Practices

## Cloud Run

- Design services as stateless containers
- Set min instances to 0 for dev, 1+ for production to avoid cold starts
- Use concurrency settings appropriate to the workload (default 80)
- Configure CPU allocation: "always on" for sustained traffic, "request-only" for bursty
- Use `gcloud run deploy` or Cloud Build for deployments

## Cloud SQL

- Connect from Cloud Run via Unix socket (`/cloudsql/PROJECT:REGION:INSTANCE`)
- Use connection pooling (PgBouncer or built-in pooler) for high-concurrency services
- Never expose Cloud SQL publicly — use Private IP or Cloud SQL Auth Proxy
- Run migrations via Cloud Build steps or a dedicated migration job, not from application startup
- Use `cloudsql-proxy` for local development

## Firebase

- Use Firebase Auth for client-facing authentication (Google, email, social providers)
- Use Firestore for real-time data with offline support (mobile apps)
- Use Cloud SQL for relational data with complex queries (backends, full-stack)
- Configure Firebase Security Rules — never leave Firestore/Storage in test mode in production
- Use Firebase Hosting for static frontends and SSR with Cloud Run rewrites

## Secret Manager

- Never hardcode secrets or commit `.env` files with real credentials
- Use `gcloud secrets versions access` in CI/CD and Cloud Build
- Mount secrets as environment variables in Cloud Run services
- Rotate secrets regularly and use secret versioning

## IAM

- Follow least-privilege principle — grant only the permissions needed
- Use service accounts per service, not a shared "admin" account
- Use Workload Identity Federation for CI/CD instead of service account keys
- Audit IAM bindings regularly with `gcloud projects get-iam-policy`

## Cost Optimization

- Use Cloud Run scale-to-zero for development and staging environments
- Set Cloud SQL to lightweight machine types for dev (db-f1-micro)
- Use Firebase Spark (free) plan for development projects
- Enable budget alerts in Cloud Billing
- Use committed use discounts for production Cloud SQL instances

## CI/CD with Cloud Build

- Use `cloudbuild.yaml` for build pipelines
- Cache Docker layers with Artifact Registry
- Run tests in Cloud Build before deploying
- Use substitution variables for environment-specific config
- Trigger builds from GitHub pushes via Cloud Build triggers
