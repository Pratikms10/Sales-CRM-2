# AI Change Audit Report

## Generated On
2026-06-23_16-22-02

## Branch
main

## Baseline Commit
84fb401

## Task Summary
Leads SOP upgrade: presales tracker, activity timeline, attachments, import leads, conversion, and quick actions

## Git Status
```text
 M index.html
 M js/leads.js
 M js/schema.js
```

## Files Changed
```text
M	index.html
M	js/leads.js
M	js/schema.js
```

## Change Summary
```text
 index.html   |  22 ++++-
 js/leads.js  | 259 +++++++++++++++++++++++++++++++++++++++++++++++++++++------
 js/schema.js |   5 +-
 3 files changed, 257 insertions(+), 29 deletions(-)
```

## Full Diff
```diff
diff --git a/index.html b/index.html
index 3aee5c0..efbbd36 100644
--- a/index.html
+++ b/index.html
@@ -67,7 +67,10 @@
         <div class="card">
           <div style="display: flex; justify-content: space-between; align-items: center;">
             <h3>Leads Tracker</h3>
-            <button class="btn btn-primary" id="btn-add-lead">+ Add Lead</button>
+            <div>
+              <button class="btn btn-secondary hidden" id="btn-import-leads" style="margin-right: 8px;">Import Leads</button>
+              <button class="btn btn-primary" id="btn-add-lead">+ Add Lead</button>
+            </div>
           </div>
           <p>Presales tracking and lead management.</p>
 
@@ -121,6 +124,7 @@
               <thead>
                 <tr>
                   <th>Action</th>
+                  <th>Lead ID</th>
                   <th>Company</th>
                   <th>Contact Person</th>
                   <th>Designation</th>
@@ -581,6 +585,22 @@
           <label>Remarks</label>
           <textarea id="lead-remarks" class="form-control" rows="3"></textarea>
         </div>
+
+        <div class="form-section" style="margin-top: 16px;">
+          <div class="form-section-title">Attachments / References</div>
+          <div class="form-grid">
+            <div class="form-group"><label>Visiting Card</label><input type="text" id="lead-visiting-card" class="form-control" placeholder="Link or note"></div>
+            <div class="form-group"><label>Requirement Note</label><input type="text" id="lead-req-note" class="form-control" placeholder="Link or note"></div>
+            <div class="form-group"><label>Email Screenshot</label><input type="text" id="lead-email-ss" class="form-control" placeholder="Link or note"></div>
+            <div class="form-group"><label>Reference Document</label><input type="text" id="lead-ref-doc" class="form-control" placeholder="Link or note"></div>
+          </div>
+        </div>
+
+        <div class="form-section" id="lead-timeline-section" style="display: none; margin-top: 16px;">
+          <div class="form-section-title">Activity Timeline</div>
+          <div id="lead-timeline-container" style="font-size: 0.85em; max-height: 200px; overflow-y: auto; background: var(--surface-soft); padding: 10px; border-radius: var(--rounded-md); border: 1px solid var(--hairline);">
+          </div>
+        </div>
         <button type="submit" class="btn btn-primary" style="margin-top: 16px;">Save Lead</button>
       </form>
     </div>
diff --git a/js/leads.js b/js/leads.js
index 2f01e16..5c26a77 100644
--- a/js/leads.js
+++ b/js/leads.js
@@ -1,4 +1,4 @@
-∩╗┐class LeadsManager {
+class LeadsManager {
   constructor() {
     this.tableBody = document.getElementById('leads-table-body');
     this.searchQuery = '';
@@ -13,6 +13,17 @@
     this.bindEvents();
   }
 
+  escapeHTML(str) {
+    if (str === null || str === undefined || str === '') return '-';
+    if (typeof str === 'number') return String(str);
+    return String(str)
+      .replace(/&/g, "&amp;")
+      .replace(/</g, "&lt;")
+      .replace(/>/g, "&gt;")
+      .replace(/"/g, "&quot;")
+      .replace(/'/g, "&#039;");
+  }
+
   bindEvents() {
     document.getElementById('lead-search').addEventListener('input', (e) => {
       this.searchQuery = e.target.value.toLowerCase();
@@ -58,6 +69,49 @@
       this.openLeadModal();
     });
 
+    const importBtn = document.getElementById('btn-import-leads');
+    if (importBtn) {
+      importBtn.addEventListener('click', () => {
+        const currentUser = auth.getCurrentUser();
+        if (!currentUser || currentUser.role === 'employee') {
+          alert('Access denied');
+          return;
+        }
+        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
+        const settingsNav = document.querySelector('[data-tab="settings"]');
+        if (settingsNav) settingsNav.classList.add('active');
+
+        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
+        document.getElementById('tab-settings').classList.add('active');
+        document.getElementById('page-title').textContent = 'Settings';
+
+        const sel = document.getElementById('import-collection');
+        if (sel) sel.value = 'leads';
+        if (window.settingsManager) window.settingsManager.render();
+      });
+    }
+
+    this.tableBody.addEventListener('click', (e) => {
+      const btn = e.target.closest('.action-btn');
+      if (btn) {
+        const action = btn.getAttribute('data-action');
+        const leadId = btn.getAttribute('data-lead-id');
+        if (action === 'edit') this.openLeadModal(leadId);
+        else if (action === 'log') this.openActivityModal(leadId);
+        else if (action === 'to-req') this.convertToRequirement(leadId);
+        else if (action === 'to-client') this.convertToClient(leadId);
+      }
+    });
+
+    this.tableBody.addEventListener('change', (e) => {
+      if (e.target.classList.contains('quick-action-select')) {
+        const action = e.target.value;
+        const leadId = e.target.getAttribute('data-lead-id');
+        this.handleQuickAction(leadId, action);
+        e.target.value = '';
+      }
+    });
+
     document.getElementById('btn-close-lead-modal').addEventListener('click', () => {
       document.getElementById('modal-lead').classList.add('hidden');
     });
@@ -85,6 +139,12 @@
 
     let leads = db.getRecords('leads', user);
 
+    const importBtn = document.getElementById('btn-import-leads');
+    if (importBtn) {
+      if (user.role === 'employee') importBtn.classList.add('hidden');
+      else importBtn.classList.remove('hidden');
+    }
+
     // Apply filters
     leads = leads.filter(l => {
       if (this.filterStatus && l.status !== this.filterStatus) return false;
@@ -120,48 +180,64 @@
       if (lead.next_follow_up_date) {
         const fuDate = new Date(lead.next_follow_up_date);
         if (fuDate < today && lead.status !== 'Converted' && lead.status !== 'Lost' && lead.status !== 'Dormant') {
-          followUpHtml = `<span class="badge badge-overdue">${lead.next_follow_up_date}</span>`;
+          followUpHtml = `<span class="badge badge-overdue">${this.escapeHTML(lead.next_follow_up_date)}</span>`;
         }
       }
 
       let priorityHtml = lead.priority || '-';
       if (lead.priority) {
-        priorityHtml = `<span class="badge badge-priority-${lead.priority.toLowerCase()}">${lead.priority}</span>`;
+        let safeClass = 'default';
+        const lowerPri = lead.priority.toLowerCase();
+        if (['high', 'medium', 'low'].includes(lowerPri)) safeClass = lowerPri;
+        priorityHtml = `<span class="badge badge-priority-${safeClass}">${this.escapeHTML(lead.priority)}</span>`;
       }
 
       html += `
         <tr>
           <td>
