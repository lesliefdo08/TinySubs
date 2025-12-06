# Vercel Deployment Guide for TinySubs

## Quick Setup

### 1. Environment Variables in Vercel
Go to your Vercel project settings and add these environment variables:

**Required:**
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` - Get from https://cloud.walletconnect.com/
- `NEXT_PUBLIC_CONTRACT_ADDRESS` - Your deployed contract address (e.g., `0x5FbDB2315678afecb367f032d93F642f64180aa3`)

**Optional:**
- `NEXT_PUBLIC_CHAIN_ID` - Default: `84532` (Base Sepolia)

### 2. Vercel Project Settings

**Framework Preset:** Next.js
**Build Command:** `npm run build`
**Output Directory:** `.next`
**Install Command:** `npm install`
**Development Command:** `npm run dev`

### 3. Deploy

#### Option A: Automatic (Recommended)
1. Connect your GitHub repository (`lesliefdo08/tiny-subs`) to Vercel
2. Vercel will auto-deploy on every push to `main` branch
3. Add environment variables in Vercel dashboard
4. Trigger a new deployment

#### Option B: Manual via CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 4. Post-Deployment Checklist

- [ ] Site loads without errors
- [ ] Wallet connection works (RainbowKit modal opens)
- [ ] Contract reads work (check browser console)
- [ ] Pages load instantly (no 10+ second delays)
- [ ] Navigation between pages is smooth
- [ ] MetaMask/wallet detection works

### 5. Troubleshooting

**Issue: Build fails**
- Check Node.js version (should be 18.x or higher)
- Verify all dependencies are in package.json
- Check build logs in Vercel dashboard

**Issue: Environment variables not working**
- Make sure they start with `NEXT_PUBLIC_`
- Redeploy after adding variables (they don't auto-reload)
- Check spelling matches exactly what's in code

**Issue: Contract reads failing**
- Verify `NEXT_PUBLIC_CONTRACT_ADDRESS` is correct
- Make sure you're on the right network (Base Sepolia)
- Check if contract is deployed and verified

**Issue: Wallet won't connect**
- Verify `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` is valid
- Check browser console for errors
- Try in incognito mode

### 6. Performance Notes

The app is optimized for instant loading:
- Pages render immediately (no blocking)
- Contract reads fail fast (no 10+ second retries)
- Skeleton loaders show during data fetch
- Auth state persists across sessions

### 7. Custom Domain (Optional)

1. Go to Vercel project settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

### 8. Monitoring

Check Vercel dashboard for:
- Build logs
- Runtime logs
- Analytics
- Performance metrics

## Current Deployment Status

- **Repository:** https://github.com/lesliefdo08/tiny-subs
- **Branch:** main
- **Framework:** Next.js 14.1.0
- **Node Version:** 18+
- **Build Time:** ~30-60 seconds

## Support

If deployment fails, check:
1. Vercel build logs for specific errors
2. Package.json for missing dependencies
3. Environment variables are properly set
4. Next.js version compatibility

---

**Last Updated:** December 6, 2025
**Version:** 1.0.0
