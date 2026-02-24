# Railway Deployment Guide for littleFleetMan

## Quick Start

This application is configured to deploy on Railway using Docker.

### Prerequisites

1. Railway account (https://railway.app)
2. GitHub repository connected to Railway
3. Railway CLI (optional): `npm i -g @railway/cli`

## Railway Configuration

### Environment Variables

The application automatically detects Railway's environment. The only required variable is:

- `PORT` - Automatically set by Railway (typically 8080 or dynamic)

### Optional Environment Variables

- `DATA_DIR` - Path for data storage (defaults to `/tmp/littlefleetman-data` in Railway)
- `NODE_ENV` - Set to `production` (automatically set in Dockerfile)

### Data Persistence

**Important:** By default, data is stored in `/tmp/littlefleetman-data` which is ephemeral.
Data will be lost when the container restarts.

#### Option 1: Railway Volume (Recommended)

1. Go to your Railway project
2. Click on your service
3. Navigate to "Volumes" tab
4. Click "New Volume"
5. Set mount path: `/data`
6. Add environment variable: `DATA_DIR=/data`

#### Option 2: External Database (Future Enhancement)

Consider migrating from JSON files to PostgreSQL or MongoDB for production use.

## Deployment Steps

### Via GitHub (Recommended)

1. Push your code to GitHub
2. In Railway dashboard, click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will automatically detect the Dockerfile
6. Deploy!

### Via Railway CLI

```bash
# Login to Railway
railway login

# Link to your project (or create new one)
railway link

# Deploy
railway up
```

## Files Required for Deployment

- `Dockerfile` - Container configuration
- `railway.json` - Railway-specific settings
- `.dockerignore` - Files to exclude from Docker build
- `package.json` & `package-lock.json` - Node.js dependencies
- `server.js` - Main application
- `public/` - Static files

## Health Check

Railway monitors your service using the health check endpoint:
- **Endpoint:** `GET /health`
- **Expected Response:** `200 OK` with text `ok`
- **Timeout:** 120 seconds (configured in railway.json)

## Monitoring

View logs in Railway dashboard:
1. Select your service
2. Click "Deployments" tab
3. Click on active deployment
4. View real-time logs

Look for these startup messages:
```
Starting littleFleetMan...
Node version: v20.x.x
Environment: production
PORT: 8080
DATA_DIR: /tmp/littlefleetman-data
Data files initialized successfully
✓ littleFleetMan is running on http://0.0.0.0:8080
✓ Health check available at http://0.0.0.0:8080/health
✓ API available at http://0.0.0.0:8080/api
```

## Troubleshooting

### Server Keeps Restarting

1. Check logs for error messages
2. Verify the PORT environment variable is being used
3. Ensure health check endpoint is responding
4. Check if DATA_DIR is writable

### Health Check Failing

- Verify `/health` endpoint returns 200 OK
- Check if server is binding to `0.0.0.0` (not `localhost`)
- Ensure PORT matches what Railway expects

### Data Not Persisting

- Set up a Railway Volume (see Data Persistence section above)
- Verify DATA_DIR points to the volume mount path

### Port Binding Issues

Railway automatically provides the PORT environment variable. The server should bind to:
```javascript
app.listen(process.env.PORT, '0.0.0.0')
```

## Testing Locally with Docker

```bash
# Build the image
docker build -t littlefleetman .

# Run the container
docker run -p 3011:3011 littlefleetman

# Test health check
curl http://localhost:3011/health
```

## API Endpoints

Once deployed, your Railway service URL will be: `https://your-service.railway.app`

- `GET /health` - Health check
- `GET /api/health` - API health check
- `GET /api/vehicles` - List all vehicles
- `GET /api/work-orders` - List all work orders
- Full API documentation in README.md

## Cost Optimization

Railway offers:
- Free tier with 500 hours/month (enough for 1 service)
- Pay-as-you-go: $5 minimum
- This lightweight app should cost $5-10/month

## Security Notes

1. No authentication is currently implemented
2. Consider adding:
   - API authentication (JWT, API keys)
   - Rate limiting
   - HTTPS only (Railway provides this automatically)
   - Environment-based access controls

## Next Steps After Deployment

1. Set up a custom domain (optional)
2. Configure Railway Volume for data persistence
3. Set up monitoring/alerts
4. Consider adding authentication
5. Implement database for production use

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- GitHub Issues: [your-repo]/issues