-            <button class="btn btn-secondary" onclick="window.leadsManager.openLeadModal('${lead.id}')" style="padding: 2px 6px; font-size: 11px;">Edit</button>
-            <button class="btn btn-secondary" onclick="window.leadsManager.openActivityModal('${lead.id}')" style="padding: 2px 6px; font-size: 11px;">Log</button>
-            ${lead.status !== 'Converted' ? `<button class="btn btn-primary" onclick="window.leadsManager.convertToRequirement('${lead.id}')" style="padding: 2px 6px; font-size: 11px;">Convert</button>` : ''}
+            <div style="display:flex; flex-direction: column; gap:4px; padding-bottom: 4px;">
+              <button class="btn btn-secondary action-btn" data-action="edit" data-lead-id="${this.escapeHTML(lead.id)}" style="padding: 2px 6px; font-size: 11px;">Edit</button>
+              <button class="btn btn-secondary action-btn" data-action="log" data-lead-id="${this.escapeHTML(lead.id)}" style="padding: 2px 6px; font-size: 11px;">Log Activity</button>
+              ${lead.status !== 'Converted' ? `
+                <button class="btn btn-primary action-btn" data-action="to-req" data-lead-id="${this.escapeHTML(lead.id)}" style="padding: 2px 6px; font-size: 11px;">To Requirement</button>
+                <button class="btn btn-secondary action-btn" data-action="to-client" data-lead-id="${this.escapeHTML(lead.id)}" style="padding: 2px 6px; font-size: 11px;">To Client</button>
+              ` : ''}
+              <select class="quick-action-select" data-lead-id="${this.escapeHTML(lead.id)}" style="font-size: 11px; padding: 2px; width: 100px;">
+                <option value="">Quick Actions</option>
+                <option value="followup">Add Follow-up</option>
+                ${(user.role === 'manager' || user.role === 'team_lead') ? '<option value="assign">Assign Owner</option>' : ''}
+                <option value="dormant">Mark Dormant</option>
+                <option value="lost">Mark Lost</option>
+              </select>
+            </div>
           </td>
