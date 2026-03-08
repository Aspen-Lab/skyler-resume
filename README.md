# Skyler Pan — Interactive Resume

An interactive concept artist resume with a built-in monster shooting mini-game.

## Local Development

```bash
npm install
npm run dev
```

## Deploy to Vercel

### Option A: One-click (fastest)
1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → "Add New Project"
3. Import your GitHub repo
4. Vercel auto-detects Vite — just click **Deploy**
5. Done! You'll get a URL like `skyler-resume.vercel.app`

### Option B: Vercel CLI
```bash
npm i -g vercel
vercel
```
Follow the prompts. Takes ~30 seconds.

## Custom Domain
In Vercel dashboard → Settings → Domains → Add your domain.

## Tech Stack
- React 18 + Vite
- Pure CSS animations (no external animation libs)
- Canvas-based particle effects
- SVG reticle cursor
