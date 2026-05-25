# ApexHR — Tenant Admin

A lightweight browser-based admin panel for managing tenants in your [ApexHR](https://github.com/coderaccoon) backend. No build tools, no dependencies — just three files you open in a browser.

---

## What it does

- View all registered tenants
- Delete a single tenant
- Wipe all tenants and their associated data (users, departments, leave policies, refresh tokens)

---

---

## Usage

### 1. Prerequisites

Your ApexHR NestJS backend must be running and publicly accessible — typically via an ngrok tunnel.

```bash
# Example
ngrok http 3000
```

Take note of your ngrok URL, e.g. `https://abc123.ngrok-free.app`.

### 2. Open the panel

Just open `index.html` directly in your browser — no server needed.

```bash
open index.html
# or double-click it in your file explorer
```

### 3. Get your access token

1. Log in to your ApexHR account via the frontend or Swagger
2. Open DevTools → **F12** → Network tab
3. Click the login request → look in the Response for `accessToken`
4. Copy it

### 4. Connect

In the panel:

1. Paste your ngrok base URL → e.g. `https://abc123.ngrok-free.app/v1`
2. Paste your access token
3. Click **Save**

### 5. Manage tenants

| Action | How |
|---|---|
| List all tenants | Click **Get all tenants** |
| Delete one tenant | Click **Delete** on any row |
| Wipe everything | Danger Zone → **Delete all tenants** |

---

## API endpoints used

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/tenant` | Fetch all tenants |
| `DELETE` | `/tenant/:name` | Delete a single tenant by name |
| `DELETE` | `/tenant` | Delete all tenants |

> The panel sends `ngrok-skip-browser-warning: true` on every request so ngrok doesn't intercept with its browser warning page.

---

## Notes

- The access token must belong to a user with **TENANT_ADMIN** or superadmin privileges — lower roles will get a `403`.
- All delete actions are **permanent and irreversible**.
- This tool is intended for local development and testing, not production use.

---

## Built by

[Code Raccoon](mailto:prospergyinka@coderaccoon.com)
