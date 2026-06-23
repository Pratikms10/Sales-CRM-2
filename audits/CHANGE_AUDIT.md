# AI Change Audit Report

## Generated On
2026-06-23_16-49-06

## Branch
main

## Baseline Commit
8cd606e

## Task Summary
Requirements & Sourcing SOP upgrade: intake details, import requirements, confirmation logic, sourcing actions, audit hardening, and safe rendering

## Git Status
```text
 M index.html
 M js/db.js
 M js/requirements.js
 M js/schema.js
```

## Files Changed
```text
M	index.html
M	js/db.js
M	js/requirements.js
M	js/schema.js
```

## Change Summary
```text
 index.html         |  43 ++++++++-
 js/db.js           |   2 +-
 js/requirements.js | 278 ++++++++++++++++++++++++++++++++++++++++++++++++-----
 js/schema.js       |   5 +-
 4 files changed, 298 insertions(+), 30 deletions(-)
```

## Full Diff
```diff
diff --git a/index.html b/index.html
index efbbd36..229dc9f 100644
--- a/index.html
+++ b/index.html
@@ -210,7 +210,10 @@
             <h3>Requirements & Sourcing</h3>
             <p>Fulfill client needs.</p>
           </div>
-          <button class="btn btn-primary" onclick="window.requirementsManager.openRequirementModal()">+ Add Requirement</button>
+          <div style="display: flex; gap: 8px;">
+            <button class="btn btn-secondary hidden" id="btn-import-reqs">Import Requirements</button>
+            <button class="btn btn-primary" onclick="window.requirementsManager.openRequirementModal()">+ Add Requirement</button>
+          </div>
         </div>
 
         <div class="card">
@@ -469,6 +472,7 @@
               <option value="leads">Leads</option>
               <option value="contacts">Contacts</option>
               <option value="clients">Clients</option>
+              <option value="requirements">Requirements</option>
               <option value="trainers">Trainers</option>
               <option value="vendors">Vendors</option>
             </select>
@@ -650,6 +654,12 @@
             <h4>1. Intake Details</h4>
             <div class="form-group"><label>Title</label><input type="text" id="req-title" class="form-control" required></div>
             <div class="form-group"><label>Client ID</label><input type="text" id="req-client-id" class="form-control"></div>
+            <div class="form-group"><label>Contact ID</label><input type="text" id="req-contact-id" class="form-control"></div>
+            <div class="form-group"><label>Company Name</label><input type="text" id="req-company" class="form-control"></div>
+            <div class="form-group"><label>Contact Person</label><input type="text" id="req-contact-person" class="form-control"></div>
+            <div class="form-group"><label>Designation</label><input type="text" id="req-designation" class="form-control"></div>
+            <div class="form-group"><label>Phone</label><input type="text" id="req-phone" class="form-control"></div>
+            <div class="form-group"><label>Email</label><input type="email" id="req-email" class="form-control"></div>
             <div class="form-group"><label>Service Type</label>
               <select id="req-service" class="form-control">
                 <option value="">None</option>
@@ -726,13 +736,34 @@
             <div class="form-group"><label>PO Received Date</label><input type="date" id="req-po-date" class="form-control"></div>
             <div class="form-group"><label>PO Attachment Ref</label><input type="text" id="req-po-att" class="form-control"></div>
             <div class="form-group"><label>Commercial Remarks</label><textarea id="req-comm-remarks" class="form-control" rows="2"></textarea></div>
+            <hr style="margin: 10px 0;">
+            <h4>Attachments / References</h4>
+            <div class="form-group"><label>Requirement Document</label><input type="text" id="req-doc-ref" class="form-control" placeholder="Link or note"></div>
+            <div class="form-group"><label>Email Reference</label><input type="text" id="req-email-ref" class="form-control" placeholder="Link or note"></div>
+            <div class="form-group"><label>Proposal Attachment</label><input type="text" id="req-prop-att-ref" class="form-control" placeholder="Link or note"></div>
+            <hr style="margin: 10px 0;">
+            <h4>Confirmation</h4>
+            <div class="form-group"><label>Confirmation Type</label>
+              <select id="req-confirm-type" class="form-control">
+                <option value="None">None</option>
+                <option value="PO Received">PO Received</option>
+                <option value="Verbal Approval">Verbal Approval</option>
+                <option value="Email Approval">Email Approval</option>
+                <option value="Internal Approval">Internal Approval</option>
+              </select>
+            </div>
+            <div class="form-group"><label>Confirmation Date</label><input type="date" id="req-confirm-date" class="form-control"></div>
+            <div class="form-group"><label>Confirmation Remarks</label><textarea id="req-confirm-remarks" class="form-control" rows="2"></textarea></div>
           </div>
         </div>
 
         <div class="card" style="margin-top: 16px;" id="sourcing-tracker-section">
-          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
+          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 6px;">
             <h4>3. Sourcing Tracker</h4>
-            <button type="button" class="btn btn-secondary" onclick="window.requirementsManager.openCandidateModal()">+ Add Candidate</button>
+            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
+              <button type="button" class="btn btn-secondary" onclick="window.requirementsManager.openCandidateModal(null, 'Trainer')">+ Add Trainer</button>
+              <button type="button" class="btn btn-secondary" onclick="window.requirementsManager.openCandidateModal(null, 'Vendor')">+ Add Vendor</button>
+            </div>
           </div>
           <div class="table-container">
             <table class="data-table">
@@ -756,9 +787,13 @@
           </div>
         </div>
 
-        <div style="margin-top: 16px; display: flex; gap: 10px;">
+        <div style="margin-top: 16px; display: flex; gap: 10px; flex-wrap: wrap;">
           <button type="submit" class="btn btn-primary">Save Requirement</button>
           <button type="button" class="btn btn-secondary" id="btn-convert-deal" onclick="window.requirementsManager.convertToDeal()">Convert to Deal</button>
+          <button type="button" class="btn btn-secondary" id="btn-req-add-proposal" onclick="window.requirementsManager.focusProposal()">Add Proposal</button>
+          <button type="button" class="btn btn-secondary" id="btn-req-upload-po" onclick="window.requirementsManager.focusPO()">Upload PO</button>
+          <button type="button" class="btn btn-secondary" id="btn-req-lost" onclick="window.requirementsManager.markLost()">Mark Lost</button>
+          <button type="button" class="btn btn-secondary" id="btn-req-hold" onclick="window.requirementsManager.markOnHold()">Mark On Hold</button>
         </div>
       </form>
     </div>
diff --git a/js/db.js b/js/db.js
index 1bf188b..597fec2 100644
--- a/js/db.js
+++ b/js/db.js
@@ -217,7 +217,7 @@ class Database {
   }
 
   logAudit(action, details, user, team_id = 'none') {
-    const allowedActions = ['login', 'logout', 'create', 'update', 'delete', 'assign', 'approve', 'import', 'export', 'stage_change', 'profile_shared', 'candidate_selected', 'proposal_update', 'po_update', 'convert_to_deal', 'deal_update', 'trainer_assigned', 'vendor_assigned', 'delivery_update', 'invoice_update', 'payment_update', 'feedback_update', 'close_deal', 'delete_attempt', 'duplicate_merge'];
+    const allowedActions = ['login', 'logout', 'create', 'update', 'delete', 'assign', 'approve', 'import', 'export', 'stage_change', 'profile_shared', 'candidate_selected', 'candidate_shortlisted', 'proposal_update', 'po_update', 'convert_to_deal', 'deal_update', 'trainer_assigned', 'vendor_assigned', 'delivery_update', 'invoice_update', 'payment_update', 'feedback_update', 'close_deal', 'delete_attempt', 'duplicate_merge', 'status_change'];
     if (!allowedActions.includes(action)) return;
 
     const audits = JSON.parse(localStorage.getItem('crm_auditLogs') || '[]');
diff --git a/js/requirements.js b/js/requirements.js
index 63a98d7..9526bde 100644
--- a/js/requirements.js
+++ b/js/requirements.js
@@ -1,4 +1,4 @@
-∩╗┐class RequirementsManager {
+class RequirementsManager {
   constructor() {
     this.filterOwner = '';
     this.filterService = '';
@@ -12,6 +12,17 @@
     this.render();
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
     const el = (id) => document.getElementById(id);
     if (!el('req-filter-owner')) return;
@@ -41,6 +52,58 @@
       e.preventDefault();
       this.saveCandidate();
     });
+
+    // Import Requirements button
+    const importBtn = el('btn-import-reqs');
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
+        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
+        document.getElementById('tab-settings').classList.add('active');
+        document.getElementById('page-title').textContent = 'Settings';
+        const sel = document.getElementById('import-collection');
+        if (sel) sel.value = 'requirements';
+        if (window.settingsManager) window.settingsManager.render();
+      });
+    }
+
+    // Req table delegation
+    const reqTbody = el('req-table-body');
+    if (reqTbody) {
+      reqTbody.addEventListener('click', (e) => {
+        const btn = e.target.closest('.req-action');
+        if (!btn) return;
+        const action = btn.getAttribute('data-action');
+        const reqId = btn.getAttribute('data-id');
+        if (action === 'view') this.openRequirementModal(reqId);
+        else if (action === 'proposal') this.openRequirementModal(reqId, 'proposal');
+        else if (action === 'po') this.openRequirementModal(reqId, 'po');
+        else if (action === 'lost') this.markLostById(reqId);
+        else if (action === 'hold') this.markOnHoldById(reqId);
+      });
+    }
+
+    // Sourcing table delegation
+    const sourcingTbody = el('sourcing-table-body');
+    if (sourcingTbody) {
+      sourcingTbody.addEventListener('click', (e) => {
+        const btn = e.target.closest('.cand-action');
+        if (!btn) return;
+        const action = btn.getAttribute('data-action');
+        const candId = btn.getAttribute('data-id');
+        if (action === 'edit') this.openCandidateModal(candId);
+        else if (action === 'shortlist') this.quickCandidateAction(candId, 'Shortlisted');
+        else if (action === 'share') this.shareCandidateProfile(candId);
+        else if (action === 'select') this.quickCandidateAction(candId, 'Selected');
+      });
+    }
   }
 
   calculateSLA(createdDateStr, sharedDateStr) {
@@ -76,9 +139,17 @@
     if (!tbody) return;
 
     const user = auth.getCurrentUser();
+    if (!user) return;
     let reqs = db.getRecords('requirements', user);
     const allCandidates = db.getRecords('sourcingCandidates', user);
 
+    // Import button visibility
+    const importBtn = document.getElementById('btn-import-reqs');
+    if (importBtn) {
+      if (user.role === 'employee') importBtn.classList.add('hidden');
+      else importBtn.classList.remove('hidden');
+    }
+
     tbody.innerHTML = '';
 
     reqs.forEach(req => {
@@ -95,23 +166,30 @@
       if (this.filterStage && req.pipeline_stage !== this.filterStage) return;
 
       const tr = document.createElement('tr');
+      const eid = this.escapeHTML(req.id);
       tr.innerHTML = `
