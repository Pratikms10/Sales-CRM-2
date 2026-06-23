# AI Change Audit Report

## Generated On
2026-06-23_13-26-10

## Branch
main

## Baseline Commit
dcf3fb0

## Task Summary
Phase 4: Build Pipeline Kanban with pipeline_stage workflow

## Git Status
```text
 M css/style.css
 M index.html
 M js/app.js
 M js/leads.js
 A js/pipeline.js
 M js/schema.js
```

## Files Changed
```text
M	css/style.css
M	index.html
M	js/app.js
M	js/leads.js
A	js/pipeline.js
M	js/schema.js
```

## Change Summary
```text
 css/style.css  |  77 ++++++++++++
 index.html     |  48 +++++++-
 js/app.js      |   4 +
 js/leads.js    |  28 ++++-
 js/pipeline.js | 371 +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 js/schema.js   |   9 +-
 6 files changed, 530 insertions(+), 7 deletions(-)
```

## Full Diff
```diff
diff --git a/css/style.css b/css/style.css
index d8a0bd6..d005b0b 100644
--- a/css/style.css
+++ b/css/style.css
@@ -384,3 +384,80 @@ a:hover {
   border-radius: var(--rounded-sm);
   border: 1px solid var(--hairline);
 }
+
+/* Kanban Board */
+.kanban-wrapper {
+  overflow-x: auto;
+  padding-bottom: 16px;
+  margin-top: 16px;
+}
+.kanban-board {
+  display: flex;
+  gap: 16px;
+  min-width: max-content;
+  align-items: flex-start;
+}
+.kanban-col {
+  width: 300px;
+  background-color: var(--surface-card);
+  border-radius: var(--rounded-md);
+  padding: 12px;
+  display: flex;
+  flex-direction: column;
+  gap: 12px;
+  min-height: 300px;
+  border: 1px solid var(--hairline);
+}
+.kanban-col-header {
+  font-weight: 600;
+  color: var(--body-strong);
+  font-size: 14px;
+  display: flex;
+  justify-content: space-between;
+  align-items: center;
+  border-bottom: 1px solid var(--hairline);
+  padding-bottom: 8px;
+}
+.kanban-card {
+  background-color: var(--canvas);
+  border: 1px solid var(--hairline);
+  border-radius: var(--rounded-sm);
+  padding: 12px;
+  font-size: 13px;
+  cursor: grab;
+  transition: transform 0.2s, box-shadow 0.2s;
+  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
+  display: flex;
+  flex-direction: column;
+  gap: 8px;
+}
+.kanban-card:active {
+  cursor: grabbing;
+}
+.kanban-card:hover {
+  transform: translateY(-2px);
+  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
+}
+.kanban-card.dragging {
+  opacity: 0.5;
+}
+.kanban-col.drag-over {
+  background-color: var(--surface-soft);
+  border: 1px dashed var(--primary);
+}
+.kanban-card-title {
+  font-weight: 600;
+  color: var(--body-strong);
+}
+.kanban-card-meta {
+  color: var(--muted);
+  font-size: 11px;
+}
+.kanban-card-actions {
+  display: flex;
+  gap: 4px;
+  flex-wrap: wrap;
+  margin-top: 4px;
+  border-top: 1px solid var(--hairline);
+  padding-top: 8px;
+}
diff --git a/index.html b/index.html
index 9542c6e..7cbfb2a 100644
--- a/index.html
+++ b/index.html
@@ -159,8 +159,50 @@
 
       <div id="tab-pipeline" class="tab-pane">
         <div class="card">
-          <h3>Pipeline</h3>
-          <p>Track ongoing sales processes.</p>
+          <div style="display: flex; justify-content: space-between; align-items: center;">
+            <h3>Pipeline Kanban</h3>
+          </div>
+          <p>Manage leads, requirements, and deals across the sales cycle.</p>
+
+          <div class="filter-bar" id="pipeline-filter-bar">
+            <input type="text" id="pipeline-filter-owner" placeholder="Filter by Owner ID" style="width: 150px;">
+            <select id="pipeline-filter-stage">
+              <option value="">All Stages</option>
+              <option value="Prospecting">Prospecting</option>
+              <option value="Outreach">Outreach</option>
+              <option value="Follow-up">Follow-up</option>
+              <option value="Requirement Gathering">Requirement Gathering</option>
+              <option value="Proposal Shared">Proposal Shared</option>
+              <option value="PO Pending">PO Pending</option>
+              <option value="Sourcing">Sourcing</option>
+              <option value="Converted">Converted</option>
+              <option value="Dormant">Dormant</option>
+              <option value="Lost">Lost</option>
+              <option value="Post-Sale">Post-Sale</option>
+            </select>
+            <select id="pipeline-filter-service">
+              <option value="">All Services</option>
+              <option value="Corporate Training">Corporate Training</option>
+              <option value="Video Content Development">Video Content Development</option>
+              <option value="Automation Consulting">Automation Consulting</option>
+            </select>
+            <select id="pipeline-filter-priority">
+              <option value="">All Priorities</option>
+              <option value="High">High</option>
+              <option value="Medium">Medium</option>
+              <option value="Low">Low</option>
+            </select>
+            <select id="pipeline-filter-overdue">
+              <option value="">All Follow-ups</option>
+              <option value="overdue">Overdue Only</option>
+            </select>
+          </div>
+        </div>
+
+        <div class="kanban-wrapper">
+          <div class="kanban-board" id="pipeline-board">
+            <!-- Columns rendered by JS -->
+          </div>
         </div>
       </div>
 
@@ -314,6 +356,7 @@
               <option value="Requirement Expected">Requirement Expected</option>
               <option value="Not Interested">Not Interested</option>
               <option value="Dormant">Dormant</option>
+              <option value="Converted">Converted</option>
               <option value="Lost">Lost</option>
             </select>
           </div>
@@ -383,6 +426,7 @@
   <script src="js/import.js"></script>
   <script src="js/auth.js"></script>
   <script src="js/leads.js"></script>
+  <script src="js/pipeline.js"></script>
   <script src="js/app.js"></script>
 </body>
 </html>
diff --git a/js/app.js b/js/app.js
index 8112763..57ad8fd 100644
--- a/js/app.js
+++ b/js/app.js
@@ -40,6 +40,7 @@
       renderDatabaseTab();
       renderAudits();
       if (window.leadsManager) window.leadsManager.render();
+      if (window.pipelineManager) window.pipelineManager.render();
     } else {
       loginView.classList.remove('hidden');
       appView.classList.add('hidden');
@@ -95,6 +96,9 @@
       if (tabName === 'leads' && window.leadsManager) {
         window.leadsManager.render();
       }
+      if (tabName === 'pipeline' && window.pipelineManager) {
+        window.pipelineManager.render();
+      }
     });
   });
 
diff --git a/js/leads.js b/js/leads.js
index 6e2df1f..2f01e16 100644
--- a/js/leads.js
+++ b/js/leads.js
@@ -242,6 +242,27 @@
       leadData.owner_id = requestedOwner;
     }
 
+    const defaultMapping = {
+      'New': 'Prospecting',
+      'Contacted': 'Outreach',
+      'Interested': 'Follow-up',
+      'Follow-up': 'Follow-up',
+      'Requirement Expected': 'Requirement Gathering',
+      'Not Interested': 'Lost',
+      'Dormant': 'Dormant',
+      'Converted': 'Converted',
+      'Lost': 'Lost'
+    };
+
+    let oldLead = null;
+    if (leadId) {
+      oldLead = db.getRecords('leads', user).find(l => l.id === leadId);
+    }
+
+    if (!leadId || (oldLead && oldLead.status !== leadData.status)) {
+      leadData.pipeline_stage = defaultMapping[leadData.status] || 'Prospecting';
+    }
+
     let finalLeadId = leadId;
     if (leadId) {
       db.updateRecord('leads', leadId, leadData, user);
@@ -344,6 +365,7 @@
       client_id: client.id,
       priority: lead.priority,
       status: 'Open',
+      pipeline_stage: 'Requirement Gathering',
       source: 'Lead Conversion',
       lead_id: lead.id,
       contact_id: contact.id,
@@ -352,7 +374,11 @@
       service_interest: lead.service_interest
     }, user);
 
-    db.updateRecord('leads', lead.id, { status: 'Converted' }, user);
+    db.updateRecord('leads', lead.id, {
+      status: 'Converted',
+      pipeline_stage: 'Converted',
+      converted_requirement_id: requirement.id
+    }, user);
     db.logAudit('stage_change', `Lead ${lead.id} converted to requirement ${requirement.id}`, user, lead.team_id);
 
     alert("Successfully converted to Requirement!");
diff --git a/js/pipeline.js b/js/pipeline.js
new file mode 100644
index 0000000..8094db2
--- /dev/null
+++ b/js/pipeline.js
@@ -0,0 +1,371 @@
+class PipelineManager {
+  constructor() {
+    this.board = document.getElementById('pipeline-board');
+    this.stages = [
+      'Prospecting', 'Outreach', 'Follow-up', 'Requirement Gathering',
+      'Proposal Shared', 'PO Pending', 'Sourcing', 'Converted',
+      'Dormant', 'Lost', 'Post-Sale'
+    ];
+    this.filterOwner = '';
+    this.filterService = '';
+    this.filterPriority = '';
+    this.filterOverdue = '';
+    this.filterStage = '';
+
+    this.bindEvents();
+  }
+
+  bindEvents() {
+    document.getElementById('pipeline-filter-owner').addEventListener('input', (e) => {
+      this.filterOwner = e.target.value.toLowerCase();
+      this.render();
+    });
+    document.getElementById('pipeline-filter-service').addEventListener('change', (e) => {
+      this.filterService = e.target.value;
+      this.render();
+    });
+    document.getElementById('pipeline-filter-priority').addEventListener('change', (e) => {
+      this.filterPriority = e.target.value;
+      this.render();
+    });
+    document.getElementById('pipeline-filter-overdue').addEventListener('change', (e) => {
+      this.filterOverdue = e.target.value;
+      this.render();
+    });
+    document.getElementById('pipeline-filter-stage').addEventListener('change', (e) => {
+      this.filterStage = e.target.value;
+      this.render();
+    });
+  }
+
+  getCollectionForType(cardType) {
+    if (cardType === 'lead') return 'leads';
+    if (cardType === 'requirement') return 'requirements';
+    if (cardType === 'deal') return 'deals';
+    return '';
+  }
+
+  getCards() {
+    const user = auth.getCurrentUser();
+    if (!user) return [];
+
+    const leadMap = {
+      'New': 'Prospecting', 'Contacted': 'Outreach', 'Interested': 'Follow-up',
+      'Follow-up': 'Follow-up', 'Requirement Expected': 'Requirement Gathering',
+      'Not Interested': 'Lost', 'Dormant': 'Dormant', 'Converted': 'Converted', 'Lost': 'Lost'
+    };
+    const reqMap = {
+      'New': 'Requirement Gathering', 'Open': 'Requirement Gathering', 'Proposal Pending': 'Proposal Shared',
+      'PO Pending': 'PO Pending', 'Sourcing': 'Sourcing', 'Converted': 'Converted',
+      'Lost': 'Lost', 'On Hold': 'Dormant'
+    };
+    const dealMap = {
+      'Confirmed': 'Converted', 'Planning': 'Converted', 'Live': 'Converted',
+      'Completed': 'Post-Sale', 'Closed': 'Post-Sale', 'Lost': 'Lost'
+    };
+
+    const leads = db.getRecords('leads', user).map(l => {
+      if (!l.pipeline_stage) {
+        l.pipeline_stage = leadMap[l.status] || 'Prospecting';
+        db.updateRecord('leads', l.id, { pipeline_stage: l.pipeline_stage }, user);
+      }
+      return { ...l, type: 'lead' };
+    });
+    
+    const reqs = db.getRecords('requirements', user).map(r => {
+      if (!r.pipeline_stage) {
+        r.pipeline_stage = reqMap[r.status] || 'Requirement Gathering';
+        db.updateRecord('requirements', r.id, { pipeline_stage: r.pipeline_stage }, user);
+      }
+      return { ...r, type: 'requirement' };
+    });
+    
+    const deals = db.getRecords('deals', user).map(d => {
+      if (!d.pipeline_stage) {
+        d.pipeline_stage = dealMap[d.stage] || 'Proposal Shared';
+        db.updateRecord('deals', d.id, { pipeline_stage: d.pipeline_stage }, user);
+      }
+      return { ...d, type: 'deal' };
+    });
+
+    return [...leads, ...reqs, ...deals];
+  }
+
+  render() {
+    if (!this.board) return;
+    const allCards = this.getCards();
+
+    // Create columns
+    this.board.innerHTML = '';
+
+    // Filter columns if stage filter is applied
+    const activeStages = this.filterStage ? [this.filterStage] : this.stages;
+
+    activeStages.forEach(stage => {
+      const col = document.createElement('div');
+      col.className = 'kanban-col';
+      col.dataset.stage = stage;
+
+      const header = document.createElement('div');
+      header.className = 'kanban-col-header';
+      header.innerHTML = `<span>${stage}</span> <span class="card-count">0</span>`;
+      col.appendChild(header);
+
+      // Setup drop zone
+      col.addEventListener('dragover', e => {
+        e.preventDefault();
+        col.classList.add('drag-over');
+      });
+      col.addEventListener('dragleave', e => {
+        col.classList.remove('drag-over');
+      });
+      col.addEventListener('drop', e => {
+        e.preventDefault();
+        col.classList.remove('drag-over');
+        const cardId = e.dataTransfer.getData('text/plain');
+        const cardType = e.dataTransfer.getData('card-type');
+        this.updateCardStage(cardId, cardType, stage);
+      });
+
+      this.board.appendChild(col);
+    });
+
+    const today = new Date(new Date().setHours(0,0,0,0));
+
+    // Add cards to columns
+    allCards.forEach(card => {
+      // Filter duplicates
+      if (card.type === 'lead' && card.converted_requirement_id) return;
+      if (card.type === 'requirement' && card.converted_deal_id) return;
+
+      // Apply filters
+      if (this.filterOwner && card.owner_id && !card.owner_id.toLowerCase().includes(this.filterOwner)) return;
+      if (this.filterService && card.service_interest !== this.filterService) return;
+      if (this.filterPriority && card.priority !== this.filterPriority) return;
+
+      if (this.filterOverdue === 'overdue') {
+        if (!card.next_follow_up_date) return;
+        const isOverdue = new Date(card.next_follow_up_date) < today;
+        if (!isOverdue) return;
+      }
+
+      // Determine stage
+      const currentStage = card.pipeline_stage;
+
+      const col = this.board.querySelector(`.kanban-col[data-stage="${currentStage}"]`);
+      if (col) {
+        const cardEl = this.createCardElement(card, today);
+        col.appendChild(cardEl);
+      }
+    });
+
+    // Update counts
+    this.board.querySelectorAll('.kanban-col').forEach(col => {
+      const count = col.querySelectorAll('.kanban-card').length;
+      col.querySelector('.card-count').textContent = count;
+    });
+  }
+
+  createCardElement(card, today) {
+    const el = document.createElement('div');
+    el.className = 'kanban-card';
+    el.draggable = true;
+
+    el.addEventListener('dragstart', e => {
+      e.dataTransfer.setData('text/plain', card.id);
+      e.dataTransfer.setData('card-type', card.type);
+      el.classList.add('dragging');
+    });
+    el.addEventListener('dragend', () => {
+      el.classList.remove('dragging');
+    });
+
+    const title = card.company_name || card.title || 'Unknown';
+    const val = card.budget || card.amount ? `$${card.budget || card.amount}` : '';
+
+    let priorityBadge = '';
+    if (card.priority) {
+      priorityBadge = `<span class="badge badge-priority-${card.priority.toLowerCase()}" style="font-size: 10px; padding: 2px 6px;">${card.priority}</span>`;
+    }
+
+    let overdueBadge = '';
+    if (card.next_follow_up_date) {
+      const fuDate = new Date(card.next_follow_up_date);
+      if (fuDate < today && card.status !== 'Converted' && card.status !== 'Lost' && card.status !== 'Dormant') {
+        overdueBadge = `<span class="badge badge-overdue" style="font-size: 10px; padding: 2px 6px;">${card.next_follow_up_date}</span>`;
+      } else {
+        overdueBadge = `<small style="color: var(--muted);">${card.next_follow_up_date}</small>`;
+      }
+    }
+
+    el.innerHTML = `
+      <div style="display:flex; justify-content:space-between; align-items:flex-start;">
+        <div class="kanban-card-title">${title} <small>(${card.type})</small></div>
+        ${priorityBadge}
+      </div>
+      <div class="kanban-card-meta">
+        <div>${card.service_interest || '-'}</div>
+        <div>Owner: ${card.owner_id || 'Unassigned'}</div>
+        ${val ? `<div>Value: ${val}</div>` : ''}
+        ${overdueBadge ? `<div>Next: ${overdueBadge}</div>` : ''}
+      </div>
+      <div class="kanban-card-actions">
+        <button class="btn btn-secondary" style="padding: 2px 6px; font-size: 10px;" onclick="window.pipelineManager.addNote('${card.id}', '${card.type}')">Note</button>
+        <button class="btn btn-secondary" style="padding: 2px 6px; font-size: 10px;" onclick="window.pipelineManager.addFollowUp('${card.id}', '${card.type}')">Follow-up</button>
+        <button class="btn btn-secondary" style="padding: 2px 6px; font-size: 10px;" onclick="window.pipelineManager.assignOwner('${card.id}', '${card.type}')">Assign</button>
+        ${card.type === 'lead' ? `<button class="btn btn-secondary" style="padding: 2px 6px; font-size: 10px;" onclick="window.pipelineManager.convertToRequirement('${card.id}')">To Req</button>` : ''}
+        ${card.type === 'requirement' ? `<button class="btn btn-secondary" style="padding: 2px 6px; font-size: 10px;" onclick="window.pipelineManager.convertToDeal('${card.id}')">To Deal</button>` : ''}
+        <button class="btn btn-secondary" style="padding: 2px 6px; font-size: 10px;" onclick="window.pipelineManager.markDormant('${card.id}', '${card.type}')">Dormant</button>
+        <button class="btn btn-secondary" style="padding: 2px 6px; font-size: 10px;" onclick="window.pipelineManager.markLost('${card.id}', '${card.type}')">Lost</button>
+      </div>
+    `;
+
+    return el;
+  }
+
+  updateCardStage(cardId, cardType, newStage) {
+    const user = auth.getCurrentUser();
+    const collection = this.getCollectionForType(cardType);
+    if (!collection) return;
+
+    const data = { pipeline_stage: newStage };
+    const allRecords = db.getRecords(collection, user);
+    const existing = allRecords.find(r => r.id === cardId);
+    
+    // Mapping for fallback
+    const leadMap = {
+      'New': 'Prospecting', 'Contacted': 'Outreach', 'Interested': 'Follow-up',
+      'Follow-up': 'Follow-up', 'Requirement Expected': 'Requirement Gathering',
+      'Not Interested': 'Lost', 'Dormant': 'Dormant', 'Converted': 'Converted', 'Lost': 'Lost'
+    };
+    const reqMap = {
+      'New': 'Requirement Gathering', 'Open': 'Requirement Gathering', 'Proposal Pending': 'Proposal Shared',
+      'PO Pending': 'PO Pending', 'Sourcing': 'Sourcing', 'Converted': 'Converted',
+      'Lost': 'Lost', 'On Hold': 'Dormant'
+    };
+    const dealMap = {
+      'Confirmed': 'Converted', 'Planning': 'Converted', 'Live': 'Converted',
+      'Completed': 'Post-Sale', 'Closed': 'Post-Sale', 'Lost': 'Lost'
+    };
+
+    let oldStage = 'Unknown';
+    if (existing) {
+      if (existing.pipeline_stage) {
+        oldStage = existing.pipeline_stage;
+      } else {
+        if (cardType === 'lead') oldStage = leadMap[existing.status] || 'Prospecting';
+        if (cardType === 'requirement') oldStage = reqMap[existing.status] || 'Requirement Gathering';
+        if (cardType === 'deal') oldStage = dealMap[existing.stage] || 'Proposal Shared';
+      }
+    }
+
+    db.updateRecord(collection, cardId, data, user);
+    db.logAudit('stage_change', `${cardType} ${cardId} pipeline_stage changed from ${oldStage} to ${newStage}`, user);
+    this.render();
+
+    if (window.leadsManager && cardType === 'lead') {
+      window.leadsManager.render();
+    }
+  }
+
+  addNote(cardId, cardType) {
+    if (cardType === 'lead' && window.leadsManager) {
+      window.leadsManager.openActivityModal(cardId);
+    } else {
+      const desc = prompt('Enter note/activity description:');
+      if (desc) {
+        const user = auth.getCurrentUser();
+        const collection = this.getCollectionForType(cardType);
+        db.logActivity('Note', desc, collection, cardId, user);
+        alert('Note added.');
+        this.render();
+      }
+    }
+  }
+
+  convertToRequirement(leadId) {
+    if (window.leadsManager) {
+      window.leadsManager.convertToRequirement(leadId);
+      setTimeout(() => this.render(), 100);
+    }
+  }
+
+  convertToDeal(reqId) {
+    const user = auth.getCurrentUser();
+    const reqs = db.getRecords('requirements', user);
+    const req = reqs.find(r => r.id === reqId);
+    if (!req) return;
+
+    if (!confirm(`Convert Requirement "${req.title}" to a Deal?`)) return;
+
+    const deal = db.createRecord('deals', {
+      title: req.title,
+      client_id: req.client_id,
+      contact_id: req.contact_id || '',
+      amount: req.budget,
+      stage: 'Proposal Shared',
+      pipeline_stage: 'Proposal Shared',
+      owner_id: req.owner_id || user.id,
+      requirement_id: req.id,
+      req_id: req.id,
+      service_interest: req.service_interest || '',
+      priority: req.priority || 'Medium',
+      next_follow_up_date: req.next_follow_up_date || ''
+    }, user);
+
+    db.updateRecord('requirements', reqId, {
+      status: 'Converted',
+      pipeline_stage: 'Converted',
+      converted_deal_id: deal.id
+    }, user);
+    db.logAudit('stage_change', `Requirement ${req.id} converted to deal ${deal.id}`, user);
+
+    alert('Converted to Deal successfully!');
+    this.render();
+  }
+
+  markLost(cardId, cardType) {
+    if (!confirm('Mark as Lost?')) return;
+    this.updateCardStage(cardId, cardType, 'Lost');
+  }
+
+  markDormant(cardId, cardType) {
+    if (!confirm('Mark as Dormant?')) return;
+    this.updateCardStage(cardId, cardType, 'Dormant');
+  }
+
+  addFollowUp(cardId, cardType) {
+    const dateStr = prompt('Enter next follow-up date (YYYY-MM-DD):');
+    if (dateStr) {
+      const user = auth.getCurrentUser();
+      const collection = this.getCollectionForType(cardType);
+      db.updateRecord(collection, cardId, { next_follow_up_date: dateStr }, user);
+
+      const rec = db.getRecords(collection, user).find(r => r.id === cardId);
+      db.createRecord('tasks', {
+        title: `Follow up with ${rec.company_name || rec.title}`,
+        description: `Scheduled via Pipeline Kanban.`,
+        due_date: dateStr,
+        related_to: cardId,
+        priority: rec.priority || 'Medium',
+        status: 'Pending'
+      }, user, true);
+
+      this.render();
+    }
+  }
+
+  assignOwner(cardId, cardType) {
+    const ownerId = prompt('Enter new Owner ID:');
+    if (ownerId !== null) {
+      const user = auth.getCurrentUser();
+      const collection = this.getCollectionForType(cardType);
+      db.updateRecord(collection, cardId, { owner_id: ownerId }, user);
+      this.render();
+    }
+  }
+}
+
+document.addEventListener('DOMContentLoaded', () => {
+  window.pipelineManager = new PipelineManager();
+});
diff --git a/js/schema.js b/js/schema.js
index a17c5a1..9908a97 100644
--- a/js/schema.js
+++ b/js/schema.js
@@ -1,4 +1,4 @@
-∩╗┐window.crmSchema = {
+window.crmSchema = {
   users: {
     fields: ['first_name', 'last_name', 'email', 'role', 'team_id', 'status'],
     duplicateKeys: ['email']
@@ -12,7 +12,8 @@
       'company_name', 'contact_person', 'designation', 'email', 'phone',
       'linkedin', 'website', 'industry', 'company_size', 'city', 'country',
       'service_interest', 'source', 'last_contact_date', 'next_follow_up_date',
-      'follow_up_type', 'last_discussion', 'remarks', 'priority'
+      'follow_up_type', 'last_discussion', 'remarks', 'priority',
+      'pipeline_stage', 'converted_requirement_id'
     ],
     duplicateKeys: ['email', 'phone', 'company_name', 'linkedin']
   },
@@ -25,7 +26,7 @@
     duplicateKeys: ['company_name', 'gst']
   },
   requirements: {
-    fields: ['title', 'description', 'client_id', 'budget', 'priority', 'status', 'skills_required', 'target_date'],
+    fields: ['title', 'description', 'client_id', 'budget', 'priority', 'status', 'skills_required', 'target_date', 'pipeline_stage', 'converted_deal_id'],
     duplicateKeys: []
   },
   sourcingCandidates: {
@@ -41,7 +42,7 @@
     duplicateKeys: ['company_name', 'email', 'gst']
   },
   deals: {
-    fields: ['title', 'client_id', 'amount', 'close_date', 'stage', 'probability', 'next_step'],
+    fields: ['title', 'client_id', 'contact_id', 'amount', 'close_date', 'stage', 'probability', 'next_step', 'pipeline_stage', 'service_interest', 'priority', 'next_follow_up_date', 'requirement_id'],
     duplicateKeys: []
   },
   tasks: {
```

## Tests Run
```text
git diff --check; node --check js/pipeline.js; node --check js/leads.js; node --check js/app.js; node --check js/schema.js; manual browser smoke test
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
