# EcoGrid AI — AI-Powered Energy Optimization Platform for MSMEs

A full-stack Flask website: premium marketing site + live-preview SaaS dashboard +
working authentication, built on top of your original static HTML/CSS/JS design.

## Quick Start

```bash
pip install -r requirements.txt
python app.py
```

Then open **http://localhost:5000** in your browser. That's it — no database
setup required. A local SQLite file is created automatically at
`instance/ecogrid.db` on first run, pre-seeded with demo dashboard data.

## What's Included

**Pages:** Home, About, Features, Dashboard, Technologies, Contact, Login,
Register, Privacy Policy, Terms of Service, and a custom 404/500 error page.

**Design upgrades over the original static site:**
- Dark mode toggle (top-right of the navbar, persists via localStorage)
- FAQ accordion, testimonials, and trusted-partners strip on the homepage
- Login / Register pages with password strength meter and show/hide toggle
- Toast notifications for form submissions, login/logout, etc.
- All original glassmorphism, animations, scroll-reveal, counters, and
  Chart.js dashboard visuals are preserved exactly as they were.

**Backend (new):**
- Flask app factory (`app.py`) with blueprints: `main`, `auth`, `dashboard`
- SQLAlchemy models: `User`, `ContactMessage`, `EnergyUsage`, `MachineStatus`,
  `RenewableEnergy`, `Alert`, `Report`
- Flask-Login session auth with hashed passwords (Werkzeug)
- Flask-WTF forms with CSRF protection and server-side validation on
  Register, Login, and Contact
- The dashboard's Machine Health, Alerts, Renewable stats, and the "Energy
  Usage" line chart are all rendered from the database (see `_seed_demo_data()`
  in `app.py`), not hardcoded — ready for a real IoT feed later
- `/api/dashboard/summary` — JSON endpoint returning the same dashboard data

## Switching to MySQL (optional)

The app uses SQLite by default so it runs with zero setup. To use MySQL instead:

1. `pip install PyMySQL` (already listed, commented out, in `requirements.txt`)
2. Run `database.sql` against your MySQL server: `mysql -u root -p < database.sql`
3. Copy `.env.example` to `.env` and set:
   ```
   DATABASE_URL=mysql+pymysql://ecogrid_user:your_password@localhost/ecogrid_db
   ```
4. Run `python app.py` again.

## Project Structure

```
app.py                  # Flask entrypoint (app factory + seed data)
config.py               # Settings (reads .env)
extensions.py           # db / login_manager / csrf instances
models.py               # SQLAlchemy models
forms.py                # WTForms (Login, Register, Contact)
requirements.txt
database.sql            # Optional MySQL schema
.env.example            # Copy to .env for production settings
blueprints/
  main.py               # Home, About, Features, Technologies, Contact, Privacy, Terms
  auth.py                # Register, Login, Logout
  dashboard.py           # Dashboard page + JSON API
templates/               # Jinja templates (base.html + one per page)
static/
  css/style.css
  js/script.js           # Dark mode, FAQ accordion, nav, forms, reveal/counters
  js/dashboard-charts.js  # Chart.js setup, fed by DB data
instance/
  ecogrid.db             # Auto-created SQLite file (git-ignore this in production)
```

## Verified Before Delivery

Every route was tested end-to-end with Flask's test client:
- All 10 pages return 200, all internal links resolve, 404 page works
- Contact form: CSRF token present, validation errors + success flash both work
- Register: creates a user, hashes the password, rejects duplicate emails,
  rejects mismatched passwords, logs the user in and redirects to /dashboard
- Login: accepts correct credentials, rejects wrong password with a clear message
- Logout clears the session
- Dashboard renders Machine Health, Alerts, and Renewable stats from the
  database (not hardcoded), and the Chart.js line chart uses seeded DB rows
- Both JS files pass `node --check` with no syntax errors
- No leftover Jinja `{{ }}` / `{% %}` markup in any rendered page

## Notes

- Change `SECRET_KEY` in `.env` before deploying publicly.
- The public `/dashboard` page is intentionally viewable without login (as in
  your original design) so it works as a live marketing preview; it also
  personalizes its greeting if you are logged in.
- The "Export" button, "Forgot password", and newsletter subscribe are wired
  as clearly-labeled demo actions (toast notification) — hook these up to a
  real PDF export, email provider, or password-reset flow when you're ready.
