# GAA Group website

One website on one domain for GAA Group and its three companies, with a blog and an admin panel.

| Address | What it is |
| --- | --- |
| `/` | GAA Group home (shared landing page) |
| `/about` | About Us (shared) |
| `/our-team` | Our Team (shared) |
| `/careers` | Careers (shared) |
| `/insights` | Insights: the shared blog for all companies, filters by company, compliance due date planner, newsletter sign-up |
| `/insights/<article>` | One blog article |
| `/contact` | Contact Us (shared, routes each enquiry to the right company) |
| `/gaa-consulting` + 6 service pages | GAA Consulting, e.g. `/gaa-consulting/india-entry` |
| `/filings-first` + 3 service pages | Filings First, e.g. `/filings-first/tax-financial-compliance` |
| `/hirings-first` + 2 service pages | Hirings First: `/hirings-first/talent-acquisition`, `/hirings-first/workforce-hr-solutions` |
| `/admin` | Admin panel: blog posts, form submissions (with CVs), subscribers, users |
| `/privacy` | Privacy, terms and disclaimer |

The header and footer are the same everywhere. The logo on the left changes to the company you are in. The footer's **Management Login** opens the admin panel.

## Tech stack

| Part | What is used |
| --- | --- |
| Frontend | React 19, built with Vite 8 |
| Rendering | Every page is pre-rendered to full HTML at build time (good for Google), then React takes over in the browser |
| Blog article pages | `api/page.php` fills each article's title, description, sharing tags, structured data and text into the page on the server |
| Backend | PHP 8 (no framework) in `public/api/` |
| Database | MySQL 5.7+ or MariaDB 10.3+ |
| Email | SMTP (recommended) or the server's PHP `mail()` |
| Hosting | Any Apache host with PHP and MySQL: cPanel, Hostinger, Bluehost, GoDaddy, a VPS and so on. Rules are in `public/.htaccess` |

## Project layout

```
src/pages/group/        GAA Group Home, About, Careers (same design as the GAA Group website)
src/pages/consulting/   GAA Consulting overview and service page
src/pages/filings/      Filings First overview and service page
src/pages/hirings/      Hirings First overview and service page
src/pages/              Shared pages: Our Team, Insights (blog), article, Contact, Privacy, 404
src/admin/              Admin panel (React)
src/data/               Page content: services of each company, team, due dates
src/site.js             Addresses, page titles and descriptions, company details
public/api/             PHP backend
  enquiry.php           contact form, job applications (CV upload) and newsletter sign-up
  posts.php             published articles for the Insights page
  page.php              server-filled article pages (/insights/<article>)
  sitemap.php           /sitemap.xml including articles
  admin/                admin endpoints (login, posts, uploads, submissions, CV download, subscribers, users)
  install/              one-time setup page, database tables and the six starter articles
  config.sample.php     settings template (config.php is written by the installer)
public/.htaccess        clean addresses, article and admin routing, redirects, security headers, caching
scripts/prerender.mjs   writes the HTML of every page, the article template, sitemap.xml and robots.txt
```

## Run on your computer

You need Node.js 20+ and PHP 8 (and MySQL if you want to test the blog and forms).

```
npm install
npm run dev        # the website on http://localhost:5173
npm run api        # in a second window: the PHP backend on http://localhost:8000 (used through the dev proxy)
npm run build      # production build in dist/
```

For the backend on your computer, create `public/api/config.php` from `config.sample.php` with your local MySQL details, then run the setup once (see step 4 below, or `php public/api/install/index.php` with the arguments it prints).

## Go live (Hostinger, cPanel or any Apache + PHP + MySQL host)

1. **Build:** run `npm run build`. Everything to upload is in the `dist` folder (including `.htaccess` and the `api` folder).
2. **Upload:** upload the *contents* of `dist` into `public_html` (or the domain's folder) with the File Manager or FTP. Make sure hidden files such as `.htaccess` are uploaded too.
3. **Database:** in the hosting panel, create a MySQL database and a database user with all privileges on it. Note the database name, user and password.
4. **Setup:** open `https://your-domain/api/install/` and fill in the database details, the website address, the email that receives form submissions, the sender address, SMTP details (recommended) and the first admin user. It creates the tables, adds the six starter articles and writes `api/config.php`, then locks itself. Delete the `api/install` folder afterwards.
5. **Sign in:** open `https://your-domain/admin` (or click **Management Login** in the footer).
6. **HTTPS:** turn on the free SSL certificate in the hosting panel, then uncomment the "force HTTPS" lines at the top of `.htaccess`.
7. **Google:** add the domain in Google Search Console and submit `https://your-domain/sitemap.xml`. Before building, set `SITE_URL` to your domain so canonical links in the pre-built pages use it (for example `SITE_URL=https://www.your-domain.com npm run build`, or `set SITE_URL=...` on Windows).

**Updating the site later:** run `npm run build` again and upload the new `dist` contents. Do not delete `api/config.php`, the `uploads` folder or the CV storage folder on the server: they hold your settings, blog images and job applications.

## Admin panel

| Section | What you can do |
| --- | --- |
| Dashboard | New and monthly submissions, published posts, drafts, subscribers, latest items |
| Blog posts | Write, edit, publish or unpublish articles; choose the company (GAA Group, GAA Consulting, Filings First, Hirings First), category, author, cover image, publish date, SEO title and description; preview before publishing |
| Form submissions | Every contact form enquiry and job application, filtered by company, type and status; open one to see all details, download the CV, add internal notes, change status, reply by email, delete; export to CSV |
| Subscribers | Newsletter sign-ups from the Insights page; export to CSV |
| Users & password | Add editors or administrators, remove users, change your password |

Security: passwords are stored hashed, sessions use secure cookies and expire after 8 hours, every change needs a CSRF token, logins and forms are rate-limited, uploaded images are checked and re-saved, CVs are stored outside the public folders (or in a protected folder) and can only be downloaded by signed-in users, and article HTML is cleaned on the server.

## Settings (`api/config.php`)

| Setting | Meaning |
| --- | --- |
| `db_host`, `db_name`, `db_user`, `db_pass` | MySQL connection |
| `site_url` | Public address, used in emails, article pages and the sitemap |
| `inbox` | Email address for each company and for careers applications (comma-separate several) |
| `mail_from`, `mail_from_name` | Sender of the emails (use an address on your domain) |
| `smtp_*` | SMTP server; leave `smtp_host` empty to use PHP `mail()` |
| `send_acknowledgement` | Send a "we have received your enquiry" email to the person |
| `storage_dir` | Folder for uploaded CVs (best outside `public_html`) |
| `uploads_dir`, `uploads_url` | Folder and address for blog images |

If the backend is not reachable, the contact form falls back to FormSubmit and emails the office inbox, so no enquiry is lost.
