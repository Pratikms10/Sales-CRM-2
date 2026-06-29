import { useMemo, useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Card from '../components/UI/Card.jsx';
import Button from '../components/UI/Button.jsx';
import DataTable from '../components/UI/DataTable.jsx';
import Modal from '../components/UI/Modal.jsx';
import StatusBadge from '../components/UI/StatusBadge.jsx';
import { useDatabase } from '../context/DatabaseContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const SearchIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const ImportIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const ExportIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const BellIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const MoreVerticalIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>;
const CloseIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

const emptyLead = { company_name: '', contact_person: '', designation: '', email: '', phone: '', linkedin: '', website: '', industry: '', company_size: '', city: '', country: '', service_interest: 'None', source: 'None', status: 'New', priority: 'Medium', last_contact_date: '', next_follow_up_date: '', first_call_date: '', first_call_status: 'None', second_call_date: '', second_call_status: 'None', follow_up_type: 'None', remarks: '' };

const leadStatuses = ['New', 'Contacted', 'Interested', 'Follow-up', 'Requirement Expected', 'Not Interested', 'Dormant', 'Converted', 'Lost'];

const statusToStage = {
  'New': 'Prospecting',
  'Contacted': 'Outreach',
  'Interested': 'Follow-up',
  'Follow-up': 'Follow-up',
  'Requirement Expected': 'Requirement Gathering',
  'Not Interested': 'Lost',
  'Lost': 'Lost',
  'Dormant': 'Dormant',
  'Converted': 'Converted'
};

function RowActionMenu({ lead, onAction, canAssign }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="row-action-menu" onClick={e=>e.stopPropagation()}>
      <button className="icon-button" onClick={() => setOpen(!open)}><MoreVerticalIcon /></button>
      {open && (
        <>
          <div className="dropdown-overlay" onClick={() => setOpen(false)}></div>
          <div className="action-dropdown">
            <button onClick={() => { setOpen(false); onAction('open', lead); }}>Open full lead</button>
            <button onClick={() => { setOpen(false); onAction('edit', lead); }}>Edit lead</button>
            <button onClick={() => { setOpen(false); onAction('activity', lead); }}>Add follow-up</button>
            {canAssign && <button onClick={() => { setOpen(false); onAction('assign', lead); }}>Assign owner</button>}
            <button onClick={() => { setOpen(false); onAction('req', lead); }}>Convert to Requirement</button>
            <button onClick={() => { setOpen(false); onAction('client', lead); }}>Convert to Client</button>
            <button onClick={() => { setOpen(false); onAction('dormant', lead); }}>Mark Dormant</button>
            <button className="danger-text" onClick={() => { setOpen(false); onAction('lost', lead); }}>Mark Lost</button>
          </div>
        </>
      )}
    </div>
  );
}

