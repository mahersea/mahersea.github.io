# Railway Deployment Checklist

Use this checklist as you deploy TrackTranslator to Railway.

---

## Pre-Deployment

- [ ] All code changes committed
- [ ] Code pushed to GitHub
- [ ] Railway account created at https://railway.app
- [ ] Railway connected to your GitHub account

---

## Database Setup

- [ ] PostgreSQL service created in Railway project
- [ ] DATABASE_URL variable automatically created
- [ ] PostgreSQL service shows "Active" status

---

## Backend Deployment

### Initial Setup
- [ ] New service created from GitHub repo
- [ ] Root directory set to `server`
- [ ] Build command confirmed: `npm install`
- [ ] Start command confirmed: `npm start`

### Environment Variables
- [ ] `DATABASE_URL` = `${{Postgres.DATABASE_URL}}` (use Reference)
- [ ] `JWT_SECRET` = Strong random string (generate one!)
- [ ] `JWT_EXPIRES_IN` = `7d`
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `3001`
- [ ] `FRONTEND_URL` = (will add after frontend deploys)

### Deployment
- [ ] Backend service deployed successfully
- [ ] Backend URL copied (e.g., `https://...-backend-....railway.app`)
- [ ] Health check tested: `/api/health` returns success

### Database Migration
- [ ] Migrations run via Railway CLI or temporary start command
- [ ] Database tables created successfully
- [ ] Migration logs checked for errors

---

## Frontend Deployment

### Initial Setup
- [ ] New service created from same GitHub repo
- [ ] Root directory set to `client`
- [ ] Build command confirmed: `npm install && npm run build`
- [ ] Start command confirmed: `npm run serve`

### Environment Variables
- [ ] `VITE_API_URL` = `https://your-backend-url.railway.app/api`

### Deployment
- [ ] Frontend service deployed successfully
- [ ] Frontend URL copied (e.g., `https://...-client-....railway.app`)
- [ ] Frontend loads in browser without errors

---

## Backend CORS Update

- [ ] Go back to backend service
- [ ] Update `FRONTEND_URL` variable with actual frontend URL
- [ ] Redeploy backend service
- [ ] Verify CORS allows frontend requests

---

## Testing

### Health Checks
- [ ] Backend health endpoint returns JSON with `status: "ok"`
- [ ] Frontend homepage loads correctly
- [ ] No console errors in browser dev tools

### Authentication
- [ ] Registration form accessible
- [ ] Can create new account
- [ ] Redirected to home after registration
- [ ] Can logout successfully
- [ ] Can login with created account

### API Communication
- [ ] Open browser network tab
- [ ] Perform actions (register, login)
- [ ] API calls return 200/201 status codes
- [ ] No CORS errors in console
- [ ] JWT token stored correctly

---

## Post-Deployment

### Monitoring
- [ ] Railway dashboard checked
- [ ] All services show "Active" status
- [ ] Recent deployments show success
- [ ] No error logs in service logs

### Documentation
- [ ] Backend URL documented
- [ ] Frontend URL documented
- [ ] Admin credentials stored securely
- [ ] Environment variables backed up securely

### Optional Enhancements
- [ ] Custom domain configured (if desired)
- [ ] DNS records added for custom domain
- [ ] Domain SSL certificate verified
- [ ] Spending limits set in Railway

---

## Troubleshooting Completed

If you encountered issues, check these off once resolved:

- [ ] Database connection errors resolved
- [ ] CORS errors fixed
- [ ] Build failures addressed
- [ ] Environment variable issues corrected
- [ ] Port conflicts resolved
- [ ] Migration errors fixed

---

## Success Criteria

All of these should be true:

✅ Backend health check returns success
✅ Frontend loads without errors
✅ Can register new users
✅ Can login/logout
✅ API calls work (check network tab)
✅ No CORS errors
✅ All Railway services show "Active"
✅ Continuous deployment works (push triggers redeploy)

---

## Next Development Steps

After successful deployment:

- [ ] Sprint 2: Implement link processing feature
- [ ] Add Odesli API integration
- [ ] Test track matching across platforms
- [ ] Deploy updates to Railway (automatic via git push)

---

## Important URLs

**Railway:**
- Dashboard: https://railway.app/dashboard
- Project: ______________________________
- PostgreSQL: ______________________________
- Backend: ______________________________
- Frontend: ______________________________

**GitHub:**
- Repository: ______________________________

**Production Environment:**
- Frontend URL: ______________________________
- Backend API: ______________________________/api
- Health Check: ______________________________/api/health

---

## Emergency Contacts

**If something goes wrong:**
1. Check Railway logs (Service → Deployments → View Logs)
2. Check `RAILWAY_DEPLOY.md` troubleshooting section
3. Railway Discord: https://discord.gg/railway
4. Railway Docs: https://docs.railway.app

---

## Deployment Date

**First Deployed:** _____ / _____ / _____
**Last Updated:** _____ / _____ / _____
**Deployed By:** _____________________

---

**You're ready to deploy! 🚀**

Follow `RAILWAY_DEPLOY.md` for detailed instructions.