-        <td><strong>${req.title || 'Untitled'}</strong><br><small>${req.id}</small></td>
-        <td>${req.company_name || req.client_id || '-'}</td>
-        <td>${req.service_interest || '-'}</td>
-        <td>${req.proposal_status || 'Not Started'}</td>
-        <td>${req.po_status || 'Not Required'}</td>
-        <td><span class="badge" style="background: var(--muted);">${reqSLA}</span></td>
-        <td>${req.pipeline_stage || 'Requirement Gathering'}</td>
+        <td><strong>${this.escapeHTML(req.title)}</strong><br><small>${eid}</small></td>
+        <td>${this.escapeHTML(req.company_name || req.client_id)}</td>
+        <td>${this.escapeHTML(req.service_interest)}</td>
+        <td>${this.escapeHTML(req.proposal_status || 'Not Started')}</td>
+        <td>${this.escapeHTML(req.po_status || 'Not Required')}</td>
+        <td><span class="badge" style="background: var(--muted);">${this.escapeHTML(reqSLA)}</span></td>
+        <td>${this.escapeHTML(req.pipeline_stage || 'Requirement Gathering')}</td>
         <td>
-          <button class="btn btn-secondary" onclick="window.requirementsManager.openRequirementModal('${req.id}')">View</button>
+          <div style="display: flex; gap: 4px; flex-wrap: wrap;">
+            <button class="btn btn-secondary req-action" data-action="view" data-id="${eid}" style="padding: 2px 6px; font-size: 11px;">View</button>
+            <button class="btn btn-secondary req-action" data-action="proposal" data-id="${eid}" style="padding: 2px 6px; font-size: 11px;">Proposal</button>
+            <button class="btn btn-secondary req-action" data-action="po" data-id="${eid}" style="padding: 2px 6px; font-size: 11px;">PO</button>
+            <button class="btn btn-secondary req-action" data-action="lost" data-id="${eid}" style="padding: 2px 6px; font-size: 11px;">Lost</button>
+            <button class="btn btn-secondary req-action" data-action="hold" data-id="${eid}" style="padding: 2px 6px; font-size: 11px;">Hold</button>
+          </div>
         </td>
       `;
       tbody.appendChild(tr);
     });
   }
 
-  openRequirementModal(reqId = null) {
+  openRequirementModal(reqId = null, focusSection = null) {
     const user = auth.getCurrentUser();
     const modalTitle = document.getElementById('modal-req-title');
     const form = document.getElementById('form-req');
@@ -132,6 +210,12 @@
         // Intake
         el('req-title').value = req.title || '';
         el('req-client-id').value = req.client_id || '';
+        el('req-contact-id').value = req.contact_id || '';
+        el('req-company').value = req.company_name || '';
+        el('req-contact-person').value = req.contact_person || '';
+        el('req-designation').value = req.designation || '';
+        el('req-phone').value = req.phone || '';
+        el('req-email').value = req.email || '';
         el('req-service').value = req.service_interest || '';
         el('req-tech').value = req.technology || '';
         el('req-audience').value = req.audience || '';
@@ -160,9 +244,19 @@
         el('req-po-att').value = req.po_attachment || '';
         el('req-comm-remarks').value = req.commercial_remarks || '';
 
+        // Attachments
+        el('req-doc-ref').value = req.requirement_document_ref || '';
+        el('req-email-ref').value = req.email_ref || '';
+        el('req-prop-att-ref').value = req.proposal_attachment_ref || '';
+
+        // Confirmation
+        el('req-confirm-type').value = req.confirmation_type || 'None';
+        el('req-confirm-date').value = req.confirmation_date || '';
+        el('req-confirm-remarks').value = req.confirmation_remarks || '';
+
         this.renderCandidates(reqId);
 
-        if (req.status !== 'Converted') {
+        if (req.status !== 'Converted' && !req.converted_deal_id) {
           el('btn-convert-deal').style.display = 'inline-block';
         }
       }
@@ -172,6 +266,13 @@
     }
 
     el('modal-req').classList.remove('hidden');
+
+    // Focus on section if requested
+    if (focusSection === 'proposal') {
+      setTimeout(() => { el('req-prop-status').focus(); el('req-prop-status').scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 200);
+    } else if (focusSection === 'po') {
+      setTimeout(() => { el('req-po-att').focus(); el('req-po-att').scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 200);
+    }
   }
 
   saveRequirement() {
@@ -182,6 +283,12 @@
     const reqData = {
       title: el('req-title').value,
       client_id: el('req-client-id').value,
+      contact_id: el('req-contact-id').value,
+      company_name: el('req-company').value,
+      contact_person: el('req-contact-person').value,
+      designation: el('req-designation').value,
+      phone: el('req-phone').value,
+      email: el('req-email').value,
       service_interest: el('req-service').value,
       technology: el('req-tech').value,
       audience: el('req-audience').value,
@@ -207,7 +314,15 @@
       po_amount: el('req-po-amt').value,
       po_received_date: el('req-po-date').value,
       po_attachment: el('req-po-att').value,
-      commercial_remarks: el('req-comm-remarks').value
+      commercial_remarks: el('req-comm-remarks').value,
+
+      requirement_document_ref: el('req-doc-ref').value,
+      email_ref: el('req-email-ref').value,
+      proposal_attachment_ref: el('req-prop-att-ref').value,
+
+      confirmation_type: el('req-confirm-type').value,
+      confirmation_date: el('req-confirm-date').value,
+      confirmation_remarks: el('req-confirm-remarks').value
     };
 
     let isProposalUpdated = false;
@@ -216,6 +331,9 @@
     if (reqId) {
       const oldReq = db.getRecords('requirements', user).find(r => r.id === reqId);
       if (oldReq) {
+        if (user.role === 'employee' && oldReq.owner_id !== reqData.owner_id) {
+          reqData.owner_id = oldReq.owner_id; // prevent employee reassignment
+        }
         if (oldReq.proposal_status !== reqData.proposal_status || oldReq.proposal_amount !== reqData.proposal_amount || oldReq.proposal_version !== reqData.proposal_version) isProposalUpdated = true;
         if (oldReq.po_status !== reqData.po_status || oldReq.po_amount !== reqData.po_amount || oldReq.po_number !== reqData.po_number || oldReq.po_received_date !== reqData.po_received_date) isPOUpdated = true;
       }
@@ -245,8 +363,19 @@
 
     if (!req) return;
 
-    if (req.po_status !== 'Received' && req.approval_status !== 'Approved') {
-      return alert('Cannot convert to Deal: Proposal Approval or PO Received is required.');
+    // Duplicate conversion guard
+    if (req.status === 'Converted' || req.converted_deal_id) {
+      return alert('This requirement has already been converted to a Deal.');
+    }
+
+    // Check confirmation eligibility
+    const confirmAllowed = ['Verbal Approval', 'Email Approval', 'Internal Approval'];
+    const canConvert = req.po_status === 'Received' ||
+                       req.approval_status === 'Approved' ||
+                       confirmAllowed.includes(req.confirmation_type);
+
+    if (!canConvert) {
+      return alert('Cannot convert to Deal: PO Received, Proposal Approval, or explicit Confirmation is required.');
     }
 
     if (!confirm('Convert this requirement to a Deal?')) return;
@@ -310,6 +439,57 @@
     if (window.pipelineManager) window.pipelineManager.render();
   }
 
+  // SOP quick actions
+  focusProposal() {
+    const propStatus = document.getElementById('req-prop-status');
+    if (propStatus) {
+      propStatus.focus();
+      propStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
+    }
+  }
+
+  focusPO() {
+    const poAtt = document.getElementById('req-po-att');
+    if (poAtt) {
+      poAtt.focus();
+      poAtt.scrollIntoView({ behavior: 'smooth', block: 'center' });
+    }
+  }
+
+  markLost() {
+    const reqId = document.getElementById('req-id').value;
+    if (!reqId) return alert('Save the requirement first.');
+    this.markLostById(reqId);
+  }
+
+  markOnHold() {
+    const reqId = document.getElementById('req-id').value;
+    if (!reqId) return alert('Save the requirement first.');
+    this.markOnHoldById(reqId);
+  }
+
+  markLostById(reqId) {
+    if (!confirm('Mark this requirement as Lost?')) return;
+    const user = auth.getCurrentUser();
+    db.updateRecord('requirements', reqId, { status: 'Lost', pipeline_stage: 'Lost' }, user);
+    db.logAudit('status_change', `Requirement ${reqId} marked as Lost`, user);
+    db.logActivity('status_change', 'Requirement marked as Lost', 'requirements', reqId, user);
+    document.getElementById('modal-req').classList.add('hidden');
+    this.render();
+    if (window.pipelineManager) window.pipelineManager.render();
+  }
+
+  markOnHoldById(reqId) {
+    if (!confirm('Mark this requirement as On Hold?')) return;
+    const user = auth.getCurrentUser();
+    db.updateRecord('requirements', reqId, { status: 'On Hold', pipeline_stage: 'Dormant' }, user);
+    db.logAudit('status_change', `Requirement ${reqId} marked as On Hold`, user);
+    db.logActivity('status_change', 'Requirement marked as On Hold', 'requirements', reqId, user);
+    document.getElementById('modal-req').classList.add('hidden');
+    this.render();
+    if (window.pipelineManager) window.pipelineManager.render();
+  }
+
   renderCandidates(reqId) {
     const user = auth.getCurrentUser();
     const cands = db.getRecords('sourcingCandidates', user).filter(c => c.requirement_id === reqId);
@@ -321,26 +501,73 @@
     cands.forEach(cand => {
       // Show saved SLA if it exists, otherwise calculate live
       const sla = cand.sla_status || this.calculateSLA(req.created_at, cand.shared_date || null);
+      const eid = this.escapeHTML(cand.id);
 
       const tr = document.createElement('tr');
       tr.innerHTML = `
