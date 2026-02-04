# Deployment Guide 🚀

Since this is a Next.js application, you have several deployment options besides Vercel.

## Option 1: Docker (Universal) 🐳

We have included a production-ready `Dockerfile`. You can deploy this container to **AWS ECS**, **DigitalOcean App Platform**, **Google Cloud Run**, **Railway**, or your own VPS.

### 1. Build the Image
```bash
docker build -t prompt-enhancer .
```

### 2. Run the Container
```bash
docker run -p 3000:3000 \
  -e OPENAI_API_KEY="sk-..." \
  -e ANTHROPIC_API_KEY="sk-..." \
  prompt-enhancer
```

---

## Option 2: Netlify (Easiest Alternative) 💎

Netlify allows simple drag-and-drop or Git-based deployment similar to Vercel.

1.  **Push to GitHub**
2.  **Log in to Netlify** -> "Add new site" -> "Import an existing project"
3.  **Select Repository**
4.  **Build Settings**:
    *   **Build command**: `npm run build`
    *   **Publish directory**: `.next` (Netlify auto-detects Next.js)
5.  **Environment Variables**:
    *   Add `OPENAI_API_KEY`, etc. under "Site configuration" -> "Environment variables".
6.  **Deploy**

---

## Option 3: Railway / Render (Full Stack) 🚂

These platforms automatically detect the `Dockerfile` or `package.json`.

1.  **Connect GitHub Repo**: Sign up and select your repo.
2.  **Configuration**: It usually auto-detects "Node.js" or "Docker".
3.  **Environment Variables**: Add your API keys in the dashboard.
4.  **Deploy**.

---

## Option 4: Self-Hosted (VPS/Node.js) 💻

If you have a Linux server (Ubuntu/Debian):

1.  **Install Node.js 18+**
2.  **Clone Repo**: `git clone ...`
3.  **Install & Build**:
    ```bash
    npm install
    npm run build
    ```
4.  **Start Server** (using PM2 for process management):
    ```bash
    npm install -g pm2
    pm2 start npm --name "prompt-enhancer" -- start
    ```
