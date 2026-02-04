# Azure Deployment Setup Guide

This guide helps you configure the Azure publish pipeline for the Sarathi UI Angular application.

## Prerequisites

1. **Azure Account**: Create an account at [azure.microsoft.com](https://azure.microsoft.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Azure CLI**: Install [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)

## Option 1: Azure Static Web Apps (Recommended for SPA)

### Step 1: Create Static Web Apps Resource

```bash
# Login to Azure
az login

# Create a resource group
az group create --name sarathi-rg --location eastus

# Create Static Web Apps resource
az staticwebapp create \
  --name sarathi-ui \
  --resource-group sarathi-rg \
  --source https://github.com/YOUR_USERNAME/YOUR_REPO \
  --branch main \
  --location eastus \
  --sku Free
```

### Step 2: Get API Token

```bash
# Retrieve the deployment token
az staticwebapp secrets list \
  --name sarathi-ui \
  --resource-group sarathi-rg \
  --query "properties.apiToken" -o tsv
```

### Step 3: Add GitHub Secret

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add secret named `AZURE_STATIC_WEB_APPS_API_TOKEN`
5. Paste the API token from Step 2

### Step 4: Configure Static Web App

Create `staticwebapp.config.json` in the root of your project:

```json
{
  "routes": [
    {
      "route": "/*",
      "serve": "/index.html",
      "statusCode": 200
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/images/*.{svg,png,gif,ico}", "/css/*"]
  }
}
```

## Option 2: Azure App Service (Node.js Runtime)

### Step 1: Create App Service Plan & App

```bash
# Create resource group
az group create --name sarathi-rg --location eastus

# Create App Service Plan
az appservice plan create \
  --name sarathi-plan \
  --resource-group sarathi-rg \
  --sku B1 \
  --is-linux

# Create Web App
az webapp create \
  --resource-group sarathi-rg \
  --plan sarathi-plan \
  --name sarathi-ui \
  --runtime "NODE|20"
```

### Step 2: Create Service Principal for GitHub Actions

```bash
# Create service principal
az ad sp create-for-rbac \
  --name "github-sarathi-ui" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/sarathi-rg \
  --json-auth
```

### Step 3: Add GitHub Secrets

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add the following secrets:

- `AZURE_CREDENTIALS`: Paste the entire JSON output from Step 2
- `AZURE_APPSERVICE_NAME`: `sarathi-ui`
- `AZURE_SUBSCRIPTION_ID`: Your Azure subscription ID
- `AZURE_APPSERVICE_PLAN`: `sarathi-plan`

### Step 4: Configure App Service

```bash
# Configure Node.js startup
az webapp config appsettings set \
  --resource-group sarathi-rg \
  --name sarathi-ui \
  --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true

# Enable logging
az webapp log config \
  --resource-group sarathi-rg \
  --name sarathi-ui \
  --web-server-logging filesystem
```

## Workflow Triggers

The pipeline runs on:
- **Push** to `main` or `master` branch (deploys to Azure)
- **Pull requests** to `main` or `master` (builds only, no deployment)

## Monitoring Deployments

### Azure Portal
1. Go to Azure Portal
2. Navigate to your Static Web App or App Service
3. View deployment history and logs

### GitHub Actions
1. Go to your GitHub repository
2. Click "Actions" tab
3. View workflow runs and logs

## Troubleshooting

### Build Failures
```bash
# Check logs locally
npm run build -- --configuration production
```

### Deployment Errors
```bash
# Check Azure logs
az webapp log tail --resource-group sarathi-rg --name sarathi-ui
```

### CORS Issues
Add CORS configuration to your backend API or enable CORS in Azure:

```bash
az webapp cors add --resource-group sarathi-rg --name sarathi-ui --allowed-origins "*"
```

## Environment Variables in Azure

### For Static Web Apps
Set environment variables in `staticwebapp.config.json` or via Azure Portal environment variables.

### For App Service
```bash
az webapp config appsettings set \
  --resource-group sarathi-rg \
  --name sarathi-ui \
  --settings API_URL="https://your-api.azurewebsites.net"
```

## Custom Domain Setup

### Static Web Apps
```bash
az staticwebapp hostname set \
  --name sarathi-ui \
  --resource-group sarathi-rg \
  --hostname yourdomain.com
```

### App Service
1. Go to Azure Portal
2. App Service → Custom domains
3. Add your domain and configure DNS

## Cost Optimization

- **Static Web Apps**: Free tier includes 100GB bandwidth/month
- **App Service**: B1 tier starts at ~$12/month
- **Staging slots**: Use deployment slots to test before production

## Next Steps

1. Configure your backend API integration
2. Set up custom domain and SSL/TLS
3. Configure monitoring and alerts
4. Set up backup and disaster recovery
