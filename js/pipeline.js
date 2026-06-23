class PipelineManager {
  constructor() {
    this.board = document.getElementById('pipeline-board');
    this.stages = [
      'Prospecting', 'Outreach', 'Follow-up', 'Requirement Gathering',
      'Proposal Shared', 'PO Pending', 'Sourcing', 'Converted',
      'Dormant', 'Lost', 'Post-Sale'
    ];
    this.filterOwner = '';
    this.filterService = '';
    this.filterPriority = '';
    this.filterOverdue = '';
    this.filterStage = '';

    this.bindEvents();
  }

  bindEvents() {
    document.getElementById('pipeline-filter-owner').addEventListener('input', (e) => {
      this.filterOwner = e.target.value.toLowerCase();
      this.render();
    });
    document.getElementById('pipeline-filter-service').addEventListener('change', (e) => {
      this.filterService = e.target.value;
      this.render();
    });
    document.getElementById('pipeline-filter-priority').addEventListener('change', (e) => {
      this.filterPriority = e.target.value;
      this.render();
    });
    document.getElementById('pipeline-filter-overdue').addEventListener('change', (e) => {
      this.filterOverdue = e.target.value;
      this.render();
    });
    document.getElementById('pipeline-filter-stage').addEventListener('change', (e) => {
      this.filterStage = e.target.value;
      this.render();
    });
  }

  getCollectionForType(cardType) {
    if (cardType === 'lead') return 'leads';
    if (cardType === 'requirement') return 'requirements';
    if (cardType === 'deal') return 'deals';
    return '';
  }

  getCards() {
    const user = auth.getCurrentUser();
    if (!user) return [];

    const leadMap = {
      'New': 'Prospecting', 'Contacted': 'Outreach', 'Interested': 'Follow-up',
      'Follow-up': 'Follow-up', 'Requirement Expected': 'Requirement Gathering',
      'Not Interested': 'Lost', 'Dormant': 'Dormant', 'Converted': 'Converted', 'Lost': 'Lost'
    };
    const reqMap = {
      'New': 'Requirement Gathering', 'Open': 'Requirement Gathering', 'Proposal Pending': 'Proposal Shared',
      'PO Pending': 'PO Pending', 'Sourcing': 'Sourcing', 'Converted': 'Converted',
      'Lost': 'Lost', 'On Hold': 'Dormant'
    };
    const dealMap = {
      'Confirmed': 'Converted', 'Planning': 'Converted', 'Live': 'Converted',
      'Completed': 'Post-Sale', 'Closed': 'Post-Sale', 'Lost': 'Lost'
    };

    const leads = db.getRecords('leads', user).map(l => {
      if (!l.pipeline_stage) {
        l.pipeline_stage = leadMap[l.status] || 'Prospecting';
        db.updateRecord('leads', l.id, { pipeline_stage: l.pipeline_stage }, user);
      }
      return { ...l, type: 'lead' };
    });

    const reqs = db.getRecords('requirements', user).map(r => {
      if (!r.pipeline_stage) {
        r.pipeline_stage = reqMap[r.status] || 'Requirement Gathering';
        db.updateRecord('requirements', r.id, { pipeline_stage: r.pipeline_stage }, user);
      }
      return { ...r, type: 'requirement' };
    });

    const deals = db.getRecords('deals', user).map(d => {
      if (!d.pipeline_stage) {
        d.pipeline_stage = dealMap[d.stage] || 'Proposal Shared';
        db.updateRecord('deals', d.id, { pipeline_stage: d.pipeline_stage }, user);
      }
      return { ...d, type: 'deal' };
    });

    return [...leads, ...reqs, ...deals];
  }

  render() {
    if (!this.board) return;
    const allCards = this.getCards();

    // Create columns
    this.board.innerHTML = '';

    // Filter columns if stage filter is applied
    const activeStages = this.filterStage ? [this.filterStage] : this.stages;

    activeStages.forEach(stage => {
      const col = document.createElement('div');
      col.className = 'kanban-col';
      col.dataset.stage = stage;

      const header = document.createElement('div');
      header.className = 'kanban-col-header';
      header.innerHTML = `<span>${stage}</span> <span class="card-count">0</span>`;
      col.appendChild(header);

      // Setup drop zone
      col.addEventListener('dragover', e => {
        e.preventDefault();
        col.classList.add('drag-over');
      });
      col.addEventListener('dragleave', e => {
        col.classList.remove('drag-over');
      });
      col.addEventListener('drop', e => {
        e.preventDefault();
        col.classList.remove('drag-over');
        const cardId = e.dataTransfer.getData('text/plain');
        const cardType = e.dataTransfer.getData('card-type');
        this.updateCardStage(cardId, cardType, stage);
      });

      this.board.appendChild(col);
    });

    const today = new Date(new Date().setHours(0,0,0,0));

    // Add cards to columns
    allCards.forEach(card => {
      // Filter duplicates
      if (card.type === 'lead' && card.converted_requirement_id) return;
      if (card.type === 'requirement' && card.converted_deal_id) return;

      // Apply filters
      if (this.filterOwner && card.owner_id && !card.owner_id.toLowerCase().includes(this.filterOwner)) return;
      if (this.filterService && card.service_interest !== this.filterService) return;
      if (this.filterPriority && card.priority !== this.filterPriority) return;

      if (this.filterOverdue === 'overdue') {
        if (!card.next_follow_up_date) return;
        const isOverdue = new Date(card.next_follow_up_date) < today;
        if (!isOverdue) return;
      }

      // Determine stage
      const currentStage = card.pipeline_stage;

      const col = this.board.querySelector(`.kanban-col[data-stage="${currentStage}"]`);
      if (col) {
        const cardEl = this.createCardElement(card, today);
        col.appendChild(cardEl);
      }
    });

    // Update counts
    this.board.querySelectorAll('.kanban-col').forEach(col => {
      const count = col.querySelectorAll('.kanban-card').length;
      col.querySelector('.card-count').textContent = count;
    });
  }

  createCardElement(card, today) {
    const el = document.createElement('div');
    el.className = 'kanban-card';
    el.draggable = true;

    el.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', card.id);
      e.dataTransfer.setData('card-type', card.type);
      el.classList.add('dragging');
    });
    el.addEventListener('dragend', () => {
      el.classList.remove('dragging');
    });

    const title = card.company_name || card.title || 'Unknown';
    const val = card.budget || card.amount ? `$${card.budget || card.amount}` : '';

    let priorityBadge = '';
    if (card.priority) {
      priorityBadge = `<span class="badge badge-priority-${card.priority.toLowerCase()}" style="font-size: 10px; padding: 2px 6px;">${card.priority}</span>`;
    }

    let overdueBadge = '';
    if (card.next_follow_up_date) {
      const fuDate = new Date(card.next_follow_up_date);
      if (fuDate < today && card.status !== 'Converted' && card.status !== 'Lost' && card.status !== 'Dormant') {
        overdueBadge = `<span class="badge badge-overdue" style="font-size: 10px; padding: 2px 6px;">${card.next_follow_up_date}</span>`;
      } else {
        overdueBadge = `<small style="color: var(--muted);">${card.next_follow_up_date}</small>`;
      }
    }

    el.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start;">
        <div class="kanban-card-title">${title} <small>(${card.type})</small></div>
        ${priorityBadge}
      </div>
      <div class="kanban-card-meta">
        <div>${card.service_interest || '-'}</div>
        <div>Owner: ${card.owner_id || 'Unassigned'}</div>
        ${val ? `<div>Value: ${val}</div>` : ''}
        ${overdueBadge ? `<div>Next: ${overdueBadge}</div>` : ''}
      </div>
      <div class="kanban-card-actions">
        <button class="btn btn-secondary" style="padding: 2px 6px; font-size: 10px;" onclick="window.pipelineManager.addNote('${card.id}', '${card.type}')">Note</button>
        <button class="btn btn-secondary" style="padding: 2px 6px; font-size: 10px;" onclick="window.pipelineManager.addFollowUp('${card.id}', '${card.type}')">Follow-up</button>
        <button class="btn btn-secondary" style="padding: 2px 6px; font-size: 10px;" onclick="window.pipelineManager.assignOwner('${card.id}', '${card.type}')">Assign</button>
        ${card.type === 'lead' ? `<button class="btn btn-secondary" style="padding: 2px 6px; font-size: 10px;" onclick="window.pipelineManager.convertToRequirement('${card.id}')">To Req</button>` : ''}
        ${card.type === 'requirement' ? `<button class="btn btn-secondary" style="padding: 2px 6px; font-size: 10px;" onclick="window.pipelineManager.convertToDeal('${card.id}')">To Deal</button>` : ''}
        <button class="btn btn-secondary" style="padding: 2px 6px; font-size: 10px;" onclick="window.pipelineManager.markDormant('${card.id}', '${card.type}')">Dormant</button>
        <button class="btn btn-secondary" style="padding: 2px 6px; font-size: 10px;" onclick="window.pipelineManager.markLost('${card.id}', '${card.type}')">Lost</button>
      </div>
    `;

    return el;
  }

  updateCardStage(cardId, cardType, newStage) {
    const user = auth.getCurrentUser();
    const collection = this.getCollectionForType(cardType);
    if (!collection) return;

    const data = { pipeline_stage: newStage };
    const allRecords = db.getRecords(collection, user);
    const existing = allRecords.find(r => r.id === cardId);

    // Mapping for fallback
    const leadMap = {
      'New': 'Prospecting', 'Contacted': 'Outreach', 'Interested': 'Follow-up',
      'Follow-up': 'Follow-up', 'Requirement Expected': 'Requirement Gathering',
      'Not Interested': 'Lost', 'Dormant': 'Dormant', 'Converted': 'Converted', 'Lost': 'Lost'
    };
    const reqMap = {
      'New': 'Requirement Gathering', 'Open': 'Requirement Gathering', 'Proposal Pending': 'Proposal Shared',
      'PO Pending': 'PO Pending', 'Sourcing': 'Sourcing', 'Converted': 'Converted',
      'Lost': 'Lost', 'On Hold': 'Dormant'
    };
    const dealMap = {
      'Confirmed': 'Converted', 'Planning': 'Converted', 'Live': 'Converted',
      'Completed': 'Post-Sale', 'Closed': 'Post-Sale', 'Lost': 'Lost'
    };

    let oldStage = 'Unknown';
    if (existing) {
      if (existing.pipeline_stage) {
        oldStage = existing.pipeline_stage;
      } else {
        if (cardType === 'lead') oldStage = leadMap[existing.status] || 'Prospecting';
        if (cardType === 'requirement') oldStage = reqMap[existing.status] || 'Requirement Gathering';
        if (cardType === 'deal') oldStage = dealMap[existing.stage] || 'Proposal Shared';
      }
    }

    db.updateRecord(collection, cardId, data, user);
    db.logAudit('stage_change', `${cardType} ${cardId} pipeline_stage changed from ${oldStage} to ${newStage}`, user);
    this.render();

    if (window.leadsManager && cardType === 'lead') {
      window.leadsManager.render();
    }
  }

  addNote(cardId, cardType) {
    if (cardType === 'lead' && window.leadsManager) {
      window.leadsManager.openActivityModal(cardId);
    } else {
      const desc = prompt('Enter note/activity description:');
      if (desc) {
        const user = auth.getCurrentUser();
        const collection = this.getCollectionForType(cardType);
        db.logActivity('Note', desc, collection, cardId, user);
        alert('Note added.');
        this.render();
      }
    }
  }

  convertToRequirement(leadId) {
    if (window.leadsManager) {
      window.leadsManager.convertToRequirement(leadId);
      setTimeout(() => this.render(), 100);
    }
  }

  convertToDeal(reqId) {
    const user = auth.getCurrentUser();
    const reqs = db.getRecords('requirements', user);
    const req = reqs.find(r => r.id === reqId);
    if (!req) return;

    if (!confirm(`Convert Requirement "${req.title}" to a Deal?`)) return;

    const deal = db.createRecord('deals', {
      title: req.title,
      client_id: req.client_id,
      contact_id: req.contact_id || '',
      amount: req.budget,
      stage: 'Proposal Shared',
      pipeline_stage: 'Proposal Shared',
      owner_id: req.owner_id || user.id,
      requirement_id: req.id,
      req_id: req.id,
      service_interest: req.service_interest || '',
      priority: req.priority || 'Medium',
      next_follow_up_date: req.next_follow_up_date || ''
    }, user);

    db.updateRecord('requirements', reqId, {
      status: 'Converted',
      pipeline_stage: 'Converted',
      converted_deal_id: deal.id
    }, user);
    db.logAudit('stage_change', `Requirement ${req.id} converted to deal ${deal.id}`, user);

    alert('Converted to Deal successfully!');
    this.render();
  }

  markLost(cardId, cardType) {
    if (!confirm('Mark as Lost?')) return;
    this.updateCardStage(cardId, cardType, 'Lost');
  }

  markDormant(cardId, cardType) {
    if (!confirm('Mark as Dormant?')) return;
    this.updateCardStage(cardId, cardType, 'Dormant');
  }

  addFollowUp(cardId, cardType) {
    const dateStr = prompt('Enter next follow-up date (YYYY-MM-DD):');
    if (dateStr) {
      const user = auth.getCurrentUser();
      const collection = this.getCollectionForType(cardType);
      db.updateRecord(collection, cardId, { next_follow_up_date: dateStr }, user);

      const rec = db.getRecords(collection, user).find(r => r.id === cardId);
      db.createRecord('tasks', {
        title: `Follow up with ${rec.company_name || rec.title}`,
        description: `Scheduled via Pipeline Kanban.`,
        due_date: dateStr,
        related_to: cardId,
        priority: rec.priority || 'Medium',
        status: 'Pending'
      }, user, true);

      this.render();
    }
  }

  assignOwner(cardId, cardType) {
    const ownerId = prompt('Enter new Owner ID:');
    if (ownerId !== null) {
      const user = auth.getCurrentUser();
      const collection = this.getCollectionForType(cardType);
      db.updateRecord(collection, cardId, { owner_id: ownerId }, user);
      this.render();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.pipelineManager = new PipelineManager();
});
