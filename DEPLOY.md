# Deploying to cPanel

This site runs on cPanel as a **Node.js app** (the same way your MERN app does). You build it on your computer, upload one zip, and cPanel runs it.

> **Why build locally?** Building Next.js needs 2 GB+ of memory, which shared hosting doesn't have. Running the finished build needs very little.

---

## 0. One-time checks

- In cPanel, open **Setup Node.js App → Create Application** and look at the **Node.js version** list. You need **18.18 or newer** (20 is ideal). If only older versions are listed, ask your host to enable Node 20.
- A **MongoDB Atlas** database (free M0 tier) — optional, but needed for the admin panel and the contact inbox. See step 4.

## 1. Set the environment variables locally

Copy `.env.example` to `.env.local` and fill it in (used only on your computer).

## 2. Build and package

```bash
npm install
npm run package
```

This creates **`deploy/portfolio.zip`** containing:

```
portfolio/
├── server.js          ← the app's start file
├── node_modules/      ← only what the server needs
├── .next/             ← compiled site (incl. .next/static)
├── public/
└── package.json
```

## 3. Upload and start on cPanel

1. **File Manager** → create a folder outside `public_html`, e.g. `/home/USERNAME/portfolio`.
2. Upload `portfolio.zip` there and **Extract** it. Make sure `server.js` ends up directly inside `/home/USERNAME/portfolio` (move the files up one level if the zip created a nested `portfolio/portfolio` folder).
3. **Setup Node.js App → Create Application**
   | Field | Value |
   |---|---|
   | Node.js version | 20.x (or the newest ≥ 18.18) |
   | Application mode | Production |
   | Application root | `portfolio` |
   | Application URL | your domain (e.g. `abdulmoiz.com`) |
   | Application startup file | `server.js` |
4. In the same screen, under **Environment variables**, add:
   | Name | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` |
   | `MONGODB_URI` | your Atlas connection string |
   | `ADMIN_PASSWORD` | a long password |
   | `ADMIN_SECRET` | 32+ random characters |
   | `RESEND_API_KEY` | optional — for email notifications |
   | `CONTACT_TO` | `abdulmoizghani500@gmail.com` |
   | `CONTACT_FROM` | `Portfolio <hello@yourdomain.com>` (a domain verified in Resend) |
5. Click **Save**, then **Restart**. Do **not** click "Run NPM Install" — dependencies are already bundled.
6. Open your domain. 🎉

> `NEXT_PUBLIC_SITE_URL` is also baked in at build time, so set it in `.env.local` **before** `npm run package` too.

## 4. MongoDB Atlas (for admin + contact inbox)

1. Create a free cluster at <https://cloud.mongodb.com>.
2. **Database Access** → add a user with a password.
3. **Network Access** → add your server's IP (cPanel shows it under *Server Information*), or `0.0.0.0/0` to allow all.
4. **Connect → Drivers** → copy the connection string into `MONGODB_URI` (replace `<password>`, and add a database name, e.g. `/portfolio`).
5. On your computer, with the same `MONGODB_URI` in `.env.local`, run once:
   ```bash
   npm run seed
   ```
   This copies the projects and videos from `/data` into MongoDB so you can edit them at **/admin**.

Without `MONGODB_URI` the site still works fully — it shows the content from `/data`, and the contact form can still email you if `RESEND_API_KEY` is set.

## 5. Updating the site later

- **Content** (projects, videos, messages): use **https://yourdomain.com/admin** — changes go live immediately, no redeploy.
- **Code or design**: edit locally → `npm run package` → upload & extract the new zip over the old files (keep your environment variables) → **Restart** in Setup Node.js App.

## Troubleshooting

| Problem | Fix |
|---|---|
| "Incomplete response" / 503 after restart | Check **Setup Node.js App → the app's log file** (or `stderr.log` in the app folder). Usually a missing env var or wrong startup file. |
| Page loads without styles | `.next/static` wasn't uploaded. It must be at `portfolio/.next/static`. |
| Admin says "No database connected" | `MONGODB_URI` isn't set in the cPanel env vars, or the app wasn't restarted. |
| Admin shows "Couldn't reach MongoDB" | Add the server IP in Atlas → Network Access. |
| Contact form says "isn't connected yet" | Set `MONGODB_URI` and/or `RESEND_API_KEY`. |
| Edits in admin don't show | Hard-refresh the page; the app writes its page cache into `.next/`, so that folder must be writable (it is by default). |
| App listens on the wrong address | Add env var `HOSTNAME` = `127.0.0.1` and restart. |
| Node version error | Choose Node 20 in Setup Node.js App, or ask the host to add it. |

## Alternative: Vercel (zero-config)

Push the project to GitHub, import it at <https://vercel.com/new>, add the same environment variables, and deploy. Every `git push` redeploys automatically.