-          <td>${lead.company_name || '-'}</td>
-          <td>${lead.contact_person || '-'}</td>
-          <td>${lead.designation || '-'}</td>
-          <td>${lead.email || '-'}</td>
-          <td>${lead.phone || '-'}</td>
-          <td>${lead.linkedin || '-'}</td>
-          <td>${lead.website || '-'}</td>
-          <td>${lead.industry || '-'}</td>
-          <td>${lead.company_size || '-'}</td>
-          <td>${lead.city || '-'}</td>
-          <td>${lead.country || '-'}</td>
-          <td>${lead.service_interest || '-'}</td>
-          <td>${lead.source || '-'}</td>
-          <td>${lead.status}</td>
-          <td>${lead.last_contact_date || '-'}</td>
+          <td><small>${this.escapeHTML(lead.id)}</small></td>
+          <td>${this.escapeHTML(lead.company_name)}</td>
+          <td>${this.escapeHTML(lead.contact_person)}</td>
+          <td>${this.escapeHTML(lead.designation)}</td>
+          <td>${this.escapeHTML(lead.email)}</td>
+          <td>${this.escapeHTML(lead.phone)}</td>
+          <td>${this.escapeHTML(lead.linkedin)}</td>
+          <td>${this.escapeHTML(lead.website)}</td>
+          <td>${this.escapeHTML(lead.industry)}</td>
+          <td>${this.escapeHTML(lead.company_size)}</td>
+          <td>${this.escapeHTML(lead.city)}</td>
+          <td>${this.escapeHTML(lead.country)}</td>
+          <td>${this.escapeHTML(lead.service_interest)}</td>
+          <td>${this.escapeHTML(lead.source)}</td>
+          <td>${this.escapeHTML(lead.status)}</td>
+          <td>${this.escapeHTML(lead.last_contact_date)}</td>
           <td>${followUpHtml}</td>
-          <td>${lead.follow_up_type || '-'}</td>
+          <td>${this.escapeHTML(lead.follow_up_type)}</td>
           <td>${priorityHtml}</td>
