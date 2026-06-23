# AI Change Audit Report

## Generated On
2026-06-23_17-37-29

## Branch
main

## Baseline Commit
bfb8545

## Task Summary
Database SOP upgrade: master lists, leads and normal contacts, import data, archive workflow, duplicate checks, and SOP schema fields

## Git Status
```text
 M index.html
 M js/database.js
 M js/db.js
 M js/schema.js
```

## Files Changed
```text
M	index.html
M	js/database.js
M	js/db.js
M	js/schema.js
```

## Change Summary
```text
 index.html     |  50 +++++-----
 js/database.js | 300 +++++++++++++++++++++++++++++++++++++++------------------
 js/db.js       |   2 +-
 js/schema.js   |  10 +-
 4 files changed, 241 insertions(+), 121 deletions(-)
```

## Full Diff
```diff
diff --git a/index.html b/index.html
index 1384eda..ca8cecd 100644
--- a/index.html
+++ b/index.html
@@ -360,8 +360,13 @@
 
       <div id="tab-database" class="tab-pane">
         <div class="card">
-          <h3>Database Master Lists</h3>
-          <p>Central repository for master data. Search and manage existing records across the system.</p>
+          <div style="display: flex; justify-content: space-between; align-items: center;">
+            <div>
+              <h3>Database Master Lists</h3>
+              <p>Central repository for master data. Search and manage existing records across the system.</p>
+            </div>
+            <button class="btn btn-secondary btn-db-add" onclick="window.databaseManager.goToImport()">Import Data</button>
+          </div>
         </div>
 
         <div class="card">
@@ -375,7 +380,25 @@
 
         <div class="card">
           <div style="display: flex; justify-content: space-between; align-items: center;">
-            <h3>Contacts</h3>
+            <h3>Leads Master</h3>
+            <!-- No add button here, leads added via Leads Tab -->
+          </div>
+          <input type="text" id="db-search-leads" class="form-control" placeholder="Search Leads..." style="margin: 10px 0; max-width: 300px;">
+          <div id="db-leads-list" class="table-container"></div>
+        </div>
+
+        <div class="card">
+          <div style="display: flex; justify-content: space-between; align-items: center;">
+            <h3>Normal Contacts</h3>
+            <button class="btn btn-primary btn-db-add" onclick="window.databaseManager.openModal('contacts', null, { contact_type: 'Normal' })">+ Add Normal Contact</button>
+          </div>
+          <input type="text" id="db-search-normal-contacts" class="form-control" placeholder="Search Normal Contacts..." style="margin: 10px 0; max-width: 300px;">
+          <div id="db-normal-contacts-list" class="table-container"></div>
+        </div>
+
+        <div class="card">
+          <div style="display: flex; justify-content: space-between; align-items: center;">
+            <h3>Contacts (Linked)</h3>
             <button class="btn btn-primary btn-db-add" onclick="window.databaseManager.openModal('contacts')">+ Add Contact</button>
           </div>
           <input type="text" id="db-search-contacts" class="form-control" placeholder="Search Contacts..." style="margin: 10px 0; max-width: 300px;">
@@ -402,30 +425,12 @@
 
         <div class="card">
           <div style="display: flex; justify-content: space-between; align-items: center;">
-            <h3>Service Lines / Training Categories</h3>
+            <h3>Service Database</h3>
             <button class="btn btn-primary btn-db-add" onclick="window.databaseManager.openModal('serviceLines')">+ Add Service Line</button>
           </div>
           <input type="text" id="db-search-serviceLines" class="form-control" placeholder="Search Service Lines..." style="margin: 10px 0; max-width: 300px;">
           <div id="db-serviceLines-list" class="table-container"></div>
         </div>
-
-        <div class="card db-admin-only" id="db-admin-users" style="display: none;">
-          <div style="display: flex; justify-content: space-between; align-items: center;">
-            <h3>Users</h3>
-            <button class="btn btn-primary btn-db-add" onclick="window.databaseManager.openModal('users')">+ Add User</button>
-          </div>
-          <input type="text" id="db-search-users" class="form-control" placeholder="Search Users..." style="margin: 10px 0; max-width: 300px;">
-          <div id="db-users-list" class="table-container"></div>
-        </div>
-
-        <div class="card db-admin-only" id="db-admin-teams" style="display: none;">
-          <div style="display: flex; justify-content: space-between; align-items: center;">
-            <h3>Teams</h3>
-            <button class="btn btn-primary btn-db-add" onclick="window.databaseManager.openModal('teams')">+ Add Team</button>
-          </div>
-          <input type="text" id="db-search-teams" class="form-control" placeholder="Search Teams..." style="margin: 10px 0; max-width: 300px;">
-          <div id="db-teams-list" class="table-container"></div>
-        </div>
       </div>
 
       <div id="tab-reports" class="tab-pane">
@@ -479,6 +484,7 @@
               <option value="requirements">Requirements</option>
               <option value="trainers">Trainers</option>
               <option value="vendors">Vendors</option>
+              <option value="serviceLines">Service Lines</option>
             </select>
           </div>
           <div class="form-group">
diff --git a/js/database.js b/js/database.js
index 4663220..7099ddd 100644
--- a/js/database.js
+++ b/js/database.js
@@ -2,16 +2,30 @@ class DatabaseManager {
   constructor() {
     this.searchFilters = {
       clients: '',
+      leads: '',
+      'normal-contacts': '',
       contacts: '',
       vendors: '',
       trainers: '',
-      users: '',
-      teams: '',
       serviceLines: ''
     };
 
     this.bindEvents();
-    // Do not call this.render() here, it will be called by app.js when the tab is clicked.
+  }
+
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
+  formatFieldName(field) {
+    return field.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
   }
 
   bindEvents() {
@@ -27,7 +41,7 @@ class DatabaseManager {
       }
     };
 
-    ['clients', 'contacts', 'vendors', 'trainers', 'users', 'teams', 'serviceLines'].forEach(bindSearch);
+    ['clients', 'leads', 'normal-contacts', 'contacts', 'vendors', 'trainers', 'serviceLines'].forEach(bindSearch);
 
     const closeModalBtn = el('btn-close-database-modal');
     if (closeModalBtn) {
@@ -43,43 +57,49 @@ class DatabaseManager {
         this.saveRecord();
       });
     }
+
+    // Event delegation for table lists
+    ['clients', 'leads', 'normal-contacts', 'contacts', 'vendors', 'trainers', 'serviceLines'].forEach(coll => {
+      const listEl = el(`db-${coll}-list`);
+      if (listEl) {
+        listEl.addEventListener('click', (e) => {
+          const btn = e.target.closest('.btn-db-action');
+          if (!btn) return;
+          const action = btn.getAttribute('data-action');
+          const id = btn.getAttribute('data-id');
+          const targetColl = btn.getAttribute('data-coll');
+
+          if (action === 'edit') this.openModal(targetColl, id);
+          if (action === 'archive') this.archiveRecord(targetColl, id);
+          if (action === 'check-dup') this.checkDuplicateModal(targetColl, id);
+        });
+      }
+    });
   }
 
   render() {
     const user = auth.getCurrentUser();
 
-    // Hide/Show Admin sections based on role
-    const el = (id) => document.getElementById(id);
-    if (user.role === 'manager') {
-      if (el('db-admin-users')) el('db-admin-users').style.display = 'block';
-      if (el('db-admin-teams')) el('db-admin-teams').style.display = 'block';
-    } else {
-      if (el('db-admin-users')) el('db-admin-users').style.display = 'none';
-      if (el('db-admin-teams')) el('db-admin-teams').style.display = 'none';
-    }
-
     // Hide Add buttons for employees
     const addBtns = document.querySelectorAll('.btn-db-add');
     addBtns.forEach(btn => {
       btn.style.display = user.role === 'employee' ? 'none' : 'block';
     });
 
-    ['clients', 'contacts', 'vendors', 'trainers', 'serviceLines'].forEach(coll => this.renderCollection(coll));
-    if (user.role === 'manager') {
-      ['users', 'teams'].forEach(coll => this.renderCollection(coll));
-    }
+    ['clients', 'leads', 'normal-contacts', 'contacts', 'vendors', 'trainers', 'serviceLines'].forEach(coll => this.renderCollection(coll));
   }
 
   getLinkedCounts(collection, id, allRecords) {
     let counts = [];
     if (collection === 'clients') {
-      const contacts = allRecords.contacts.filter(r => r.client_id === id).length;
-      const reqs = allRecords.requirements.filter(r => r.client_id === id).length;
-      const deals = allRecords.deals.filter(r => r.client_id === id).length;
-      if (contacts) counts.push(`${contacts} Contacts`);
-      if (reqs) counts.push(`${reqs} Reqs`);
-      if (deals) counts.push(`${deals} Deals`);
-    } else if (collection === 'contacts') {
+      const deals = allRecords.deals.filter(r => r.client_id === id);
+      const totalDeals = deals.length;
+      const totalRev = deals.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);
+      const acts = allRecords.activities.filter(a => a.related_id === id);
+      const lastAct = acts.length > 0 ? new Date(Math.max(...acts.map(a => new Date(a.created_at)))).toISOString().split('T')[0] : 'None';
+
+      return `Deals: ${totalDeals} | Rev: ${totalRev} | Last Act: ${lastAct}`;
+    } else if (collection === 'contacts' || collection === 'normal-contacts') {
       const reqs = allRecords.requirements.filter(r => r.contact_id === id).length;
       const deals = allRecords.deals.filter(r => r.contact_id === id).length;
       if (reqs) counts.push(`${reqs} Reqs`);
@@ -96,7 +116,18 @@ class DatabaseManager {
 
   renderCollection(collection) {
     const user = auth.getCurrentUser();
-    const records = db.getRecords(collection, user);
+    const isEmp = user.role === 'employee';
+    let baseColl = collection;
+    if (collection === 'normal-contacts') baseColl = 'contacts';
+
+    let records = db.getRecords(baseColl, user);
+
+    if (collection === 'normal-contacts') {
+      records = records.filter(r => r.contact_type === 'Normal' || (!r.client_id && !r.vendor_id && !r.trainer_id && !r.lead_id));
+    } else if (collection === 'contacts') {
+      records = records.filter(r => r.client_id || r.vendor_id || r.trainer_id || r.lead_id || (r.contact_type && r.contact_type !== 'Normal'));
+    }
+
     const container = document.getElementById(`db-${collection}-list`);
     if (!container) return;
 
@@ -106,44 +137,60 @@ class DatabaseManager {
       return Object.values(r).some(v => String(v).toLowerCase().includes(searchTerm));
     });
 
-    // Load all records once for link counting
     const allRecords = {
-      contacts: db.getRecords('contacts', user),
+      deals: db.getRecords('deals', user),
       requirements: db.getRecords('requirements', user),
-      deals: db.getRecords('deals', user)
+      activities: JSON.parse(localStorage.getItem('crm_activities') || '[]')
     };
 
-    const schema = window.crmSchema[collection];
-    if (!schema) return;
-
-    // Display first 4 fields
-    const displayFields = schema.fields.slice(0, 4);
+    let columns = [];
+    if (collection === 'clients') {
+      columns = ['company_name', 'industry', 'city', 'country'];
+    } else if (collection === 'leads') {
+      columns = ['company_name', 'service_interest', 'pipeline_stage', 'owner_id', 'converted_requirement_id', 'status'];
+    } else if (collection === 'normal-contacts' || collection === 'contacts') {
+      columns = ['first_name', 'last_name', 'company_name', 'designation', 'phone', 'email', 'contact_type'];
+    } else if (collection === 'trainers') {
+      columns = ['first_name', 'last_name', 'skills', 'commercial_rate', 'phone', 'email', 'vendor_status'];
+    } else if (collection === 'vendors') {
+      columns = ['company_name', 'vendor_contact', 'service_area', 'phone', 'email'];
+    } else if (collection === 'serviceLines') {
+      columns = ['name', 'category', 'service_type', 'status'];
+    } else {
+      columns = window.crmSchema[baseColl]?.fields.slice(0, 4) || [];
+    }
 
     let html = `<table class="data-table"><thead><tr>`;
-    displayFields.forEach(f => {
-      html += `<th>${this.formatFieldName(f)}</th>`;
-    });
-    html += `<th>Linked Data</th>`;
-    if (user.role !== 'employee') {
-      html += `<th>Actions</th>`;
+    columns.forEach(c => html += `<th>${this.formatFieldName(c)}</th>`);
+
+    if (['clients', 'contacts', 'normal-contacts', 'trainers', 'vendors'].includes(collection)) {
+      html += `<th>Linked Data</th>`;
     }
+
+    if (!isEmp) html += `<th>Actions</th>`;
     html += `</tr></thead><tbody>`;
 
     if (filtered.length === 0) {
-      html += `<tr><td colspan="${displayFields.length + 2}">No records found.</td></tr>`;
+      html += `<tr><td colspan="${columns.length + 2}">No records found.</td></tr>`;
     } else {
       filtered.forEach(record => {
         html += `<tr>`;
-        displayFields.forEach(f => {
-          html += `<td>${this.escapeHTML(record[f])}</td>`;
+        columns.forEach(c => {
+          html += `<td>${this.escapeHTML(record[c])}</td>`;
         });
-        html += `<td><span style="font-size: 0.85em; color: #666;">${this.escapeHTML(this.getLinkedCounts(collection, record.id, allRecords))}</span></td>`;
 
-        if (user.role !== 'employee') {
+        if (['clients', 'contacts', 'normal-contacts', 'trainers', 'vendors'].includes(collection)) {
+          html += `<td><span style="font-size: 0.85em; color: #666;">${this.escapeHTML(this.getLinkedCounts(collection, record.id, allRecords))}</span></td>`;
+        }
+
+        if (!isEmp) {
+          const eId = this.escapeHTML(record.id);
+          const eColl = this.escapeHTML(baseColl);
           html += `
             <td>
