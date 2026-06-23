# AI Change Audit Report

## Generated On
2026-06-23_16-32-12

## Branch
main

## Baseline Commit
58d690e

## Task Summary
Pipeline SOP upgrade: Kanban card details, stage controls, safe actions, service filtering, and conversion guards

## Git Status
```text
 M js/pipeline.js
```

## Files Changed
```text
M	js/pipeline.js
```

## Change Summary
```text
 js/pipeline.js | 124 +++++++++++++++++++++++++++++++++++++++++++++++----------
 1 file changed, 103 insertions(+), 21 deletions(-)
```

## Full Diff
```diff
diff --git a/js/pipeline.js b/js/pipeline.js
index b5631dd..1790b82 100644
--- a/js/pipeline.js
+++ b/js/pipeline.js
@@ -1,4 +1,4 @@
-∩╗┐class PipelineManager {
+class PipelineManager {
   constructor() {
     this.board = document.getElementById('pipeline-board');
     this.stages = [
@@ -15,6 +15,17 @@
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
     document.getElementById('pipeline-filter-owner').addEventListener('input', (e) => {
       this.filterOwner = e.target.value.toLowerCase();
@@ -36,6 +47,32 @@
       this.filterStage = e.target.value;
       this.render();
     });
+
+    if (this.board) {
+      this.board.addEventListener('click', (e) => {
+        const btn = e.target.closest('.pl-action');
+        if (!btn) return;
+        const action = btn.getAttribute('data-action');
+        const cardId = btn.getAttribute('data-id');
+        const cardType = btn.getAttribute('data-type');
+
+        if (action === 'note') this.addNote(cardId, cardType);
+        else if (action === 'followup') this.addFollowUp(cardId, cardType);
+        else if (action === 'assign') this.assignOwner(cardId, cardType);
+        else if (action === 'to-req') this.convertToRequirement(cardId);
+        else if (action === 'to-deal') this.convertToDeal(cardId);
+        else if (action === 'dormant') this.markDormant(cardId, cardType);
+        else if (action === 'lost') this.markLost(cardId, cardType);
+        else if (action === 'back' || action === 'forward') {
+          const currentStage = btn.getAttribute('data-stage');
+          const idx = this.stages.indexOf(currentStage);
+          if (idx > -1) {
+            if (action === 'back' && idx > 0) this.updateCardStage(cardId, cardType, this.stages[idx - 1]);
+            if (action === 'forward' && idx < this.stages.length - 1) this.updateCardStage(cardId, cardType, this.stages[idx + 1]);
+          }
+        }
+      });
+    }
   }
 
   getCollectionForType(cardType) {
@@ -140,7 +177,8 @@
 
       // Apply filters
       if (this.filterOwner && card.owner_id && !card.owner_id.toLowerCase().includes(this.filterOwner)) return;
-      if (this.filterService && card.service_interest !== this.filterService) return;
+      const cardService = card.service_interest || card.service_type || '';
+      if (this.filterService && cardService !== this.filterService) return;
       if (this.filterPriority && card.priority !== this.filterPriority) return;
 
       if (this.filterOverdue === 'overdue') {
@@ -181,42 +219,69 @@
     });
 
     const title = card.company_name || card.title || 'Unknown';
-    const val = card.budget || card.amount ? `$${card.budget || card.amount}` : '';
+    const val = card.budget || card.amount || card.proposal_amount || card.po_amount || card.invoice_amount || '';
+    const service = card.service_interest || card.service_type || '-';
+    const nextAction = card.next_step || card.follow_up_type || card.proposal_status || card.po_status || 'Follow-up';
+    const dueDate = card.next_follow_up_date || card.preferred_dates || card.close_date || card.start_date || '-';
 
     let priorityBadge = '';
     if (card.priority) {
-      priorityBadge = `<span class="badge badge-priority-${card.priority.toLowerCase()}" style="font-size: 10px; padding: 2px 6px;">${card.priority}</span>`;
+      let safeClass = 'default';
+      const lowerPri = card.priority.toLowerCase();
+      if (['high', 'medium', 'low'].includes(lowerPri)) safeClass = lowerPri;
+      priorityBadge = `<span class="badge badge-priority-${safeClass}" style="font-size: 10px; padding: 2px 6px;">${this.escapeHTML(card.priority)}</span>`;
     }
 
     let overdueBadge = '';
-    if (card.next_follow_up_date) {
-      const fuDate = new Date(card.next_follow_up_date);
+    if (dueDate && dueDate !== '-') {
+      const fuDate = new Date(dueDate);
       if (fuDate < today && card.status !== 'Converted' && card.status !== 'Lost' && card.status !== 'Dormant') {
-        overdueBadge = `<span class="badge badge-overdue" style="font-size: 10px; padding: 2px 6px;">${card.next_follow_up_date}</span>`;
+        overdueBadge = `<span class="badge badge-overdue" style="font-size: 10px; padding: 2px 6px;">${this.escapeHTML(dueDate)}</span>`;
       } else {
-        overdueBadge = `<small style="color: var(--muted);">${card.next_follow_up_date}</small>`;
+        overdueBadge = `<small style="color: var(--muted);">${this.escapeHTML(dueDate)}</small>`;
       }
     }
 
+    const stageIdx = this.stages.indexOf(card.pipeline_stage);
+    const hasBack = stageIdx > 0;
+    const hasForward = stageIdx > -1 && stageIdx < this.stages.length - 1;
+
+    let toReqBtn = '';
+    if (card.type === 'lead' && card.status !== 'Converted' && !card.converted_requirement_id && !card.converted_client_id) {
+      toReqBtn = `<button class="btn btn-secondary pl-action" data-action="to-req" data-id="${this.escapeHTML(card.id)}" data-type="${this.escapeHTML(card.type)}" style="padding: 2px 6px; font-size: 10px;">To Req</button>`;
+    }
+
+    let toDealBtn = '';
+    if (card.type === 'requirement' && card.status !== 'Converted' && !card.converted_deal_id) {
+      toDealBtn = `<button class="btn btn-secondary pl-action" data-action="to-deal" data-id="${this.escapeHTML(card.id)}" data-type="${this.escapeHTML(card.type)}" style="padding: 2px 6px; font-size: 10px;">To Deal</button>`;
+    }
+
     el.innerHTML = `
       <div style="display:flex; justify-content:space-between; align-items:flex-start;">