-          <td>${lead.owner_id}</td>
-          <td><small><b>Rem:</b> ${lead.remarks || '-'}<br><b>Dis:</b> ${lead.last_discussion || '-'}</small></td>
+          <td>${this.escapeHTML(lead.owner_id)}</td>
+          <td><small><b>Rem:</b> ${this.escapeHTML(lead.remarks)}<br><b>Dis:</b> ${this.escapeHTML(lead.last_discussion)}</small></td>
         </tr>
       `;
     });
 
     if (leads.length === 0) {
-      html = `<tr><td colspan="21">No leads found.</td></tr>`;
+      html = `<tr><td colspan="22">No leads found.</td></tr>`;
     }
 
     this.tableBody.innerHTML = html;
@@ -202,10 +278,37 @@
         document.getElementById('lead-service').value = lead.service_interest || '';
         document.getElementById('lead-remarks').value = lead.remarks || '';
         document.getElementById('lead-owner-id').value = lead.owner_id || '';
+
+        document.getElementById('lead-visiting-card').value = lead.visiting_card_ref || '';
+        document.getElementById('lead-req-note').value = lead.requirement_note_ref || '';
+        document.getElementById('lead-email-ss').value = lead.email_screenshot_ref || '';
+        document.getElementById('lead-ref-doc').value = lead.reference_document_ref || '';
+
+        // Activity timeline
+        const timelineSec = document.getElementById('lead-timeline-section');
+        const timelineCont = document.getElementById('lead-timeline-container');
+        if (timelineSec && timelineCont) {
+          const activities = db.getRecords('activities', user).filter(a => a.related_entity === 'leads' && a.related_id === leadId);
+          if (activities.length > 0) {
+            timelineSec.style.display = 'block';
+            activities.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
+            timelineCont.innerHTML = activities.slice(0, 5).map(a =>
+              `<div style="margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid var(--hairline);">
+                 <b>${this.escapeHTML(a.type)}</b> - <span style="color: var(--muted);">${new Date(a.created_at).toLocaleString()} by ${this.escapeHTML(a.created_by)}</span><br>
+                 ${this.escapeHTML(a.description)}
+               </div>`
+            ).join('');
+          } else {
+            timelineSec.style.display = 'none';
+            timelineCont.innerHTML = '';
+          }
+        }
       }
     } else {
       modalTitle.textContent = 'Add Lead';
       document.getElementById('lead-id').value = '';
+      const timelineSec = document.getElementById('lead-timeline-section');
+      if (timelineSec) timelineSec.style.display = 'none';
     }
 
     document.getElementById('modal-lead').classList.remove('hidden');
@@ -234,7 +337,11 @@
       priority: document.getElementById('lead-priority').value,
       next_follow_up_date: document.getElementById('lead-next-followup').value,
       service_interest: document.getElementById('lead-service').value,
-      remarks: document.getElementById('lead-remarks').value
+      remarks: document.getElementById('lead-remarks').value,
+      visiting_card_ref: document.getElementById('lead-visiting-card').value,
+      requirement_note_ref: document.getElementById('lead-req-note').value,
+      email_screenshot_ref: document.getElementById('lead-email-ss').value,
+      reference_document_ref: document.getElementById('lead-ref-doc').value
     };
 
     const requestedOwner = document.getElementById('lead-owner-id').value;
@@ -316,6 +423,9 @@
     const lead = leads.find(l => l.id === leadId);
 
     if (!lead) return alert("Lead not found.");
+    if (lead.status === 'Converted' || lead.converted_requirement_id || lead.converted_client_id) {
+      return alert("This lead has already been converted.");
+    }
     if (!confirm(`Convert ${lead.company_name} to Requirement? This will create a Client and Contact record if they don't exist.`)) return;
 
     const clients = db.getRecords('clients', {role: 'manager'});
@@ -384,6 +494,103 @@
     alert("Successfully converted to Requirement!");
     this.render();
   }
