# AI Change Audit Report

## Generated On
2026-06-23_12-05-01

## Branch
master

## Baseline Commit
No previous commit. This is the initial implementation audit.

## Task Summary
Initial CRM shell rebuild with 8-tab navigation, design system integration, browser-local RBAC, localStorage database, and audit logging.

## Git Status
```text
A  css/style.css
A  index.html
A  js/app.js
A  js/auth.js
A  js/db.js
A  "sales crm design.md"
```

## Files Changed
```text
A	css/style.css
A	index.html
A	js/app.js
A	js/auth.js
A	js/db.js
A	sales crm design.md
```

## Change Summary
```text
 css/style.css       | 309 +++++++++++++++++++++++++++
 index.html          | 134 ++++++++++++
 js/app.js           | 156 ++++++++++++++
 js/auth.js          |  36 ++++
 js/db.js            | 116 ++++++++++
 sales crm design.md | 593 ++++++++++++++++++++++++++++++++++++++++++++++++++++
 6 files changed, 1344 insertions(+)
```

## Full Diff
```diff
diff --git a/css/style.css b/css/style.css
new file mode 100644
index 0000000..20d6d3c
--- /dev/null
+++ b/css/style.css
@@ -0,0 +1,309 @@
+:root {
+  --primary: #cc785c;
+  --primary-active: #a9583e;
+  --primary-disabled: #e6dfd8;
+  --ink: #141413;
+  --body: #3d3d3a;
+  --body-strong: #252523;
+  --muted: #6c6a64;
+  --muted-soft: #8e8b82;
+  --hairline: #e6dfd8;
+  --canvas: #f5f0e8;
+  --surface-soft: #f5f0e8;
+  --surface-card: #efe9de;
+  --surface-dark: #181715;
+  --surface-dark-elevated: #252320;
+  --on-primary: #ffffff;
+  --on-dark: #f5f0e8;
+  --on-dark-soft: #a09d96;
+
+  --success: #5db872;
+  --warning: #d4a017;
+  --error: #c64545;
+
+  --font-display: "Tiempos Headline", "Cormorant Garamond", serif;
+  --font-body: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
+  --font-code: "JetBrains Mono", ui-monospace, monospace;
+
+  --rounded-xs: 4px;
+  --rounded-sm: 6px;
+  --rounded-md: 8px;
+  --rounded-lg: 12px;
+  --rounded-xl: 16px;
+  --rounded-pill: 9999px;
+
+  --spacing-xxs: 4px;
+  --spacing-xs: 8px;
+  --spacing-sm: 12px;
+  --spacing-md: 16px;
+  --spacing-lg: 24px;
+  --spacing-xl: 32px;
+  --spacing-section: 96px;
+}
+
+* {
+  box-sizing: border-box;
+  margin: 0;
+  padding: 0;
+}
+
+body {
+  font-family: var(--font-body);
+  background-color: var(--canvas);
+  color: var(--ink);
+  line-height: 1.55;
+  font-size: 16px;
+}
+
+h1, h2, h3, h4, h5, h6 {
+  font-family: var(--font-display);
+  font-weight: 400;
+  color: var(--ink);
+  letter-spacing: -0.5px;
+}
+
+h1 {
+  font-size: 48px;
+  letter-spacing: -1px;
+}
+
+h2 {
+  font-size: 36px;
+}
+
+h3 {
+  font-size: 28px;
+}
+
+a {
+  color: var(--primary);
+  text-decoration: none;
+}
+
+a:hover {
+  text-decoration: underline;
+}
+
+/* Layout */
+.app-container {
+  display: flex;
+  height: 100vh;
+  overflow: hidden;
+}
+
+/* Sidebar Navigation */
+.sidebar {
+  width: 260px;
+  background-color: var(--surface-dark);
+  color: var(--on-dark);
+  display: flex;
+  flex-direction: column;
+  padding: var(--spacing-lg) 0;
+  border-right: 1px solid var(--surface-dark-elevated);
+}
+
+.sidebar-header {
+  padding: 0 var(--spacing-lg);
+  margin-bottom: var(--spacing-xl);
+}
+
+.sidebar-header h2 {
+  color: var(--on-dark);
+  font-size: 24px;
+  margin-bottom: var(--spacing-xs);
+}
+
+.user-info {
+  font-size: 14px;
+  color: var(--on-dark-soft);
+  margin-bottom: var(--spacing-sm);
+}
+
+.nav-menu {
+  list-style: none;
+  flex-grow: 1;
+}
+
+.nav-item {
+  padding: var(--spacing-sm) var(--spacing-lg);
+  cursor: pointer;
+  font-weight: 500;
+  font-size: 14px;
+  color: var(--on-dark-soft);
+  transition: all 0.2s ease;
+}
+
+.nav-item:hover, .nav-item.active {
+  background-color: var(--surface-dark-elevated);
+  color: var(--on-dark);
+}
+
+/* Main Content Area */
+.main-content {
+  flex-grow: 1;
+  background-color: var(--canvas);
+  overflow-y: auto;
+  padding: var(--spacing-xl);
+}
+
+.tab-pane {
+  display: none;
+}
+
+.tab-pane.active {
+  display: block;
+}
+
+/* Header inside Main Content */
+.top-bar {
+  display: flex;
+  justify-content: space-between;
+  align-items: center;
+  margin-bottom: var(--spacing-xl);
+  padding-bottom: var(--spacing-md);
+  border-bottom: 1px solid var(--hairline);
+}
+
+/* Components */
+.card {
+  background-color: var(--surface-card);
+  border-radius: var(--rounded-lg);
+  padding: var(--spacing-xl);
+  margin-bottom: var(--spacing-lg);
+}
+
+.dark-card {
+  background-color: var(--surface-dark);
+  color: var(--on-dark);
+  border-radius: var(--rounded-lg);
+  padding: var(--spacing-xl);
+  margin-bottom: var(--spacing-lg);
+}
+
+.dark-card h3 {
+  color: var(--on-dark);
+}
+
+/* Buttons */
+.btn {
+  font-family: var(--font-body);
+  font-weight: 500;
+  font-size: 14px;
+  padding: 12px 20px;
+  border-radius: var(--rounded-md);
+  border: none;
+  cursor: pointer;
+  display: inline-flex;
+  align-items: center;
+  justify-content: center;
+  transition: background-color 0.2s ease;
+}
+
+.btn-primary {
+  background-color: var(--primary);
+  color: var(--on-primary);
+}
+
+.btn-primary:hover {
+  background-color: var(--primary-active);
+}
+
+.btn-secondary {
+  background-color: var(--canvas);
+  color: var(--ink);
+  border: 1px solid var(--hairline);
+}
+
+.btn-secondary:hover {
+  background-color: var(--surface-card);
+}
+
+/* Forms */
+.form-group {
+  margin-bottom: var(--spacing-md);
+}
+
+.form-group label {
+  display: block;
+  font-weight: 500;
+  margin-bottom: var(--spacing-xs);
+  color: var(--body-strong);
+}
+
+.form-control {
+  width: 100%;
+  padding: 10px 14px;
+  font-family: var(--font-body);
+  font-size: 16px;
+  border: 1px solid var(--hairline);
+  border-radius: var(--rounded-md);
+  background-color: var(--canvas);
+  color: var(--ink);
+}
+
+.form-control:focus {
+  outline: none;
+  border-color: var(--primary);
+  box-shadow: 0 0 0 3px rgba(204, 120, 92, 0.15);
+}
+
+/* Login View */
+.login-view {
+  display: flex;
+  height: 100vh;
+  align-items: center;
+  justify-content: center;
+  background-color: var(--canvas);
+}
+
+.login-card {
+  background-color: var(--surface-card);
+  padding: var(--spacing-xl);
+  border-radius: var(--rounded-lg);
+  width: 100%;
+  max-width: 400px;
+  box-shadow: 0 4px 12px rgba(20, 20, 19, 0.05);
+}
+
+.login-card h2 {
+  margin-bottom: var(--spacing-lg);
+  text-align: center;
+}
+
+/* Tables for CRM data */
+.data-table {
+  width: 100%;
+  border-collapse: collapse;
+}
+
+.data-table th, .data-table td {
+  padding: var(--spacing-sm);
+  text-align: left;
+  border-bottom: 1px solid var(--hairline);
+}
+
+.data-table th {
+  font-weight: 500;
+  color: var(--muted);
+  font-size: 14px;
+}
+
+/* Badges */
+.badge {
+  padding: 4px 12px;
+  border-radius: var(--rounded-pill);
+  font-size: 12px;
+  font-weight: 500;
+  letter-spacing: 1.5px;
+  text-transform: uppercase;
+}
+
+.badge-coral {
+  background-color: var(--primary);
+  color: var(--on-primary);
+}
+
+/* Hidden elements */
+.hidden {
+  display: none !important;
+}
diff --git a/index.html b/index.html
new file mode 100644
index 0000000..d67bee4
--- /dev/null
+++ b/index.html
@@ -0,0 +1,134 @@
+<!DOCTYPE html>
+<html lang="en">
+<head>
+  <meta charset="UTF-8">
+  <meta name="viewport" content="width=device-width, initial-scale=1.0">
+  <title>Sales CRM</title>
+  <link rel="stylesheet" href="css/style.css">
+</head>
+<body>
+
+  <!-- Login View -->
+  <div id="login-view" class="login-view">
+    <div class="login-card">
+      <h2>Sales CRM</h2>
+      <form id="login-form">
+        <div class="form-group">
+          <label for="role-select">Select Role to Login</label>
+          <select id="role-select" class="form-control">
+            <option value="manager">Manager (Full Access)</option>
+            <option value="team_lead">Team Lead (Team Access)</option>
+            <option value="employee">Employee (Own Access)</option>
+          </select>
+        </div>
+        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 16px;">Log In</button>
+      </form>
+    </div>
+  </div>
+
+  <!-- App Shell -->
+  <div id="app-view" class="app-container hidden">
+    <!-- Sidebar -->
+    <aside class="sidebar">
+      <div class="sidebar-header">
+        <h2>Sales CRM</h2>
+        <div id="current-user-info" class="user-info"></div>
+      </div>
+      <ul class="nav-menu">
+        <li class="nav-item active" data-tab="dashboard">Dashboard</li>
+        <li class="nav-item" data-tab="leads">Leads</li>
+        <li class="nav-item" data-tab="pipeline">Pipeline</li>
+        <li class="nav-item" data-tab="sourcing">Requirements & Sourcing</li>
+        <li class="nav-item" data-tab="deals">Deals</li>
+        <li class="nav-item" data-tab="database">Database</li>
+        <li class="nav-item" data-tab="reports">Reports / MIS</li>
+        <li class="nav-item" data-tab="settings">Settings</li>
+      </ul>
+      <div style="padding: 16px;">
+        <button id="logout-btn" class="btn btn-secondary" style="width: 100%;">Log Out</button>
+      </div>
+    </aside>
+
+    <!-- Main Content -->
+    <main class="main-content">
+      <div class="top-bar">
+        <h2 id="page-title">Dashboard</h2>
+        <div>
+          <button class="btn btn-primary" id="add-record-btn">+ New Record</button>
+        </div>
+      </div>
+
+      <!-- Tab Contents -->
+      <div id="tab-dashboard" class="tab-pane active">
+        <div class="card">
+          <h3>Welcome to the Dashboard</h3>
+          <p>Your current active workspace overview will appear here.</p>
+        </div>
+        <div id="dashboard-records" class="card">
+          <!-- Rendered by JS -->
+        </div>
+      </div>
+
+      <div id="tab-leads" class="tab-pane">
+        <div class="card">
+          <h3>Leads</h3>
+          <p>Manage your prospective clients.</p>
+        </div>
+      </div>
+
+      <div id="tab-pipeline" class="tab-pane">
+        <div class="card">
+          <h3>Pipeline</h3>
+          <p>Track ongoing sales processes.</p>
+        </div>
+      </div>
+
+      <div id="tab-sourcing" class="tab-pane">
+        <div class="card">
+          <h3>Requirements & Sourcing</h3>
+          <p>Fulfill client needs.</p>
+        </div>
+      </div>
+
+      <div id="tab-deals" class="tab-pane">
+        <div class="card">
+          <h3>Deals</h3>
+          <p>Closed and closing deals.</p>
+        </div>
+      </div>
+
+      <div id="tab-database" class="tab-pane">
+        <div class="card">
+          <h3>Database</h3>
+          <p>Full CRM registry.</p>
+        </div>
+      </div>
+
+      <div id="tab-reports" class="tab-pane">
+        <div class="card">
+          <h3>Reports / MIS</h3>
+          <p>Analytics based on your role access.</p>
+        </div>
+      </div>
+
+      <div id="tab-settings" class="tab-pane">
+        <div class="card">
+          <h3>Settings</h3>
+          <p>Application settings (restricted access).</p>
+        </div>
+      </div>
+
+      <!-- Audit Logs (Admin only visible usually, but let's put it on Dashboard or Database) -->
+      <div id="audit-logs-section" class="card hidden">
+        <h3>Recent Audit Logs</h3>
+        <div id="audit-logs-container"></div>
+      </div>
+
+    </main>
+  </div>
+
+  <script src="js/db.js"></script>
+  <script src="js/auth.js"></script>
+  <script src="js/app.js"></script>
+</body>
+</html>
diff --git a/js/app.js b/js/app.js
new file mode 100644
index 0000000..d6f7c93
--- /dev/null
+++ b/js/app.js
@@ -0,0 +1,156 @@
+document.addEventListener('DOMContentLoaded', () => {
+  const loginView = document.getElementById('login-view');
+  const appView = document.getElementById('app-view');
+  const loginForm = document.getElementById('login-form');
+  const logoutBtn = document.getElementById('logout-btn');
+  const userInfo = document.getElementById('current-user-info');
+  const navItems = document.querySelectorAll('.nav-item');
+  const tabPanes = document.querySelectorAll('.tab-pane');
+  const pageTitle = document.getElementById('page-title');
+  const dashboardRecords = document.getElementById('dashboard-records');
+  const addRecordBtn = document.getElementById('add-record-btn');
+  const auditLogsSection = document.getElementById('audit-logs-section');
+  const auditLogsContainer = document.getElementById('audit-logs-container');
+
+  function init() {
+    const user = auth.getCurrentUser();
+    if (user) {
+      loginView.classList.add('hidden');
+      appView.classList.remove('hidden');
+      userInfo.textContent = `Logged in as: ${user.name}`;
+      applyRoleRestrictions(user);
+      renderRecords();
+      renderAudits();
+    } else {
+      loginView.classList.remove('hidden');
+      appView.classList.add('hidden');
+    }
+  }
+
+  function applyRoleRestrictions(user) {
+    // Basic UI restrictions based on role
+    const settingsTab = document.querySelector('[data-tab="settings"]');
+
+    // Reset all
+    settingsTab.classList.remove('hidden');
+    auditLogsSection.classList.add('hidden');
+
+    if (user.role === 'employee') {
+      settingsTab.classList.add('hidden');
+    }
+
+    if (user.role === 'manager' || user.role === 'team_lead') {
+      auditLogsSection.classList.remove('hidden');
+    }
+  }
+
+  loginForm.addEventListener('submit', (e) => {
+    e.preventDefault();
+    const roleSelect = document.getElementById('role-select').value;
+    if (auth.login(roleSelect)) {
+      init();
+    }
+  });
+
+  logoutBtn.addEventListener('click', () => {
+    auth.logout();
+    init();
+  });
+
+  navItems.forEach(item => {
+    item.addEventListener('click', () => {
+      // Check if user is allowed to access
+      const tabName = item.getAttribute('data-tab');
+      const user = auth.getCurrentUser();
+      if (tabName === 'settings' && user.role === 'employee') {
+        alert("Unauthorized access blocked.");
+        return;
+      }
+
+      navItems.forEach(nav => nav.classList.remove('active'));
+      item.classList.add('active');
+
+      tabPanes.forEach(pane => pane.classList.remove('active'));
+      document.getElementById(`tab-${tabName}`).classList.add('active');
+
+      pageTitle.textContent = item.textContent;
+    });
+  });
+
+  addRecordBtn.addEventListener('click', () => {
+    const user = auth.getCurrentUser();
+    if (user) {
+      db.addRecord(`New Record ${new Date().getTime().toString().slice(-4)}`, user);
+      renderRecords();
+      renderAudits();
+    }
+  });
+
+  function renderRecords() {
+    const user = auth.getCurrentUser();
+    const records = db.getRecords(user);
+
+    if (records.length === 0) {
+      dashboardRecords.innerHTML = '<p>No records visible for your role.</p>';
+      return;
+    }
+
+    let html = `
+      <table class="data-table">
+        <thead>
+          <tr>
+            <th>ID</th>
+            <th>Title</th>
+            <th>Owner ID</th>
+            <th>Team ID</th>
+            <th>Created By</th>
+            <th>Created At</th>
+          </tr>
+        </thead>
+        <tbody>
+    `;
+
+    records.forEach(rec => {
+      html += `
+        <tr>
+          <td><span class="badge badge-coral">${rec.id}</span></td>
+          <td>${rec.title}</td>
+          <td>${rec.owner_id}</td>
+          <td>${rec.team_id}</td>
+          <td>${rec.created_by}</td>
+          <td>${new Date(rec.created_at).toLocaleString()}</td>
+        </tr>
+      `;
+    });
+
+    html += `</tbody></table>`;
+    dashboardRecords.innerHTML = html;
+  }
+
+  function renderAudits() {
+    const audits = db.getAudits();
+    if (audits.length === 0) {
+      auditLogsContainer.innerHTML = '<p>No audit logs.</p>';
+      return;
+    }
+
+    // Show last 5 audits for demo
+    const recentAudits = audits.slice(-5).reverse();
+
+    let html = '<table class="data-table"><thead><tr><th>Time</th><th>User</th><th>Action</th><th>Details</th></tr></thead><tbody>';
+    recentAudits.forEach(log => {
+      html += `
+        <tr>
+          <td>${new Date(log.timestamp).toLocaleTimeString()}</td>
+          <td>${log.user_id} (${log.user_role})</td>
+          <td><span class="badge" style="background-color: var(--surface-dark-elevated); color: var(--on-dark);">${log.action}</span></td>
+          <td>${log.details}</td>
+        </tr>
+      `;
+    });
+    html += '</tbody></table>';
+    auditLogsContainer.innerHTML = html;
+  }
+
+  init();
+});
diff --git a/js/auth.js b/js/auth.js
new file mode 100644
index 0000000..4530c92
--- /dev/null
+++ b/js/auth.js
@@ -0,0 +1,36 @@
+const USERS = {
+  manager: { id: 'mgr1', name: 'Alice (Manager)', role: 'manager', team_id: 'all' },
+  team_lead: { id: 'tl1', name: 'Bob (Team Lead - Alpha)', role: 'team_lead', team_id: 'team_alpha' },
+  employee: { id: 'emp1', name: 'Charlie (Employee - Alpha)', role: 'employee', team_id: 'team_alpha' }
+};
+
+class Auth {
+  constructor() {
+    this.currentUser = JSON.parse(localStorage.getItem('crm_current_user'));
+  }
+
+  login(roleKey) {
+    const user = USERS[roleKey];
+    if (user) {
+      this.currentUser = user;
+      localStorage.setItem('crm_current_user', JSON.stringify(user));
+      db.logAudit('login', 'User logged in', user);
+      return true;
+    }
+    return false;
+  }
+
+  logout() {
+    if (this.currentUser) {
+      db.logAudit('logout', 'User logged out', this.currentUser);
+    }
+    this.currentUser = null;
+    localStorage.removeItem('crm_current_user');
+  }
+
+  getCurrentUser() {
+    return this.currentUser;
+  }
+}
+
+const auth = new Auth();
diff --git a/js/db.js b/js/db.js
new file mode 100644
index 0000000..9185032
--- /dev/null
+++ b/js/db.js
@@ -0,0 +1,116 @@
+class Database {
+  constructor() {
+    this.seedData();
+  }
+
+  seedData() {
+    if (!localStorage.getItem('crm_records')) {
+      const initialRecords = [
+        {
+          id: 'rec_1',
+          title: 'Acme Corp Deal',
+          owner_id: 'mgr1',
+          assigned_to: 'mgr1',
+          team_id: 'management',
+          created_by: 'mgr1',
+          created_at: new Date().toISOString(),
+          updated_at: new Date().toISOString()
+        },
+        {
+          id: 'rec_2',
+          title: 'Alpha Team Lead Project',
+          owner_id: 'tl1',
+          assigned_to: 'tl1',
+          team_id: 'team_alpha',
+          created_by: 'mgr1',
+          created_at: new Date().toISOString(),
+          updated_at: new Date().toISOString()
+        },
+        {
+          id: 'rec_3',
+          title: 'Employee 1 Task',
+          owner_id: 'emp1',
+          assigned_to: 'emp1',
+          team_id: 'team_alpha',
+          created_by: 'tl1',
+          created_at: new Date().toISOString(),
+          updated_at: new Date().toISOString()
+        },
+        {
+          id: 'rec_4',
+          title: 'Employee 2 Task',
+          owner_id: 'emp2',
+          assigned_to: 'emp2',
+          team_id: 'team_beta',
+          created_by: 'mgr1',
+          created_at: new Date().toISOString(),
+          updated_at: new Date().toISOString()
+        }
+      ];
+      localStorage.setItem('crm_records', JSON.stringify(initialRecords));
+    }
+
+    if (!localStorage.getItem('crm_audits')) {
+      localStorage.setItem('crm_audits', JSON.stringify([]));
+    }
+  }
+
+  getRecords(user) {
+    const allRecords = JSON.parse(localStorage.getItem('crm_records') || '[]');
+
+    if (!user) return [];
+
+    if (user.role === 'manager') {
+      return allRecords;
+    } else if (user.role === 'team_lead') {
+      return allRecords.filter(r => r.team_id === user.team_id);
+    } else if (user.role === 'employee') {
+      return allRecords.filter(r =>
+        r.owner_id === user.id ||
+        r.assigned_to === user.id ||
+        r.created_by === user.id
+      );
+    }
+    return [];
+  }
+
+  addRecord(title, user) {
+    const records = JSON.parse(localStorage.getItem('crm_records') || '[]');
+    const newRecord = {
+      id: 'rec_' + Math.random().toString(36).substr(2, 9),
+      title: title,
+      owner_id: user.id,
+      assigned_to: user.id,
+      team_id: user.team_id,
+      created_by: user.id,
+      created_at: new Date().toISOString(),
+      updated_at: new Date().toISOString()
+    };
+    records.push(newRecord);
+    localStorage.setItem('crm_records', JSON.stringify(records));
+
+    this.logAudit('create', `Created record ${newRecord.id}`, user);
+    return newRecord;
+  }
+
+  logAudit(action, details, user) {
+    const allowedActions = ['login', 'logout', 'create', 'update', 'delete', 'assign', 'approve', 'import', 'export', 'stage_change'];
+    if (!allowedActions.includes(action)) return;
+
+    const audits = JSON.parse(localStorage.getItem('crm_audits') || '[]');
+    audits.push({
+      timestamp: new Date().toISOString(),
+      action: action,
+      details: details,
+      user_id: user ? user.id : 'unknown',
+      user_role: user ? user.role : 'unknown'
+    });
+    localStorage.setItem('crm_audits', JSON.stringify(audits));
+  }
+
+  getAudits() {
+    return JSON.parse(localStorage.getItem('crm_audits') || '[]');
+  }
+}
+
+const db = new Database();
diff --git a/sales crm design.md b/sales crm design.md
new file mode 100644
index 0000000..f3d9378
--- /dev/null
+++ b/sales crm design.md	
@@ -0,0 +1,593 @@
+---
+version: alpha
+name: Claude-design-analysis
+description: A warm-canvas editorial interface for Anthropic's Claude product. The system anchors on a tinted cream canvas with serif display headlines, warm coral CTAs, and dark navy product surfaces (code editor mockups, model showcase cards). Brand voltage comes from the cream/coral pairing ΓÇö deliberately warm and humanist where most AI brands use cool blue + slate. Type voice runs a slab-serif display ("Copernicus" / Tiempos Headline) for h1/h2 and a humanist sans for body. The signature Anthropic black-radial-spike mark anchors the wordmark.
+
+golden_rule:
+  canvas_replacement: "Use surface-soft (#f5f0e8) as the global canvas/default page floor everywhere the old cream canvas was used."
+  old_canvas_removed: "The old canvas cream token must not be used anywhere in the application design system."
+
+colors:
+  primary: "#cc785c"
+  primary-active: "#a9583e"
+  primary-disabled: "#e6dfd8"
+  ink: "#141413"
+  body: "#3d3d3a"
+  body-strong: "#252523"
+  muted: "#6c6a64"
+  muted-soft: "#8e8b82"
+  hairline: "#e6dfd8"
+  hairline-soft: "#ebe6df"
+  canvas: "#f5f0e8"
+  surface-soft: "#f5f0e8"
+  surface-card: "#efe9de"
+  surface-cream-strong: "#e8e0d2"
+  surface-dark: "#181715"
+  surface-dark-elevated: "#252320"
+  surface-dark-soft: "#1f1e1b"
+  on-primary: "#ffffff"
+  on-dark: "#f5f0e8"
+  on-dark-soft: "#a09d96"
+  accent-teal: "#5db8a6"
+  accent-amber: "#e8a55a"
+  success: "#5db872"
+  warning: "#d4a017"
+  error: "#c64545"
+
+typography:
+  display-xl:
+    fontFamily: "Copernicus, Tiempos Headline, serif"
+    fontSize: 64px
+    fontWeight: 400
+    lineHeight: 1.05
+    letterSpacing: -1.5px
+  display-lg:
+    fontFamily: "Copernicus, Tiempos Headline, serif"
+    fontSize: 48px
+    fontWeight: 400
+    lineHeight: 1.1
+    letterSpacing: -1px
+  display-md:
+    fontFamily: "Copernicus, Tiempos Headline, serif"
+    fontSize: 36px
+    fontWeight: 400
+    lineHeight: 1.15
+    letterSpacing: -0.5px
+  display-sm:
+    fontFamily: "Copernicus, Tiempos Headline, serif"
+    fontSize: 28px
+    fontWeight: 400
+    lineHeight: 1.2
+    letterSpacing: -0.3px
+  title-lg:
+    fontFamily: "StyreneB, Inter, sans-serif"
+    fontSize: 22px
+    fontWeight: 500
+    lineHeight: 1.3
+    letterSpacing: 0
+  title-md:
+    fontFamily: "StyreneB, Inter, sans-serif"
+    fontSize: 18px
+    fontWeight: 500
+    lineHeight: 1.4
+    letterSpacing: 0
+  title-sm:
+    fontFamily: "StyreneB, Inter, sans-serif"
+    fontSize: 16px
+    fontWeight: 500
+    lineHeight: 1.4
+    letterSpacing: 0
+  body-md:
+    fontFamily: "StyreneB, Inter, sans-serif"
+    fontSize: 16px
+    fontWeight: 400
+    lineHeight: 1.55
+    letterSpacing: 0
+  body-sm:
+    fontFamily: "StyreneB, Inter, sans-serif"
+    fontSize: 14px
+    fontWeight: 400
+    lineHeight: 1.55
+    letterSpacing: 0
+  caption:
+    fontFamily: "StyreneB, Inter, sans-serif"
+    fontSize: 13px
+    fontWeight: 500
+    lineHeight: 1.4
+    letterSpacing: 0
+  caption-uppercase:
+    fontFamily: "StyreneB, Inter, sans-serif"
+    fontSize: 12px
+    fontWeight: 500
+    lineHeight: 1.4
+    letterSpacing: 1.5px
+  code:
+    fontFamily: "JetBrains Mono, ui-monospace, monospace"
+    fontSize: 14px
+    fontWeight: 400
+    lineHeight: 1.6
+    letterSpacing: 0
+  button:
+    fontFamily: "StyreneB, Inter, sans-serif"
+    fontSize: 14px
+    fontWeight: 500
+    lineHeight: 1
+    letterSpacing: 0
+  nav-link:
+    fontFamily: "StyreneB, Inter, sans-serif"
+    fontSize: 14px
+    fontWeight: 500
+    lineHeight: 1.4
+    letterSpacing: 0
+
+rounded:
+  xs: 4px
+  sm: 6px
+  md: 8px
+  lg: 12px
+  xl: 16px
+  pill: 9999px
+  full: 9999px
+
+spacing:
+  xxs: 4px
+  xs: 8px
+  sm: 12px
+  md: 16px
+  lg: 24px
+  xl: 32px
+  xxl: 48px
+  section: 96px
+
+components:
+  button-primary:
+    backgroundColor: "{colors.primary}"
+    textColor: "{colors.on-primary}"
+    typography: "{typography.button}"
+    rounded: "{rounded.md}"
+    padding: 12px 20px
+    height: 40px
+  button-primary-active:
+    backgroundColor: "{colors.primary-active}"
+    textColor: "{colors.on-primary}"
+    rounded: "{rounded.md}"
+  button-primary-disabled:
+    backgroundColor: "{colors.primary-disabled}"
+    textColor: "{colors.muted}"
+    rounded: "{rounded.md}"
+  button-secondary:
+    backgroundColor: "{colors.canvas}"
+    textColor: "{colors.ink}"
+    typography: "{typography.button}"
+    rounded: "{rounded.md}"
+    padding: 12px 20px
+    height: 40px
+  button-secondary-on-dark:
+    backgroundColor: "{colors.surface-dark-elevated}"
+    textColor: "{colors.on-dark}"
+    typography: "{typography.button}"
+    rounded: "{rounded.md}"
+    padding: 12px 20px
+  button-text-link:
+    backgroundColor: transparent
+    textColor: "{colors.ink}"
+    typography: "{typography.button}"
+  button-icon-circular:
+    backgroundColor: "{colors.canvas}"
+    textColor: "{colors.ink}"
+    rounded: "{rounded.full}"
+    size: 36px
+  text-link:
+    backgroundColor: transparent
+    textColor: "{colors.primary}"
+    typography: "{typography.body-md}"
+  top-nav:
+    backgroundColor: "{colors.canvas}"
+    textColor: "{colors.ink}"
+    typography: "{typography.nav-link}"
+    height: 64px
+  hero-band:
+    backgroundColor: "{colors.canvas}"
+    textColor: "{colors.ink}"
+    typography: "{typography.display-xl}"
+    padding: 96px
+  hero-illustration-card:
+    backgroundColor: "{colors.canvas}"
+    textColor: "{colors.ink}"
+    rounded: "{rounded.xl}"
+  feature-card:
+    backgroundColor: "{colors.surface-card}"
+    textColor: "{colors.ink}"
+    typography: "{typography.title-md}"
+    rounded: "{rounded.lg}"
+    padding: 32px
+  product-mockup-card-dark:
+    backgroundColor: "{colors.surface-dark}"
+    textColor: "{colors.on-dark}"
+    typography: "{typography.title-md}"
+    rounded: "{rounded.lg}"
+    padding: 32px
+  code-window-card:
+    backgroundColor: "{colors.surface-dark}"
+    textColor: "{colors.on-dark}"
+    typography: "{typography.code}"
+    rounded: "{rounded.lg}"
+    padding: 24px
+  model-comparison-card:
+    backgroundColor: "{colors.canvas}"
+    textColor: "{colors.ink}"
+    typography: "{typography.title-md}"
+    rounded: "{rounded.lg}"
+    padding: 32px
+  pricing-tier-card:
+    backgroundColor: "{colors.canvas}"
+    textColor: "{colors.ink}"
+    typography: "{typography.title-lg}"
+    rounded: "{rounded.lg}"
+    padding: 32px
+  pricing-tier-card-featured:
+    backgroundColor: "{colors.surface-dark}"
+    textColor: "{colors.on-dark}"
+    typography: "{typography.title-lg}"
+    rounded: "{rounded.lg}"
+    padding: 32px
+  callout-card-coral:
+    backgroundColor: "{colors.primary}"
+    textColor: "{colors.on-primary}"
+    typography: "{typography.title-md}"
+    rounded: "{rounded.lg}"
+    padding: 32px
+  connector-tile:
+    backgroundColor: "{colors.canvas}"
+    textColor: "{colors.ink}"
+    typography: "{typography.title-sm}"
+    rounded: "{rounded.lg}"
+    padding: 20px
+  text-input:
+    backgroundColor: "{colors.canvas}"
+    textColor: "{colors.ink}"
+    typography: "{typography.body-md}"
+    rounded: "{rounded.md}"
+    padding: 10px 14px
+    height: 40px
+  text-input-focused:
+    backgroundColor: "{colors.canvas}"
+    textColor: "{colors.ink}"
+    rounded: "{rounded.md}"
+  cookie-consent-card:
+    backgroundColor: "{colors.surface-dark}"
+    textColor: "{colors.on-dark}"
+    typography: "{typography.body-sm}"
+    rounded: "{rounded.lg}"
+    padding: 24px
+  category-tab:
+    backgroundColor: transparent
+    textColor: "{colors.muted}"
+    typography: "{typography.nav-link}"
+    padding: 8px 14px
+    rounded: "{rounded.md}"
+  category-tab-active:
+    backgroundColor: "{colors.surface-card}"
+    textColor: "{colors.ink}"
+    typography: "{typography.nav-link}"
+    rounded: "{rounded.md}"
+  badge-pill:
+    backgroundColor: "{colors.surface-card}"
+    textColor: "{colors.ink}"
+    typography: "{typography.caption}"
+    rounded: "{rounded.pill}"
+    padding: 4px 12px
+  badge-coral:
+    backgroundColor: "{colors.primary}"
+    textColor: "{colors.on-primary}"
+    typography: "{typography.caption-uppercase}"
+    rounded: "{rounded.pill}"
+    padding: 4px 12px
+  cta-band-coral:
+    backgroundColor: "{colors.primary}"
+    textColor: "{colors.on-primary}"
+    typography: "{typography.display-sm}"
+    rounded: "{rounded.lg}"
+    padding: 64px
+  cta-band-dark:
+    backgroundColor: "{colors.surface-dark}"
+    textColor: "{colors.on-dark}"
+    typography: "{typography.display-sm}"
+    rounded: "{rounded.lg}"
+    padding: 64px
+  footer:
+    backgroundColor: "{colors.surface-dark}"
+    textColor: "{colors.on-dark-soft}"
+    typography: "{typography.body-sm}"
+    padding: 64px
+---
+
+## Overview
+
+Claude.com is the warmest, most editorial interface in the AI-product category. The base atmosphere is a **tinted cream canvas** (`{colors.canvas}` ΓÇö #f5f0e8) ΓÇö distinctly warm, deliberately not the cool gray-white that every other AI brand uses. Headlines run a **slab-serif display** ("Copernicus" / Tiempos Headline) at weight 400 with negative letter-spacing, paired with **StyreneB / Inter** body sans. The combination feels like a literary publication, not a SaaS marketing page.
+
+Brand voltage comes from the **cream + coral pairing** ΓÇö coral (`{colors.primary}` ΓÇö #cc785c) is the signature Anthropic accent, used on every primary CTA, on the brand wordmark, and on full-bleed callout cards. The coral is warm, slightly muted, never cyan/blue ΓÇö a deliberate counter-positioning against OpenAI's cool slate, Google's saturated blue, and Microsoft's corporate cyan.
+
+The system has three surface modes that alternate page-by-page:
+1. **Cream canvas** (`{colors.canvas}`) ΓÇö default body floor
+2. **Light cream cards** (`{colors.surface-card}`) ΓÇö feature card backgrounds
+3. **Dark navy product surfaces** (`{colors.surface-dark}`) ΓÇö code editor mockups, model showcase cards, pre-footer CTAs, footer itself
+
+The dark surfaces are where Claude shows its product chrome ΓÇö code blocks, terminal output, model comparison tables, agentic-flow diagrams. The cream-to-dark contrast is the page's pacing rhythm.
+
+**Key Characteristics:**
+- Warm cream canvas (`{colors.canvas}` ΓÇö #f5f0e8) with dark warm-ink text (`{colors.ink}` ΓÇö #141413). The brand's defining color choice.
+- Coral primary CTA (`{colors.primary}` ΓÇö #cc785c). Used scarcely on individual buttons, generously on full-bleed coral callout cards.
+- Slab-serif display headlines via Copernicus / Tiempos Headline at weight 400 with negative letter-spacing. Pairs with humanist sans body for a literary editorial voice.
+- Dark navy product mockup cards (`{colors.surface-dark}` ΓÇö #181715) carrying code blocks, terminal panels, model comparison data ΓÇö the brand shows the product chrome at scale rather than abstract marketing illustrations.
+- Light cream feature cards (`{colors.surface-card}` ΓÇö #efe9de) ΓÇö slightly darker than canvas, used for content-driven feature explanations.
+- Anthropic radial-spike mark ΓÇö a small black asterisk-like glyph (4-spoke radial) ΓÇö appears as the brand wordmark prefix and as a content marker.
+- Border radius is hierarchical: `{rounded.md}` (8px) for buttons + inputs, `{rounded.lg}` (12px) for content + product cards, `{rounded.xl}` (16px) for the hero illustration container, `{rounded.pill}` for badges.
+- Section rhythm `{spacing.section}` (96px) ΓÇö modern-SaaS standard. Internal card padding stays generous at `{spacing.xl}` (32px).
+
+## Colors
+
+### Brand & Accent
+- **Coral / Primary** (`{colors.primary}` ΓÇö #cc785c): The signature Anthropic warm coral. Used on every primary CTA background, on full-bleed coral callout cards, on the brand wordmark accent. The most-recognized Anthropic color outside of the spike-mark logo.
+- **Coral Active** (`{colors.primary-active}` ΓÇö #a9583e): The press / hover-darker variant.
+- **Coral Disabled** (`{colors.primary-disabled}` ΓÇö #e6dfd8): A desaturated cream-tinted disabled state.
+- **Accent Teal** (`{colors.accent-teal}` ΓÇö #5db8a6): Used sparingly on secondary product surfaces (terminal status indicators, "active connection" dots in connectors page).
+- **Accent Amber** (`{colors.accent-amber}` ΓÇö #e8a55a): A small companion warm-tone used on category badges and inline highlights.
+
+### Surface
+- **Canvas** (`{colors.canvas}` ΓÇö #f5f0e8): The default page floor. Tinted cream ΓÇö warm, deliberately not pure white.
+- **Surface Soft** (`{colors.surface-soft}` ΓÇö #f5f0e8): Section dividers, very-soft band backgrounds.
+- **Surface Card** (`{colors.surface-card}` ΓÇö #efe9de): Feature cards, content cards. One step darker than canvas.
+- **Surface Cream Strong** (`{colors.surface-cream-strong}` ΓÇö #e8e0d2): A strongest-cream variant used on selected category tabs and emphasized section bands.
+- **Surface Dark** (`{colors.surface-dark}` ΓÇö #181715): Code editor mockups, model showcase cards, footer. The dominant dark surface.
+- **Surface Dark Elevated** (`{colors.surface-dark-elevated}` ΓÇö #252320): Elevated cards inside dark bands (settings panels in mockups).
+- **Surface Dark Soft** (`{colors.surface-dark-soft}` ΓÇö #1f1e1b): Slightly lighter dark, used for code block backgrounds inside larger dark cards.
+- **Hairline** (`{colors.hairline}` ΓÇö #e6dfd8): The 1px border tone on cream surfaces. Same hex as `{colors.primary-disabled}` ΓÇö borders feel like one elevation step rather than ink lines.
+- **Hairline Soft** (`{colors.hairline-soft}` ΓÇö #ebe6df): Barely-visible divider used inside the same band.
+
+### Text
+- **Ink** (`{colors.ink}` ΓÇö #141413): All headlines and primary text. Warm dark, slightly off-pure-black.
+- **Body Strong** (`{colors.body-strong}` ΓÇö #252523): Emphasized paragraphs, lead text.
+- **Body** (`{colors.body}` ΓÇö #3d3d3a): Default running-text color.
+- **Muted** (`{colors.muted}` ΓÇö #6c6a64): Sub-headings, breadcrumbs, footer-adjacent secondary text.
+- **Muted Soft** (`{colors.muted-soft}` ΓÇö #8e8b82): Captions, fine-print, copyright lines.
+- **On Primary** (`{colors.on-primary}` ΓÇö #ffffff): Text on coral buttons.
+- **On Dark** (`{colors.on-dark}` ΓÇö #f5f0e8): Cream-tinted white used on dark surfaces (echoes the canvas tone).
+- **On Dark Soft** (`{colors.on-dark-soft}` ΓÇö #a09d96): Footer body text, secondary labels in dark mockups.
+
+### Semantic
+- **Success** (`{colors.success}` ΓÇö #5db872): Green status dots, "available" indicators.
+- **Warning** (`{colors.warning}` ΓÇö #d4a017): Warning callouts (rare on marketing surfaces).
+- **Error** (`{colors.error}` ΓÇö #c64545): Validation errors.
+
+## Typography
+
+### Font Family
+The system runs **Copernicus** (or **Tiempos Headline** as substitute) as the slab-serif display face for headlines, and **StyreneB** (or **Inter** as substitute) as the humanist sans for body, navigation, and UI labels. **JetBrains Mono** handles code blocks. The fallback stack walks `Tiempos Headline, Garamond, "Times New Roman", serif` for display and `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` for body.
+
+The display/body split is editorial:
+- Copernicus serif (weight 400, negative tracking) ΓåÆ h1, h2, h3, hero display
+- StyreneB sans (weight 400-500) ΓåÆ body, navigation, buttons, captions, labels
+- JetBrains Mono ΓåÆ all code blocks and terminal text
+
+### Hierarchy
+
+| Token | Size | Weight | Line Height | Letter Spacing | Use |
+|---|---|---|---|---|---|
+| `{typography.display-xl}` | 64px | 400 | 1.05 | -1.5px | Homepage h1 ("Meet your thinking partner") ΓÇö Copernicus serif |
+| `{typography.display-lg}` | 48px | 400 | 1.1 | -1px | Section heads ΓÇö Copernicus |
+| `{typography.display-md}` | 36px | 400 | 1.15 | -0.5px | Sub-section heads, model names ΓÇö Copernicus |
+| `{typography.display-sm}` | 28px | 400 | 1.2 | -0.3px | Pricing tier names, callout headlines ΓÇö Copernicus |
+| `{typography.title-lg}` | 22px | 500 | 1.3 | 0 | Pricing plan size labels ΓÇö StyreneB |
+| `{typography.title-md}` | 18px | 500 | 1.4 | 0 | Feature card titles, intro paragraphs |
+| `{typography.title-sm}` | 16px | 500 | 1.4 | 0 | Connector tile titles, list labels |
+| `{typography.body-md}` | 16px | 400 | 1.55 | 0 | Default running-text ΓÇö StyreneB |
+| `{typography.body-sm}` | 14px | 400 | 1.55 | 0 | Footer body, fine-print |
+| `{typography.caption}` | 13px | 500 | 1.4 | 0 | Badge labels, captions |
+| `{typography.caption-uppercase}` | 12px | 500 | 1.4 | 1.5px | Category tags, "NEW" badges |
+| `{typography.code}` | 14px | 400 | 1.6 | 0 | Code blocks ΓÇö JetBrains Mono |
+| `{typography.button}` | 14px | 500 | 1.0 | 0 | Standard button labels |
+| `{typography.nav-link}` | 14px | 500 | 1.4 | 0 | Top-nav menu items |
+
+### Principles
+Display sizes use weight 400 (regular), never bold. Negative letter-spacing (-0.3 to -1.5px) is essential ΓÇö Copernicus without it reads as off-brand. The serif character is what gives Anthropic its literary, considered voice; switching to a sans-serif display would make Claude feel like every other AI tool.
+
+Body type stays at weight 400 for paragraphs, weight 500 for labels and emphasized phrases. The sans body is humanist (StyreneB) ΓÇö never geometric. Inter is an acceptable substitute because of its similar humanist proportions; Helvetica or Arial would be too neutral and break the warm-editorial feel.
+
+### Note on Font Substitutes
+If Copernicus / Tiempos Headline is unavailable, **Cormorant Garamond** at weight 500 with -0.02em letter-spacing is the closest open-source approximation. **EB Garamond** is a fallback. For StyreneB, **Inter** is the closest match ΓÇö both are humanist sans designed for screen reading. **S├╢hne** is another close alternative if licensed.
+
+## Layout
+
+### Spacing System
+- **Base unit:** 4px.
+- **Tokens:** `{spacing.xxs}` 4px ┬╖ `{spacing.xs}` 8px ┬╖ `{spacing.sm}` 12px ┬╖ `{spacing.md}` 16px ┬╖ `{spacing.lg}` 24px ┬╖ `{spacing.xl}` 32px ┬╖ `{spacing.xxl}` 48px ┬╖ `{spacing.section}` 96px.
+- **Section padding:** `{spacing.section}` (96px) ΓÇö modern-SaaS rhythm.
+- **Card internal padding:** `{spacing.xl}` (32px) for feature cards, pricing tier cards, model comparison cards; `{spacing.lg}` (24px) for code-window cards and connector tiles.
+- **Callout / CTA bands:** `{spacing.xxl}` (48px) inside coral callout cards; 64px inside the larger dark CTA band.
+
+### Grid & Container
+- **Max content width:** ~1200px centered.
+- **Editorial body:** Single 12-column grid; hero often uses 6/6 split (h1 left, illustration right).
+- **Feature card grids:** 3-up at desktop, 2-up at tablet, 1-up at mobile.
+- **Connector tile grids:** 4-up or 6-up at desktop, 2-up at tablet, 1-up at mobile.
+- **Pricing grid:** 3-up at desktop (Free / Pro / Team / Enterprise often), 1-up at mobile.
+
+### Whitespace Philosophy
+The cream canvas + serif display + generous internal padding create an editorial pacing ΓÇö Claude reads like a long-form magazine column rather than a marketing template. Whitespace between bands stays uniform at 96px; whitespace inside cards is generous (32px), letting type breathe.
+
+## Elevation & Depth
+
+| Level | Treatment | Use |
+|---|---|---|
+| Flat | No shadow, no border | Body sections, top nav, hero bands |
+| Soft hairline | 1px `{colors.hairline}` border | Inputs, sub-nav, occasionally on cards |
+| Cream card | `{colors.surface-card}` background ΓÇö no shadow | Feature cards, content cards |
+| Dark surface card | `{colors.surface-dark}` background ΓÇö no shadow | Code editor mockups, model showcase cards |
+| Subtle drop shadow | Faint shadow at low alpha | Hover-elevated states (the system uses `0 1px 3px rgba(20,20,19,0.08)` rarely) |
+
+The elevation philosophy is **color-block first, shadow rare**. Most depth comes from the cream-vs-dark surface contrast. Shadows are minimal. The dark surface mockups have their own internal product chrome (code editor scrollbars, line numbers, syntax highlighting) which adds detail without needing external shadows.
+
+### Decorative Depth
+- The Anthropic spike-mark glyph (4-spoke radial asterisk) appears as a small black mark in the brand wordmark and inline as a content marker.
+- Code editor mockups carry their own internal depth: syntax-highlighted text in muted blues / oranges / grays, line numbers in `{colors.muted-soft}`, status bars at the bottom in `{colors.surface-dark-elevated}`.
+- Some hero illustrations use simple line-art with coral and dark-navy strokes on cream ΓÇö minimal, hand-drawn-feeling, never photorealistic.
+
+## Shapes
+
+### Border Radius Scale
+
+| Token | Value | Use |
+|---|---|---|
+| `{rounded.xs}` | 4px | Reserved for badge accents and tiny dropdowns |
+| `{rounded.sm}` | 6px | Small inline buttons, dropdown items |
+| `{rounded.md}` | 8px | Standard CTA buttons, text inputs, category tabs |
+| `{rounded.lg}` | 12px | Content cards (feature, pricing, code-window, model-comparison) |
+| `{rounded.xl}` | 16px | Hero illustration container, the larger marquee components |
+| `{rounded.pill}` | 9999px | Badge pills, "NEW" tags |
+| `{rounded.full}` | 9999px / 50% | Avatar substitutes, icon buttons |
+
+### Photography & Illustrations
+Claude's hero rarely uses photography. Instead it uses:
+- Simple line-art illustrations with coral + dark-navy strokes on the cream canvas
+- Code editor mockups (the dominant "hero" treatment on developer-focused pages)
+- Terminal output mockups with monospace text on dark
+- Model comparison cards (Opus / Sonnet / Haiku) with abstract geometric thumbnails
+
+When photography is used (rare ΓÇö mostly testimonials), avatars crop to perfect circles at 40px diameter.
+
+## Components
+
+### Top Navigation
+
+**`top-nav`** ΓÇö Cream nav bar pinned to the top of every page. 64px tall, `{colors.canvas}` background. Carries the Anthropic spike-mark + "Claude" wordmark at left, primary horizontal menu (Product, Solutions, Use Cases, Pricing, Research, Company) center-left, right-side cluster with "Sign in" text-link, "Try Claude" `{component.button-primary}` (coral). Menu items in `{typography.nav-link}` (StyreneB 14px / 500).
+
+### Buttons
+
+**`button-primary`** ΓÇö The signature coral CTA. Background `{colors.primary}` (#cc785c), text `{colors.on-primary}` (white), type `{typography.button}` (StyreneB 14px / 500), padding 12px ├ù 20px, height 40px, rounded `{rounded.md}` (8px). Active state `button-primary-active` darkens to `{colors.primary-active}` (#a9583e).
+
+**`button-secondary`** ΓÇö Cream button with hairline outline. Background `{colors.canvas}`, text `{colors.ink}`, 1px hairline border, same padding + height + radius as primary.
+
+**`button-secondary-on-dark`** ΓÇö Used over `{colors.surface-dark}` cards. Background `{colors.surface-dark-elevated}` (#252320), text `{colors.on-dark}`. Stays dark ΓÇö the system never inverts to a light secondary on dark surfaces.
+
+**`button-text-link`** ΓÇö Inline text button, no background. Used for "Sign in" in the top nav and inline CTA links.
+
+**`button-icon-circular`** ΓÇö 36px circular icon button. Background `{colors.canvas}`, hairline border, ink-color icon. Used for carousel arrows, share, "view more".
+
+**`text-link`** ΓÇö Inline body links in `{colors.primary}` (the coral). Underlined on press; the coral inline link is one of the system's most distinctive small details.
+
+### Cards & Containers
+
+**`hero-band`** ΓÇö Cream-canvas hero with a 6-6 grid: h1 + sub-headline + button row on the left, hero illustration card or product mockup card on the right. Vertical padding `{spacing.section}` (96px).
+
+**`hero-illustration-card`** ΓÇö A larger card holding the hero's right-side artifact ΓÇö sometimes a coral-stroke line illustration on cream background, sometimes a dark code editor mockup. Background `{colors.canvas}` or `{colors.surface-dark}` depending on context, rounded `{rounded.xl}` (16px).
+
+**`feature-card`** ΓÇö Used in 3-up feature grids. Background `{colors.surface-card}` (#efe9de ΓÇö slightly darker cream), rounded `{rounded.lg}` (12px), internal padding `{spacing.xl}` (32px). Carries a small icon at top, an `{typography.title-md}` headline, and a body description in `{typography.body-md}`.
+
+**`product-mockup-card-dark`** ΓÇö Dark navy card showing actual Claude product chrome (chat interface, code editor, agent controls). Background `{colors.surface-dark}`, rounded `{rounded.lg}`, internal padding `{spacing.xl}` (32px). Carries text labels in `{colors.on-dark}` and product UI fragments below.
+
+**`code-window-card`** ΓÇö A specialized dark card showing a code editor with line numbers, syntax-highlighted code in `{typography.code}` (JetBrains Mono), and sometimes a "Run" button or terminal output panel below. Background `{colors.surface-dark}` with `{colors.surface-dark-soft}` for the inner code block, rounded `{rounded.lg}`, padding `{spacing.lg}` (24px). The signature visual element of Claude Code product pages.
+
+**`model-comparison-card`** ΓÇö Used on the homepage's "Which problem are you up against?" section comparing Opus / Sonnet / Haiku. Background `{colors.canvas}` with hairline border, rounded `{rounded.lg}`, internal padding `{spacing.xl}` (32px). Carries the model name, a short capability blurb, and a `{component.text-link}` to learn more.
+
+**`pricing-tier-card`** ΓÇö Standard tier card. Background `{colors.canvas}` with hairline border, rounded `{rounded.lg}`, padding `{spacing.xl}` (32px). Carries the plan name in `{typography.title-lg}` (StyreneB), price in `{typography.display-sm}` (Copernicus serif!), feature checklist in `{typography.body-md}`, and a `{component.button-primary}` at the bottom.
+
+**`pricing-tier-card-featured`** ΓÇö The featured tier (typically "Pro" or "Team"). Background flips to `{colors.surface-dark}`, text inverts to `{colors.on-dark}`. The dark surface IS the featured-tier signal.
+
+**`callout-card-coral`** ΓÇö A full-bleed coral card carrying a major call-to-action. Background `{colors.primary}` (#cc785c), text `{colors.on-primary}` (white), rounded `{rounded.lg}`, padding `{spacing.xxl}` (48px). The coral surface IS the voltage; the CTA inside uses an inverted button style (cream/canvas button on coral).
+
+**`connector-tile`** ΓÇö Used on the connectors page's integration grid. Background `{colors.canvas}` with hairline border, rounded `{rounded.lg}`, padding 20px. Each tile carries a logo at top, a `{typography.title-sm}` connector name, and a short description.
+
+### Inputs & Forms
+
+**`text-input`** ΓÇö Standard text input. Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-md}`, rounded `{rounded.md}` (8px), padding 10px ├ù 14px, height 40px. 1px hairline border in `{colors.hairline}`.
+
+**`text-input-focused`** ΓÇö Focus state. Border thickens or shifts to `{colors.primary}` (coral) for emphasis. Carries a 3px coral-at-15%-alpha outer ring.
+
+**`cookie-consent-card`** ΓÇö Bottom-right floating dark cookie banner. Background `{colors.surface-dark}`, text `{colors.on-dark}`, rounded `{rounded.lg}`, padding `{spacing.lg}` (24px). One of the few places dark surface appears at small scale on cream pages.
+
+### Tags / Badges
+
+**`badge-pill`** ΓÇö Small pill label used for category tags. Background `{colors.surface-card}`, text `{colors.ink}`, type `{typography.caption}` (13px / 500), rounded `{rounded.pill}`, padding 4px ├ù 12px.
+
+**`badge-coral`** ΓÇö Coral-fill badge for "NEW", "BETA", featured highlights. Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.caption-uppercase}` (12px / 500 / 1.5px tracking), rounded `{rounded.pill}`, padding 4px ├ù 12px.
+
+### Tab / Filter
+
+**`category-tab`** + **`category-tab-active`** ΓÇö Used in sub-nav rows on solutions / connectors pages. Inactive: transparent background, `{colors.muted}` text. Active: `{colors.surface-card}` background, `{colors.ink}` text. Padding 8px ├ù 14px, rounded `{rounded.md}`.
+
+### CTA / Footer
+
+**`cta-band-coral`** ΓÇö A pre-footer "Try Claude" CTA card. Full-width coral fill, white type, rounded `{rounded.lg}`, padding 64px. Carries an h2 in `{typography.display-sm}` (still serif!), a sub-line, and a cream-button CTA.
+
+**`cta-band-dark`** ΓÇö Alternative pre-footer band on developer-focused pages. Background `{colors.surface-dark}`, text `{colors.on-dark}`, rounded `{rounded.lg}`, padding 64px. Often pairs with a code-window card.
+
+**`footer`** ΓÇö Dark navy footer that closes every page. Background `{colors.surface-dark}` (#181715), text `{colors.on-dark-soft}`. 4-column link list at desktop covering Product / Company / Resources / Legal. Vertical padding 64px. The Anthropic spike-mark + "Anthropic" wordmark sits at the top in `{colors.on-dark}`. The footer never inverts.
+
+## Do's and Don'ts
+
+### Do
+- Anchor every page on the cream canvas. Pure white reads as "any other AI tool"; the warm tint is the brand differentiator.
+- Use Copernicus serif for every display headline. Pair with StyreneB sans body. Negative letter-spacing on display sizes is non-negotiable.
+- Reserve `{colors.primary}` (coral) for primary CTAs and full-bleed `{component.callout-card-coral}` moments. Don't paint accent moments coral elsewhere.
+- Use `{component.product-mockup-card-dark}` and `{component.code-window-card}` to show actual Claude product chrome. Don't paint marketing illustrations of code when you can show real code.
+- Pair `{component.feature-card}` (cream) with `{component.product-mockup-card-dark}` (navy) in alternating bands. The cream-to-dark rhythm is the brand's pacing mechanism.
+- Use the Anthropic spike-mark glyph as the brand wordmark prefix. Never invert the mark to white-on-dark within the wordmark itself.
+- Apply `{spacing.section}` (96px) between major bands.
+
+### Don't
+- Don't use cool grays or pure white for canvas. Cream is the brand.
+- Don't bold serif display weight. Copernicus at 700 reads as bombastic; the system stays at 400.
+- Don't use cool blue or saturated cyan as a brand accent. The coral is the brand voltage.
+- Don't put coral everywhere. The coral is scarce on individual elements and generous only on full-bleed coral callout cards.
+- Don't use Inter for display headlines. The serif character is the brand voice.
+- Don't repeat the same surface mode in two consecutive bands. The pacing alternates: cream ΓåÆ cream-card ΓåÆ dark-mockup ΓåÆ cream ΓåÆ coral-callout ΓåÆ dark-footer.
+- Don't add hover state styling beyond what the system already encodes ΓÇö primary darkens on press; nothing else changes.
+
+## Responsive Behavior
+
+### Breakpoints
+
+| Name | Width | Key Changes |
+|---|---|---|
+| Mobile | < 768px | Hamburger nav; hero h1 64ΓåÆ32px; hero-illustration-card stacks below content; feature grids 1-up; connector tiles 2-up; pricing 1-up; footer 4 cols ΓåÆ 1 |
+| Tablet | 768ΓÇô1024px | Top nav stays horizontal but tightens; feature cards 2-up; connector tiles 3-up; pricing 2-up |
+| Desktop | 1024ΓÇô1440px | Full top-nav with all menu items; 3-up feature cards; 4-up or 6-up connector tiles; 3-up pricing tiers |
+| Wide | > 1440px | Same as desktop with more outer breathing room; max content width caps at 1200px |
+
+### Touch Targets
+- `{component.button-primary}` at minimum 40 ├ù 40px.
+- `{component.button-icon-circular}` at exactly 36 ├ù 36 ΓÇö slightly under WCAG 44 but visually centered.
+- `{component.text-input}` height is 40px.
+- Connector tile entire card area is tappable; effective tap area >> 44px.
+
+### Collapsing Strategy
+- Top nav collapses to hamburger at < 768px; menu opens as a full-screen cream sheet.
+- Hero band's 6-6 grid collapses to single-column on mobile ΓÇö h1 + sub-head + buttons first, then the illustration / mockup card below.
+- Feature grids reduce columns rather than scaling cards down.
+- Pricing tier cards collapse 4 ΓåÆ 2 ΓåÆ 1; featured-tier dark surface stays visually distinct at every breakpoint.
+- Code-window cards retain code legibility at every breakpoint by allowing horizontal scroll within the card rather than wrapping code lines.
+
+### Image Behavior
+- Code blocks inside dark mockups stay at fixed font-size; horizontal scroll on mobile rather than wrapping.
+- Hero illustrations scale proportionally; line-art strokes thin slightly on mobile.
+- Avatar photos in testimonials crop to circles at every breakpoint.
+
+## Iteration Guide
+
+1. Focus on ONE component at a time. Reference its YAML key (`{component.feature-card}`, `{component.code-window-card}`).
+2. Variants of an existing component (`-active`, `-disabled`, `-focused`) live as separate entries in `components:`.
+3. Use `{token.refs}` everywhere ΓÇö never inline hex.
+4. Never document hover. Default and Active/Pressed states only.
+5. Display headlines stay Copernicus serif 400 with negative tracking. Body stays StyreneB / Inter 400. The split is unbreakable.
+6. Cream + coral + dark navy is the trinity. Don't introduce a fourth surface tone (no purple cards, no green sections).
+7. When in doubt about emphasis: bigger Copernicus serif before bolder weight.
+
+## Known Gaps
+
+- Copernicus and StyreneB are licensed Anthropic typefaces and not available as public web fonts. Substitutes (Tiempos Headline / Cormorant Garamond / EB Garamond for serif; Inter / S├╢hne for sans) are documented in the typography section.
+- The Anthropic radial-spike-mark is a brand glyph rendered as inline SVG; it's not formalized as a system token here. Treat it as a logo asset.
+- Animation and transition timings (chat message reveal, code block typewriter effect on the homepage, agentic-flow diagram animations) are not in scope.
+- Form validation states beyond `{component.text-input-focused}` are not extracted ΓÇö error / success states would need a sign-up or feedback flow to confirm.
+- The actual Claude product surface (claude.ai chat interface) shares some tokens with the marketing site but adds many product-specific components (chat bubbles, message tools, file upload chips, conversation history sidebar) that are out of scope for this marketing-surface document.
+- The "agent" / "computer use" demo cards on certain pages display animated Claude controlling a browser ΓÇö the static screenshot doesn't fully capture the animation chrome.
```

## Tests Run
```text
git diff --cached --check
manual browser smoke test
```

## Risks / Pending Checks
- Confirm this folder is now the official CRM project folder.
- Confirm role-based access works correctly.
- Confirm audit log does not track normal page views.
- Confirm no AI/RAG/integrations/call recording were added.
- Confirm no Claude/Anthropic branding was copied.

## Rollback Command
```bash
git reset
git clean -fd
```
