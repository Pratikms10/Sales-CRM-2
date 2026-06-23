class ReportsManager {
  constructor() {
    this.bindEvents();
  }

  bindEvents() {
    const reportType = document.getElementById('report-type');
    if (reportType) {
      reportType.addEventListener('change', () => this.render());
    }
  }

  escapeHTML(str) {
    if (str === null || str === undefined || str === '') return '-';
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  formatDate(value) {
    if (!value) return '-';
    const d = new Date(value);
    if (isNaN(d)) return '-';
    return d.toLocaleDateString();
  }

  isWithinDateRange(dateStr, start, end) {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (isNaN(d)) return false;

    if (start) {
      const s = new Date(start);
      s.setHours(0,0,0,0);
      if (d < s) return false;
    }
    if (end) {
      const e = new Date(end);
      e.setHours(23,59,59,999);
      if (d > e) return false;
    }
    return true;
  }

  formatCurrency(val) {
    const num = parseFloat(val);
    if (isNaN(num)) return '-';
    return '$' + num.toLocaleString();
  }

  render() {
    const type = document.getElementById('report-type').value;
    const startDate = document.getElementById('report-start-date').value;
    const endDate = document.getElementById('report-end-date').value;
    const user = auth.getCurrentUser();

    if (type === 'sales') this.generateSalesMIS(startDate, endDate, user);
    else if (type === 'personal') this.generatePersonalMIS(startDate, endDate, user);
    else if (type === 'deals') this.generateDealMIS(startDate, endDate, user);
    else if (type === 'revenue') this.generateRevenueSummary(startDate, endDate, user);
    else if (type === 'pending') this.generatePendingPayments(startDate, endDate, user);
    else if (type === 'datewise') this.generateDatewiseReports(startDate, endDate, user);
    else if (type === 'owner') this.generateOwnerwisePerformance(startDate, endDate, user);
    else if (type === 'service') this.generateServiceLinePerformance(startDate, endDate, user);
    else if (type === 'followup') this.generateFollowupOverdue(startDate, endDate, user);
  }

  renderKPIs(kpis) {
    const container = document.getElementById('report-kpis');
    container.innerHTML = '';
    kpis.forEach(kpi => {
      container.innerHTML += `
        <div style="flex: 1; min-width: 150px; background: var(--surface-card); padding: 15px; border-radius: 8px; text-align: center; border: 1px solid var(--hairline);">
          <div style="font-size: 0.9em; color: var(--muted);">${this.escapeHTML(kpi.label)}</div>
          <div style="font-size: 1.5em; font-weight: bold; color: var(--primary);">${this.escapeHTML(kpi.value)}</div>
        </div>
      `;
    });
  }

  renderTable(headers, rows) {
    const container = document.getElementById('report-table-container');
    if (rows.length === 0) {
      container.innerHTML = '<p>No data found for the selected criteria.</p>';
      return;
    }

    let html = '<table class="data-table"><thead><tr>';
    headers.forEach(h => html += `<th>${this.escapeHTML(h)}</th>`);
    html += '</tr></thead><tbody>';

    rows.forEach(row => {
      html += '<tr>';
      row.forEach(cell => html += `<td>${this.escapeHTML(cell)}</td>`);
      html += '</tr>';
    });

    html += '</tbody></table>';
    container.innerHTML = html;
  }

  // 1. Sales MIS
  generateSalesMIS(start, end, user) {
    let leads = db.getRecords('leads', user);
    let reqs = db.getRecords('requirements', user);

    if (start || end) {
      leads = leads.filter(r => this.isWithinDateRange(r.created_at, start, end));
      reqs = reqs.filter(r => this.isWithinDateRange(r.created_at, start, end));
    }

    this.renderKPIs([
      { label: 'Total Leads', value: leads.length },
      { label: 'Converted Leads', value: leads.filter(l => l.pipeline_stage === 'Converted').length },
      { label: 'Total Requirements', value: reqs.length },
      { label: 'Live Reqs (Sourcing)', value: reqs.filter(r => r.pipeline_stage === 'Sourcing').length }
    ]);

    document.getElementById('report-table-title').innerText = 'Leads & Requirements Overview';

    const headers = ['Entity Type', 'Name / Title', 'Client / Company', 'Stage', 'Priority', 'Created At'];
    const rows = [];

    leads.forEach(l => {
      rows.push(['Lead', `${l.first_name} ${l.last_name}`, l.company_name, l.pipeline_stage, l.priority, this.formatDate(l.created_at)]);
    });
    reqs.forEach(r => {
      rows.push(['Requirement', r.title, r.company_name, r.pipeline_stage, r.priority, this.formatDate(r.created_at)]);
    });

    this.renderTable(headers, rows);
  }

  // 2. Personal MIS
  generatePersonalMIS(start, end, user) {
    const allLeads = db.getRecords('leads', user).filter(r => r.owner_id === user.id);
    const allDeals = db.getRecords('deals', user).filter(r => r.owner_id === user.id);
    const allTasks = db.getRecords('tasks', user).filter(r => r.owner_id === user.id || r.assigned_to === user.id);

    let leads = allLeads;
    let deals = allDeals;
    let tasks = allTasks;

    if (start || end) {
      leads = leads.filter(r => this.isWithinDateRange(r.created_at, start, end));
      deals = deals.filter(r => this.isWithinDateRange(r.created_at, start, end));
      tasks = tasks.filter(r => this.isWithinDateRange(r.created_at, start, end));
    }

    this.renderKPIs([
      { label: 'My Leads', value: leads.length },
      { label: 'My Deals', value: deals.length },
      { label: 'Pending Tasks', value: tasks.filter(t => t.status !== 'Completed').length }
    ]);

    document.getElementById('report-table-title').innerText = 'My Active Pipeline';
    const headers = ['Type', 'Title', 'Status/Stage', 'Value/Priority', 'Due/Created Date'];
    const rows = [];

    leads.forEach(l => rows.push(['Lead', l.company_name, l.pipeline_stage, l.priority, this.formatDate(l.created_at)]));
    deals.forEach(d => rows.push(['Deal', d.title, d.status, this.formatCurrency(d.amount), this.formatDate(d.created_at)]));
    tasks.filter(t => t.status !== 'Completed').forEach(t => rows.push(['Task', t.title, t.status, t.priority, this.formatDate(t.due_date)]));

    this.renderTable(headers, rows);
  }

  // 3. Deal MIS
  generateDealMIS(start, end, user) {
    let deals = db.getRecords('deals', user);
    if (start || end) {
      deals = deals.filter(r => this.isWithinDateRange(r.created_at, start, end));
    }

    this.renderKPIs([
      { label: 'Total Deals', value: deals.length },
      { label: 'Live Deals', value: deals.filter(d => d.status === 'Live').length },
      { label: 'Confirmed Deals', value: deals.filter(d => d.status === 'Confirmed').length },
      { label: 'Completed Deals', value: deals.filter(d => d.status === 'Completed').length }
    ]);

    document.getElementById('report-table-title').innerText = 'Deals Detail';
    const headers = ['Deal Title', 'Project Name', 'Client ID', 'Amount', 'Status', 'Start Date', 'End Date'];
    const rows = deals.map(d => [
      d.title, d.project_name, d.client_id, this.formatCurrency(d.amount), d.status, d.start_date, d.end_date
    ]);

    this.renderTable(headers, rows);
  }

  // 4. Revenue Summary
  generateRevenueSummary(start, end, user) {
    let deals = db.getRecords('deals', user).filter(d => d.status === 'Confirmed' || d.status === 'Live' || d.status === 'Completed' || d.status === 'Closed');
    if (start || end) {
      deals = deals.filter(r => this.isWithinDateRange(r.created_at, start, end));
    }

    const totalRev = deals.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);

    this.renderKPIs([
      { label: 'Total Won Revenue', value: this.formatCurrency(totalRev) },
      { label: 'Deals Count', value: deals.length }
    ]);

    document.getElementById('report-table-title').innerText = 'Revenue Breakdown (Won Deals)';
    const headers = ['Deal Title', 'Service Type', 'Amount', 'Status', 'Owner'];
    const rows = deals.map(d => [
      d.title, d.service_type, this.formatCurrency(d.amount), d.status, d.owner_id
    ]);

    this.renderTable(headers, rows);
  }

  // 5. Pending Payments
  generatePendingPayments(start, end, user) {
    let deals = db.getRecords('deals', user).filter(d => d.payment_status && d.payment_status.toLowerCase() !== 'paid');
    let invoices = db.getRecords('invoices', user).filter(i => i.status && i.status.toLowerCase() !== 'paid');

    if (start || end) {
      deals = deals.filter(r => this.isWithinDateRange(r.payment_followup_date, start, end));
      invoices = invoices.filter(r => this.isWithinDateRange(r.due_date, start, end));
    }

    this.renderKPIs([
      { label: 'Deals Pending Payment', value: deals.length },
      { label: 'Unpaid Invoices', value: invoices.length }
    ]);

    document.getElementById('report-table-title').innerText = 'Overdue / Pending Collections';
    const headers = ['Entity', 'Reference', 'Amount', 'Status', 'Due / Follow-up Date'];
    const rows = [];

    deals.forEach(d => rows.push(['Deal Payment', d.title, this.formatCurrency(d.invoice_amount || d.amount), d.payment_status, d.payment_followup_date || '-']));
    invoices.forEach(i => rows.push(['Invoice', i.invoice_number, this.formatCurrency(i.amount), i.status, i.due_date || '-']));

    this.renderTable(headers, rows);
  }

  // 6. Date-wise Reports
  generateDatewiseReports(start, end, user) {
    let leads = db.getRecords('leads', user);
    let deals = db.getRecords('deals', user);

    if (start || end) {
      leads = leads.filter(r => this.isWithinDateRange(r.created_at, start, end));
      deals = deals.filter(r => this.isWithinDateRange(r.created_at, start, end));
    }

    this.renderKPIs([
      { label: 'New Leads', value: leads.length },
      { label: 'New Deals', value: deals.length }
    ]);

    document.getElementById('report-table-title').innerText = 'Records Created in Date Range';
    const headers = ['Date Created', 'Type', 'Title / Name', 'Owner', 'Stage / Status'];
    const rows = [];

    leads.forEach(l => rows.push([this.formatDate(l.created_at), 'Lead', l.company_name, l.owner_id, l.pipeline_stage]));
    deals.forEach(d => rows.push([this.formatDate(d.created_at), 'Deal', d.title, d.owner_id, d.status]));

    // Sort by date
    rows.sort((a, b) => new Date(b[0]) - new Date(a[0]));

    this.renderTable(headers, rows);
  }

  // 7. Owner-wise Performance
  generateOwnerwisePerformance(start, end, user) {
    let deals = db.getRecords('deals', user);
    if (start || end) {
      deals = deals.filter(r => this.isWithinDateRange(r.created_at, start, end));
    }

    const perf = {};
    deals.forEach(d => {
      const owner = d.owner_id || 'Unassigned';
      if (!perf[owner]) perf[owner] = { count: 0, revenue: 0, won: 0 };
      perf[owner].count++;
      if (['Confirmed', 'Live', 'Completed', 'Closed'].includes(d.status)) {
        perf[owner].won++;
        perf[owner].revenue += (parseFloat(d.amount) || 0);
      }
    });

    this.renderKPIs([
      { label: 'Total Owners Tracked', value: Object.keys(perf).length }
    ]);

    document.getElementById('report-table-title').innerText = 'Performance by Owner';
    const headers = ['Owner ID', 'Total Deals', 'Won Deals', 'Won Revenue'];
    const rows = Object.keys(perf).map(owner => [
      owner, perf[owner].count, perf[owner].won, this.formatCurrency(perf[owner].revenue)
    ]);

    this.renderTable(headers, rows);
  }

  // 8. Service-line Performance
  generateServiceLinePerformance(start, end, user) {
    let deals = db.getRecords('deals', user);
    if (start || end) {
      deals = deals.filter(r => this.isWithinDateRange(r.created_at, start, end));
    }

    const perf = {};
    deals.forEach(d => {
      const service = d.service_type || d.service_interest || 'Uncategorized';
      if (!perf[service]) perf[service] = { count: 0, revenue: 0 };
      perf[service].count++;
      if (['Confirmed', 'Live', 'Completed', 'Closed'].includes(d.status)) {
        perf[service].revenue += (parseFloat(d.amount) || 0);
      }
    });

    this.renderKPIs([
      { label: 'Service Lines Tracked', value: Object.keys(perf).length }
    ]);

    document.getElementById('report-table-title').innerText = 'Performance by Service Line';
    const headers = ['Service Line', 'Total Deals', 'Won Revenue'];
    const rows = Object.keys(perf).map(service => [
      service, perf[service].count, this.formatCurrency(perf[service].revenue)
    ]);

    this.renderTable(headers, rows);
  }

  // 9. Follow-up & Overdue Tasks
  generateFollowupOverdue(start, end, user) {
    const todayStr = new Date().toISOString().split('T')[0];

    let tasks = db.getRecords('tasks', user).filter(t => t.status !== 'Completed');
    let leads = db.getRecords('leads', user).filter(l => l.next_follow_up_date);
    let deals = db.getRecords('deals', user).filter(d => d.payment_followup_date);

    if (start || end) {
      tasks = tasks.filter(r => this.isWithinDateRange(r.due_date, start, end));
      leads = leads.filter(r => this.isWithinDateRange(r.next_follow_up_date, start, end));
      deals = deals.filter(r => this.isWithinDateRange(r.payment_followup_date, start, end));
    }

    const overdueTasks = tasks.filter(t => t.due_date && t.due_date < todayStr).length;

    this.renderKPIs([
      { label: 'Pending Tasks', value: tasks.length },
      { label: 'Overdue Tasks', value: overdueTasks },
      { label: 'Lead Follow-ups', value: leads.length }
    ]);

    document.getElementById('report-table-title').innerText = 'Follow-ups and Tasks';
    const headers = ['Type', 'Title / Contact', 'Due Date', 'Status', 'Owner'];
    const rows = [];

    tasks.forEach(t => rows.push(['Task', t.title, t.due_date, t.status, t.assigned_to]));
    leads.forEach(l => rows.push(['Lead Follow-up', l.company_name, l.next_follow_up_date, l.pipeline_stage, l.owner_id]));
    deals.forEach(d => rows.push(['Payment Follow-up', d.title, d.payment_followup_date, d.payment_status, d.owner_id]));

    // Sort by due date ascending
    rows.sort((a, b) => new Date(a[2] || '2099-01-01') - new Date(b[2] || '2099-01-01'));

    this.renderTable(headers, rows);
  }

  exportCSV() {
    const table = document.querySelector('#report-table-container table');
    if (!table) {
      alert("No data available to export.");
      return;
    }

    let csvContent = "";
    const rows = table.querySelectorAll('tr');

    rows.forEach(row => {
      const cols = row.querySelectorAll('th, td');
      const rowData = [];
      cols.forEach(col => {
        let text = col.innerText.replace(/"/g, '""');
        rowData.push(`"${text}"`);
      });
      csvContent += rowData.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute("download", `CRM_Report_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.reportsManager = new ReportsManager();
});
