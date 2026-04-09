# GCP Setup Guide

This guide walks through setting up Google Cloud Platform services for your BlueVector AI project.

## Prerequisites

- Google Cloud SDK (`gcloud`) installed: `brew install google-cloud-sdk`
- Firebase CLI installed: `npm install -g firebase-tools`
- A Google Cloud account with billing enabled

## 1. GCP Project Setup

```bash
# Authenticate
gcloud auth login

# Create a new project (or use an existing one)
gcloud projects create YOUR_PROJECT_ID --name="Your Project Name"

# Set as active project
gcloud config set project YOUR_PROJECT_ID

# Set default region
gcloud config set run/region us-central1

# Enable required APIs
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  artifactregistry.googleapis.com \
  cloudfunctions.googleapis.com
```

## 2. Firebase Setup

```bash
# Login to Firebase
firebase login

# Initialize Firebase in your project directory
firebase init

# Select services:
#   - Firestore (if using NoSQL)
#   - Authentication
#   - Hosting (for web frontends)
#   - Cloud Functions (if needed)
#   - Storage (for file uploads)

# Link to your GCP project
firebase use YOUR_PROJECT_ID
```

## 3. Cloud SQL Setup

```bash
# Create a PostgreSQL instance
gcloud sql instances create main-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1

# Create a database
gcloud sql databases create app_db --instance=main-db

# Create a user
gcloud sql users create app_user \
  --instance=main-db \
  --password=YOUR_SECURE_PASSWORD

# For local development, use Cloud SQL Auth Proxy:
# Install: https://cloud.google.com/sql/docs/postgres/sql-proxy
cloud-sql-proxy YOUR_PROJECT_ID:us-central1:main-db
```

## 4. Cloud Run Setup

```bash
# Build and deploy a service
gcloud run deploy my-service \
  --source . \
  --region us-central1 \
  --allow-unauthenticated

# Connect to Cloud SQL (add connection flag)
gcloud run deploy my-service \
  --source . \
  --region us-central1 \
  --add-cloudsql-instances=YOUR_PROJECT_ID:us-central1:main-db \
  --set-env-vars="DB_HOST=/cloudsql/YOUR_PROJECT_ID:us-central1:main-db"
```

## 5. Secret Manager

```bash
# Create a secret
echo -n "my-secret-value" | gcloud secrets create MY_SECRET --data-file=-

# Grant Cloud Run access
gcloud secrets add-iam-policy-binding MY_SECRET \
  --member="serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Reference in Cloud Run
gcloud run deploy my-service \
  --update-secrets=MY_SECRET=MY_SECRET:latest
```

## 6. Service Account Setup

```bash
# Create a service account for local development
gcloud iam service-accounts create local-dev \
  --display-name="Local Development"

# Grant necessary roles
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:local-dev@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/cloudsql.client"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:local-dev@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/firebase.admin"

# Download key (for local dev only — use Workload Identity in CI/CD)
gcloud iam service-accounts keys create service-account.json \
  --iam-account=local-dev@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

## 7. Environment Variables

Your `.env` file should contain:

```bash
GCP_PROJECT_ID=your-project-id
FIREBASE_PROJECT_ID=your-project-id
GCP_REGION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json

# Database (local development)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=app_db
DB_USER=app_user
DB_PASSWORD=your-local-password

# MCP API Keys
GITHUB_PERSONAL_ACCESS_TOKEN=...
```

## 8. CI/CD with Cloud Build

Create `cloudbuild.yaml` in your project root:

```yaml
steps:
  # Run tests
  - name: 'node:20'
    entrypoint: 'npm'
    args: ['ci']
  - name: 'node:20'
    entrypoint: 'npm'
    args: ['test']

  # Build and push container
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'us-central1-docker.pkg.dev/$PROJECT_ID/app/my-service:$COMMIT_SHA', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'us-central1-docker.pkg.dev/$PROJECT_ID/app/my-service:$COMMIT_SHA']

  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'my-service'
      - '--image=us-central1-docker.pkg.dev/$PROJECT_ID/app/my-service:$COMMIT_SHA'
      - '--region=us-central1'
```

Set up a build trigger:

```bash
gcloud builds triggers create github \
  --repo-name=your-repo \
  --repo-owner=your-org \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

## Security Checklist

- [ ] Service account keys are in `.gitignore`
- [ ] Production secrets in Secret Manager (not .env)
- [ ] Cloud SQL not publicly accessible
- [ ] Firebase Security Rules configured (not in test mode)
- [ ] IAM roles follow least-privilege
- [ ] Budget alerts enabled in Cloud Billing