-        <div class="kanban-card-title">${title} <small>(${card.type})</small></div>
+        <div class="kanban-card-title">${this.escapeHTML(title)} <small>(${this.escapeHTML(card.type)})</small></div>
         ${priorityBadge}
       </div>
       <div class="kanban-card-meta">
-        <div>${card.service_interest || '-'}</div>
-        <div>Owner: ${card.owner_id || 'Unassigned'}</div>
-        ${val ? `<div>Value: ${val}</div>` : ''}
-        ${overdueBadge ? `<div>Next: ${overdueBadge}</div>` : ''}
+        <div>Serv: ${this.escapeHTML(service)}</div>
+        <div>Owner: ${this.escapeHTML(card.owner_id || 'Unassigned')}</div>
+        ${val ? `<div>Val: $${this.escapeHTML(val)}</div>` : ''}
+        <div>Action: ${this.escapeHTML(nextAction)}</div>
+        ${overdueBadge ? `<div>Due: ${overdueBadge}</div>` : ''}
       </div>
-      <div class="kanban-card-actions">
-        <button class="btn btn-secondary" style="padding: 2px 6px; font-size: 10px;" onclick="window.pipelineManager.addNote('${card.id}', '${card.type}')">Note</button>
-        <button class="btn btn-secondary" style="padding: 2px 6px; font-size: 10px;" onclick="window.pipelineManager.addFollowUp('${card.id}', '${card.type}')">Follow-up</button>
-        <button class="btn btn-secondary" style="padding: 2px 6px; font-size: 10px;" onclick="window.pipelineManager.assignOwner('${card.id}', '${card.type}')">Assign</button>
-        ${card.type === 'lead' ? `<button class="btn btn-secondary" style="padding: 2px 6px; font-size: 10px;" onclick="window.pipelineManager.convertToRequirement('${card.id}')">To Req</button>` : ''}
-        ${card.type === 'requirement' ? `<button class="btn btn-secondary" style="padding: 2px 6px; font-size: 10px;" onclick="window.pipelineManager.convertToDeal('${card.id}')">To Deal</button>` : ''}
-        <button class="btn btn-secondary" style="padding: 2px 6px; font-size: 10px;" onclick="window.pipelineManager.markDormant('${card.id}', '${card.type}')">Dormant</button>
-        <button class="btn btn-secondary" style="padding: 2px 6px; font-size: 10px;" onclick="window.pipelineManager.markLost('${card.id}', '${card.type}')">Lost</button>
+      <div class="kanban-card-actions" style="margin-top: 8px;">
+        <div style="display: flex; gap: 4px; flex-wrap: wrap;">
+          <button class="btn btn-secondary pl-action" data-action="note" data-id="${this.escapeHTML(card.id)}" data-type="${this.escapeHTML(card.type)}" style="padding: 2px 6px; font-size: 10px;">Note</button>
+          <button class="btn btn-secondary pl-action" data-action="followup" data-id="${this.escapeHTML(card.id)}" data-type="${this.escapeHTML(card.type)}" style="padding: 2px 6px; font-size: 10px;">Follow-up</button>
+          <button class="btn btn-secondary pl-action" data-action="assign" data-id="${this.escapeHTML(card.id)}" data-type="${this.escapeHTML(card.type)}" style="padding: 2px 6px; font-size: 10px;">Assign</button>
+          ${toReqBtn}
+          ${toDealBtn}
+          <button class="btn btn-secondary pl-action" data-action="dormant" data-id="${this.escapeHTML(card.id)}" data-type="${this.escapeHTML(card.type)}" style="padding: 2px 6px; font-size: 10px;">Dormant</button>
+          <button class="btn btn-secondary pl-action" data-action="lost" data-id="${this.escapeHTML(card.id)}" data-type="${this.escapeHTML(card.type)}" style="padding: 2px 6px; font-size: 10px;">Lost</button>
+        </div>
+        <div style="display: flex; justify-content: space-between; margin-top: 6px; border-top: 1px solid var(--hairline); padding-top: 6px;">
+          ${hasBack ? `<button class="btn btn-secondary pl-action" data-action="back" data-id="${this.escapeHTML(card.id)}" data-type="${this.escapeHTML(card.type)}" data-stage="${this.escapeHTML(card.pipeline_stage)}" style="padding: 2px 8px; font-size: 10px;">&larr; Back</button>` : '<div></div>'}
+          ${hasForward ? `<button class="btn btn-secondary pl-action" data-action="forward" data-id="${this.escapeHTML(card.id)}" data-type="${this.escapeHTML(card.type)}" data-stage="${this.escapeHTML(card.pipeline_stage)}" style="padding: 2px 8px; font-size: 10px;">Forward &rarr;</button>` : '<div></div>'}
+        </div>
       </div>
     `;
 
@@ -284,6 +349,13 @@
   }
 
   convertToRequirement(leadId) {
+    const user = auth.getCurrentUser();
+    const leads = db.getRecords('leads', user);
+    const lead = leads.find(l => l.id === leadId);
+    if (!lead) return;
+    if (lead.status === 'Converted' || lead.converted_requirement_id || lead.converted_client_id) {
+      return alert("This lead has already been converted.");
+    }
     if (window.leadsManager) {
       window.leadsManager.convertToRequirement(leadId);
       setTimeout(() => this.render(), 100);
@@ -295,6 +367,9 @@
     const reqs = db.getRecords('requirements', user);
     const req = reqs.find(r => r.id === reqId);
     if (!req) return;
+    if (req.status === 'Converted' || req.converted_deal_id) {
+      return alert("This requirement has already been converted.");
+    }
 
     if (!confirm(`Convert Requirement "${req.title}" to a Deal?`)) return;
 
@@ -326,11 +401,15 @@
 
   markLost(cardId, cardType) {
     if (!confirm('Mark as Lost?')) return;
+    const user = auth.getCurrentUser();
+    if (cardType === 'lead') db.updateRecord('leads', cardId, { status: 'Lost' }, user);
     this.updateCardStage(cardId, cardType, 'Lost');
   }
 
   markDormant(cardId, cardType) {
     if (!confirm('Mark as Dormant?')) return;
+    const user = auth.getCurrentUser();
+    if (cardType === 'lead') db.updateRecord('leads', cardId, { status: 'Dormant' }, user);
     this.updateCardStage(cardId, cardType, 'Dormant');
   }
 
@@ -356,6 +435,9 @@
   }
 
   assignOwner(cardId, cardType) {
+    const user = auth.getCurrentUser();
+    if (user.role === 'employee') return alert('Access Denied');
+
     const ownerId = prompt('Enter new Owner ID:');
     if (ownerId !== null) {
       const user = auth.getCurrentUser();
```

## Tests Run
```text
git diff --check; node --check js/pipeline.js; node --check js/app.js; node --check js/leads.js; node --check js/db.js; node --check js/schema.js; node --check js/requirements.js; node --check js/deals.js; node --check js/dashboard.js; node --check js/database.js; node --check js/reports.js; node --check js/settings.js
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