+
+  convertToClient(leadId) {
+    const user = auth.getCurrentUser();
+    const leads = db.getRecords('leads', user);
+    const lead = leads.find(l => l.id === leadId);
+
+    if (!lead) return alert("Lead not found.");
+    if (lead.status === 'Converted' || lead.converted_requirement_id || lead.converted_client_id) {
+      return alert("This lead has already been converted.");
+    }
+    if (!confirm(`Convert ${lead.company_name} to Client? This will create a Client and Contact record if they don't exist.`)) return;
+
+    const clients = db.getRecords('clients', {role: 'manager'});
+    let client = clients.find(c =>
+      (c.company_name && c.company_name.toLowerCase() === lead.company_name.toLowerCase()) ||
+      (c.website && lead.website && c.website.toLowerCase() === lead.website.toLowerCase())
+    );
+
+    if (!client) {
+      client = db.createRecord('clients', {
+        company_name: lead.company_name,
+        industry: lead.industry,
+        website: lead.website
+      }, user);
+    }
+
+    const contacts = db.getRecords('contacts', {role: 'manager'});
+    let contact = contacts.find(c =>
+      (c.email && lead.email && c.email.toLowerCase() === lead.email.toLowerCase()) ||
+      (c.phone && lead.phone && c.phone === lead.phone) ||
+      (c.linkedin && lead.linkedin && c.linkedin.toLowerCase() === lead.linkedin.toLowerCase())
+    );
+
+    if (!contact) {
+      let fName = lead.contact_person || 'Unknown';
+      let lName = '';
+      if (fName.includes(' ')) {
+        const parts = fName.split(' ');
+        fName = parts[0];
+        lName = parts.slice(1).join(' ');
+      }
+
+      contact = db.createRecord('contacts', {
+        first_name: fName,
+        last_name: lName,
+        email: lead.email,
+        phone: lead.phone,
+        linkedin: lead.linkedin,
+        client_id: client.id,
+        job_title: lead.designation
+      }, user);
+    }
+
+    db.updateRecord('leads', lead.id, {
+      status: 'Converted',
+      pipeline_stage: 'Converted',
+      converted_client_id: client.id
+    }, user);
+
+    db.logActivity('client conversion', `Lead directly converted to Client ID: ${client.id}`, 'leads', lead.id, user);
+
+    alert("Successfully converted to Client!");
+    this.render();
+  }
+
+  handleQuickAction(leadId, action) {
+    if (!action) return;
+    const user = auth.getCurrentUser();
+    const leads = db.getRecords('leads', user);
+    const lead = leads.find(l => l.id === leadId);
+    if (!lead) return;
+
+    if (action === 'dormant') {
+      db.updateRecord('leads', leadId, { status: 'Dormant', pipeline_stage: 'Dormant' }, user);
+      db.logActivity('status change', 'Marked as Dormant', 'leads', leadId, user);
+      this.render();
+    } else if (action === 'lost') {
+      db.updateRecord('leads', leadId, { status: 'Lost', pipeline_stage: 'Lost' }, user);
+      db.logActivity('status change', 'Marked as Lost', 'leads', leadId, user);
+      this.render();
+    } else if (action === 'followup') {
+      const date = prompt('Enter next follow-up date (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);
+      if (date) {
+        db.updateRecord('leads', leadId, { next_follow_up_date: date, follow_up_type: 'Call' }, user);
+        db.logActivity('followup scheduled', `Scheduled follow-up for ${date}`, 'leads', leadId, user);
+        this.render();
+      }
+    } else if (action === 'assign') {
+      if (user.role !== 'manager' && user.role !== 'team_lead') return alert('Access Denied');
+      const newOwner = prompt('Enter new Owner ID:');
+      if (newOwner) {
+        db.updateRecord('leads', leadId, { owner_id: newOwner }, user);
+        db.logActivity('owner reassigned', `Owner changed to ${newOwner}`, 'leads', leadId, user);
+        this.render();
+      }
+    }
+  }
 }
 
 document.addEventListener('DOMContentLoaded', () => {
diff --git a/js/schema.js b/js/schema.js
index b5e3119..2ff81e9 100644
--- a/js/schema.js
+++ b/js/schema.js
@@ -1,4 +1,4 @@
-∩╗┐window.crmSchema = {
+window.crmSchema = {
   users: {
     fields: ['first_name', 'last_name', 'email', 'role', 'team_id', 'status'],
     duplicateKeys: ['email']
@@ -17,7 +17,8 @@
       'linkedin', 'website', 'industry', 'company_size', 'city', 'country',
       'service_interest', 'source', 'last_contact_date', 'next_follow_up_date',
       'follow_up_type', 'last_discussion', 'remarks', 'priority',
-      'pipeline_stage', 'converted_requirement_id'
+      'pipeline_stage', 'converted_requirement_id', 'converted_client_id',
+      'visiting_card_ref', 'requirement_note_ref', 'email_screenshot_ref', 'reference_document_ref'
     ],
     duplicateKeys: ['email', 'phone', 'company_name', 'linkedin']
   },
```

## Tests Run
```text
git diff --check; node --check js/leads.js; node --check js/app.js; node --check js/schema.js; node --check js/db.js; node --check js/import.js; node --check js/dashboard.js; node --check js/pipeline.js; node --check js/requirements.js; node --check js/deals.js; node --check js/database.js; node --check js/settings.js
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
