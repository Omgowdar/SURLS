# SURLS — Smart URL Shortener with Analytics

A full-stack URL shortener with click analytics, custom codes, link expiry, and a dashboard.

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS + Recharts
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas

---

## Local Setup

### 1. Backend
```bash
cd server
npm install
```

Create `server/.env`:
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
BASE_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
```

### 2. Frontend
```bash
cd client
npm install
```

Create `client/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Open http://localhost:5173

---

## Deployment

### Backend → Render
1. Push repo to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Set root directory to `server`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables: `MONGO_URI`, `BASE_URL` (your Render URL), `CLIENT_URL` (your Vercel URL)

### Frontend → Vercel
1. Create a new project on [Vercel](https://vercel.com)
2. Set root directory to `client`
3. Add environment variable: `VITE_API_URL=https://your-render-url/api`
4. Deploy

---

## Features
- Shorten any valid URL
- Custom short codes
- Link expiry (in days)
- Click tracking with timestamps
- Analytics dashboard with charts
- Copy to clipboard
- Delete links
- Expired link detection
