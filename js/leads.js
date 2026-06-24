class LeadsManager {
  constructor() {
    this.tableBody = document.getElementById('leads-table-body');
    this.searchQuery = '';
    this.filterStatus = '';
    this.filterPriority = '';
    this.filterOverdue = '';
    this.filterService = '';
    this.filterSource = '';
    this.filterOwner = '';
    this.filterDate = '';

    this.bindEvents();
  }

  escapeHTML(str) {
    if (str === null || str === undefined || str === '') return '-';
    if (typeof str === 'number') return String(str);
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  bindEvents() {
    document.getElementById('lead-search').addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase();
      this.render();
    });

    document.getElementById('lead-filter-status').addEventListener('change', (e) => {
      this.filterStatus = e.target.value;
      this.render();
    });

    document.getElementById('lead-filter-priority').addEventListener('change', (e) => {
      this.filterPriority = e.target.value;
      this.render();
    });

    document.getElementById('lead-filter-overdue').addEventListener('change', (e) => {
      this.filterOverdue = e.target.value;
      this.render();
    });

    document.getElementById('lead-filter-service').addEventListener('change', (e) => {
      this.filterService = e.target.value;
      this.render();
    });

    document.getElementById('lead-filter-source').addEventListener('change', (e) => {
      this.filterSource = e.target.value;
      this.render();
    });

    document.getElementById('lead-filter-date').addEventListener('change', (e) => {
      this.filterDate = e.target.value;
      this.render();
    });

    document.getElementById('lead-filter-owner').addEventListener('input', (e) => {
      this.filterOwner = e.target.value.toLowerCase();
      this.render();
    });

    document.getElementById('btn-add-lead').addEventListener('click', () => {
      this.openLeadModal();
    });

    this.tableBody.addEventListener('click', (e) => {
      const btn = e.target.closest('.action-btn');
      if (btn) {
        const action = btn.getAttribute('data-action');
        const leadId = btn.getAttribute('data-lead-id');
        if (action === 'edit') this.openLeadModal(leadId);
        else if (action === 'log') this.openActivityModal(leadId);
        else if (action === 'to-req') this.convertToRequirement(leadId);
        else if (action === 'to-client') this.convertToClient(leadId);
      }
    });

    this.tableBody.addEventListener('change', (e) => {
      if (e.target.classList.contains('quick-action-select')) {
        const action = e.target.value;
        const leadId = e.target.getAttribute('data-lead-id');
        this.handleQuickAction(leadId, action);
        e.target.value = '';
      }
    });

    document.getElementById('btn-close-lead-modal').addEventListener('click', () => {
      document.getElementById('modal-lead').classList.add('hidden');
    });

    document.getElementById('btn-close-activity-modal').addEventListener('click', () => {
      document.getElementById('modal-activity').classList.add('hidden');
    });

    document.getElementById('form-lead').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveLead();
    });

    document.getElementById('form-activity').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveActivity();
    });
  }

  render() {
    if (!this.tableBody) return;

    const user = auth.getCurrentUser();
    if (!user) return;

    let leads = db.getRecords('leads', user);

    // Apply filters
    leads = leads.filter(l => {
      if (this.filterStatus && l.status !== this.filterStatus) return false;
      if (this.filterPriority && l.priority !== this.filterPriority) return false;
      if (this.filterService && l.service_interest !== this.filterService) return false;
      if (this.filterSource && l.source !== this.filterSource) return false;

      if (this.filterOwner && l.owner_id) {
        if (!l.owner_id.toLowerCase().includes(this.filterOwner)) return false;
      }

      if (this.filterDate && l.next_follow_up_date !== this.filterDate) return false;

      if (this.filterOverdue === 'overdue') {
        if (!l.next_follow_up_date) return false;
        const isOverdue = new Date(l.next_follow_up_date) < new Date(new Date().setHours(0,0,0,0));
        if (!isOverdue) return false;
      }

      if (this.searchQuery) {
        const text = `${l.company_name} ${l.contact_person} ${l.email} ${l.phone} ${l.linkedin}`.toLowerCase();
        if (!text.includes(this.searchQuery)) return false;
      }

      return true;
    });

    let html = '';
    const today = new Date(new Date().setHours(0,0,0,0));

    leads.forEach(lead => {
      let followUpHtml = lead.next_follow_up_date || '-';
      if (lead.next_follow_up_date) {
        const fuDate = new Date(lead.next_follow_up_date);
        if (fuDate < today && lead.status !== 'Converted' && lead.status !== 'Lost' && lead.status !== 'Dormant') {
          followUpHtml = `<span class="badge badge-overdue">${this.escapeHTML(lead.next_follow_up_date)}</span>`;
        }
      }

      let priorityHtml = lead.priority || '-';
      if (lead.priority) {
        let safeClass = 'default';
        const lowerPri = lead.priority.toLowerCase();
        if (['high', 'medium', 'low'].includes(lowerPri)) safeClass = lowerPri;
        priorityHtml = `<span class="badge badge-priority-${safeClass}">${this.escapeHTML(lead.priority)}</span>`;
      }

      html += `
        <tr>
          <td>
            <div style="display:flex; flex-direction: column; gap:4px; padding-bottom: 4px;">
              <button class="btn btn-secondary action-btn" data-action="edit" data-lead-id="${this.escapeHTML(lead.id)}" style="padding: 2px 6px; font-size: 11px;">Edit</button>
              <button class="btn btn-secondary action-btn" data-action="log" data-lead-id="${this.escapeHTML(lead.id)}" style="padding: 2px 6px; font-size: 11px;">Log Activity</button>
              ${lead.status !== 'Converted' ? `
                <button class="btn btn-primary action-btn" data-action="to-req" data-lead-id="${this.escapeHTML(lead.id)}" style="padding: 2px 6px; font-size: 11px;">To Requirement</button>
                <button class="btn btn-secondary action-btn" data-action="to-client" data-lead-id="${this.escapeHTML(lead.id)}" style="padding: 2px 6px; font-size: 11px;">To Client</button>
              ` : ''}
              <select class="quick-action-select" data-lead-id="${this.escapeHTML(lead.id)}" style="font-size: 11px; padding: 2px; width: 100px;">
                <option value="">Quick Actions</option>
                <option value="followup">Add Follow-up</option>
                ${(user.role === 'manager' || user.role === 'team_lead') ? '<option value="assign">Assign Owner</option>' : ''}
                <option value="dormant">Mark Dormant</option>
                <option value="lost">Mark Lost</option>
              </select>
            </div>
          </td>
          <td><small>${this.escapeHTML(lead.id)}</small></td>
          <td>${this.escapeHTML(lead.company_name)}</td>
          <td>${this.escapeHTML(lead.contact_person)}</td>
          <td>${this.escapeHTML(lead.designation)}</td>
          <td>${this.escapeHTML(lead.email)}</td>
          <td>${this.escapeHTML(lead.phone)}</td>
          <td>${this.escapeHTML(lead.linkedin)}</td>
          <td>${this.escapeHTML(lead.website)}</td>
          <td>${this.escapeHTML(lead.industry)}</td>
          <td>${this.escapeHTML(lead.company_size)}</td>
          <td>${this.escapeHTML(lead.city)}</td>
          <td>${this.escapeHTML(lead.country)}</td>
          <td>${this.escapeHTML(lead.service_interest)}</td>
          <td>${this.escapeHTML(lead.source)}</td>
          <td>${this.escapeHTML(lead.status)}</td>
          <td>${this.escapeHTML(lead.last_contact_date)}</td>
          <td>${followUpHtml}</td>
          <td>${this.escapeHTML(lead.follow_up_type)}</td>
          <td>${priorityHtml}</td>
          <td>${this.escapeHTML(lead.owner_id)}</td>
          <td><small><b>Rem:</b> ${this.escapeHTML(lead.remarks)}<br><b>Dis:</b> ${this.escapeHTML(lead.last_discussion)}</small></td>
        </tr>
      `;
    });

    if (leads.length === 0) {
      html = `<tr><td colspan="22">No leads found.</td></tr>`;
    }

    this.tableBody.innerHTML = html;
  }

  openLeadModal(leadId = null) {
    const user = auth.getCurrentUser();
    const modalTitle = document.getElementById('modal-lead-title');
    const form = document.getElementById('form-lead');

    form.reset();
    document.getElementById('lead-owner-id').placeholder = user.id;

    if (leadId) {
      modalTitle.textContent = 'Edit Lead';
      const leads = db.getRecords('leads', user);
      const lead = leads.find(l => l.id === leadId);

      if (lead) {
        document.getElementById('lead-id').value = lead.id;
        document.getElementById('lead-company').value = lead.company_name || '';
        document.getElementById('lead-contact').value = lead.contact_person || '';
        document.getElementById('lead-designation').value = lead.designation || '';
        document.getElementById('lead-email').value = lead.email || '';
        document.getElementById('lead-phone').value = lead.phone || '';
        document.getElementById('lead-linkedin').value = lead.linkedin || '';
        document.getElementById('lead-website').value = lead.website || '';
        document.getElementById('lead-industry').value = lead.industry || '';
        document.getElementById('lead-company-size').value = lead.company_size || '';
        document.getElementById('lead-city').value = lead.city || '';
        document.getElementById('lead-country').value = lead.country || '';
        document.getElementById('lead-source').value = lead.source || '';
        document.getElementById('lead-last-contact').value = lead.last_contact_date || '';
        document.getElementById('lead-followup-type').value = lead.follow_up_type || '';
        document.getElementById('lead-status').value = lead.status || 'New';
        document.getElementById('lead-priority').value = lead.priority || 'Medium';
        document.getElementById('lead-next-followup').value = lead.next_follow_up_date || '';
        document.getElementById('lead-service').value = lead.service_interest || '';
        document.getElementById('lead-remarks').value = lead.remarks || '';
        document.getElementById('lead-owner-id').value = lead.owner_id || '';

        document.getElementById('lead-visiting-card').value = lead.visiting_card_ref || '';
        document.getElementById('lead-req-note').value = lead.requirement_note_ref || '';
        document.getElementById('lead-email-ss').value = lead.email_screenshot_ref || '';
        document.getElementById('lead-ref-doc').value = lead.reference_document_ref || '';

        // Activity timeline
        const timelineSec = document.getElementById('lead-timeline-section');
        const timelineCont = document.getElementById('lead-timeline-container');
        if (timelineSec && timelineCont) {
          const activities = db.getRecords('activities', user).filter(a => a.related_entity === 'leads' && a.related_id === leadId);
          if (activities.length > 0) {
            timelineSec.style.display = 'block';
            activities.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            timelineCont.innerHTML = activities.slice(0, 5).map(a =>
              `<div style="margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid var(--hairline);">
                 <b>${this.escapeHTML(a.type)}</b> - <span style="color: var(--muted);">${new Date(a.created_at).toLocaleString()} by ${this.escapeHTML(a.created_by)}</span><br>
                 ${this.escapeHTML(a.description)}
               </div>`
            ).join('');
          } else {
            timelineSec.style.display = 'none';
            timelineCont.innerHTML = '';
          }
        }
      }
    } else {
      modalTitle.textContent = 'Add Lead';
      document.getElementById('lead-id').value = '';
      const timelineSec = document.getElementById('lead-timeline-section');
      if (timelineSec) timelineSec.style.display = 'none';
    }

    document.getElementById('modal-lead').classList.remove('hidden');
  }

  saveLead() {
    const user = auth.getCurrentUser();
    const leadId = document.getElementById('lead-id').value;

    const leadData = {
      company_name: document.getElementById('lead-company').value,
      contact_person: document.getElementById('lead-contact').value,
      designation: document.getElementById('lead-designation').value,
      email: document.getElementById('lead-email').value,
      phone: document.getElementById('lead-phone').value,
      linkedin: document.getElementById('lead-linkedin').value,
      website: document.getElementById('lead-website').value,
      industry: document.getElementById('lead-industry').value,
      company_size: document.getElementById('lead-company-size').value,
      city: document.getElementById('lead-city').value,
      country: document.getElementById('lead-country').value,
      source: document.getElementById('lead-source').value,
      last_contact_date: document.getElementById('lead-last-contact').value,
      follow_up_type: document.getElementById('lead-followup-type').value,
      status: document.getElementById('lead-status').value,
      priority: document.getElementById('lead-priority').value,
      next_follow_up_date: document.getElementById('lead-next-followup').value,
      service_interest: document.getElementById('lead-service').value,
      remarks: document.getElementById('lead-remarks').value,
      visiting_card_ref: document.getElementById('lead-visiting-card').value,
      requirement_note_ref: document.getElementById('lead-req-note').value,
      email_screenshot_ref: document.getElementById('lead-email-ss').value,
      reference_document_ref: document.getElementById('lead-ref-doc').value
    };

    const requestedOwner = document.getElementById('lead-owner-id').value;
    if (requestedOwner) {
      leadData.owner_id = requestedOwner;
    }

    const defaultMapping = {
      'New': 'Prospecting',
      'Contacted': 'Outreach',
      'Interested': 'Follow-up',
      'Follow-up': 'Follow-up',
      'Requirement Expected': 'Requirement Gathering',
      'Not Interested': 'Lost',
      'Dormant': 'Dormant',
      'Converted': 'Converted',
      'Lost': 'Lost'
    };

    let oldLead = null;
    if (leadId) {
      oldLead = db.getRecords('leads', user).find(l => l.id === leadId);
    }

    if (!leadId || (oldLead && oldLead.status !== leadData.status)) {
      leadData.pipeline_stage = defaultMapping[leadData.status] || 'Prospecting';
    }

    let finalLeadId = leadId;
    if (leadId) {
      db.updateRecord('leads', leadId, leadData, user);
    } else {
      const createdLead = db.createRecord('leads', leadData, user);
      finalLeadId = createdLead.id;
    }

    if (leadData.next_follow_up_date && leadData.status !== 'Converted' && leadData.status !== 'Lost') {
      db.createRecord('tasks', {
        title: `Follow up with ${leadData.company_name}`,
        description: `Scheduled via Lead Edit.`,
        due_date: leadData.next_follow_up_date,
        related_to: finalLeadId,
        priority: leadData.priority,
        status: 'Pending'
      }, user, true);
    }

    document.getElementById('modal-lead').classList.add('hidden');
    this.render();
    if (window.renderDashboard) window.renderDashboard();
  }

  openActivityModal(leadId) {
    document.getElementById('form-activity').reset();
    document.getElementById('activity-lead-id').value = leadId;
    document.getElementById('modal-activity').classList.remove('hidden');
  }

  saveActivity() {
    const user = auth.getCurrentUser();
    const leadId = document.getElementById('activity-lead-id').value;
    const type = document.getElementById('activity-type').value;
    const desc = document.getElementById('activity-desc').value;

    db.logActivity(type, desc, 'leads', leadId, user);

    db.updateRecord('leads', leadId, {
      last_discussion: `${type}: ${desc}`,
      last_contact_date: new Date().toISOString().split('T')[0]
    }, user);

    document.getElementById('modal-activity').classList.add('hidden');
    this.render();
  }

  convertToRequirement(leadId) {
    const user = auth.getCurrentUser();
    const leads = db.getRecords('leads', user);
    const lead = leads.find(l => l.id === leadId);

    if (!lead) return alert("Lead not found.");
    if (lead.status === 'Converted' || lead.converted_requirement_id || lead.converted_client_id) {
      return alert("This lead has already been converted.");
    }
    if (!confirm(`Convert ${lead.company_name} to Requirement? This will create a Client and Contact record if they don't exist.`)) return;

    const clients = db.getRecords('clients', {role: 'manager'});
    let client = clients.find(c =>
      (c.company_name && c.company_name.toLowerCase() === lead.company_name.toLowerCase()) ||
      (c.website && lead.website && c.website.toLowerCase() === lead.website.toLowerCase())
    );

    if (!client) {
      client = db.createRecord('clients', {
        company_name: lead.company_name,
        industry: lead.industry,
        website: lead.website
      }, user);
    }

    const contacts = db.getRecords('contacts', {role: 'manager'});
    let contact = contacts.find(c =>
      (c.email && lead.email && c.email.toLowerCase() === lead.email.toLowerCase()) ||
      (c.phone && lead.phone && c.phone === lead.phone) ||
      (c.linkedin && lead.linkedin && c.linkedin.toLowerCase() === lead.linkedin.toLowerCase())
    );

    if (!contact) {
      let fName = lead.contact_person || 'Unknown';
      let lName = '';
      if (fName.includes(' ')) {
        const parts = fName.split(' ');
        fName = parts[0];
        lName = parts.slice(1).join(' ');
      }

      contact = db.createRecord('contacts', {
        first_name: fName,
        last_name: lName,
        email: lead.email,
        phone: lead.phone,
        linkedin: lead.linkedin,
        client_id: client.id,
        job_title: lead.designation
      }, user);
    }

    const requirement = db.createRecord('requirements', {
      title: `${lead.service_interest || 'Service Request'} - ${lead.company_name}`,
      description: `Converted from Lead. Remarks: ${lead.remarks || 'None'}`,
      client_id: client.id,
      priority: lead.priority,
      status: 'Open',
      pipeline_stage: 'Requirement Gathering',
      source: 'Lead Conversion',
      lead_id: lead.id,
      contact_id: contact.id,
      company_name: lead.company_name,
      contact_person: lead.contact_person,
      service_interest: lead.service_interest
    }, user);

    db.updateRecord('leads', lead.id, {
      status: 'Converted',
      pipeline_stage: 'Converted',
      converted_requirement_id: requirement.id
    }, user);
    db.logAudit('stage_change', `Lead ${lead.id} converted to requirement ${requirement.id}`, user, lead.team_id);

    alert("Successfully converted to Requirement!");
    this.render();
  }

  convertToClient(leadId) {
    const user = auth.getCurrentUser();
    const leads = db.getRecords('leads', user);
    const lead = leads.find(l => l.id === leadId);

    if (!lead) return alert("Lead not found.");
    if (lead.status === 'Converted' || lead.converted_requirement_id || lead.converted_client_id) {
      return alert("This lead has already been converted.");
    }
    if (!confirm(`Convert ${lead.company_name} to Client? This will create a Client and Contact record if they don't exist.`)) return;

    const clients = db.getRecords('clients', {role: 'manager'});
    let client = clients.find(c =>
      (c.company_name && c.company_name.toLowerCase() === lead.company_name.toLowerCase()) ||
      (c.website && lead.website && c.website.toLowerCase() === lead.website.toLowerCase())
    );

    if (!client) {
      client = db.createRecord('clients', {
        company_name: lead.company_name,
        industry: lead.industry,
        website: lead.website
      }, user);
    }

    const contacts = db.getRecords('contacts', {role: 'manager'});
    let contact = contacts.find(c =>
      (c.email && lead.email && c.email.toLowerCase() === lead.email.toLowerCase()) ||
      (c.phone && lead.phone && c.phone === lead.phone) ||
      (c.linkedin && lead.linkedin && c.linkedin.toLowerCase() === lead.linkedin.toLowerCase())
    );

    if (!contact) {
      let fName = lead.contact_person || 'Unknown';
      let lName = '';
      if (fName.includes(' ')) {
        const parts = fName.split(' ');
        fName = parts[0];
        lName = parts.slice(1).join(' ');
      }

      contact = db.createRecord('contacts', {
        first_name: fName,
        last_name: lName,
        email: lead.email,
        phone: lead.phone,
        linkedin: lead.linkedin,
        client_id: client.id,
        job_title: lead.designation
      }, user);
    }

    db.updateRecord('leads', lead.id, {
      status: 'Converted',
      pipeline_stage: 'Converted',
      converted_client_id: client.id
    }, user);

    db.logActivity('client conversion', `Lead directly converted to Client ID: ${client.id}`, 'leads', lead.id, user);

    alert("Successfully converted to Client!");
    this.render();
  }

  handleQuickAction(leadId, action) {
    if (!action) return;
    const user = auth.getCurrentUser();
    const leads = db.getRecords('leads', user);
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    if (action === 'dormant') {
      db.updateRecord('leads', leadId, { status: 'Dormant', pipeline_stage: 'Dormant' }, user);
      db.logActivity('status change', 'Marked as Dormant', 'leads', leadId, user);
      this.render();
    } else if (action === 'lost') {
      db.updateRecord('leads', leadId, { status: 'Lost', pipeline_stage: 'Lost' }, user);
      db.logActivity('status change', 'Marked as Lost', 'leads', leadId, user);
      this.render();
    } else if (action === 'followup') {
      const date = prompt('Enter next follow-up date (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);
      if (date) {
        db.updateRecord('leads', leadId, { next_follow_up_date: date, follow_up_type: 'Call' }, user);
        db.logActivity('followup scheduled', `Scheduled follow-up for ${date}`, 'leads', leadId, user);
        this.render();
      }
    } else if (action === 'assign') {
      if (user.role !== 'manager' && user.role !== 'team_lead') return alert('Access Denied');
      const newOwner = prompt('Enter new Owner ID:');
      if (newOwner) {
        db.updateRecord('leads', leadId, { owner_id: newOwner }, user);
        db.logActivity('owner reassigned', `Owner changed to ${newOwner}`, 'leads', leadId, user);
        this.render();
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.leadsManager = new LeadsManager();
});
