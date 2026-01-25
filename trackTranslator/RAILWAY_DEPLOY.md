# Railway Deployment - Quick Start

## Prerequisites

✅ Your code is in a GitHub repository
✅ You have a Railway account (https://railway.app)
✅ All changes are committed and pushed to GitHub

## Deployment Steps

### 1. Create Railway Project

1. Go to https://railway.app and sign in
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub
5. Select your TrackTranslator repository

### 2. Deploy PostgreSQL Database

1. In your Railway project, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway provisions a database automatically
4. Note: Railway creates a `DATABASE_URL` variable you'll reference later

### 3. Deploy Backend (Server)

1. Click "+ New" → "GitHub Repo"
2. Select your TrackTranslator repository
3. Go to "Settings" tab:
   - **Root Directory:** `server`
   - **Build Command:** `npm install` (auto-detected)
   - **Start Command:** `npm start` (auto-detected)

4. Go to "Variables" tab and add:

```bash
# Reference PostgreSQL database
DATABASE_URL=${{Postgres.DATABASE_URL}}

# JWT Configuration
JWT_SECRET=create-a-long-random-secret-key-here
JWT_EXPIRES_IN=7d

# Environment
NODE_ENV=production
PORT=3001

# CORS (add your frontend URL after deploying frontend)
FRONTEND_URL=https://your-frontend-url.railway.app
```

**Important:** For `DATABASE_URL`, use "Add Reference" and select the PostgreSQL service.

5. Deploy! Railway will build and start your backend
6. Copy your backend URL (e.g., `https://tracktranslator-backend-production.railway.app`)

### 4. Run Database Migrations

After backend deploys successfully:

**Option A - Using Railway Dashboard:**
1. Go to backend service → "Settings" → "Deploy"
2. Under "Custom Start Command" temporarily add: `npm run migrate && npm start`
3. Redeploy
4. Change back to `npm start` after migration completes

**Option B - Using Railway CLI:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migration
railway run npm run migrate
```

### 5. Deploy Frontend (Client)

1. Click "+ New" → "GitHub Repo"
2. Select your TrackTranslator repository again
3. Go to "Settings" tab:
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run serve`

4. Go to "Variables" tab and add:

```bash
# Use your backend URL from step 3
VITE_API_URL=https://your-backend-url.railway.app/api

# Or use Railway reference (if in same project)
VITE_API_URL=${{Backend.RAILWAY_PUBLIC_DOMAIN}}/api
```

5. Deploy! Railway will build and start your frontend
6. Copy your frontend URL (e.g., `https://tracktranslator-client-production.railway.app`)

### 6. Update Backend CORS

1. Go back to your **Backend service**
2. Go to "Variables" tab
3. Update `FRONTEND_URL` with your actual frontend URL:
   ```bash
   FRONTEND_URL=https://tracktranslator-client-production.railway.app
   ```
4. Save and redeploy backend

### 7. Test Your Deployment

**Test Backend:**
Visit: `https://your-backend-url.railway.app/api/health`

Should return:
```json
{
  "status": "ok",
  "message": "TrackTranslator API is running",
  "environment": "production",
  "timestamp": "2026-01-22T..."
}
```

**Test Frontend:**
Visit: `https://your-frontend-url.railway.app`

Should load the TrackTranslator homepage.

**Test Full Flow:**
1. Register a new account
2. Login
3. Try the link input (if Sprint 2 is complete)

---

## Environment Variables Reference

### Backend Required Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | PostgreSQL connection (from Railway) |
| `JWT_SECRET` | Random string | Secret for JWT tokens |
| `JWT_EXPIRES_IN` | `7d` | JWT expiration time |
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `3001` | Server port |
| `FRONTEND_URL` | Frontend Railway URL | For CORS |

### Frontend Required Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | Backend Railway URL + `/api` | API endpoint |

---

## Troubleshooting

### Backend Won't Start

**Check:**
- Railway logs: Click on backend service → "Deployments" → Latest deployment → "View Logs"
- Database connection: Ensure `DATABASE_URL` references PostgreSQL service
- Environment variables: All required variables set?

### Frontend Can't Reach Backend

**Check:**
- `VITE_API_URL` is correct (should end with `/api`)
- Backend `FRONTEND_URL` matches frontend Railway URL
- Backend is running (check health endpoint)
- CORS configuration in `server/src/index.js`

### Database Connection Failed

**Check:**
- PostgreSQL service is running
- `DATABASE_URL` uses Railway reference: `${{Postgres.DATABASE_URL}}`
- Migrations have been run
- Check PostgreSQL logs in Railway dashboard

### Build Failures

**Check:**
- `package.json` has correct scripts
- All dependencies are in `dependencies` (not just `devDependencies`)
- Root directory is set correctly (`server` or `client`)
- Node version compatible (Railway uses Node 20+ by default)

---

## Continuous Deployment

Railway automatically redeploys when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main

# Railway detects push and redeploys affected services
```

---

## Cost Management

**Free Trial:** $5 credit (no credit card)
**Developer Plan:** $5/month + usage

**Typical Costs:**
- Small project: $5-10/month
- Medium traffic: $15-25/month

**Monitor Usage:**
- Railway Dashboard → Project → "Usage"
- Set up spending limits in project settings

---

## Custom Domains (Optional)

To use your own domain:

1. Click on service → "Settings" → "Domains"
2. Click "Add Domain"
3. Enter your domain (e.g., `tracktranslator.com`)
4. Add DNS records as shown:
   ```
   Type: CNAME
   Name: @ (or subdomain)
   Value: [provided by Railway]
   ```
5. Wait for DNS propagation (5-30 minutes)
6. Update environment variables to use custom domain

---

## Next Steps

- ✅ Monitor your deployment in Railway dashboard
- ✅ Set up custom domain (optional)
- ✅ Configure database backups (automatic with Railway)
- ✅ Add more environment-specific features
- ✅ Implement Sprint 2 features (link processing)

---

## Support Resources

- **Railway Docs:** https://docs.railway.app
- **Railway Discord:** https://discord.gg/railway
- **TrackTranslator Issues:** [Your GitHub repo]/issues

---

## Quick Commands

```bash
# View deployment logs
railway logs

# Run migrations
railway run npm run migrate

# Open backend in browser
railway open

# Check environment variables
railway variables

# Link local project to Railway
railway link
```

Good luck with your deployment! 🚀