export default function Leads() {
  const { records, create, update, activity } = useDatabase();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const didOpenFromQuery = useRef(false);

  const [globalSearch, setGlobalSearch] = useState('');
  const [filters, setFilters] = useState({ owner: '', status: '', priority: '', followUps: '', service: '', source: '', firstCall: '', secondCall: '' });

  const [editing, setEditing] = useState(null);
  const [drawer, setDrawer] = useState(null);
  const [activityModal, setActivityModal] = useState(null);
  const [newMenuOpen, setNewMenuOpen] = useState(false);
  const [importMessage, setImportMessage] = useState(false);

  const canAssign = currentUser?.role === 'manager' || currentUser?.role === 'team_lead';

  useEffect(() => {
    if (didOpenFromQuery.current) return;
    if (searchParams.get('action') === 'add') {
      didOpenFromQuery.current = true;
      setEditing(emptyLead);
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const leads = records('leads');

  const visible = useMemo(() => leads.filter((lead) => {
    const text = `${lead.id} ${lead.company_name} ${lead.contact_person} ${lead.email} ${lead.phone} ${lead.linkedin} ${lead.owner_id}`.toLowerCase();
    const gMatch = !globalSearch || text.includes(globalSearch.toLowerCase());
    const oMatch = !filters.owner || (lead.owner_id || '').toLowerCase().includes(filters.owner.toLowerCase());
    const stMatch = !filters.status || lead.status === filters.status;
    const prMatch = !filters.priority || lead.priority === filters.priority;
    const srvMatch = !filters.service || lead.service_interest === filters.service;
    const srcMatch = !filters.source || lead.source === filters.source;
    const fcMatch = !filters.firstCall || lead.first_call_status === filters.firstCall;
    const scMatch = !filters.secondCall || lead.second_call_status === filters.secondCall;

    let fuMatch = true;
    if (filters.followUps === 'Overdue Only') {
      const today = new Date().toISOString().slice(0, 10);
      fuMatch = lead.next_follow_up_date && lead.next_follow_up_date < today && !['Converted','Lost'].includes(lead.status);
    }

    return gMatch && oMatch && stMatch && prMatch && srvMatch && srcMatch && fcMatch && scMatch && fuMatch;
  }), [leads, globalSearch, filters]);

  const save = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const stage = statusToStage[data.status] || 'Prospecting';
    data.pipeline_stage = stage;

    let savedLead;
    if (editing.id) {
      savedLead = update('leads', editing.id, data);
    } else {
      savedLead = create('leads', data);
    }

    if (data.next_follow_up_date && !['Converted', 'Lost'].includes(data.status)) {
      create('tasks', { title: `Follow up with ${data.company_name}`, due_date: data.next_follow_up_date, related_entity: 'leads', related_id: savedLead.id, status: 'Pending', priority: data.priority });
    }

    if (drawer && drawer.id === savedLead.id) setDrawer(savedLead);
    setEditing(null);
  };

  const logAct = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    activity(data.type, data.description, 'leads', activityModal.id);
    update('leads', activityModal.id, {
      last_contact_date: new Date().toISOString().slice(0, 10),
      last_discussion: `${data.type}: ${data.description}`
    });
    setActivityModal(null);
    if (drawer) {
      const updated = leads.find(l => l.id === activityModal.id);
      if (updated) setDrawer(updated);
    }
  };

  const handleExport = () => {
    if (!canAssign) return;
    const header = columns.map(c => c.label).join(',');
    const rows = visible.map(r => columns.map(c => `"${(r[c.key] || '').toString().replace(/"/g, '""')}"`).join(','));
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-export-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  const assignOwner = (leadId) => {
    const newOwner = window.prompt("Enter new Owner ID:");
    if (newOwner) {
      const updated = update('leads', leadId, { owner_id: newOwner });
      if (drawer?.id === leadId) setDrawer(updated);
    }
  };

  const convertRequirement = (lead) => {
    if (['Converted', 'Lost'].includes(lead.status)) return;
    if (window.confirm(`Convert ${lead.company_name} to Requirement?`)) {
      const client = create('clients', { company_name: lead.company_name, industry: lead.industry, city: lead.city, country: lead.country });
      create('contacts', { first_name: lead.contact_person, last_name: '', email: lead.email, phone: lead.phone, company: lead.company_name, client_id: client.id });
      const req = create('requirements', { title: `${lead.company_name} Requirement`, company_name: lead.company_name, service_interest: lead.service_interest, priority: lead.priority, pipeline_stage: 'Requirement Gathering', status: 'Open' });
      const updated = update('leads', lead.id, { status: 'Converted', pipeline_stage: 'Converted', converted_requirement_id: req.id, converted_client_id: client.id });
      if (drawer?.id === lead.id) setDrawer(updated);
    }
  };

  const convertClient = (lead) => {
    if (['Converted', 'Lost'].includes(lead.status)) return;
    if (window.confirm(`Convert ${lead.company_name} to Client?`)) {
      const client = create('clients', { company_name: lead.company_name, industry: lead.industry, city: lead.city, country: lead.country });
      create('contacts', { first_name: lead.contact_person, last_name: '', email: lead.email, phone: lead.phone, company: lead.company_name, client_id: client.id });
      const updated = update('leads', lead.id, { status: 'Converted', pipeline_stage: 'Converted', converted_client_id: client.id });
      if (drawer?.id === lead.id) setDrawer(updated);
      activity('Status Change', 'Converted to Client', 'leads', lead.id);
    }
  };

  const setFilter = (k, v) => setFilters(prev => ({...prev, [k]: v}));
  const clearFilters = () => {
    setGlobalSearch('');
    setFilters({ owner: '', status: '', priority: '', followUps: '', service: '', source: '', firstCall: '', secondCall: '' });
  };

  const priorityColor = (p) => p === 'High' ? 'red' : p === 'Medium' ? 'amber' : 'green';
  const statusColor = (s) => {
    const c = { New: 'blue', Contacted: 'cyan', Interested: 'green', 'Follow-up': 'amber', 'Requirement Expected': 'purple', Converted: 'green', Lost: 'red' };
    return c[s] || 'muted';
  };

  const handleRowAction = (val, r) => {
    if (val === 'open') setDrawer(r);
    else if (val === 'edit') setEditing(r);
    else if (val === 'activity') setActivityModal(r);
    else if (val === 'assign' && canAssign) assignOwner(r.id);
    else if (val === 'req') convertRequirement(r);
    else if (val === 'client') convertClient(r);
    else if (val === 'dormant') { const u = update('leads', r.id, {status: 'Dormant', pipeline_stage: 'Dormant'}); if(drawer?.id===r.id) setDrawer(u); }
    else if (val === 'lost') { const u = update('leads', r.id, {status: 'Lost', pipeline_stage: 'Lost'}); if(drawer?.id===r.id) setDrawer(u); }
  };

  const columns = [
    { key: 'id', label: 'Lead ID' },
    { key: 'owner_id', label: 'Owner' },
    { key: 'company_name', label: 'Company Name' },
    { key: 'contact_person', label: 'Client' },
    { key: 'designation', label: 'Designation' },
    { key: 'email', label: 'Email', render: (r) => r.email ? <a href={`mailto:${r.email}`} onClick={e=>e.stopPropagation()}>{r.email}</a> : '' },
    { key: 'phone', label: 'Phone', render: (r) => r.phone ? <a href={`tel:${r.phone}`} onClick={e=>e.stopPropagation()}>{r.phone}</a> : '' },
    { key: 'linkedin', label: 'LinkedIn', render: (r) => r.linkedin ? <a href={r.linkedin} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()}>Profile</a> : '' },
    { key: 'website', label: 'Website', render: (r) => r.website ? <a href={r.website} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()}>Visit</a> : '' },
    { key: 'industry', label: 'Industry' },
    { key: 'company_size', label: 'Company Size' },
    { key: 'city', label: 'Headquarters' },
    { key: 'country', label: 'Locations' },
    { key: 'service_interest', label: 'Service Interest' },
    { key: 'source', label: 'Source' },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge tone={statusColor(r.status)}>{r.status}</StatusBadge> },
    { key: 'priority', label: 'Priority', render: (r) => <StatusBadge tone={priorityColor(r.priority)}>{r.priority}</StatusBadge> },
    { key: 'first_call_date', label: 'First Call' },
    { key: 'first_call_status', label: 'First Call Status' },
    { key: 'second_call_date', label: 'Second Call' },
    { key: 'second_call_status', label: 'Second Call Status' },
    { key: 'follow_up_type', label: 'Follow-up Status / Type' },
    { key: 'remarks', label: 'Comments / Remarks' },
    { key: 'actions', label: 'Action', render: (r) => <RowActionMenu lead={r} onAction={handleRowAction} canAssign={canAssign} /> }
  ];

  return (
    <div className="page leads-page">
      {/* Topbar */}
      <div className="leads-topbar">
        <div className="topbar-search">
          <SearchIcon />
          <input value={globalSearch} onChange={e=>setGlobalSearch(e.target.value)} placeholder="Search Lead ID, Company, Client, Email, Phone..." />
        </div>
        <div className="topbar-actions">
          <div className="new-dropdown-container">
            <Button onClick={() => setNewMenuOpen(!newMenuOpen)}>+ New</Button>
            {newMenuOpen && (
              <>
                <div className="dropdown-overlay" onClick={() => setNewMenuOpen(false)}></div>
                <div className="new-dropdown">
                  <div className="dropdown-label">Sales Flow</div>
                  <button onClick={() => { setEditing(emptyLead); setNewMenuOpen(false); }}>Add Lead</button>
                  <button onClick={() => { navigate('/requirements?action=add'); setNewMenuOpen(false); }}>Add Requirement</button>
                  <button onClick={() => { navigate('/deals?action=add'); setNewMenuOpen(false); }}>Add Deal</button>
                  {canAssign && (
                    <>
                      <div className="dropdown-divider"></div>
                      <div className="dropdown-label">Database</div>
                      <button onClick={() => { navigate('/database?section=contacts&action=add'); setNewMenuOpen(false); }}>Add Contact</button>
                      <button onClick={() => { navigate('/database?section=trainers&action=add'); setNewMenuOpen(false); }}>Add Trainer</button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
          <button className="icon-button" onClick={() => { setImportMessage(true); setTimeout(() => setImportMessage(false), 3000); }}><ImportIcon /></button>
          <button className="icon-button" onClick={handleExport} disabled={!canAssign}><ExportIcon /></button>
          <button className="icon-button"><BellIcon /></button>
          <div className="profile-chip">{currentUser?.name?.charAt(0) || 'U'}</div>
        </div>
      </div>
      {importMessage && <div className="inline-message">Import is not yet available in React.</div>}

      <Card className="leads-tracker-card">
        <div className="section-header">
          <h2>Leads Tracker</h2>
          <div className="header-actions">
            <Button onClick={() => setEditing(emptyLead)}>+ Add Lead</Button>
          </div>
        </div>

        {/* Filters */}
        <div className="advanced-filters">
          <div className="filter-grid">
            <input value={filters.owner} onChange={e=>setFilter('owner', e.target.value)} placeholder="Owner" />
            <select value={filters.status} onChange={e=>setFilter('status', e.target.value)}>
              <option value="">All Statuses</option>
              {leadStatuses.map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={filters.priority} onChange={e=>setFilter('priority', e.target.value)}>
              <option value="">All Priorities</option>
              <option>High</option><option>Medium</option><option>Low</option>
            </select>
            <select value={filters.followUps} onChange={e=>setFilter('followUps', e.target.value)}>
              <option value="">All Follow-ups</option>
              <option>Overdue Only</option>
            </select>
            <select value={filters.service} onChange={e=>setFilter('service', e.target.value)}>
              <option value="">All Services</option>
              <option>Corporate Training</option><option>Video Content Development</option><option>Automation Consulting</option>
            </select>
            <select value={filters.source} onChange={e=>setFilter('source', e.target.value)}>
              <option value="">All Sources</option>
              <option>LinkedIn</option><option>Referral</option><option>Website</option><option>Campaign</option><option>Cold Call</option><option>Email</option><option>Event</option><option>Existing Database</option>
            </select>
            <select value={filters.firstCall} onChange={e=>setFilter('firstCall', e.target.value)}>
              <option value="">All First Calls</option>
              <option>Not Called</option><option>Connected</option><option>Not Connected</option><option>Call Back Later</option><option>Interested</option><option>Not Interested</option><option>Requirement Expected</option><option>No Response</option><option>Wrong Contact</option>
            </select>
            <select value={filters.secondCall} onChange={e=>setFilter('secondCall', e.target.value)}>
              <option value="">All Second Calls</option>
              <option>Not Called</option><option>Connected</option><option>Not Connected</option><option>Call Back Later</option><option>Interested</option><option>Not Interested</option><option>Requirement Expected</option><option>No Response</option><option>Wrong Contact</option>
            </select>
            <Button variant="secondary" onClick={clearFilters}>Clear</Button>
          </div>
        </div>

        <div className="table-container leads-table">
          {visible.length === 0 ? <div className="empty-state">No leads found.</div> : <DataTable columns={columns} rows={visible} onRowClick={setDrawer} />}
        </div>
      </Card>

      {drawer && (
        <div className="lead-drawer-overlay" onClick={() => setDrawer(null)}>
          <div className="lead-drawer" onClick={e=>e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-title">
                <h3>{drawer.company_name}</h3>
                <p>{drawer.contact_person} • {drawer.designation}</p>
              </div>
              <button className="close-btn" onClick={() => setDrawer(null)}><CloseIcon /></button>
            </div>

            <div className="drawer-badges">
              <StatusBadge tone={statusColor(drawer.status)}>{drawer.status}</StatusBadge>
              <StatusBadge tone={priorityColor(drawer.priority)}>{drawer.priority}</StatusBadge>
              <StatusBadge tone="muted">Owner: {drawer.owner_id}</StatusBadge>
            </div>

            <div className="drawer-action-cards">
              <div className="card" onClick={() => { setEditing(drawer); setDrawer(null); }}>Edit Lead</div>
              <div className="card" onClick={() => convertRequirement(drawer)}>Convert to Requirement</div>
              <div className="card" onClick={() => convertClient(drawer)}>Convert to Client</div>
              <div className="card" onClick={() => setActivityModal(drawer)}>Add Follow-up</div>
              {canAssign && <div className="card" onClick={() => assignOwner(drawer.id)}>Assign Owner</div>}
              <div className="card" onClick={() => { const u = update('leads', drawer.id, {status: 'Dormant', pipeline_stage: 'Dormant'}); setDrawer(u); }}>Mark Dormant</div>
              <div className="card" onClick={() => { const u = update('leads', drawer.id, {status: 'Lost', pipeline_stage: 'Lost'}); setDrawer(u); }}>Mark Lost</div>
            </div>

            <div className="drawer-summaries">
              <Card><strong>Lead Stage:</strong> {drawer.pipeline_stage || '-'}</Card>
              <Card><strong>Priority:</strong> {drawer.priority || '-'}</Card>
              <Card><strong>Next Action:</strong> {drawer.next_follow_up_date || '-'}</Card>
            </div>

            <div className="drawer-content-sections">
              <section>
                <h4>1. Lead Profile</h4>
                <div className="info-grid">
                  <span><strong>Lead ID:</strong> {drawer.id}</span>
                  <span><strong>Owner:</strong> {drawer.owner_id}</span>
                  <span><strong>Client:</strong> {drawer.contact_person}</span>
                  <span><strong>Designation:</strong> {drawer.designation}</span>
                  <span><strong>Email:</strong> {drawer.email}</span>
                  <span><strong>Phone:</strong> {drawer.phone}</span>
                  <span><strong>LinkedIn:</strong> {drawer.linkedin}</span>
                  <span><strong>Website:</strong> {drawer.website}</span>
                </div>
              </section>
              <section>
                <h4>2. Company Details</h4>
                <div className="info-grid">
                  <span><strong>Company:</strong> {drawer.company_name}</span>
                  <span><strong>Industry:</strong> {drawer.industry}</span>
                  <span><strong>Size:</strong> {drawer.company_size}</span>
                  <span><strong>Headquarters:</strong> {drawer.city}</span>
                  <span><strong>Locations:</strong> {drawer.country}</span>
                  <span><strong>Service:</strong> {drawer.service_interest}</span>
                  <span><strong>Source:</strong> {drawer.source}</span>
                </div>
              </section>
              <section>
                <h4>3. Sales Tracking</h4>
                <div className="info-grid">
                  <span><strong>Status:</strong> {drawer.status}</span>
                  <span><strong>Priority:</strong> {drawer.priority}</span>
                  <span><strong>1st Call:</strong> {drawer.first_call_date} ({drawer.first_call_status})</span>
                  <span><strong>2nd Call:</strong> {drawer.second_call_date} ({drawer.second_call_status})</span>
                  <span><strong>Follow-up Type:</strong> {drawer.follow_up_type}</span>
                  <span><strong>Remarks:</strong> {drawer.remarks}</span>
                </div>
              </section>
              <section>
                <h4>4. Attachments</h4>
                <div className="info-grid">
                  <span><strong>Visiting Card:</strong> {drawer.visiting_card_ref || 'None'}</span>
                  <span><strong>Req Note:</strong> {drawer.requirement_note_ref || 'None'}</span>
                  <span><strong>Email Screenshot:</strong> {drawer.email_screenshot_ref || 'None'}</span>
                  <span><strong>Ref Document:</strong> {drawer.reference_document_ref || 'None'}</span>
                </div>
              </section>
              <section>
                <h4>5. Activity Timeline</h4>
                <div className="timeline">
                  {records('activities').filter(a => a.related_entity === 'leads' && a.related_id === drawer.id).map(act => (
                    <div key={act.id} className="timeline-item">
                      <strong>{act.type}</strong> - {new Date(act.created_at).toLocaleString()}
                      <p>{act.description}</p>
                    </div>
                  ))}
                  {(!records('activities').find(a => a.related_entity === 'leads' && a.related_id === drawer.id)) && <p>No activity logged yet.</p>}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <Modal title={editing.id ? 'Edit Lead' : 'Add Lead'} onClose={() => setEditing(null)}>
          <form className="form-grid" onSubmit={save}>
            <label>Company Name<input name="company_name" defaultValue={editing.company_name} required /></label>
            <label>Contact Person<input name="contact_person" defaultValue={editing.contact_person} required /></label>
            <label>Designation<input name="designation" defaultValue={editing.designation} /></label>
            <label>Email<input type="email" name="email" defaultValue={editing.email} /></label>
            <label>Phone<input name="phone" defaultValue={editing.phone} /></label>
            <label>LinkedIn<input name="linkedin" defaultValue={editing.linkedin} /></label>
            <label>Website<input name="website" defaultValue={editing.website} /></label>
            <label>Industry<input name="industry" defaultValue={editing.industry} /></label>
            <label>Company Size<input name="company_size" defaultValue={editing.company_size} /></label>
            <label>City<input name="city" defaultValue={editing.city} /></label>
            <label>Country<input name="country" defaultValue={editing.country} /></label>

            <label>Service Interest
              <select name="service_interest" defaultValue={editing.service_interest}>
                <option>None</option><option>Corporate Training</option><option>Video Content Development</option><option>Automation Consulting</option>
              </select>
            </label>
            <label>Source
              <select name="source" defaultValue={editing.source}>
                <option>None</option><option>LinkedIn</option><option>Referral</option><option>Website</option><option>Campaign</option><option>Cold Call</option><option>Email</option><option>Event</option><option>Existing Database</option>
              </select>
            </label>
            <label>Status
              <select name="status" defaultValue={editing.status}>
                {leadStatuses.map(s => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label>Priority
              <select name="priority" defaultValue={editing.priority}>
                <option>Low</option><option>Medium</option><option>High</option>
              </select>
            </label>

            <label>Last Contact Date<input type="date" name="last_contact_date" defaultValue={editing.last_contact_date} /></label>
            <label>Next Follow-up Date<input type="date" name="next_follow_up_date" defaultValue={editing.next_follow_up_date} /></label>

            <label>First Call Date<input type="date" name="first_call_date" defaultValue={editing.first_call_date} /></label>
            <label>First Call Status
              <select name="first_call_status" defaultValue={editing.first_call_status}>
                <option>None</option><option>Not Called</option><option>Connected</option><option>Not Connected</option><option>Call Back Later</option><option>Interested</option><option>Not Interested</option><option>Requirement Expected</option><option>No Response</option><option>Wrong Contact</option>
              </select>
            </label>
            <label>Second Call Date<input type="date" name="second_call_date" defaultValue={editing.second_call_date} /></label>
            <label>Second Call Status
              <select name="second_call_status" defaultValue={editing.second_call_status}>
                <option>None</option><option>Not Called</option><option>Connected</option><option>Not Connected</option><option>Call Back Later</option><option>Interested</option><option>Not Interested</option><option>Requirement Expected</option><option>No Response</option><option>Wrong Contact</option>
              </select>
            </label>
            <label>Follow-up Type
              <select name="follow_up_type" defaultValue={editing.follow_up_type}>
                <option>None</option><option>Call Follow-up</option><option>Email Follow-up</option><option>WhatsApp Follow-up</option><option>Meeting Follow-up</option><option>Proposal Follow-up</option><option>Requirement Follow-up</option><option>No Follow-up Set</option><option>Follow-up Completed</option><option>Follow-up Overdue</option>
              </select>
            </label>
            <label>Owner ID<input name="owner_id" defaultValue={editing.owner_id} /></label>
            <label className="full">Remarks<textarea name="remarks" defaultValue={editing.remarks} rows="2" /></label>
            <div className="modal-actions"><Button type="submit">Save</Button></div>
          </form>
        </Modal>
      )}

      {activityModal && (
        <Modal title="Log Activity" onClose={() => setActivityModal(null)}>
          <form className="form-grid" onSubmit={logAct}>
            <label className="full">Type
              <select name="type" required>
                <option>Call</option><option>Email</option><option>WhatsApp</option><option>LinkedIn</option><option>Meeting</option><option>Note</option>
              </select>
            </label>
            <label className="full">Discussion / Notes
              <textarea name="description" required rows="3" />
            </label>
            <div className="modal-actions"><Button type="submit">Save</Button></div>
          </form>
        </Modal>
      )}
    </div>
  );
}
