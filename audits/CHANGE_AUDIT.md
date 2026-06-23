# AI Change Audit Report

## Generated On
2026-06-23_18-18-37

## Branch
main

## Baseline Commit
6f320fc

## Task Summary
Settings SOP upgrade: user management, role permissions, CRM configuration, import rules, templates, duplicate rules, and settings hardening

## Git Status
```text
 M index.html
 M js/db.js
 M js/schema.js
 M js/settings.js
```

## Files Changed
```text
M	index.html
M	js/db.js
M	js/schema.js
M	js/settings.js
```

## Change Summary
```text
 index.html     | 103 +++++++++++++
 js/db.js       |   2 +-
 js/schema.js   |   2 +-
 js/settings.js | 461 +++++++++++++++++++++++++++++++++++++++++++++++++++------
 4 files changed, 523 insertions(+), 45 deletions(-)
```

## Full Diff
```diff
diff --git a/index.html b/index.html
index 5427eb1..26c4e5c 100644
--- a/index.html
+++ b/index.html
@@ -1113,6 +1113,109 @@
   <script src="js/import.js"></script>
   <script src="js/auth.js"></script>
 
+  <!-- Settings User Modal -->
+  <div id="modal-settings-user" class="modal-overlay hidden">
+    <div class="modal" style="max-width: 600px;">
+      <div class="modal-header">
+        <h3 id="modal-settings-user-title">Manage User</h3>
+        <button class="btn btn-secondary" onclick="document.getElementById('modal-settings-user').classList.add('hidden')">Close</button>
+      </div>
+      <form id="form-settings-user">
+        <input type="hidden" id="settings-user-id">
+        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
+          <div class="form-group"><label>First Name</label><input type="text" id="settings-user-firstname" class="form-control" required></div>
+          <div class="form-group"><label>Last Name</label><input type="text" id="settings-user-lastname" class="form-control" required></div>
+          <div class="form-group"><label>Email</label><input type="email" id="settings-user-email" class="form-control" required></div>
+          <div class="form-group">
+            <label>Role</label>
+            <select id="settings-user-role" class="form-control" required>
+              <option value="employee">Employee</option>
+              <option value="team_lead">Team Lead</option>
+              <option value="manager">Manager</option>
+            </select>
+          </div>
+          <div class="form-group">
+            <label>Department</label>
+            <select id="settings-user-department" class="form-control">
+              <option value="Sales">Sales</option>
+              <option value="Presales">Presales</option>
+              <option value="Sourcing">Sourcing</option>
+              <option value="Operations">Operations</option>
+              <option value="Finance">Finance</option>
+              <option value="Management">Management</option>
+            </select>
+          </div>
+          <div class="form-group">
+            <label>Team ID</label>
+            <input type="text" id="settings-user-team" class="form-control">
+          </div>
+          <div class="form-group">
+            <label>Status</label>
+            <select id="settings-user-status" class="form-control">
+              <option value="Active">Active</option>
+              <option value="Inactive">Inactive</option>
+            </select>
+          </div>
+          <div class="form-group" style="display: flex; align-items: center; gap: 8px;">
+            <input type="checkbox" id="settings-user-reset">
+            <label for="settings-user-reset" style="margin: 0; font-weight: normal;">Require Password Reset on Login</label>
+          </div>
+        </div>
+        <div style="margin-top: 16px;">
+          <h4>Permissions & Owner Mapping</h4>
+          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px;">
+            <label><input type="checkbox" id="perm-view"> View</label>
+            <label><input type="checkbox" id="perm-add"> Add</label>
+            <label><input type="checkbox" id="perm-edit"> Edit</label>
+            <label><input type="checkbox" id="perm-delete"> Delete</label>
+            <label><input type="checkbox" id="perm-export"> Export</label>
+          </div>
+          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px;">
+            <label><input type="checkbox" id="assign-leads"> Assignable to Leads</label>
+            <label><input type="checkbox" id="assign-reqs"> Assignable to Reqs</label>
+            <label><input type="checkbox" id="assign-deals"> Assignable to Deals</label>
+          </div>
+        </div>
+        <div style="margin-top: 20px;">
+          <button type="submit" class="btn btn-primary" style="width: 100%;">Save User</button>
+        </div>
+      </form>
+    </div>
+  </div>
+
+  <!-- Settings Role Modal -->
+  <div id="modal-settings-role" class="modal-overlay hidden">
+    <div class="modal" style="max-width: 500px;">
+      <div class="modal-header">
+        <h3>Configure Role Permissions</h3>
+        <button class="btn btn-secondary" onclick="document.getElementById('modal-settings-role').classList.add('hidden')">Close</button>
+      </div>
+      <form id="form-settings-role">
+        <div class="form-group">
+          <label>Target Role</label>
+          <select id="settings-role-target" class="form-control" required>
+            <option value="manager">Manager</option>
+            <option value="team_lead">Team Lead</option>
+            <option value="employee">Employee</option>
+          </select>
+        </div>
+        <div style="margin-top: 16px;">
+          <h4>Default Permissions</h4>
+          <div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-top: 8px;">
+            <label><input type="checkbox" id="role-perm-view"> View Access</label>
+            <label><input type="checkbox" id="role-perm-add"> Create Records</label>
+            <label><input type="checkbox" id="role-perm-edit"> Update Records</label>
+            <label><input type="checkbox" id="role-perm-delete"> Delete Records</label>
+            <label><input type="checkbox" id="role-perm-export"> Export Data</label>
+          </div>
+        </div>
+        <div style="margin-top: 20px;">
+          <button type="submit" class="btn btn-primary" style="width: 100%;">Save Role Permissions</button>
+        </div>
+      </form>
+    </div>
+  </div>
+
   <!-- Database Master Modal -->
   <div id="modal-database" class="modal-overlay hidden">
     <div class="modal" style="max-width: 600px;">
diff --git a/js/db.js b/js/db.js
index 9b015f3..08f1eaf 100644
--- a/js/db.js
+++ b/js/db.js
@@ -217,7 +217,7 @@ class Database {
   }
 
   logAudit(action, details, user, team_id = 'none') {
-    const allowedActions = ['login', 'logout', 'create', 'update', 'delete', 'archive', 'assign', 'approve', 'import', 'export', 'stage_change', 'profile_shared', 'candidate_selected', 'candidate_shortlisted', 'proposal_update', 'po_update', 'convert_to_deal', 'deal_update', 'trainer_assigned', 'vendor_assigned', 'delivery_update', 'invoice_update', 'payment_update', 'feedback_update', 'close_deal', 'delete_attempt', 'duplicate_merge', 'status_change'];
+    const allowedActions = ['login', 'logout', 'create', 'update', 'delete', 'archive', 'assign', 'approve', 'import', 'export', 'stage_change', 'profile_shared', 'candidate_selected', 'candidate_shortlisted', 'proposal_update', 'po_update', 'convert_to_deal', 'deal_update', 'trainer_assigned', 'vendor_assigned', 'delivery_update', 'invoice_update', 'payment_update', 'feedback_update', 'close_deal', 'delete_attempt', 'duplicate_merge', 'status_change', 'user_create', 'user_update', 'user_deactivate', 'role_create', 'permissions_update', 'settings_update', 'template_update', 'duplicate_rules_update'];
     if (!allowedActions.includes(action)) return;
 
     const audits = JSON.parse(localStorage.getItem('crm_auditLogs') || '[]');
diff --git a/js/schema.js b/js/schema.js
index 68486ee..96521e4 100644
--- a/js/schema.js
+++ b/js/schema.js
@@ -1,6 +1,6 @@
 window.crmSchema = {
   users: {
-    fields: ['first_name', 'last_name', 'email', 'role', 'team_id', 'status'],
+    fields: ['first_name', 'last_name', 'email', 'role', 'department', 'team_id', 'status', 'permissions_view', 'permissions_add', 'permissions_edit', 'permissions_delete', 'permissions_export', 'assignable_to_leads', 'assignable_to_requirements', 'assignable_to_deals', 'password_reset_required', 'remarks'],
     duplicateKeys: ['email']
   },
   teams: {
diff --git a/js/settings.js b/js/settings.js
index 8f0e712..1afbf4c 100644
--- a/js/settings.js
+++ b/js/settings.js
@@ -5,8 +5,59 @@ class SettingsManager {
       sla_req_response: 4,
       sla_follow_up: 48,
       sla_payment_follow_up: 72,
-      sla_sourcing: 48
+      sla_sourcing: 48,
+      lead_statuses: 'New, Contacted, Interested, Dormant, Lost, Converted',
+      pipeline_stages: 'Prospecting, Outreach, Follow-up, Requirement Gathering, Proposal Shared, PO Pending, Sourcing, Converted, Dormant, Lost, Post-Sale',
+      requirement_statuses: 'New, Proposal Pending, Sourcing, Profile Shared, On Hold, Converted, Lost',
+      deal_statuses: 'Confirmed, Planning, Live, Completed, Closed',
+      payment_statuses: 'Pending, Partial, Received, Overdue',
+      service_lines: 'Corporate Training, Video Content Development, Automation Consulting',
+      sla_rules: 'Same day, 24h, 36h, 48h',
+      duplicate_rules: 'phone, email, company, linkedin',
+      import_mappings: '',
+      follow_up_rules: '',
+      notification_rules: '',
+      form_templates: '',
+      proposal_templates: '',
+      invoice_settings: '',
+      role_permissions: JSON.stringify({
+        manager: { view: true, add: true, edit: true, delete: true, export: true },
+        team_lead: { view: true, add: true, edit: true, delete: false, export: false },
+        employee: { view: true, add: true, edit: true, delete: false, export: false }
+      })
     };
+    this.bindEvents();
+  }
+
+  bindEvents() {
+    const tableContainer = document.getElementById('settings-container');
+    if (tableContainer) {
+      tableContainer.addEventListener('click', (e) => {
+        const btn = e.target.closest('button[data-action]');
+        if (!btn) return;
+        const action = btn.getAttribute('data-action');
+        const id = btn.getAttribute('data-id');
+
+        if (action === 'edit_user') this.openUserModal(id);
+        if (action === 'deactivate_user') this.deactivateUser(id);
+      });
+    }
+
+    const formUser = document.getElementById('form-settings-user');
+    if (formUser) {
+      formUser.addEventListener('submit', (e) => {
+        e.preventDefault();
+        this.saveUser();
+      });
+    }
+
+    const formRole = document.getElementById('form-settings-role');
+    if (formRole) {
+      formRole.addEventListener('submit', (e) => {
+        e.preventDefault();
+        this.saveRolePermissions();
+      });
+    }
   }
 
   getSettings() {
@@ -19,23 +70,6 @@ class SettingsManager {
     return { ...this.defaultSettings };
   }
 
-  saveSettings() {
-    const user = auth.getCurrentUser();
-    if (!user || user.role !== 'manager') {
-      alert('Access denied');
-      return;
-    }
-    const s = {
-      sla_profile_sharing: parseInt(document.getElementById('set-sla-profile').value) || 24,
-      sla_req_response: parseInt(document.getElementById('set-sla-req').value) || 4,
-      sla_follow_up: parseInt(document.getElementById('set-sla-followup').value) || 48,
-      sla_payment_follow_up: parseInt(document.getElementById('set-sla-payment').value) || 72,
-      sla_sourcing: parseInt(document.getElementById('set-sla-sourcing').value) || 48
-    };
-    localStorage.setItem('crm_settings', JSON.stringify(s));
-    alert('Settings saved successfully.');
-  }
-
   escapeHTML(str) {
     if (str === null || str === undefined || str === '') return '-';
     return String(str)
@@ -70,46 +104,184 @@ class SettingsManager {
     const s = this.getSettings();
     const isManager = user.role === 'manager';
 
-    let html = `
-      <div class="card">
-        <h3>SLA & Reminder Configurations</h3>
-        <p>Set default operational targets (in hours).</p>
-        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
-          <div class="form-group">
-            <label>Profile Sharing SLA (hrs)</label>
-            <input type="number" id="set-sla-profile" class="form-control" value="${Number(s.sla_profile_sharing) || 24}" ${!isManager ? 'disabled' : ''}>
+    let html = '';
+
+    if (user.role !== 'employee') {
+      html += `
+        <div class="card" style="margin-bottom: 20px;">
+          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
+            <button class="btn btn-secondary" onclick="const el = document.getElementById('import-collection'); if(el) { el.scrollIntoView(); el.focus(); }">Import Data</button>
+            ${isManager ? `
+            <button class="btn btn-secondary" onclick="const el = document.getElementById('set-lead-status'); if(el) { el.scrollIntoView(); el.focus(); }">Create Status</button>
+            <button class="btn btn-secondary" onclick="const el = document.getElementById('set-pipe-stage'); if(el) { el.scrollIntoView(); el.focus(); }">Create Stage</button>
+            <button class="btn btn-secondary" onclick="const el = document.getElementById('set-sla-rules'); if(el) { el.scrollIntoView(); el.focus(); }">Create SLA Rule</button>
+            <button class="btn btn-secondary" onclick="const el = document.getElementById('set-followup-rules'); if(el) { el.scrollIntoView(); el.focus(); }">Create Reminder Rule</button>
+            <button class="btn btn-secondary" onclick="const el = document.getElementById('set-form-templates'); if(el) { el.scrollIntoView(); el.focus(); }">Create Template</button>
+            <button class="btn btn-secondary" onclick="const el = document.getElementById('set-dup-rules'); if(el) { el.scrollIntoView(); el.focus(); }">Manage Duplicate Rules</button>
+            ` : ''}
           </div>
-          <div class="form-group">
-            <label>Requirement Response SLA (hrs)</label>
-            <input type="number" id="set-sla-req" class="form-control" value="${Number(s.sla_req_response) || 4}" ${!isManager ? 'disabled' : ''}>
+        </div>
+      `;
+    }
+
+    // USER MANAGEMENT
+    if (isManager) {
+      const users = db.getRecords('users', user);
+      html += `
+        <div class="card">
+          <div style="display: flex; justify-content: space-between; align-items: center;">
+            <div>
+              <h3>User Management</h3>
+              <p>Manage application users and their roles.</p>
+            </div>
+            <button class="btn btn-primary" onclick="window.settingsManager.openUserModal()">Add User</button>
           </div>
-          <div class="form-group">
-            <label>General Follow-up Frequency (hrs)</label>
-            <input type="number" id="set-sla-followup" class="form-control" value="${Number(s.sla_follow_up) || 48}" ${!isManager ? 'disabled' : ''}>
+          <div class="table-container" style="margin-top: 15px;">
+            <table class="data-table">
+              <thead>
+                <tr>
+                  <th>Name</th>
+                  <th>Email</th>
+                  <th>Role</th>
+                  <th>Department</th>
+                  <th>Status</th>
+                  <th>Action</th>
+                </tr>
+              </thead>
+              <tbody>
+                ${users.map(u => `
+                  <tr>
+                    <td>${this.escapeHTML(u.first_name)} ${this.escapeHTML(u.last_name)}</td>
+                    <td>${this.escapeHTML(u.email)}</td>
+                    <td>${this.escapeHTML(u.role)}</td>
+                    <td>${this.escapeHTML(u.department)}</td>
+                    <td><span class="badge badge-${u.status === 'Active' ? 'success' : 'error'}">${this.escapeHTML(u.status)}</span></td>
+                    <td>
+                      <button class="btn btn-secondary btn-sm" data-action="edit_user" data-id="${this.escapeHTML(u.id)}">Edit User</button>
+                      ${u.status !== 'Inactive' ? `<button class="btn btn-secondary btn-sm" data-action="deactivate_user" data-id="${this.escapeHTML(u.id)}">Deactivate User</button>` : ''}
+                    </td>
+                  </tr>
+                `).join('')}
+                ${users.length === 0 ? '<tr><td colspan="6">No users found.</td></tr>' : ''}
+              </tbody>
+            </table>
           </div>
-          <div class="form-group">
-            <label>Payment Follow-up SLA (hrs)</label>
-            <input type="number" id="set-sla-payment" class="form-control" value="${Number(s.sla_payment_follow_up) || 72}" ${!isManager ? 'disabled' : ''}>
+        </div>
+
+        <div class="card">
+          <div style="display: flex; justify-content: space-between; align-items: center;">
+            <div>
+              <h3>Role & Permission Configuration</h3>
+              <p>Modify default baseline permissions for standard internal roles.</p>
+            </div>
+            <button class="btn btn-primary" onclick="window.settingsManager.openRoleModal()">Set Permissions</button>
           </div>
-          <div class="form-group">
-            <label>Sourcing Turnaround SLA (hrs)</label>
-            <input type="number" id="set-sla-sourcing" class="form-control" value="${Number(s.sla_sourcing) || 48}" ${!isManager ? 'disabled' : ''}>
+        </div>
+      `;
+    }
+
+    // CRM CONFIGURATION
+    if (isManager) {
+      html += `
+        <div class="card">
+          <h3>CRM Configuration</h3>
+          <p>Modify standard drop-down lists and rule engines globally (comma-separated values).</p>
+          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
+
+            <div class="form-group">
+              <label>Lead Statuses</label>
+              <textarea id="set-lead-status" class="form-control" rows="2">${this.escapeHTML(s.lead_statuses)}</textarea>
+            </div>
+            <div class="form-group">
+              <label>Pipeline Stages</label>
+              <textarea id="set-pipe-stage" class="form-control" rows="2">${this.escapeHTML(s.pipeline_stages)}</textarea>
+            </div>
+            <div class="form-group">
+              <label>Requirement Statuses</label>
+              <textarea id="set-req-status" class="form-control" rows="2">${this.escapeHTML(s.requirement_statuses)}</textarea>
+            </div>
+            <div class="form-group">
+              <label>Deal Statuses</label>
+              <textarea id="set-deal-status" class="form-control" rows="2">${this.escapeHTML(s.deal_statuses)}</textarea>
+            </div>
+            <div class="form-group">
+              <label>Payment Statuses</label>
+              <textarea id="set-pay-status" class="form-control" rows="2">${this.escapeHTML(s.payment_statuses)}</textarea>
+            </div>
+            <div class="form-group">
+              <label>Service Lines Defaults</label>
+              <textarea id="set-svc-lines" class="form-control" rows="2">${this.escapeHTML(s.service_lines)}</textarea>
+            </div>
+            <div class="form-group">
+              <label>Duplicate Check Rules</label>
+              <textarea id="set-dup-rules" class="form-control" rows="2">${this.escapeHTML(s.duplicate_rules)}</textarea>
+            </div>
+            <div class="form-group">
+              <label>Import Data Mappings (JSON)</label>
+              <textarea id="set-imp-mappings" class="form-control" rows="2">${this.escapeHTML(s.import_mappings)}</textarea>
+            </div>
+            <div class="form-group">
+              <label>SLA Rules</label>
+              <textarea id="set-sla-rules" class="form-control" rows="2">${this.escapeHTML(s.sla_rules)}</textarea>
+            </div>
+            <div class="form-group">
+              <label>Follow-up Rules</label>
+              <textarea id="set-followup-rules" class="form-control" rows="2">${this.escapeHTML(s.follow_up_rules)}</textarea>
+            </div>
+            <div class="form-group">
+              <label>Notification Rules</label>
+              <textarea id="set-notif-rules" class="form-control" rows="2">${this.escapeHTML(s.notification_rules)}</textarea>
+            </div>
+            <div class="form-group">
+              <label>Form Templates</label>
+              <textarea id="set-form-templates" class="form-control" rows="2">${this.escapeHTML(s.form_templates)}</textarea>
+            </div>
+            <div class="form-group">
+              <label>Proposal Templates</label>
+              <textarea id="set-prop-templates" class="form-control" rows="2">${this.escapeHTML(s.proposal_templates)}</textarea>
+            </div>
+            <div class="form-group">
+              <label>Invoice Settings</label>
+              <textarea id="set-inv-settings" class="form-control" rows="2">${this.escapeHTML(s.invoice_settings)}</textarea>
+            </div>
+
+            <div class="form-group">
+              <label>Profile Sharing SLA (hrs)</label>
+              <input type="number" id="set-sla-profile" class="form-control" value="${Number(s.sla_profile_sharing) || 24}">
+            </div>
+            <div class="form-group">
+              <label>Requirement Response SLA (hrs)</label>
+              <input type="number" id="set-sla-req" class="form-control" value="${Number(s.sla_req_response) || 4}">
+            </div>
+            <div class="form-group">
+              <label>General Follow-up Frequency (hrs)</label>
+              <input type="number" id="set-sla-followup" class="form-control" value="${Number(s.sla_follow_up) || 48}">
+            </div>
+            <div class="form-group">
+              <label>Payment Follow-up SLA (hrs)</label>
+              <input type="number" id="set-sla-payment" class="form-control" value="${Number(s.sla_payment_follow_up) || 72}">
+            </div>
+            <div class="form-group">
+              <label>Sourcing Turnaround SLA (hrs)</label>
+              <input type="number" id="set-sla-sourcing" class="form-control" value="${Number(s.sla_sourcing) || 48}">
+            </div>
           </div>
+          <button class="btn btn-primary" style="margin-top: 15px;" onclick="window.settingsManager.saveCRMConfig()">Save Configuration</button>
         </div>
-        ${isManager ? `<button class="btn btn-primary" style="margin-top: 15px;" onclick="window.settingsManager.saveSettings()">Save Configuration</button>` : ''}
-      </div>
+      `;
+    }
 
