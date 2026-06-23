# AI Change Audit Report

## Generated On
2026-06-23_14-20-11

## Branch
main

## Baseline Commit
6020760

## Task Summary
Phase 5: Build Requirements and Sourcing workspace

## Git Status
```text
 M index.html
 M js/app.js
 M js/db.js
 M js/pipeline.js
 A js/requirements.js
 M js/schema.js
```

## Files Changed
```text
M	index.html
M	js/app.js
M	js/db.js
M	js/pipeline.js
A	js/requirements.js
M	js/schema.js
```

## Change Summary
```text
 index.html         | 306 +++++++++++++++++++++++++++++++++-
 js/app.js          |   4 +
 js/db.js           |   2 +-
 js/pipeline.js     |   8 +-
 js/requirements.js | 476 +++++++++++++++++++++++++++++++++++++++++++++++++++++
 js/schema.js       |  22 ++-
 6 files changed, 807 insertions(+), 11 deletions(-)
```

## Full Diff
```diff
diff --git a/index.html b/index.html
index 7cbfb2a..8ec056b 100644
--- a/index.html
+++ b/index.html
@@ -207,9 +207,83 @@
       </div>
 
       <div id="tab-sourcing" class="tab-pane">
+        <div class="card" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
+          <div>
+            <h3>Requirements & Sourcing</h3>
+            <p>Fulfill client needs.</p>
+          </div>
+          <button class="btn btn-primary" onclick="window.requirementsManager.openRequirementModal()">+ Add Requirement</button>
+        </div>
+
         <div class="card">
-          <h3>Requirements & Sourcing</h3>
-          <p>Fulfill client needs.</p>
+          <div class="filter-bar" id="req-filter-bar">
+            <input type="text" id="req-filter-owner" placeholder="Filter by Owner ID" style="width: 150px;">
+            <select id="req-filter-service">
+              <option value="">All Services</option>
+              <option value="Corporate Training">Corporate Training</option>
+              <option value="Video Content Development">Video Content Development</option>
+              <option value="Automation Consulting">Automation Consulting</option>
+            </select>
+            <select id="req-filter-priority">
+              <option value="">All Priorities</option>
+              <option value="High">High</option>
+              <option value="Medium">Medium</option>
+              <option value="Low">Low</option>
+            </select>
+            <select id="req-filter-proposal">
+              <option value="">All Proposal Status</option>
+              <option value="Not Started">Not Started</option>
+              <option value="Draft">Draft</option>
+              <option value="Shared">Shared</option>
+              <option value="Revised">Revised</option>
+              <option value="Approved">Approved</option>
+            </select>
+            <select id="req-filter-po">
+              <option value="">All PO Status</option>
+              <option value="Not Required">Not Required</option>
+              <option value="Pending">Pending</option>
+              <option value="Received">Received</option>
+              <option value="Rejected">Rejected</option>
+            </select>
+            <select id="req-filter-sla">
+              <option value="">All SLA Status</option>
+              <option value="Same Day">Same Day</option>
+              <option value="24h">24h</option>
+              <option value="36h">36h</option>
+              <option value="48h">48h</option>
+              <option value="Breached">Breached</option>
+            </select>
+            <select id="req-filter-stage">
+              <option value="">All Stages</option>
+              <option value="Requirement Gathering">Requirement Gathering</option>
+              <option value="Proposal Shared">Proposal Shared</option>
+              <option value="PO Pending">PO Pending</option>
+              <option value="Sourcing">Sourcing</option>
+              <option value="Converted">Converted</option>
+              <option value="Dormant">Dormant</option>
+              <option value="Lost">Lost</option>
+            </select>
+          </div>
+
+          <div class="table-container">
+            <table class="data-table">
+              <thead>
+                <tr>
+                  <th>Req Title</th>
+                  <th>Client</th>
+                  <th>Service</th>
+                  <th>Proposal</th>
+                  <th>PO</th>
+                  <th>SLA</th>
+                  <th>Stage</th>
+                  <th>Actions</th>
+                </tr>
+              </thead>
+              <tbody id="req-table-body">
+                <!-- Requirements injected here -->
+              </tbody>
+            </table>
+          </div>
         </div>
       </div>
 
@@ -421,12 +495,240 @@
     </div>
   </div>
 
+  <!-- Requirement Detail Modal -->
+  <div id="modal-req" class="modal-overlay hidden">
+    <div class="modal" style="width: 900px; max-width: 95vw; max-height: 90vh; overflow-y: auto;">
+      <div class="modal-header">
+        <h3 id="modal-req-title">Requirement Details</h3>
+        <button class="btn btn-secondary" id="btn-close-req-modal">Close</button>
+      </div>
+      <form id="form-req">
+        <input type="hidden" id="req-id">
+        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
+          <!-- Intake Fields -->
+          <div class="card" style="padding: 12px;">
+            <h4>1. Intake Details</h4>
+            <div class="form-group"><label>Title</label><input type="text" id="req-title" class="form-control" required></div>
+            <div class="form-group"><label>Client ID</label><input type="text" id="req-client-id" class="form-control"></div>
+            <div class="form-group"><label>Service Type</label>
+              <select id="req-service" class="form-control">
+                <option value="">None</option>
+                <option value="Corporate Training">Corporate Training</option>
+                <option value="Video Content Development">Video Content Development</option>
+                <option value="Automation Consulting">Automation Consulting</option>
+              </select>
+            </div>
+            <div class="form-group"><label>Technology/Topic</label><input type="text" id="req-tech" class="form-control"></div>
+            <div class="form-group"><label>Audience</label><input type="text" id="req-audience" class="form-control"></div>
+            <div class="form-group"><label>Duration</label><input type="text" id="req-duration" class="form-control"></div>
+            <div class="form-group"><label>Mode</label>
+              <select id="req-mode" class="form-control">
+                <option value="Online">Online</option>
+                <option value="Offline">Offline</option>
+                <option value="Hybrid">Hybrid</option>
+              </select>
+            </div>
+            <div class="form-group"><label>Location</label><input type="text" id="req-location" class="form-control"></div>
+            <div class="form-group"><label>Preferred Dates</label><input type="text" id="req-dates" class="form-control"></div>
+            <div class="form-group"><label>Budget</label><input type="number" id="req-budget" class="form-control"></div>
+            <div class="form-group"><label>Trainer Type</label>
+              <select id="req-trainer-type" class="form-control">
+                <option value="Freelancer">Freelancer</option>
+                <option value="Vendor Trainer">Vendor Trainer</option>
+                <option value="Internal Trainer">Internal Trainer</option>
+              </select>
+            </div>
+            <div class="form-group"><label>Lab Needs</label><input type="text" id="req-lab" class="form-control"></div>
+            <div class="form-group"><label>Recording Needs</label><input type="text" id="req-recording" class="form-control"></div>
+            <div class="form-group"><label>Priority</label>
+              <select id="req-priority" class="form-control">
+                <option value="Low">Low</option>
+                <option value="Medium">Medium</option>
+                <option value="High">High</option>
+              </select>
+            </div>
+            <div class="form-group"><label>Owner ID</label><input type="text" id="req-owner" class="form-control"></div>
+          </div>
+          <!-- Proposal / PO Fields -->
+          <div class="card" style="padding: 12px;">
+            <h4>2. Proposal & PO</h4>
+            <div class="form-group"><label>Proposal Status</label>
+              <select id="req-prop-status" class="form-control">
+                <option value="Not Started">Not Started</option>
+                <option value="Draft">Draft</option>
+                <option value="Shared">Shared</option>
+                <option value="Revised">Revised</option>
+                <option value="Approved">Approved</option>
+              </select>
+            </div>
+            <div class="form-group"><label>Proposal Number</label><input type="text" id="req-prop-num" class="form-control"></div>
+            <div class="form-group"><label>Proposal Date</label><input type="date" id="req-prop-date" class="form-control"></div>
+            <div class="form-group"><label>Proposal Amount</label><input type="number" id="req-prop-amt" class="form-control"></div>
+            <div class="form-group"><label>Proposal Version</label><input type="text" id="req-prop-ver" class="form-control"></div>
+            <div class="form-group"><label>Approval Status</label>
+              <select id="req-prop-appr" class="form-control">
+                <option value="Pending">Pending</option>
+                <option value="Approved">Approved</option>
+                <option value="Rejected">Rejected</option>
+              </select>
+            </div>
+            <hr style="margin: 10px 0;">
+            <div class="form-group"><label>PO Status</label>
+              <select id="req-po-status" class="form-control">
+                <option value="Not Required">Not Required</option>
+                <option value="Pending">Pending</option>
+                <option value="Received">Received</option>
+                <option value="Rejected">Rejected</option>
+              </select>
+            </div>
+            <div class="form-group"><label>PO Number</label><input type="text" id="req-po-num" class="form-control"></div>
+            <div class="form-group"><label>PO Amount</label><input type="number" id="req-po-amt" class="form-control"></div>
+            <div class="form-group"><label>PO Received Date</label><input type="date" id="req-po-date" class="form-control"></div>
+            <div class="form-group"><label>PO Attachment Ref</label><input type="text" id="req-po-att" class="form-control"></div>
+            <div class="form-group"><label>Commercial Remarks</label><textarea id="req-comm-remarks" class="form-control" rows="2"></textarea></div>
+          </div>
+        </div>
+
+        <div class="card" style="margin-top: 16px;" id="sourcing-tracker-section">
+          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
+            <h4>3. Sourcing Tracker</h4>
+            <button type="button" class="btn btn-secondary" onclick="window.requirementsManager.openCandidateModal()">+ Add Candidate</button>
+          </div>
+          <div class="table-container">
+            <table class="data-table">
+              <thead>
+                <tr>
+                  <th>Name</th>
+                  <th>Type</th>
+                  <th>Match</th>
+                  <th>Rate</th>
+                  <th>Status</th>
+                  <th>Shared</th>
+                  <th>Feedback</th>
+                  <th>SLA</th>
+                  <th>Actions</th>
+                </tr>
+              </thead>
+              <tbody id="sourcing-table-body">
+                <!-- Sourcing Candidates injected here -->
+              </tbody>
+            </table>
+          </div>
+        </div>
+
+        <div style="margin-top: 16px; display: flex; gap: 10px;">
+          <button type="submit" class="btn btn-primary">Save Requirement</button>
+          <button type="button" class="btn btn-secondary" id="btn-convert-deal" onclick="window.requirementsManager.convertToDeal()">Convert to Deal</button>
+        </div>
+      </form>
+    </div>
+  </div>
+
+  <!-- Sourcing Candidate Modal -->
+  <div id="modal-candidate" class="modal-overlay hidden">
+    <div class="modal" style="width: 700px; max-width: 95vw;">
+      <div class="modal-header">
+        <h3 id="modal-candidate-title">Add/Edit Candidate</h3>
+        <button class="btn btn-secondary" id="btn-close-candidate-modal">Close</button>
+      </div>
+      <form id="form-candidate">
+        <input type="hidden" id="cand-id">
+        <input type="hidden" id="cand-trainer-id">
+        <input type="hidden" id="cand-vendor-id">
+        <div style="margin-bottom: 15px; display:flex; gap: 10px;">
+          <button type="button" class="btn btn-secondary" onclick="window.requirementsManager.selectExistingTrainer()">Select Existing Trainer</button>
+          <button type="button" class="btn btn-secondary" onclick="window.requirementsManager.selectExistingVendor()">Select Existing Vendor</button>
+        </div>
+
+        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
+          <div class="form-group"><label>Candidate Name</label><input type="text" id="cand-name" class="form-control" required></div>
+          <div class="form-group"><label>Candidate Type</label>
+            <select id="cand-type" class="form-control">
+              <option value="Trainer">Trainer</option>
+              <option value="Vendor">Vendor</option>
+            </select>
+          </div>
+          <div class="form-group"><label>Source</label>
+            <select id="cand-source" class="form-control">
+              <option value="Existing Database">Existing Database</option>
+              <option value="Vendor">Vendor</option>
+              <option value="LinkedIn">LinkedIn</option>
+              <option value="Referral">Referral</option>
+            </select>
+          </div>
+          <div class="form-group"><label>Skill Match</label>
+            <select id="cand-match" class="form-control">
+              <option value="High">High</option>
+              <option value="Medium">Medium</option>
+              <option value="Low">Low</option>
+            </select>
+          </div>
+          <div class="form-group"><label>Experience</label><input type="text" id="cand-exp" class="form-control"></div>
+          <div class="form-group"><label>Commercial Rate</label><input type="number" id="cand-rate" class="form-control"></div>
+          <div class="form-group"><label>Availability</label>
+            <select id="cand-avail" class="form-control">
+              <option value="Available">Available</option>
+              <option value="Tentative">Tentative</option>
+              <option value="Not Available">Not Available</option>
+            </select>
+          </div>
+          <div class="form-group"><label>Location Fit</label>
+            <select id="cand-loc" class="form-control">
+              <option value="Same City">Same City</option>
+              <option value="Travel Needed">Travel Needed</option>
+              <option value="Remote Only">Remote Only</option>
+            </select>
+          </div>
+          <div class="form-group"><label>Evaluation Status</label>
+            <select id="cand-eval" class="form-control">
+              <option value="Pending">Pending</option>
+              <option value="Shortlisted">Shortlisted</option>
+              <option value="Rejected">Rejected</option>
+              <option value="Selected">Selected</option>
+            </select>
+          </div>
+          <div class="form-group"><label>Profile Shared</label>
+            <select id="cand-shared" class="form-control">
+              <option value="No">No</option>
+              <option value="Yes">Yes</option>
+            </select>
+          </div>
+          <div class="form-group"><label>Shared Date</label><input type="date" id="cand-shared-date" class="form-control"></div>
+          <div class="form-group"><label>Client Feedback</label>
+            <select id="cand-feedback" class="form-control">
+              <option value="Pending">Pending</option>
+              <option value="Accepted">Accepted</option>
+              <option value="Rejected">Rejected</option>
+              <option value="Hold">Hold</option>
+            </select>
+          </div>
+        </div>
+
+        <div class="card" style="margin-top: 16px; padding: 12px;">
+          <h4>Trainer Evaluation</h4>
+          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
+            <div class="form-group"><label>Communication</label><input type="text" id="eval-comm" class="form-control"></div>
+            <div class="form-group"><label>Subject Expertise</label><input type="text" id="eval-subj" class="form-control"></div>
+            <div class="form-group"><label>Past Experience</label><input type="text" id="eval-past" class="form-control"></div>
+            <div class="form-group"><label>Methodology</label><input type="text" id="eval-meth" class="form-control"></div>
+            <div class="form-group"><label>Commercial Fit</label><input type="text" id="eval-comm-fit" class="form-control"></div>
+            <div class="form-group"><label>Flexibility</label><input type="text" id="eval-flex" class="form-control"></div>
+          </div>
+          <div class="form-group" style="margin-top: 10px;"><label>Past Feedback</label><textarea id="eval-past-fb" class="form-control" rows="2"></textarea></div>
+        </div>
+
+        <button type="submit" class="btn btn-primary" style="margin-top: 16px;">Save Candidate</button>
+      </form>
+    </div>
+  </div>
+
   <script src="js/schema.js"></script>
   <script src="js/db.js"></script>
   <script src="js/import.js"></script>
   <script src="js/auth.js"></script>
   <script src="js/leads.js"></script>
   <script src="js/pipeline.js"></script>
+  <script src="js/requirements.js"></script>
   <script src="js/app.js"></script>
 </body>
 </html>
diff --git a/js/app.js b/js/app.js
index 57ad8fd..b75f3dd 100644
--- a/js/app.js
+++ b/js/app.js
@@ -41,6 +41,7 @@
       renderAudits();
       if (window.leadsManager) window.leadsManager.render();
       if (window.pipelineManager) window.pipelineManager.render();
+      if (window.requirementsManager) window.requirementsManager.render();
     } else {
       loginView.classList.remove('hidden');
       appView.classList.add('hidden');
@@ -99,6 +100,9 @@
       if (tabName === 'pipeline' && window.pipelineManager) {
         window.pipelineManager.render();
       }
+      if (tabName === 'sourcing' && window.requirementsManager) {
+        window.requirementsManager.render();
+      }
     });
   });
 
diff --git a/js/db.js b/js/db.js
index 423cc04..374e3f5 100644
--- a/js/db.js
+++ b/js/db.js
@@ -167,7 +167,7 @@
   }
 
   logAudit(action, details, user, team_id = 'none') {
-    const allowedActions = ['login', 'logout', 'create', 'update', 'delete', 'assign', 'approve', 'import', 'export', 'stage_change'];
+    const allowedActions = ['login', 'logout', 'create', 'update', 'delete', 'assign', 'approve', 'import', 'export', 'stage_change', 'profile_shared', 'candidate_selected', 'proposal_update', 'po_update', 'convert_to_deal'];
     if (!allowedActions.includes(action)) return;
 
     const audits = JSON.parse(localStorage.getItem('crm_auditLogs') || '[]');
diff --git a/js/pipeline.js b/js/pipeline.js
index 8094db2..b5631dd 100644
--- a/js/pipeline.js
+++ b/js/pipeline.js
@@ -1,4 +1,4 @@
-class PipelineManager {
+∩╗┐class PipelineManager {
   constructor() {
     this.board = document.getElementById('pipeline-board');
     this.stages = [
@@ -71,7 +71,7 @@ class PipelineManager {
       }
       return { ...l, type: 'lead' };
     });
-    
+
     const reqs = db.getRecords('requirements', user).map(r => {
       if (!r.pipeline_stage) {
         r.pipeline_stage = reqMap[r.status] || 'Requirement Gathering';
@@ -79,7 +79,7 @@ class PipelineManager {
       }
       return { ...r, type: 'requirement' };
     });
-    
+
     const deals = db.getRecords('deals', user).map(d => {
       if (!d.pipeline_stage) {
         d.pipeline_stage = dealMap[d.stage] || 'Proposal Shared';
@@ -231,7 +231,7 @@ class PipelineManager {
     const data = { pipeline_stage: newStage };
     const allRecords = db.getRecords(collection, user);
     const existing = allRecords.find(r => r.id === cardId);
-    
+
     // Mapping for fallback
     const leadMap = {
       'New': 'Prospecting', 'Contacted': 'Outreach', 'Interested': 'Follow-up',
diff --git a/js/requirements.js b/js/requirements.js
new file mode 100644
index 0000000..b2e4fe9
--- /dev/null
+++ b/js/requirements.js
@@ -0,0 +1,476 @@
+∩╗┐class RequirementsManager {
+  constructor() {
+    this.filterOwner = '';
+    this.filterService = '';
+    this.filterPriority = '';
+    this.filterProposal = '';
+    this.filterPO = '';
+    this.filterSLA = '';
+    this.filterStage = '';
+
+    this.bindEvents();
+    this.render();
+  }
+
+  bindEvents() {
+    const el = (id) => document.getElementById(id);
+    if (!el('req-filter-owner')) return;
+
+    el('req-filter-owner').addEventListener('input', e => { this.filterOwner = e.target.value.toLowerCase(); this.render(); });
+    el('req-filter-service').addEventListener('change', e => { this.filterService = e.target.value; this.render(); });
+    el('req-filter-priority').addEventListener('change', e => { this.filterPriority = e.target.value; this.render(); });
+    el('req-filter-proposal').addEventListener('change', e => { this.filterProposal = e.target.value; this.render(); });
+    el('req-filter-po').addEventListener('change', e => { this.filterPO = e.target.value; this.render(); });
+    el('req-filter-sla').addEventListener('change', e => { this.filterSLA = e.target.value; this.render(); });
+    el('req-filter-stage').addEventListener('change', e => { this.filterStage = e.target.value; this.render(); });
+
+    el('btn-close-req-modal').addEventListener('click', () => {
+      el('modal-req').classList.add('hidden');
+    });
+
+    el('form-req').addEventListener('submit', (e) => {
+      e.preventDefault();
+      this.saveRequirement();
+    });
+
+    el('btn-close-candidate-modal').addEventListener('click', () => {
+      el('modal-candidate').classList.add('hidden');
+    });
+
+    el('form-candidate').addEventListener('submit', (e) => {
+      e.preventDefault();
+      this.saveCandidate();
+    });
+  }
+
+  calculateSLA(createdDateStr, sharedDateStr) {
+    if (!createdDateStr) return 'Pending';
+    const created = new Date(createdDateStr);
+    const end = sharedDateStr ? new Date(sharedDateStr) : new Date();
+
+    const diffMs = end - created;
+    const diffHours = diffMs / (1000 * 60 * 60);
+
+    if (diffHours <= 12) return 'Same Day';
+    if (diffHours <= 24) return '24h';
+    if (diffHours <= 36) return '36h';
+    if (diffHours <= 48) return '48h';
+    return 'Breached';
+  }
+
+  getRequirementSLA(req, candidates) {
+    const sharedCands = candidates.filter(c => c.profile_shared === 'Yes' && c.shared_date);
+
+    if (sharedCands.length > 0) {
+      const firstShared = sharedCands.reduce((earliest, c) => {
+        const d = new Date(c.shared_date);
+        return d < earliest ? d : earliest;
+      }, new Date(sharedCands[0].shared_date));
+      return this.calculateSLA(req.created_at, firstShared.toISOString());
+    }
+    return this.calculateSLA(req.created_at, null);
+  }
+
+  render() {
+    const tbody = document.getElementById('req-table-body');
+    if (!tbody) return;
+
+    const user = auth.getCurrentUser();
+    let reqs = db.getRecords('requirements', user);
+    const allCandidates = db.getRecords('sourcingCandidates', user);
+
+    tbody.innerHTML = '';
+
+    reqs.forEach(req => {
+      const cands = allCandidates.filter(c => c.requirement_id === req.id);
+      const reqSLA = this.getRequirementSLA(req, cands);
+
+      // Filters
+      if (this.filterOwner && req.owner_id && !req.owner_id.toLowerCase().includes(this.filterOwner)) return;
+      if (this.filterService && req.service_interest !== this.filterService) return;
+      if (this.filterPriority && req.priority !== this.filterPriority) return;
+      if (this.filterProposal && req.proposal_status !== this.filterProposal) return;
+      if (this.filterPO && req.po_status !== this.filterPO) return;
+      if (this.filterSLA && reqSLA !== this.filterSLA) return;
+      if (this.filterStage && req.pipeline_stage !== this.filterStage) return;
+
+      const tr = document.createElement('tr');
+      tr.innerHTML = `
+        <td><strong>${req.title || 'Untitled'}</strong><br><small>${req.id}</small></td>
+        <td>${req.company_name || req.client_id || '-'}</td>
+        <td>${req.service_interest || '-'}</td>
+        <td>${req.proposal_status || 'Not Started'}</td>
+        <td>${req.po_status || 'Not Required'}</td>
+        <td><span class="badge" style="background: var(--muted);">${reqSLA}</span></td>
+        <td>${req.pipeline_stage || 'Requirement Gathering'}</td>
+        <td>
+          <button class="btn btn-secondary" onclick="window.requirementsManager.openRequirementModal('${req.id}')">View</button>
+        </td>
+      `;
+      tbody.appendChild(tr);
+    });
+  }
+
+  openRequirementModal(reqId = null) {
+    const user = auth.getCurrentUser();
+    const modalTitle = document.getElementById('modal-req-title');
+    const form = document.getElementById('form-req');
+    const el = (id) => document.getElementById(id);
+
+    form.reset();
+    el('req-id').value = '';
+    el('sourcing-table-body').innerHTML = '';
+    el('btn-convert-deal').style.display = 'none';
+
+    if (reqId) {
+      modalTitle.textContent = 'Edit Requirement';
+      const reqs = db.getRecords('requirements', user);
+      const req = reqs.find(r => r.id === reqId);
+
+      if (req) {
+        el('req-id').value = req.id;
+        // Intake
+        el('req-title').value = req.title || '';
+        el('req-client-id').value = req.client_id || '';
+        el('req-service').value = req.service_interest || '';
+        el('req-tech').value = req.technology || '';
+        el('req-audience').value = req.audience || '';
+        el('req-duration').value = req.duration || '';
+        el('req-mode').value = req.mode || 'Online';
+        el('req-location').value = req.location || '';
+        el('req-dates').value = req.preferred_dates || '';
+        el('req-budget').value = req.budget || '';
+        el('req-trainer-type').value = req.trainer_type || 'Freelancer';
+        el('req-lab').value = req.lab_needs || '';
+        el('req-recording').value = req.recording_needs || '';
+        el('req-priority').value = req.priority || 'Medium';
+        el('req-owner').value = req.owner_id || '';
+
+        // Proposal/PO
+        el('req-prop-status').value = req.proposal_status || 'Not Started';
+        el('req-prop-num').value = req.proposal_number || '';
+        el('req-prop-date').value = req.proposal_date || '';
+        el('req-prop-amt').value = req.proposal_amount || '';
+        el('req-prop-ver').value = req.proposal_version || '';
+        el('req-prop-appr').value = req.approval_status || 'Pending';
+        el('req-po-status').value = req.po_status || 'Not Required';
+        el('req-po-num').value = req.po_number || '';
+        el('req-po-amt').value = req.po_amount || '';
+        el('req-po-date').value = req.po_received_date || '';
+        el('req-po-att').value = req.po_attachment || '';
+        el('req-comm-remarks').value = req.commercial_remarks || '';
+
+        this.renderCandidates(reqId);
+
+        if (req.status !== 'Converted') {
+          el('btn-convert-deal').style.display = 'inline-block';
+        }
+      }
+    } else {
+      modalTitle.textContent = 'Add Requirement';
+      el('req-owner').value = user.id;
+    }
+
+    el('modal-req').classList.remove('hidden');
+  }
+
+  saveRequirement() {
+    const user = auth.getCurrentUser();
+    const reqId = document.getElementById('req-id').value;
+    const el = (id) => document.getElementById(id);
+
+    const reqData = {
+      title: el('req-title').value,
+      client_id: el('req-client-id').value,
+      service_interest: el('req-service').value,
+      technology: el('req-tech').value,
+      audience: el('req-audience').value,
+      duration: el('req-duration').value,
+      mode: el('req-mode').value,
+      location: el('req-location').value,
+      preferred_dates: el('req-dates').value,
+      budget: el('req-budget').value,
+      trainer_type: el('req-trainer-type').value,
+      lab_needs: el('req-lab').value,
+      recording_needs: el('req-recording').value,
+      priority: el('req-priority').value,
+      owner_id: el('req-owner').value,
+
+      proposal_status: el('req-prop-status').value,
+      proposal_number: el('req-prop-num').value,
+      proposal_date: el('req-prop-date').value,
+      proposal_amount: el('req-prop-amt').value,
+      proposal_version: el('req-prop-ver').value,
+      approval_status: el('req-prop-appr').value,
+      po_status: el('req-po-status').value,
+      po_number: el('req-po-num').value,
+      po_amount: el('req-po-amt').value,
+      po_received_date: el('req-po-date').value,
+      po_attachment: el('req-po-att').value,
+      commercial_remarks: el('req-comm-remarks').value
+    };
+
+    let isProposalUpdated = false;
+    let isPOUpdated = false;
+
+    if (reqId) {
+      const oldReq = db.getRecords('requirements', user).find(r => r.id === reqId);
+      if (oldReq) {
+        if (oldReq.proposal_status !== reqData.proposal_status || oldReq.proposal_amount !== reqData.proposal_amount || oldReq.proposal_version !== reqData.proposal_version) isProposalUpdated = true;
+        if (oldReq.po_status !== reqData.po_status || oldReq.po_amount !== reqData.po_amount || oldReq.po_number !== reqData.po_number || oldReq.po_received_date !== reqData.po_received_date) isPOUpdated = true;
+      }
+
+      db.updateRecord('requirements', reqId, reqData, user);
+      if (isProposalUpdated) db.logAudit('proposal_update', `Proposal details updated for req ${reqId}`, user);
+      if (isPOUpdated) db.logAudit('po_update', `PO details updated for req ${reqId}`, user);
+      if (window.pipelineManager) window.pipelineManager.render();
+    } else {
+      reqData.status = 'Open';
+      reqData.pipeline_stage = 'Requirement Gathering';
+      db.createRecord('requirements', reqData, user);
+      if (window.pipelineManager) window.pipelineManager.render();
+    }
+
+    document.getElementById('modal-req').classList.add('hidden');
+    this.render();
+  }
+
+  convertToDeal() {
+    const reqId = document.getElementById('req-id').value;
+    if (!reqId) return alert('Please save the requirement first.');
+
+    const user = auth.getCurrentUser();
+    const reqs = db.getRecords('requirements', user);
+    const req = reqs.find(r => r.id === reqId);
+
+    if (!req) return;
+
+    if (req.po_status !== 'Received' && req.approval_status !== 'Approved') {
+      return alert('Cannot convert to Deal: Proposal Approval or PO Received is required.');
+    }
+
+    if (!confirm('Convert this requirement to a Deal?')) return;
+
+    const stage = req.po_status === 'Received' ? 'Converted' : 'Proposal Shared';
+
+    const deal = db.createRecord('deals', {
+      title: req.title,
+      client_id: req.client_id || '',
+      contact_id: req.contact_id || '',
+      amount: req.po_amount || req.proposal_amount || req.budget,
+      stage: stage,
+      pipeline_stage: stage,
+      owner_id: req.owner_id || user.id,
+      requirement_id: req.id,
+      req_id: req.id,
+      service_interest: req.service_interest || '',
+      priority: req.priority || 'Medium',
+      next_follow_up_date: ''
+    }, user);
+
+    db.updateRecord('requirements', reqId, {
+      status: 'Converted',
+      pipeline_stage: 'Converted',
+      converted_deal_id: deal.id
+    }, user);
+
+    db.logAudit('convert_to_deal', `Requirement ${req.id} converted to deal ${deal.id}`, user);
+    db.logActivity('convert_to_deal', `Requirement converted to deal`, 'requirements', req.id, user);
+
+    alert('Successfully converted to Deal!');
+    document.getElementById('modal-req').classList.add('hidden');
+    this.render();
+    if (window.pipelineManager) window.pipelineManager.render();
+  }
+
+  renderCandidates(reqId) {
+    const user = auth.getCurrentUser();
+    const cands = db.getRecords('sourcingCandidates', user).filter(c => c.requirement_id === reqId);
+    const req = db.getRecords('requirements', user).find(r => r.id === reqId);
+
+    const tbody = document.getElementById('sourcing-table-body');
+    tbody.innerHTML = '';
+
+    cands.forEach(cand => {
+      // Show saved SLA if it exists, otherwise calculate live
+      const sla = cand.sla_status || this.calculateSLA(req.created_at, cand.shared_date || null);
+
+      const tr = document.createElement('tr');
+      tr.innerHTML = `
+        <td>${cand.candidate_name || '-'}</td>
+        <td>${cand.candidate_type || '-'}</td>
+        <td>${cand.skill_match || '-'}</td>
+        <td>${cand.commercial_rate || '-'}</td>
+        <td>${cand.evaluation_status || 'Pending'}</td>
+        <td>${cand.profile_shared || 'No'}</td>
+        <td>${cand.client_feedback || 'Pending'}</td>
+        <td><span class="badge" style="background: var(--muted);">${sla}</span></td>
+        <td>
+          <button class="btn btn-secondary" style="padding: 2px 6px; font-size: 12px;" type="button" onclick="window.requirementsManager.openCandidateModal('${cand.id}')">Edit</button>
+        </td>
+      `;
+      tbody.appendChild(tr);
+    });
+  }
+
+  openCandidateModal(candId = null) {
+    const reqId = document.getElementById('req-id').value;
+    if (!reqId) return alert('Please save the requirement first before adding candidates.');
+
+    const user = auth.getCurrentUser();
+    const modalTitle = document.getElementById('modal-candidate-title');
+    const form = document.getElementById('form-candidate');
+    const el = (id) => document.getElementById(id);
+
+    form.reset();
+    el('cand-id').value = '';
+    el('cand-trainer-id').value = '';
+    el('cand-vendor-id').value = '';
+
+    if (candId) {
+      modalTitle.textContent = 'Edit Candidate';
+      const cands = db.getRecords('sourcingCandidates', user);
+      const cand = cands.find(c => c.id === candId);
+
+      if (cand) {
+        el('cand-id').value = cand.id;
+        el('cand-trainer-id').value = cand.linked_trainer_id || '';
+        el('cand-vendor-id').value = cand.linked_vendor_id || '';
+        el('cand-name').value = cand.candidate_name || '';
+        el('cand-type').value = cand.candidate_type || 'Trainer';
+        el('cand-source').value = cand.source || 'Existing Database';
+        el('cand-match').value = cand.skill_match || 'Medium';
+        el('cand-exp').value = cand.experience || '';
+        el('cand-rate').value = cand.commercial_rate || '';
+        el('cand-avail').value = cand.availability || 'Tentative';
+        el('cand-loc').value = cand.location_fit || 'Remote Only';
+        el('cand-eval').value = cand.evaluation_status || 'Pending';
+        el('cand-shared').value = cand.profile_shared || 'No';
+        el('cand-shared-date').value = cand.shared_date || '';
+        el('cand-feedback').value = cand.client_feedback || 'Pending';
+
+        el('eval-comm').value = cand.communication || '';
+        el('eval-subj').value = cand.subject_expertise || '';
+        el('eval-past').value = cand.past_experience || '';
+        el('eval-meth').value = cand.methodology || '';
+        el('eval-comm-fit').value = cand.commercial_fit || '';
+        el('eval-flex').value = cand.flexibility || '';
+        el('eval-past-fb').value = cand.past_feedback || '';
+      }
+    } else {
+      modalTitle.textContent = 'Add Candidate';
+    }
+
+    el('modal-candidate').classList.remove('hidden');
+  }
+
+  saveCandidate() {
+    const user = auth.getCurrentUser();
+    const candId = document.getElementById('cand-id').value;
+    const reqId = document.getElementById('req-id').value;
+    const el = (id) => document.getElementById(id);
+
+    const reqs = db.getRecords('requirements', user);
+    const req = reqs.find(r => r.id === reqId);
+
+    const candData = {
+      requirement_id: reqId,
+      linked_trainer_id: el('cand-trainer-id').value,
+      linked_vendor_id: el('cand-vendor-id').value,
+      candidate_name: el('cand-name').value,
+      candidate_type: el('cand-type').value,
+      source: el('cand-source').value,
+      skill_match: el('cand-match').value,
+      experience: el('cand-exp').value,
+      commercial_rate: el('cand-rate').value,
+      availability: el('cand-avail').value,
+      location_fit: el('cand-loc').value,
+      evaluation_status: el('cand-eval').value,
+      profile_shared: el('cand-shared').value,
+      shared_date: el('cand-shared-date').value,
+      client_feedback: el('cand-feedback').value,
+      communication: el('eval-comm').value,
+      subject_expertise: el('eval-subj').value,
+      past_experience: el('eval-past').value,
+      methodology: el('eval-meth').value,
+      commercial_fit: el('eval-comm-fit').value,
+      flexibility: el('eval-flex').value,
+      past_feedback: el('eval-past-fb').value,
+      sla_status: req ? this.calculateSLA(req.created_at, el('cand-shared-date').value) : 'Pending'
+    };
+
+    let wasShared = false;
+    let wasSelected = false;
+
+    if (candId) {
+      const oldCand = db.getRecords('sourcingCandidates', user).find(c => c.id === candId);
+      if (oldCand && oldCand.profile_shared !== 'Yes' && candData.profile_shared === 'Yes') wasShared = true;
+      if (oldCand && oldCand.evaluation_status !== 'Selected' && candData.evaluation_status === 'Selected') wasSelected = true;
+      db.updateRecord('sourcingCandidates', candId, candData, user);
+    } else {
+      if (candData.profile_shared === 'Yes') wasShared = true;
+      if (candData.evaluation_status === 'Selected') wasSelected = true;
+      const newCand = db.createRecord('sourcingCandidates', candData, user);
+      db.logActivity('create', `Candidate ${candData.candidate_name} added to requirement.`, 'sourcingCandidates', newCand.id, user);
+    }
+
+    if (wasShared) {
+      db.logAudit('profile_shared', `Profile ${candData.candidate_name} shared for req ${reqId}`, user);
+      db.logActivity('profile_shared', `Candidate profile shared`, 'requirements', reqId, user);
+    }
+    if (wasSelected) {
+      db.logAudit('candidate_selected', `Candidate ${candData.candidate_name} selected for req ${reqId}`, user);
+      db.logActivity('candidate_selected', `Candidate selected`, 'requirements', reqId, user);
+    }
+
+    el('modal-candidate').classList.add('hidden');
+    this.renderCandidates(reqId);
+  }
+
+  selectExistingTrainer() {
+    const user = auth.getCurrentUser();
+    const trainers = db.getRecords('trainers', user);
+    if (!trainers.length) return alert('No trainers found in database.');
+
+    const name = prompt('Enter trainer name to search:');
+    if (!name) return;
+
+    const match = trainers.find(t => `${t.first_name} ${t.last_name}`.toLowerCase().includes(name.toLowerCase()));
+    if (match) {
+      document.getElementById('cand-name').value = `${match.first_name} ${match.last_name}`;
+      document.getElementById('cand-type').value = 'Trainer';
+      document.getElementById('cand-source').value = 'Existing Database';
+      document.getElementById('cand-rate').value = match.daily_rate || '';
+      document.getElementById('cand-exp').value = match.expertise || '';
+      document.getElementById('cand-trainer-id').value = match.id;
+      document.getElementById('cand-vendor-id').value = '';
+    } else {
+      alert('Trainer not found.');
+    }
+  }
+
+  selectExistingVendor() {
+    const user = auth.getCurrentUser();
+    const vendors = db.getRecords('vendors', user);
+    if (!vendors.length) return alert('No vendors found in database.');
+
+    const name = prompt('Enter vendor name to search:');
+    if (!name) return;
+
+    const match = vendors.find(v => v.company_name.toLowerCase().includes(name.toLowerCase()));
+    if (match) {
+      document.getElementById('cand-name').value = match.company_name;
+      document.getElementById('cand-type').value = 'Vendor';
+      document.getElementById('cand-source').value = 'Existing Database';
+      document.getElementById('cand-exp').value = match.services_provided || '';
+      document.getElementById('cand-vendor-id').value = match.id;
+      document.getElementById('cand-trainer-id').value = '';
+    } else {
+      alert('Vendor not found.');
+    }
+  }
+}
+
+document.addEventListener('DOMContentLoaded', () => {
+  window.requirementsManager = new RequirementsManager();
+});
diff --git a/js/schema.js b/js/schema.js
index 9908a97..92b9cf2 100644
--- a/js/schema.js
+++ b/js/schema.js
@@ -1,4 +1,4 @@
-window.crmSchema = {
+∩╗┐window.crmSchema = {
   users: {
     fields: ['first_name', 'last_name', 'email', 'role', 'team_id', 'status'],
     duplicateKeys: ['email']
@@ -26,12 +26,26 @@ window.crmSchema = {
     duplicateKeys: ['company_name', 'gst']
   },
   requirements: {
-    fields: ['title', 'description', 'client_id', 'budget', 'priority', 'status', 'skills_required', 'target_date', 'pipeline_stage', 'converted_deal_id'],
+    fields: [
+      'title', 'description', 'client_id', 'contact_id', 'lead_id', 'company_name', 'contact_person',
+      'budget', 'priority', 'status', 'pipeline_stage', 'converted_deal_id',
+      'service_interest', 'technology', 'audience', 'duration', 'mode', 'location',
+      'preferred_dates', 'trainer_type', 'lab_needs', 'recording_needs',
+      'proposal_status', 'po_status', 'proposal_number', 'proposal_date',
+      'proposal_amount', 'proposal_version', 'approval_status', 'po_number',
+      'po_amount', 'po_received_date', 'po_attachment', 'commercial_remarks', 'owner_id'
+    ],
     duplicateKeys: []
   },
   sourcingCandidates: {
-    fields: ['first_name', 'last_name', 'email', 'phone', 'linkedin', 'skills', 'experience_years', 'current_company', 'expected_salary', 'notice_period'],
-    duplicateKeys: ['email', 'phone', 'linkedin']
+    fields: [
+      'requirement_id', 'candidate_name', 'candidate_type', 'source', 'skill_match',
+      'experience', 'commercial_rate', 'availability', 'location_fit', 'evaluation_status',
+      'profile_shared', 'shared_date', 'client_feedback', 'sla_status', 'remarks',
+      'communication', 'subject_expertise', 'past_experience', 'methodology',
+      'commercial_fit', 'flexibility', 'past_feedback', 'linked_trainer_id', 'linked_vendor_id'
+    ],
+    duplicateKeys: []
   },
   trainers: {
     fields: ['first_name', 'last_name', 'email', 'phone', 'linkedin', 'expertise', 'daily_rate', 'availability', 'certifications'],
```

## Tests Run
```text
git diff --check; node --check js/requirements.js; node --check js/app.js; node --check js/pipeline.js; node --check js/schema.js; node --check js/db.js; manual browser smoke test
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
