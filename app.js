let BASE_URL = "";
let TOKEN = "";

function showToast(el, type, msg) {
  el.className = `toast ${type}`;
  el.textContent = msg;
}

function authHeaders() {
  return {
    Authorization: `Bearer ${TOKEN}`,
    "ngrok-skip-browser-warning": "true",
  };
}

function requireConn(toastEl) {
  if (!BASE_URL || !TOKEN) {
    showToast(toastEl, "error", "Save your connection settings first.");
    return false;
  }
  return true;
}

/* ---------- Connection ---------- */
function saveConn() {
  BASE_URL = document.getElementById("baseUrl").value.trim().replace(/\/$/, "");
  TOKEN = document.getElementById("token").value.trim();
  const toast = document.getElementById("conn-toast");

  if (!BASE_URL || !TOKEN) {
    showToast(
      toast,
      "error",
      "Please enter both the base URL and access token.",
    );
  } else {
    showToast(
      toast,
      "success",
      "Connection saved. You can now fetch or manage tenants.",
    );
  }
}

/* ---------- Fetch tenants ---------- */
async function fetchTenants() {
  const toast = document.getElementById("fetch-toast");
  const list = document.getElementById("tenants-list");
  if (!requireConn(toast)) return;

  showToast(toast, "info", "Fetching tenants…");
  list.innerHTML = "";

  try {
    const res = await fetch(`${BASE_URL}/tenant`, { headers: authHeaders() });
    const data = await res.json();

    if (!res.ok) {
      showToast(toast, "error", data.message || "Failed to fetch tenants.");
      return;
    }

    const tenants = Array.isArray(data) ? data : [];
    showToast(
      toast,
      "success",
      `${tenants.length} tenant${tenants.length !== 1 ? "s" : ""} found.`,
    );

    if (!tenants.length) {
      list.innerHTML = '<div class="empty">No tenants found.</div>';
      return;
    }

    tenants.forEach(renderTenantRow);
  } catch {
    showToast(toast, "error", "Network error. Check your base URL and token.");
  }
}

function renderTenantRow(tenant) {
  const list = document.getElementById("tenants-list");
  const initials = tenant.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const row = document.createElement("div");
  row.className = "tenant-row";
  row.innerHTML = `
    <div class="tenant-avatar">${initials}</div>
    <div class="tenant-info">
      <div class="tenant-name">${tenant.name}</div>
      <div class="tenant-meta">
        ${tenant.companyType || "No type"} ·
        ${tenant.companyLocation || "No location"} ·
        ID: ${tenant.id.slice(0, 8)}…
      </div>
    </div>
    <button class="tenant-delete" onclick="deleteTenant('${tenant.name}', this)">Delete</button>
  `;
  list.appendChild(row);
}

/* ---------- Delete a single tenant ---------- */
async function deleteTenant(name, btn) {
  const toast = document.getElementById("fetch-toast");
  if (!confirm(`Delete tenant "${name}"? This cannot be undone.`)) return;

  btn.disabled = true;
  btn.textContent = "…";

  try {
    const res = await fetch(`${BASE_URL}/tenant/${encodeURIComponent(name)}`, {
      method: "DELETE",
      headers: authHeaders(),
    });

    if (res.ok) {
      btn.closest(".tenant-row").remove();
      const remaining = document.querySelectorAll(".tenant-row").length;
      showToast(
        toast,
        "success",
        `"${name}" deleted. ${remaining} tenant${remaining !== 1 ? "s" : ""} remaining.`,
      );
      if (!remaining)
        document.getElementById("tenants-list").innerHTML =
          '<div class="empty">No tenants found.</div>';
    } else {
      const data = await res.json();
      showToast(toast, "error", data.message || "Failed to delete tenant.");
      btn.disabled = false;
      btn.textContent = "Delete";
    }
  } catch {
    showToast(toast, "error", "Network error.");
    btn.disabled = false;
    btn.textContent = "Delete";
  }
}

function showConfirm() {
  if (!requireConn(document.getElementById("delete-toast"))) return;
  document.getElementById("confirm-overlay").classList.add("show");
}

function hideConfirm() {
  document.getElementById("confirm-overlay").classList.remove("show");
}

/* ---------- Delete all tenants ---------- */
async function deleteAll() {
  hideConfirm();
  const toast = document.getElementById("delete-toast");
  showToast(toast, "info", "Deleting all tenants…");

  try {
    const res = await fetch(`${BASE_URL}/tenant`, {
      method: "DELETE",
      headers: authHeaders(),
    });

    if (res.ok) {
      showToast(toast, "success", "All tenants deleted successfully.");
      document.getElementById("tenants-list").innerHTML =
        '<div class="empty">No tenants found.</div>';
      showToast(
        document.getElementById("fetch-toast"),
        "success",
        "0 tenants found.",
      );
    } else {
      const data = await res.json();
      showToast(
        toast,
        "error",
        data.message || "Failed to delete all tenants.",
      );
    }
  } catch {
    showToast(toast, "error", "Network error. Check your base URL and token.");
  }
}
