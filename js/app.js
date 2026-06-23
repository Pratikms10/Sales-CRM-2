document.addEventListener('DOMContentLoaded', () => {
  const loginView = document.getElementById('login-view');
  const appView = document.getElementById('app-view');
  const loginForm = document.getElementById('login-form');
  const logoutBtn = document.getElementById('logout-btn');
  const userInfo = document.getElementById('current-user-info');
  const navItems = document.querySelectorAll('.nav-item');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const pageTitle = document.getElementById('page-title');
  const dashboardRecords = document.getElementById('dashboard-records');
  const addRecordBtn = document.getElementById('add-record-btn');
  const auditLogsSection = document.getElementById('audit-logs-section');
  const auditLogsContainer = document.getElementById('audit-logs-container');

  function init() {
    const user = auth.getCurrentUser();
    if (user) {
      loginView.classList.add('hidden');
      appView.classList.remove('hidden');
      userInfo.textContent = `Logged in as: ${user.name}`;
      applyRoleRestrictions(user);
      renderRecords();
      renderAudits();
    } else {
      loginView.classList.remove('hidden');
      appView.classList.add('hidden');
    }
  }

  function applyRoleRestrictions(user) {
    // Basic UI restrictions based on role
    const settingsTab = document.querySelector('[data-tab="settings"]');

    // Reset all
    settingsTab.classList.remove('hidden');
    auditLogsSection.classList.add('hidden');

    if (user.role === 'employee') {
      settingsTab.classList.add('hidden');
    }

    if (user.role === 'manager' || user.role === 'team_lead') {
      auditLogsSection.classList.remove('hidden');
    }
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const roleSelect = document.getElementById('role-select').value;
    if (auth.login(roleSelect)) {
      init();
    }
  });

  logoutBtn.addEventListener('click', () => {
    auth.logout();
    init();
  });

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // Check if user is allowed to access
      const tabName = item.getAttribute('data-tab');
      const user = auth.getCurrentUser();
      if (tabName === 'settings' && user.role === 'employee') {
        alert("Unauthorized access blocked.");
        return;
      }

      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      tabPanes.forEach(pane => pane.classList.remove('active'));
      document.getElementById(`tab-${tabName}`).classList.add('active');

      pageTitle.textContent = item.textContent;
    });
  });

  addRecordBtn.addEventListener('click', () => {
    const user = auth.getCurrentUser();
    if (user) {
      db.addRecord(`New Record ${new Date().getTime().toString().slice(-4)}`, user);
      renderRecords();
      renderAudits();
    }
  });

  function renderRecords() {
    const user = auth.getCurrentUser();
    const records = db.getRecords(user);

    if (records.length === 0) {
      dashboardRecords.innerHTML = '<p>No records visible for your role.</p>';
      return;
    }

    let html = `
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Owner ID</th>
            <th>Team ID</th>
            <th>Created By</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
    `;

    records.forEach(rec => {
      html += `
        <tr>
          <td><span class="badge badge-coral">${rec.id}</span></td>
          <td>${rec.title}</td>
          <td>${rec.owner_id}</td>
          <td>${rec.team_id}</td>
          <td>${rec.created_by}</td>
          <td>${new Date(rec.created_at).toLocaleString()}</td>
        </tr>
      `;
    });

    html += `</tbody></table>`;
    dashboardRecords.innerHTML = html;
  }

  function renderAudits() {
    const audits = db.getAudits();
    if (audits.length === 0) {
      auditLogsContainer.innerHTML = '<p>No audit logs.</p>';
      return;
    }

    // Show last 5 audits for demo
    const recentAudits = audits.slice(-5).reverse();

    let html = '<table class="data-table"><thead><tr><th>Time</th><th>User</th><th>Action</th><th>Details</th></tr></thead><tbody>';
    recentAudits.forEach(log => {
      html += `
        <tr>
          <td>${new Date(log.timestamp).toLocaleTimeString()}</td>
          <td>${log.user_id} (${log.user_role})</td>
          <td><span class="badge" style="background-color: var(--surface-dark-elevated); color: var(--on-dark);">${log.action}</span></td>
          <td>${log.details}</td>
        </tr>
      `;
    });
    html += '</tbody></table>';
    auditLogsContainer.innerHTML = html;
  }

  init();
});
