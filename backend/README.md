Admin creation
===============

This folder contains a small utility to create or update an initial admin user in the database.

Script: `create_admin.js`

What it does
- Connects to MongoDB (uses `MONGODB_URI` or `--mongo` )
- Creates a user with `isAdmin: true` or updates an existing user (sets `isAdmin: true`, updates name and password)

Usage

1) Using npm script (from `backend/`):

PowerShell (inline env vars):

```powershell
$env:ADMIN_NAME='Admin User'; $env:ADMIN_EMAIL='admin@example.com'; $env:ADMIN_PASSWORD='S3cret'; npm run create-admin
```

Or pass command-line arguments:

```powershell
npm run create-admin -- --name "Admin User" --email admin@example.com --password S3cret
```

2) Run directly with Node:

```powershell
node create_admin.js --name "Admin User" --email admin@example.com --password S3cret
```

Options
- `--mongo <uri>` : optional MongoDB URI (overrides `MONGODB_URI` env var)
- Environment variables supported: `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `MONGODB_URI`

Safety notes
- The script will update an existing user with the same email: it sets `isAdmin: true`, updates the `name` and replaces the password hash. Use carefully in production.
- Consider requiring an explicit environment flag (e.g. `ALLOW_CREATE_ADMIN=true`) or running this utility only in a secure environment.
- For production use, consider creating admin users via a protected admin dashboard or a well-audited migration.

Location
- Script: `create_admin.js`
- Model change: `models/User.js` (field `isAdmin`)

Questions or changes
If you want the script to prompt for confirmation interactively, require an extra env flag before running in production, or create a read-only dry-run mode, tell me and I will add it.