-              <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 0.8rem;" onclick="window.databaseManager.openModal('${collection}', '${record.id}')">Edit</button>
-              <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 0.8rem; background-color: #fee;" onclick="window.databaseManager.deleteRecord('${collection}', '${record.id}')">Del</button>
+              <button class="btn btn-secondary btn-db-action" data-action="edit" data-id="${eId}" data-coll="${eColl}" style="padding: 2px 6px; font-size: 11px;">Update Profile</button>
+              <button class="btn btn-secondary btn-db-action" data-action="archive" data-id="${eId}" data-coll="${eColl}" style="padding: 2px 6px; font-size: 11px; background-color: #fee;">Archive</button>
+              <button class="btn btn-secondary btn-db-action" data-action="check-dup" data-id="${eId}" data-coll="${eColl}" style="padding: 2px 6px; font-size: 11px;">Check Dup</button>
             </td>
           `;
         }
@@ -154,62 +201,48 @@ class DatabaseManager {
     container.innerHTML = html;
   }
 
-  escapeHTML(str) {
-    if (!str) return '-';
-    return String(str)
-      .replace(/&/g, "&amp;")
-      .replace(/</g, "&lt;")
-      .replace(/>/g, "&gt;")
-      .replace(/"/g, "&quot;")
-      .replace(/'/g, "&#039;");
-  }
-
-  formatFieldName(field) {
-    return field.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
-  }
-
-  openModal(collection, recordId = null) {
+  openModal(collection, recordId = null, defaults = {}) {
     const user = auth.getCurrentUser();
     if (user.role === 'employee') return;
     const schema = window.crmSchema[collection];
     if (!schema) return;
 
-    document.getElementById('db-collection').value = collection;
-    document.getElementById('db-record-id').value = recordId || '';
+    const el = (id) => document.getElementById(id);
+    el('db-collection').value = collection;
+    el('db-record-id').value = recordId || '';
 
     const titleObj = collection.charAt(0).toUpperCase() + collection.slice(1);
-    document.getElementById('modal-database-title').textContent = recordId ? `Edit ${titleObj}` : `Add ${titleObj}`;
+    el('modal-database-title').textContent = recordId ? `Update ${titleObj} Profile` : `Add ${titleObj}`;
 
-    const fieldsContainer = document.getElementById('db-dynamic-fields');
+    const fieldsContainer = el('db-dynamic-fields');
     fieldsContainer.innerHTML = '';
 
     let record = null;
     if (recordId) {
-      const records = db.getRecords(collection, user);
-      record = records.find(r => r.id === recordId);
+      record = db.getRecords(collection, user).find(r => r.id === recordId);
     }
 
     schema.fields.forEach(field => {
       const wrapper = document.createElement('div');
       wrapper.className = 'form-group';
-
-      const label = document.createElement('label');
-      label.textContent = this.formatFieldName(field);
+      wrapper.innerHTML = `<label>${this.escapeHTML(this.formatFieldName(field))}</label>`;
 
       const input = document.createElement('input');
       input.type = 'text';
       input.id = `db-f-${field}`;
       input.className = 'form-control';
+
       if (record && record[field]) {
         input.value = record[field];
+      } else if (!record && defaults[field]) {
+        input.value = defaults[field];
       }
 
-      wrapper.appendChild(label);
       wrapper.appendChild(input);
       fieldsContainer.appendChild(wrapper);
     });
 
-    document.getElementById('modal-database').classList.remove('hidden');
+    el('modal-database').classList.remove('hidden');
   }
 
   normalizeValue(value) {
@@ -217,6 +250,73 @@ class DatabaseManager {
     return String(value).trim().toLowerCase().replace(/[\s\+\-\(\)\[\]]/g, '');
   }
 
+  checkDuplicateModal(collection, recordId) {
+    const user = auth.getCurrentUser();
+    if (user.role === 'employee') return;
+    const schema = window.crmSchema[collection];
+    if (!schema || !schema.duplicateKeys || schema.duplicateKeys.length === 0) {
+      return alert('No duplicate keys defined for this collection.');
+    }
+
+    const record = db.getRecords(collection, user).find(r => r.id === recordId);
+    if (!record) return;
+
+    const globalRecords = db.getRecords(collection, {role: 'manager'});
+    let duplicateRecord = null;
+
+    for (let r of globalRecords) {
+      if (r.id === recordId) continue;
+      let isDup = false;
+      for (let key of schema.duplicateKeys) {
+        if (record[key] && r[key]) {
+          if (this.normalizeValue(record[key]) === this.normalizeValue(r[key])) {
+            isDup = true;
+            break;
+          }
+        }
+      }
+      if (isDup) {
+        duplicateRecord = r;
+        break;
+      }
+    }
+
+    if (!duplicateRecord) {
+      return alert('No duplicates found.');
+    }
+
+    const accessibleRecords = db.getRecords(collection, user);
+    const isAccessible = accessibleRecords.some(r => r.id === duplicateRecord.id);
+
+    if (!isAccessible) {
+      return alert(`Duplicate found outside scope (ID: ${duplicateRecord.id}). Ask manager.`);
+    }
+
+    const confirmMerge = confirm(`Duplicate detected: ${duplicateRecord.id}. Merge missing fields from this record into the older duplicate and archive this one?`);
+    if (confirmMerge) {
+      let mergedData = { ...duplicateRecord };
+      let changes = false;
+      schema.fields.forEach(f => {
+        if (!mergedData[f] && record[f]) {
+          mergedData[f] = record[f];
+          changes = true;
+        }
+      });
+
+      if (changes) {
+        db.updateRecord(collection, duplicateRecord.id, mergedData, user);
+      }
+
+      // Soft archive the current record as it's merged
+      db.updateRecord(collection, recordId, { status: 'Archived', remarks: `Merged into ${duplicateRecord.id}` }, user);
+
+      db.logAudit('duplicate_merge', `Merged ${recordId} into ${duplicateRecord.id}`, user);
+      db.logActivity('update', 'Merged duplicate', collection, duplicateRecord.id, user);
+
+      this.render();
+    }
+  }
+
   saveRecord() {
     const user = auth.getCurrentUser();
     if (user.role === 'employee') return;
@@ -228,18 +328,19 @@ class DatabaseManager {
 
     let data = {};
     schema.fields.forEach(field => {
-      data[field] = document.getElementById(`db-f-${field}`).value.trim();
+      const val = document.getElementById(`db-f-${field}`).value.trim();
+      data[field] = val;
     });
 
-    const globalRecords = db.getRecords(collection, {role: 'manager'}); // full list for dup detection
-    const accessibleRecords = db.getRecords(collection, user); // scope for merging
+    const globalRecords = db.getRecords(collection, {role: 'manager'});
+    const accessibleRecords = db.getRecords(collection, user);
     const duplicateKeys = schema.duplicateKeys || [];
 
-    // Check Duplicates
+    // Check Duplicates automatically on Save
     let duplicateRecord = null;
     if (duplicateKeys.length > 0) {
       for (let r of globalRecords) {
-        if (recordId && r.id === recordId) continue; // Skip self
+        if (recordId && r.id === recordId) continue;
 
         let isDup = false;
         for (let key of duplicateKeys) {
@@ -259,18 +360,16 @@ class DatabaseManager {
 
     if (duplicateRecord) {
       const isAccessible = accessibleRecords.some(r => r.id === duplicateRecord.id);
-      
       if (!isAccessible) {
         alert("Duplicate exists outside your access scope. Please ask a Manager to review.");
         return;
       }
 
-      const confirmMerge = confirm(`Duplicate detected for this record (Matched existing record ID: ${duplicateRecord.id}).\n\nDo you want to merge these details? This will only fill empty fields on the existing record and keep the original ID.`);
+      const confirmMerge = confirm(`Duplicate detected for this record (Matched existing record ID: ${duplicateRecord.id}).\\n\\nDo you want to merge these details? This will only fill empty fields on the existing record and keep the original ID.`);
       if (!confirmMerge) {
-        return; // Abort
+        return;
       }
 
-      // Merge Logic: only fill empty fields
       let mergedData = { ...duplicateRecord };
       let changesMade = false;
 
@@ -283,36 +382,51 @@ class DatabaseManager {
 
       if (changesMade) {
         db.updateRecord(collection, duplicateRecord.id, mergedData, user);
-        db.logAudit('duplicate_merge', `Merged data into existing ${collection} ${duplicateRecord.id}`, user, duplicateRecord.team_id);
+        db.logAudit('duplicate_merge', `Merged data into existing ${collection} ${duplicateRecord.id}`, user);
         db.logActivity('update', `Merged duplicate data`, collection, duplicateRecord.id, user);
       }
 
       document.getElementById('modal-database').classList.add('hidden');
-      this.renderCollection(collection);
+      this.render();
       return;
     }
 
-    // Normal Save
     if (recordId) {
       db.updateRecord(collection, recordId, data, user);
     } else {
+      if (collection === 'leads') data.status = 'Open';
       db.createRecord(collection, data, user);
     }
 
     document.getElementById('modal-database').classList.add('hidden');
-    this.renderCollection(collection);
+    this.render();
   }
 
-  deleteRecord(collection, id) {
+  archiveRecord(collection, id) {
     const user = auth.getCurrentUser();
     if (user.role === 'employee') return;
-    if (!confirm('Are you sure you want to delete this record?')) return;
+    if (!confirm('Are you sure you want to archive this record?')) return;
+
+    db.updateRecord(collection, id, { status: 'Archived', archived: 'Yes' }, user);
+    db.logAudit('archive', `Archived ${collection} record ${id}`, user);
+    db.logActivity('archive', `Archived ${collection}`, collection, id, user);
+    this.render();
+  }
 
-    try {
-      db.deleteRecord(collection, id, user);
-      this.renderCollection(collection);
-    } catch (e) {
-      alert(e.message);
+  goToImport() {
+    const user = auth.getCurrentUser();
+    if (user.role === 'employee') {
+      alert('You do not have permission to import data.');
+      return;
+    }
+    document.querySelectorAll('.tab-pane').forEach(tab => tab.classList.remove('active'));
+    document.getElementById('tab-settings').classList.add('active');
+
+    // Focus import collection
+    const importColl = document.getElementById('import-collection');
+    if (importColl) {
+      importColl.focus();
+      importColl.scrollIntoView({ behavior: 'smooth' });
     }
   }
 }
diff --git a/js/db.js b/js/db.js
index 597fec2..9b015f3 100644
--- a/js/db.js
+++ b/js/db.js
@@ -217,7 +217,7 @@ class Database {
   }
 
   logAudit(action, details, user, team_id = 'none') {
-    const allowedActions = ['login', 'logout', 'create', 'update', 'delete', 'assign', 'approve', 'import', 'export', 'stage_change', 'profile_shared', 'candidate_selected', 'candidate_shortlisted', 'proposal_update', 'po_update', 'convert_to_deal', 'deal_update', 'trainer_assigned', 'vendor_assigned', 'delivery_update', 'invoice_update', 'payment_update', 'feedback_update', 'close_deal', 'delete_attempt', 'duplicate_merge', 'status_change'];
+    const allowedActions = ['login', 'logout', 'create', 'update', 'delete', 'archive', 'assign', 'approve', 'import', 'export', 'stage_change', 'profile_shared', 'candidate_selected', 'candidate_shortlisted', 'proposal_update', 'po_update', 'convert_to_deal', 'deal_update', 'trainer_assigned', 'vendor_assigned', 'delivery_update', 'invoice_update', 'payment_update', 'feedback_update', 'close_deal', 'delete_attempt', 'duplicate_merge', 'status_change'];
     if (!allowedActions.includes(action)) return;
 
     const audits = JSON.parse(localStorage.getItem('crm_auditLogs') || '[]');
diff --git a/js/schema.js b/js/schema.js
index 4850416..68486ee 100644
--- a/js/schema.js
+++ b/js/schema.js
@@ -8,7 +8,7 @@ window.crmSchema = {
     duplicateKeys: ['name']
   },
   serviceLines: {
-    fields: ['name', 'description', 'status'],
+    fields: ['name', 'category', 'service_type', 'technology_topic', 'description', 'status', 'remarks'],
     duplicateKeys: ['name']
   },
   leads: {
@@ -23,11 +23,11 @@ window.crmSchema = {
     duplicateKeys: ['email', 'phone', 'company_name', 'linkedin']
   },
   contacts: {
-    fields: ['first_name', 'last_name', 'email', 'phone', 'linkedin', 'client_id', 'job_title', 'department', 'primary_contact'],
+    fields: ['first_name', 'last_name', 'email', 'phone', 'linkedin', 'client_id', 'job_title', 'department', 'primary_contact', 'designation', 'company_name', 'relationship_type', 'contact_type', 'vendor_id', 'trainer_id', 'lead_id', 'owner_id', 'remarks'],
     duplicateKeys: ['email', 'phone', 'linkedin']
   },
   clients: {
-    fields: ['company_name', 'industry', 'website', 'gst', 'billing_address', 'shipping_address', 'account_tier', 'annual_revenue'],
+    fields: ['company_name', 'industry', 'company_size', 'website', 'city', 'country', 'gst', 'billing_address', 'shipping_address', 'primary_contact', 'relationship_status', 'remarks', 'account_tier', 'annual_revenue'],
     duplicateKeys: ['company_name', 'gst']
   },
   requirements: {
@@ -56,11 +56,11 @@ window.crmSchema = {
     duplicateKeys: []
   },
   trainers: {
-    fields: ['first_name', 'last_name', 'email', 'phone', 'linkedin', 'expertise', 'daily_rate', 'availability', 'certifications'],
+    fields: ['first_name', 'last_name', 'email', 'phone', 'linkedin', 'expertise', 'daily_rate', 'availability', 'certifications', 'city', 'skills', 'experience', 'past_clients', 'commercial_rate', 'mode_preference', 'travel_flexibility', 'recording_capability', 'feedback_rating', 'vendor_status', 'vendor_id', 'documents', 'remarks'],
     duplicateKeys: ['email', 'phone', 'linkedin']
   },
   vendors: {
-    fields: ['company_name', 'services_provided', 'email', 'phone', 'gst', 'website', 'point_of_contact', 'payment_terms'],
+    fields: ['company_name', 'services_provided', 'email', 'phone', 'gst', 'website', 'point_of_contact', 'payment_terms', 'vendor_contact', 'city', 'service_area', 'trainer_pool_strength', 'commercial_model', 'past_work', 'reliability_rating', 'remarks'],
     duplicateKeys: ['company_name', 'email', 'gst']
   },
   deals: {
```

## Tests Run
```text
git diff --check; node --check js/database.js; node --check js/schema.js; node --check js/db.js; node --check js/app.js; node --check js/leads.js; node --check js/deals.js; node --check js/requirements.js; node --check js/pipeline.js; node --check js/dashboard.js; node --check js/reports.js; node --check js/settings.js; node --check js/import.js
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
