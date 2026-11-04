# GAA Group website: run locally and go live

The website has two parts:

| Part | What it is | Where it runs |
|---|---|---|
| Frontend | The React site (all pages), built into `dist/` | Vercel |
| Backend | PHP + MySQL in `public/api` (forms, admin panel, blog, CV uploads) | PHP hosting (Hostinger, cPanel, etc.) |

Vercel does not run PHP with a MySQL database, and it cannot keep uploaded files (CVs, blog images).
So the backend lives on PHP hosting, and Vercel forwards `/api`, `/uploads` and `/insights/<article>` to it
(see `rewrites` in `vercel.json`). Visitors only ever see your main domain.

---

## Part 1: run it on your computer (Windows + XAMPP)

1. **Install once:** Node.js 20+ and XAMPP.
2. **Start MySQL:** open the XAMPP Control Panel and click **Start** next to MySQL (Apache is not needed).
3. **Create the database:** open http://localhost/phpmyadmin, then **New**, enter the name `gaa_website` and click **Create**.
   Select it, go to **Import** and import `gaa_website.sql`.
4. **Settings file:** copy `config.php` to `public\api\config.php` (never commit this file).
5. **Install packages** (first time only), in the project folder:
   ```
   npm install
   ```
6. **Terminal 1, the PHP backend** (leave it open):
   ```
   C:\xampp\php\php.exe -S localhost:8000 -t public
   ```
7. **Terminal 2, the website:**
   ```
   npm run dev
   ```
8. Open http://localhost:5173 for the site and http://localhost:5173/admin for the admin panel.

Errors:
- **502:** step 6 is not running.
- **500 / "database is not available":** MySQL is not started, or `db_name` in `config.php` does not match the database name.

---

## Part 2: go live

### A. Backend on PHP hosting (for example a subdomain `api.your-domain.com`)

1. In your hosting panel, create the subdomain `api.your-domain.com` and turn on its free SSL certificate.
2. **Database:** create a MySQL database and a user with all privileges, then import `gaa_website.sql` with phpMyAdmin.
3. **Files:** on your computer run `npm run build`, then upload **everything inside `dist/`** to the subdomain's folder.
   This includes `api/`, `.htaccess` and `insights/_post/`, which the backend needs.
4. **Settings:** in the subdomain's `api/` folder, create `config.php` from `config.sample.php` and fill in:
   - `db_host` (usually `localhost`), `db_name`, `db_user`, `db_pass`: from step 2.
   - `site_url`: your main website address, for example `https://www.your-domain.com` (used for links in emails).
   - `inbox`: where each company's enquiries are emailed.
   - `mail_from`: an address on your domain, for example `no-reply@your-domain.com`.
   - `smtp_host`, `smtp_port`, `smtp_user`, `smtp_pass`: from your email provider (strongly recommended so emails do not go to spam).
   - `trust_proxy`: `true`.
   - `storage_dir`: a folder outside the public folder if possible, for example `/home/USER/gaa-storage` (must be writable).
5. **Check:** open `https://api.your-domain.com/api/posts.php`. You should see JSON with the blog posts.

### B. Frontend on Vercel

1. In `vercel.json`, replace every `https://api.YOUR-DOMAIN.com` with your real backend address from step A.
   Commit and push to GitHub.
2. On vercel.com, choose **Add New**, then **Project**, and import the GitHub repository `gaagroups`.
   Vercel reads `vercel.json`: Framework **Vite**, Build Command `npm run build`, Output Directory `dist`. Click **Deploy**.
3. **Domain:** in Project, go to **Settings**, then **Domains**, and add `www.your-domain.com` (and `your-domain.com`).
   Add the DNS records that Vercel shows at your domain registrar.
4. **Check:**
   - open the site, submit the Contact form: it should show the success message and arrive by email;
   - open `/admin` and log in: the submission should be listed;
   - publish a blog post in the admin and open it under `/insights/...`.

### C. After going live

- **Change the admin password:** in the admin panel, under **Users & password**.
- **Activate FormSubmit (email backup):** the first form sent through the backup triggers an activation email to the inbox address. Click **Activate** once.
- **Every change:** push to GitHub and Vercel redeploys the frontend by itself.
  Re-upload `dist/api` to the PHP hosting only when files in `public/api` change.

## Admin login

Use the admin email and password shared with you privately (they are in the database file, not in this repository).
Change the password after the first login.