+    // Templates and Import tools are visible to TL and Manager
+    html += `
       <div class="card">
         <h3>Import Templates</h3>
-        <p>Download header-only CSV templates for data import. (No sample rows included to prevent accidental junk data).</p>
+        <p>Download header-only CSV templates for data import.</p>
         <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 15px;">
     `;
-
     const entities = ['leads', 'clients', 'contacts', 'trainers', 'vendors', 'requirements', 'deals'];
     entities.forEach(ent => {
       html += `<button class="btn btn-secondary" onclick="window.settingsManager.downloadTemplate('${ent}')">Download ${ent} Template</button>`;
     });
-
     html += `
         </div>
       </div>
@@ -138,7 +310,210 @@ class SettingsManager {
     container.innerHTML = html;
   }
 
+  // --- CRM CONFIG ---
+  saveCRMConfig() {
+    const user = auth.getCurrentUser();
+    if (!user || user.role !== 'manager') return alert('Access denied');
+    const el = id => document.getElementById(id) ? document.getElementById(id).value : '';
+
+    const currentSettings = this.getSettings();
+    const updatedSettings = {
+      ...currentSettings,
+      sla_profile_sharing: parseInt(el('set-sla-profile')) || 24,
+      sla_req_response: parseInt(el('set-sla-req')) || 4,
+      sla_follow_up: parseInt(el('set-sla-followup')) || 48,
+      sla_payment_follow_up: parseInt(el('set-sla-payment')) || 72,
+      sla_sourcing: parseInt(el('set-sla-sourcing')) || 48,
+      lead_statuses: el('set-lead-status'),
+      pipeline_stages: el('set-pipe-stage'),
+      requirement_statuses: el('set-req-status'),
+      deal_statuses: el('set-deal-status'),
+      payment_statuses: el('set-pay-status'),
+      service_lines: el('set-svc-lines'),
+      duplicate_rules: el('set-dup-rules'),
+      import_mappings: el('set-imp-mappings'),
+      sla_rules: el('set-sla-rules'),
+      follow_up_rules: el('set-followup-rules'),
+      notification_rules: el('set-notif-rules'),
+      form_templates: el('set-form-templates'),
+      proposal_templates: el('set-prop-templates'),
+      invoice_settings: el('set-inv-settings')
+    };
+
+    localStorage.setItem('crm_settings', JSON.stringify(updatedSettings));
+    db.logAudit('settings_update', 'Updated CRM Settings Configurations', user);
+
+    if (updatedSettings.form_templates !== currentSettings.form_templates || updatedSettings.proposal_templates !== currentSettings.proposal_templates) {
+      db.logAudit('template_update', 'Updated CRM templates configuration', user);
+    }
+    if (updatedSettings.duplicate_rules !== currentSettings.duplicate_rules) {
+      db.logAudit('duplicate_rules_update', 'Updated duplicate check rules configuration', user);
+    }
+
+    alert('Settings saved successfully.');
+  }
+
+  // --- ROLE CONFIG ---
+  openRoleModal() {
+    const user = auth.getCurrentUser();
+    if (!user || user.role !== 'manager') return alert('Access denied');
+    document.getElementById('settings-role-target').value = 'employee';
+    document.getElementById('modal-settings-role').classList.remove('hidden');
+    this.populateRoleDefaults('employee');
+
+    document.getElementById('settings-role-target').onchange = (e) => {
+      this.populateRoleDefaults(e.target.value);
+    };
+  }
+
+  populateRoleDefaults(roleName) {
+    const s = this.getSettings();
+    let perms = { view: true, add: true, edit: true, delete: false, export: false };
+    try {
+      const allPerms = JSON.parse(s.role_permissions || '{}');
+      if (allPerms[roleName]) perms = allPerms[roleName];
+    } catch(e){}
+
+    document.getElementById('role-perm-view').checked = !!perms.view;
+    document.getElementById('role-perm-add').checked = !!perms.add;
+    document.getElementById('role-perm-edit').checked = !!perms.edit;
+    document.getElementById('role-perm-delete').checked = !!perms.delete;
+    document.getElementById('role-perm-export').checked = !!perms.export;
+  }
+
+  saveRolePermissions() {
+    const user = auth.getCurrentUser();
+    if (!user || user.role !== 'manager') return alert('Access denied');
+
+    const roleName = document.getElementById('settings-role-target').value;
+    const perms = {
+      view: document.getElementById('role-perm-view').checked,
+      add: document.getElementById('role-perm-add').checked,
+      edit: document.getElementById('role-perm-edit').checked,
+      delete: document.getElementById('role-perm-delete').checked,
+      export: document.getElementById('role-perm-export').checked,
+    };
+
+    const s = this.getSettings();
+    let allPerms = {};
+    try { allPerms = JSON.parse(s.role_permissions || '{}'); } catch(e){}
+
+    allPerms[roleName] = perms;
+    s.role_permissions = JSON.stringify(allPerms);
+    localStorage.setItem('crm_settings', JSON.stringify(s));
+
+    db.logAudit('permissions_update', `Updated permissions for role ${roleName}`, user);
+    alert('Role permissions saved successfully.');
+    document.getElementById('modal-settings-role').classList.add('hidden');
+  }
+
+  // --- USER MANAGEMENT ---
+  openUserModal(userId = null) {
+    const user = auth.getCurrentUser();
+    if (!user || user.role !== 'manager') return alert('Access denied');
+
+    const form = document.getElementById('form-settings-user');
+    form.reset();
+    document.getElementById('settings-user-id').value = '';
+    document.getElementById('modal-settings-user-title').textContent = 'Add User';
+
+    if (userId) {
+      const records = db.getRecords('users', user);
+      const target = records.find(r => r.id === userId);
+      if (target) {
+        document.getElementById('modal-settings-user-title').textContent = 'Edit User';
+        document.getElementById('settings-user-id').value = target.id;
+        document.getElementById('settings-user-firstname').value = target.first_name || '';
+        document.getElementById('settings-user-lastname').value = target.last_name || '';
+        document.getElementById('settings-user-email').value = target.email || '';
+        document.getElementById('settings-user-role').value = target.role || 'employee';
+        document.getElementById('settings-user-department').value = target.department || 'Sales';
+        document.getElementById('settings-user-team').value = target.team_id || '';
+        document.getElementById('settings-user-status').value = target.status || 'Active';
+        document.getElementById('settings-user-reset').checked = !!target.password_reset_required;
+
+        document.getElementById('perm-view').checked = target.permissions_view !== false;
+        document.getElementById('perm-add').checked = target.permissions_add !== false;
+        document.getElementById('perm-edit').checked = target.permissions_edit !== false;
+        document.getElementById('perm-delete').checked = !!target.permissions_delete;
+        document.getElementById('perm-export').checked = !!target.permissions_export;
+
+        document.getElementById('assign-leads').checked = target.assignable_to_leads !== false;
+        document.getElementById('assign-reqs').checked = target.assignable_to_requirements !== false;
+        document.getElementById('assign-deals').checked = target.assignable_to_deals !== false;
+      }
+    } else {
+      // defaults for new
+      document.getElementById('settings-user-status').value = 'Active';
+      document.getElementById('perm-view').checked = true;
+      document.getElementById('perm-add').checked = true;
+      document.getElementById('perm-edit').checked = true;
+      document.getElementById('assign-leads').checked = true;
+      document.getElementById('assign-reqs').checked = true;
+      document.getElementById('assign-deals').checked = true;
+      document.getElementById('settings-user-reset').checked = true;
+    }
+
+    document.getElementById('modal-settings-user').classList.remove('hidden');
+  }
+
+  saveUser() {
+    const user = auth.getCurrentUser();
+    if (!user || user.role !== 'manager') return alert('Access denied');
+
+    const id = document.getElementById('settings-user-id').value;
+    const userData = {
+      first_name: document.getElementById('settings-user-firstname').value,
+      last_name: document.getElementById('settings-user-lastname').value,
+      email: document.getElementById('settings-user-email').value,
+      role: document.getElementById('settings-user-role').value,
+      department: document.getElementById('settings-user-department').value,
+      team_id: document.getElementById('settings-user-team').value,
+      status: document.getElementById('settings-user-status').value,
+      password_reset_required: document.getElementById('settings-user-reset').checked,
+      permissions_view: document.getElementById('perm-view').checked,
+      permissions_add: document.getElementById('perm-add').checked,
+      permissions_edit: document.getElementById('perm-edit').checked,
+      permissions_delete: document.getElementById('perm-delete').checked,
+      permissions_export: document.getElementById('perm-export').checked,
+      assignable_to_leads: document.getElementById('assign-leads').checked,
+      assignable_to_requirements: document.getElementById('assign-reqs').checked,
+      assignable_to_deals: document.getElementById('assign-deals').checked,
+    };
+
+    const allowedRoles = ['manager', 'team_lead', 'employee'];
+    if (!allowedRoles.includes(userData.role)) {
+      alert('Invalid role selected. Must be manager, team_lead, or employee.');
+      return;
+    }
+
+    if (id) {
+      db.updateRecord('users', id, userData, user);
+      db.logAudit('user_update', `Updated user ${userData.email}`, user);
+    } else {
+      db.createRecord('users', userData, user);
+      db.logAudit('user_create', `Created user ${userData.email}`, user);
+    }
+
+    document.getElementById('modal-settings-user').classList.add('hidden');
+    this.render();
+  }
+
+  deactivateUser(id) {
+    const user = auth.getCurrentUser();
+    if (!user || user.role !== 'manager') return alert('Access denied');
+    if (!confirm('Are you sure you want to deactivate this user? They will not be able to log in.')) return;
+
+    db.updateRecord('users', id, { status: 'Inactive' }, user);
+    db.logAudit('user_deactivate', `Deactivated user ID ${id}`, user);
+    this.render();
+  }
+
+  // --- TEMPLATES & TOOLS ---
   downloadTemplate(collection) {
+    const user = auth.getCurrentUser();
+    if (!user || user.role === 'employee') { alert('Access denied'); return; }
+
     const schema = window.crmSchema[collection];
     if (!schema) return;
 
```

## Tests Run
```text
git diff --check; node --check js/settings.js; node --check js/app.js; node --check js/db.js; node --check js/schema.js; node --check js/auth.js; node --check js/import.js; node --check js/database.js; node --check js/reports.js; node --check js/deals.js; node --check js/requirements.js; node --check js/pipeline.js; node --check js/leads.js; node --check js/dashboard.js
```

## Risks / Pending Checks
- Review whether all changed files match the requested task.
- Confirm role access rules are not broken.
- Confirm AI/RAG/integrations/call recording were not added in this phase.

## Rollback Command
```bash
git restore --staged .
git restore .
git clean -fd
```