-        <td>${cand.candidate_name || '-'}</td>
-        <td>${cand.candidate_type || '-'}</td>
-        <td>${cand.skill_match || '-'}</td>
-        <td>${cand.commercial_rate || '-'}</td>
-        <td>${cand.evaluation_status || 'Pending'}</td>
-        <td>${cand.profile_shared || 'No'}</td>
-        <td>${cand.client_feedback || 'Pending'}</td>
-        <td><span class="badge" style="background: var(--muted);">${sla}</span></td>
+        <td>${this.escapeHTML(cand.candidate_name)}</td>
+        <td>${this.escapeHTML(cand.candidate_type)}</td>
+        <td>${this.escapeHTML(cand.skill_match)}</td>
+        <td>${this.escapeHTML(cand.commercial_rate)}</td>
+        <td>${this.escapeHTML(cand.evaluation_status || 'Pending')}</td>
+        <td>${this.escapeHTML(cand.profile_shared || 'No')}</td>
+        <td>${this.escapeHTML(cand.client_feedback || 'Pending')}</td>
+        <td><span class="badge" style="background: var(--muted);">${this.escapeHTML(sla)}</span></td>
         <td>
-          <button class="btn btn-secondary" style="padding: 2px 6px; font-size: 12px;" type="button" onclick="window.requirementsManager.openCandidateModal('${cand.id}')">Edit</button>
+          <div style="display: flex; gap: 4px; flex-wrap: wrap;">
+            <button class="btn btn-secondary cand-action" data-action="edit" data-id="${eid}" type="button" style="padding: 2px 6px; font-size: 11px;">Edit</button>
+            <button class="btn btn-secondary cand-action" data-action="shortlist" data-id="${eid}" type="button" style="padding: 2px 6px; font-size: 11px;">Shortlist</button>
+            <button class="btn btn-secondary cand-action" data-action="share" data-id="${eid}" type="button" style="padding: 2px 6px; font-size: 11px;">Share</button>
+            <button class="btn btn-secondary cand-action" data-action="select" data-id="${eid}" type="button" style="padding: 2px 6px; font-size: 11px;">Select</button>
+          </div>
         </td>
       `;
       tbody.appendChild(tr);
     });
   }
 
-  openCandidateModal(candId = null) {
+  quickCandidateAction(candId, newStatus) {
+    const user = auth.getCurrentUser();
+    const reqId = document.getElementById('req-id').value;
+    const cand = db.getRecords('sourcingCandidates', user).find(c => c.id === candId);
+    if (!cand) return;
+
+    const oldStatus = cand.evaluation_status;
+    db.updateRecord('sourcingCandidates', candId, { evaluation_status: newStatus }, user);
+
+    if (newStatus === 'Selected' && oldStatus !== 'Selected') {
+      db.logAudit('candidate_selected', `Candidate ${cand.candidate_name} selected for req ${reqId}`, user);
+      db.logActivity('candidate_selected', `Candidate selected`, 'requirements', reqId, user);
+    } else if (newStatus === 'Shortlisted' && oldStatus !== 'Shortlisted') {
+      db.logAudit('candidate_shortlisted', `Candidate ${cand.candidate_name} shortlisted for req ${reqId}`, user);
+      db.logActivity('candidate_shortlisted', `Candidate shortlisted`, 'requirements', reqId, user);
+    }
+
+    if (reqId) this.renderCandidates(reqId);
+  }
+
+  shareCandidateProfile(candId) {
+    const user = auth.getCurrentUser();
+    const reqId = document.getElementById('req-id').value;
+    const cand = db.getRecords('sourcingCandidates', user).find(c => c.id === candId);
+    if (!cand) return;
+
+    const updates = { profile_shared: 'Yes' };
+    if (!cand.shared_date) {
+      updates.shared_date = new Date().toISOString().split('T')[0];
+    }
+
+    db.updateRecord('sourcingCandidates', candId, updates, user);
+
+    if (cand.profile_shared !== 'Yes') {
+      db.logAudit('profile_shared', `Profile ${cand.candidate_name} shared for req ${reqId}`, user);
+      db.logActivity('profile_shared', `Candidate profile shared`, 'requirements', reqId, user);
+    }
+
+    if (reqId) this.renderCandidates(reqId);
+  }
+
+  openCandidateModal(candId = null, defaultType = null) {
     const reqId = document.getElementById('req-id').value;
     if (!reqId) return alert('Please save the requirement first before adding candidates.');
 
@@ -386,6 +613,9 @@
       }
     } else {
       modalTitle.textContent = 'Add Candidate';
+      if (defaultType) {
+        el('cand-type').value = defaultType;
+      }
     }
 
     el('modal-candidate').classList.remove('hidden');
diff --git a/js/schema.js b/js/schema.js
index 2ff81e9..4850416 100644
--- a/js/schema.js
+++ b/js/schema.js
@@ -33,12 +33,15 @@ window.crmSchema = {
   requirements: {
     fields: [
       'title', 'description', 'client_id', 'contact_id', 'lead_id', 'company_name', 'contact_person',
+      'designation', 'phone', 'email',
       'budget', 'priority', 'status', 'pipeline_stage', 'converted_deal_id',
       'service_interest', 'technology', 'audience', 'duration', 'mode', 'location',
       'preferred_dates', 'trainer_type', 'lab_needs', 'recording_needs',
       'proposal_status', 'po_status', 'proposal_number', 'proposal_date',
       'proposal_amount', 'proposal_version', 'approval_status', 'po_number',
-      'po_amount', 'po_received_date', 'po_attachment', 'commercial_remarks', 'owner_id'
+      'po_amount', 'po_received_date', 'po_attachment', 'commercial_remarks', 'owner_id',
+      'requirement_document_ref', 'email_ref', 'proposal_attachment_ref',
+      'confirmation_type', 'confirmation_date', 'confirmation_remarks'
     ],
     duplicateKeys: []
   },
```

## Tests Run
```text
git diff --check; node --check js/requirements.js; node --check js/db.js; node --check js/app.js; node --check js/schema.js; node --check js/pipeline.js; node --check js/deals.js; node --check js/leads.js; node --check js/dashboard.js; node --check js/database.js; node --check js/reports.js; node --check js/settings.js; node --check js/import.js
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
