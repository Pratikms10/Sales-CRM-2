import { useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/UI/Card.jsx';
import Button from '../components/UI/Button.jsx';
import DataTable from '../components/UI/DataTable.jsx';
import Modal from '../components/UI/Modal.jsx';
import StatusBadge from '../components/UI/StatusBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useDatabase } from '../context/DatabaseContext.jsx';
import { PIPELINE_STAGES } from '../utils/crmStore.js';

/* Constants */

const STAGE_MEANINGS = {
  'Prospecting': 'Lead identified',
  'Outreach': 'First communication',
  'Follow-up': 'Conversation ongoing',
  'Requirement Gathering': 'Need discussed',
  'Proposal Shared': 'Proposal sent',
  'PO Pending': 'Purchase order awaited',
  'Sourcing': 'Trainer/vendor sourcing',
  'Converted': 'Deal confirmed',
  'Dormant': 'No active response',
  'Lost': 'Opportunity lost',
  'Post-Sale': 'Upsell possible'
};

const SERVICES = ['Corporate Training', 'Video Content Development', 'Automation Consulting'];
const TYPES = ['Lead', 'Requirement', 'Deal'];
const PRIORITIES = ['High', 'Medium', 'Low'];

/* Stage maps use lowercase keys for case-insensitive lookup */
const LEAD_STAGE_MAP = {
  'new': 'Prospecting', 'contacted': 'Outreach', 'interested': 'Follow-up',
  'follow-up': 'Follow-up', 'requirement expected': 'Requirement Gathering',
  'not interested': 'Lost', 'dormant': 'Dormant', 'converted': 'Converted', 'lost': 'Lost'
};

const REQ_STAGE_MAP = {
  'new': 'Requirement Gathering', 'open': 'Requirement Gathering',
  'proposal pending': 'Proposal Shared', 'po pending': 'PO Pending',
  'sourcing': 'Sourcing', 'converted': 'Converted', 'lost': 'Lost', 'on hold': 'Dormant'
};

const DEAL_STAGE_MAP = {
  'active': 'Converted', 'confirmed': 'Converted', 'planning': 'Converted', 'live': 'Converted',
  'completed': 'Post-Sale', 'closed': 'Post-Sale', 'lost': 'Lost'
};

/* SVG Icons */

const SearchIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const ExportIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const BellIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const CloseIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const ArrowLeftIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>;
const ArrowRightIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 6 15 12 9 18"/></svg>;

/* Helpers */

function inferStage(item, type) {
  if (item.pipeline_stage && PIPELINE_STAGES.includes(item.pipeline_stage)) return item.pipeline_stage;
  const status = (item.status || '').trim().toLowerCase();
  if (type === 'Lead') return LEAD_STAGE_MAP[status] || 'Prospecting';
  if (type === 'Requirement') return REQ_STAGE_MAP[status] || 'Requirement Gathering';
  return DEAL_STAGE_MAP[status] || 'Converted';
}

function normalize(item, type) {
  return {
    raw: item,
    source: type === 'Lead' ? 'leads' : type === 'Requirement' ? 'requirements' : 'deals',
    id: item.id,
    owner: item.owner_id || item.assigned_to || '-',
    opportunity: item.company_name || item.title || item.first_name || 'Untitled',
    type,
    service: item.service_interest || item.service_type || '-',
    priority: item.priority || 'Medium',
    due: item.next_follow_up_date || item.preferred_dates || item.close_date || item.start_date || item.due_date || '',
    age: item.created_at ? `${Math.max(0, Math.floor((Date.now() - new Date(item.created_at).getTime()) / 86400000))} days` : '0 days',
    action: item.next_step || item.follow_up_type || item.proposal_status || item.po_status || 'Follow-up',
    stage: inferStage(item, type),
    status: item.status || 'Active',
    team_id: item.team_id,
    note: item.remarks || item.notes || item.last_discussion || ''
  };
}

function priorityTone(p) { return p === 'High' ? 'red' : p === 'Medium' ? 'amber' : 'green'; }

function dueTone(dateStr) {
  if (!dateStr) return 'neutral';
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr); d.setHours(0, 0, 0, 0);
  if (d < today) return 'red';
  if (d.getTime() === today.getTime()) return 'amber';
  return 'neutral';
}

/* Main Component */

export default function Pipeline() {
  const { currentUser } = useAuth();
  const { records, create, update, activity, audit } = useDatabase();
  const navigate = useNavigate();

  /* State */
  const [query, setQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [followFilter, setFollowFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [view, setView] = useState('kanban');
  const [drawer, setDrawer] = useState(null);
  const [modal, setModal] = useState(null);
  const [noteModal, setNoteModal] = useState(null);
  const [activityOpen, setActivityOpen] = useState(false);
  const [unread, setUnread] = useState(false);
  const [newMenuOpen, setNewMenuOpen] = useState(false);

  const canAssign = currentUser?.role === 'manager' || currentUser?.role === 'team_lead';

  /* -- Data Aggregation ----------------------------------─ */

  const cards = useMemo(() => {
    const allLeads = records('leads').filter(l => {
      // Exclude leads already converted that have a linked requirement
      if (l.status === 'Converted' && l.converted_requirement_id) return false;
      return true;
    });
    const allReqs = records('requirements').filter(r => {
      // Exclude requirements already converted that have a linked deal
      if (r.status === 'Converted' && r.linked_deal_id) return false;
      return true;
    });
    const allDeals = records('deals');
    return [
      ...allLeads.map(r => normalize(r, 'Lead')),
      ...allReqs.map(r => normalize(r, 'Requirement')),
      ...allDeals.map(r => normalize(r, 'Deal'))
    ];
  }, [records]);

  const visible = useMemo(() => cards.filter(card => {
    const text = `${card.id} ${card.owner} ${card.opportunity} ${card.type} ${card.service} ${card.stage}`.toLowerCase();
    if (query && !text.includes(query.toLowerCase())) return false;
    if (stageFilter && card.stage !== stageFilter) return false;
    if (serviceFilter && card.service !== serviceFilter) return false;
    if (typeFilter && card.type !== typeFilter) return false;
    if (followFilter) {
      const dueDate = card.due ? new Date(card.due) : null;
      if (!dueDate) return false;
      const today = new Date(); today.setHours(0, 0, 0, 0);
      if (followFilter === 'Today' && dueDate.toDateString() !== today.toDateString()) return false;
      if (followFilter === 'Overdue' && dueDate >= today) return false;
      if (followFilter === 'This week') {
        const week = new Date(today); week.setDate(today.getDate() + 7);
        if (dueDate < today || dueDate > week) return false;
      }
    }
    return true;
  }), [cards, query, stageFilter, serviceFilter, typeFilter, followFilter]);

  /* Action Handlers */

  const logPipelineActivity = useCallback((title, card) => {
    activity(title, `${title} - ${card.id} - ${card.opportunity}`, card.source, card.id);
    setUnread(true);
  }, [activity]);

  const moveCard = useCallback((card, direction) => {
    const idx = PIPELINE_STAGES.indexOf(card.stage);
    const next = PIPELINE_STAGES[idx + direction];
    if (!next) return;
    update(card.source, card.id, { pipeline_stage: next });
    logPipelineActivity(`Stage moved to ${next}`, { ...card, stage: next });
    audit('stage_change', `Moved ${card.id} from ${card.stage} to ${next}`);
    if (drawer?.id === card.id) setDrawer(prev => ({ ...prev, stage: next }));
  }, [update, logPipelineActivity, audit, drawer]);

  const handleDrop = useCallback((e, targetStage) => {
    e.preventDefault();
    try {
      const payload = JSON.parse(e.dataTransfer.getData('application/json'));
      if (payload.stage === targetStage) return;
      update(payload.source, payload.id, { pipeline_stage: targetStage });
      logPipelineActivity(`Stage moved to ${targetStage}`, { ...payload, stage: targetStage });
      audit('stage_change', `Moved ${payload.id} from ${payload.stage} to ${targetStage}`);
    } catch { /* ignore invalid drag data */ }
  }, [update, logPipelineActivity, audit]);

  const handleAddNote = useCallback((card) => {
    setNoteModal(card);
  }, []);

  const saveNote = useCallback((e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    activity(data.type || 'Note', data.description, noteModal.source, noteModal.id);
    update(noteModal.source, noteModal.id, {
      last_contact_date: new Date().toISOString().slice(0, 10),
      remarks: data.description
    });
    setUnread(true);
    if (drawer?.id === noteModal.id) {
      setDrawer(prev => ({ ...prev, note: data.description, action: data.type || prev.action }));
    }
    setNoteModal(null);
  }, [activity, update, noteModal, drawer]);

  const handleAddFollowUp = useCallback((card) => {
    const dateStr = window.prompt('Enter follow-up date (YYYY-MM-DD):');
    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return;
    update(card.source, card.id, { next_follow_up_date: dateStr });
    create('tasks', {
      title: `Follow up with ${card.opportunity}`,
      description: 'Scheduled via Pipeline Kanban.',
      due_date: dateStr,
      related_entity: card.source,
      related_id: card.id,
      status: 'Pending',
      priority: card.priority
    });
    logPipelineActivity('Follow-up scheduled', card);
    if (drawer?.id === card.id) setDrawer(prev => ({ ...prev, due: dateStr }));
  }, [update, create, logPipelineActivity, drawer]);

  const handleAssignOwner = useCallback((card) => {
    const newOwner = window.prompt('Enter new Owner ID:');
    if (!newOwner) return;
    update(card.source, card.id, { owner_id: newOwner, assigned_to: newOwner });
    logPipelineActivity('Owner assigned', card);
    if (drawer?.id === card.id) setDrawer(prev => ({ ...prev, owner: newOwner }));
  }, [update, logPipelineActivity, drawer]);

  const handleConvertToDeal = useCallback((card) => {
    if (card.type === 'Deal') {
      update(card.source, card.id, { pipeline_stage: 'Converted', status: 'Confirmed' });
      logPipelineActivity('Moved to Converted', card);
      if (drawer?.id === card.id) setDrawer(prev => ({ ...prev, stage: 'Converted', status: 'Confirmed' }));
    } else if (card.type === 'Requirement') {
      if (!window.confirm(`Convert requirement "${card.opportunity}" to Deal?`)) return;
      const deal = create('deals', {
        title: card.opportunity,
        company_name: card.opportunity,
        service_interest: card.service,
        priority: card.priority,
        pipeline_stage: 'Converted',
        status: 'Confirmed',
        linked_source_id: card.id
      });
      update(card.source, card.id, { pipeline_stage: 'Converted', status: 'Converted', linked_deal_id: deal.id });
      logPipelineActivity('Converted to Deal', card);
      if (drawer?.id === card.id) setDrawer(prev => ({ ...prev, stage: 'Converted', status: 'Converted' }));
    } else {
      // Lead → convert to Requirement first
      if (!window.confirm(`Convert lead "${card.opportunity}" to Requirement?`)) return;
      const raw = card.raw;
      const client = create('clients', { company_name: raw.company_name || card.opportunity, industry: raw.industry, city: raw.city, country: raw.country });
      create('contacts', { first_name: raw.contact_person || '', last_name: '', email: raw.email, phone: raw.phone, company: raw.company_name, client_id: client.id });
      const req = create('requirements', {
        title: `${card.opportunity} Requirement`,
        company_name: card.opportunity,
        service_interest: card.service,
        priority: card.priority,
        pipeline_stage: 'Requirement Gathering',
        status: 'Open'
      });
      update(card.source, card.id, { status: 'Converted', pipeline_stage: 'Converted', converted_requirement_id: req.id, converted_client_id: client.id });
      logPipelineActivity('Converted to Requirement', card);
      if (drawer?.id === card.id) setDrawer(prev => ({ ...prev, stage: 'Converted', status: 'Converted' }));
    }
  }, [create, update, logPipelineActivity, drawer]);

  const handleMarkDormant = useCallback((card) => {
    if (!window.confirm(`Mark "${card.opportunity}" as Dormant?`)) return;
    const updates = { pipeline_stage: 'Dormant' };
    if (card.type === 'Lead') updates.status = 'Dormant';
    update(card.source, card.id, updates);
    logPipelineActivity('Marked Dormant', card);
    if (drawer?.id === card.id) setDrawer(prev => ({ ...prev, stage: 'Dormant', status: updates.status || prev.status }));
  }, [update, logPipelineActivity, drawer]);

  const handleMarkLost = useCallback((card) => {
    if (!window.confirm(`Mark "${card.opportunity}" as Lost?`)) return;
    update(card.source, card.id, { pipeline_stage: 'Lost', status: 'Lost' });
    logPipelineActivity('Marked Lost', card);
    if (drawer?.id === card.id) setDrawer(prev => ({ ...prev, stage: 'Lost', status: 'Lost' }));
  }, [update, logPipelineActivity, drawer]);

  /* Add / Edit Modal */

  const saveCard = useCallback((e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    if (modal.mode === 'edit') {
      const card = modal.card;
      const updates = {
        pipeline_stage: data.stage,
        service_interest: data.service,
        service_type: data.service,
        priority: data.priority,
        next_follow_up_date: data.due,
        next_step: data.action,
        remarks: data.action
      };
      // Title field mapping
      if (card.type === 'Lead') {
        updates.company_name = data.opportunity;
      } else {
        updates.title = data.opportunity;
      }
      // Owner update only if user is not employee
      if (canAssign && data.owner) {
        updates.owner_id = data.owner;
        updates.assigned_to = data.owner;
      }
      update(card.source, card.id, updates);
      logPipelineActivity('Card details edited', card);
      if (drawer?.id === card.id) {
        setDrawer(prev => ({
          ...prev,
          opportunity: data.opportunity,
          stage: data.stage,
          service: data.service,
          priority: data.priority,
          due: data.due,
          action: data.action,
          owner: data.owner || prev.owner
        }));
      }
    } else {
      // Add new card -- use the stage from the column that was clicked
      const type = data.type;
      const source = type === 'Lead' ? 'leads' : type === 'Requirement' ? 'requirements' : 'deals';
      const clickedStage = modal.stage || 'Prospecting';
      const payload = {
        pipeline_stage: clickedStage,
        priority: data.priority,
        next_follow_up_date: data.due,
        next_step: data.action,
        service_interest: data.service,
        service_type: data.service
      };
      if (type === 'Lead') {
        payload.company_name = data.opportunity;
        payload.status = 'New';
      } else if (type === 'Requirement') {
        payload.title = data.opportunity;
        payload.status = 'New';
      } else {
        // Deal: use clicked stage, do NOT override to Converted
        payload.title = data.opportunity;
        payload.company_name = data.opportunity;
        payload.status = 'Active';
      }
      const record = create(source, payload);
      logPipelineActivity('Pipeline card added', normalize(record, type));
    }
    setModal(null);
  }, [modal, update, create, logPipelineActivity, canAssign, drawer]);

  /* Export CSV */

  const exportCSV = useCallback(() => {
    const headers = ['ID', 'Owner', 'Opportunity', 'Type', 'Service', 'Priority', 'Due', 'Age', 'Next Action'];
    const lines = visible.map(c =>
      [c.id, c.owner, c.opportunity, c.type, c.service, c.priority, c.due, c.age, c.action]
        .map(v => `"${String(v || '').replace(/"/g, '""')}"`)
        .join(',')
    );
    const blob = new Blob([[headers.join(','), ...lines].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `technoedge-pipeline-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    audit('export', 'Exported visible pipeline CSV');
  }, [visible, audit]);

  /* Filters and Cards */

  const clearFilters = useCallback(() => {
    setQuery('');
    setStageFilter('');
    setServiceFilter('');
    setFollowFilter('');
    setTypeFilter('');
  }, []);

  /* Derived data */

  const stageCards = (stage) => visible.filter(c => c.stage === stage);
  const recentActivities = records('activities').slice(-12).reverse();
  const drawerActivities = drawer ? records('activities').filter(a => a.related_id === drawer.id) : [];

  /* List View Columns */

  const listColumns = [
    { key: 'id', label: 'ID' },
    { key: 'owner', label: 'Owner' },
    { key: 'opportunity', label: 'Opportunity' },
    { key: 'type', label: 'Type', render: r => <StatusBadge tone="blue">{r.type}</StatusBadge> },
    { key: 'service', label: 'Service' },
    { key: 'priority', label: 'Priority', render: r => <StatusBadge tone={priorityTone(r.priority)}>{r.priority}</StatusBadge> },
    { key: 'due', label: 'Due', render: r => r.due ? <StatusBadge tone={dueTone(r.due)}>{r.due}</StatusBadge> : '-' },
    { key: 'age', label: 'Age' },
    { key: 'action', label: 'Next Action' }
  ];

  /* Stages to render (respect filter) */

  const stagesToRender = stageFilter ? PIPELINE_STAGES.filter(s => s === stageFilter) : PIPELINE_STAGES;

  /* ══════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════ */

  return (
    <div className="page pipeline-page">

      {/* -- Top Bar --------------------------------------─ */}
      <div className="pipeline-topbar-row">
        <div className="topbar-search">
          <SearchIcon />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search Lead ID, Requirement ID, Deal ID, Company, Owner..."
          />
        </div>
        <div className="topbar-actions">
          <div className="new-dropdown-container">
            <Button onClick={() => setNewMenuOpen(!newMenuOpen)}>+ New</Button>
            {newMenuOpen && (
              <>
                <div className="dropdown-overlay" onClick={() => setNewMenuOpen(false)} />
                <div className="new-dropdown">
                  <div className="dropdown-label">Sales Flow</div>
                  <button onClick={() => { navigate('/leads?action=add'); setNewMenuOpen(false); }}>Add Lead</button>
                  <button onClick={() => { navigate('/requirements?action=add'); setNewMenuOpen(false); }}>Add Requirement</button>
                  <button onClick={() => { navigate('/deals?action=add'); setNewMenuOpen(false); }}>Add Deal</button>
                  {canAssign && (
                    <>
                      <div className="dropdown-divider" />
                      <div className="dropdown-label">Database</div>
                      <button onClick={() => { navigate('/database?section=contacts&action=add'); setNewMenuOpen(false); }}>Add Contact</button>
                      <button onClick={() => { navigate('/database?section=trainers&action=add'); setNewMenuOpen(false); }}>Add Trainer</button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
          <button className="icon-button" onClick={exportCSV} title="Export CSV"><ExportIcon /></button>
          <button className="icon-button bell" onClick={() => setActivityOpen(true)} title="Recent Activity">
            <BellIcon />
            {unread && <span className="notif-dot" />}
          </button>
          <div className="profile-chip-btn" style={{ cursor: 'default' }}>
            <div className="avatar-sm">{currentUser?.name?.charAt(0) || 'U'}</div>
            <div>
              <div className="profile-chip-name">{currentUser?.name || 'User'}</div>
              <div className="profile-chip-role">{currentUser?.role || 'user'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* -- Filters / Control Panel ----------------------─ */}
      <Card className="pipeline-control">
        <div className="control-title">
          <span className="icon-square">▦</span>
          <h2>Pipeline Kanban</h2>
        </div>
        <div className="control-row">
          <div className="filters">
            <select value={stageFilter} onChange={e => setStageFilter(e.target.value)}>
              <option value="">All Stages</option>
              {PIPELINE_STAGES.map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={serviceFilter} onChange={e => setServiceFilter(e.target.value)}>
              <option value="">All Services</option>
              {SERVICES.map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={followFilter} onChange={e => setFollowFilter(e.target.value)}>
              <option value="">All Follow-ups</option>
              <option>Today</option>
              <option>Overdue</option>
              <option>This week</option>
            </select>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="">All Types</option>
              {TYPES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="view-actions">
            <Button variant={view === 'kanban' ? 'primary' : 'secondary'} onClick={() => setView('kanban')}>Kanban</Button>
            <Button variant={view === 'list' ? 'primary' : 'secondary'} onClick={() => setView('list')}>List</Button>
            <Button variant="secondary" onClick={clearFilters}>Clear</Button>
          </div>
        </div>
      </Card>

      {/* -- Kanban View ----------------------------------─ */}
      {view === 'kanban' ? (
        <div className="kanban-scroll">
          {stagesToRender.map(stage => {
            const items = stageCards(stage);
            const stageIdx = PIPELINE_STAGES.indexOf(stage);
            return (
              <section
                className="kanban-col"
                key={stage}
                onDragOver={e => e.preventDefault()}
                onDrop={e => handleDrop(e, stage)}
              >
                <header>
                  <div>
                    <strong>{stage}</strong>
                    <p>{STAGE_MEANINGS[stage]}</p>
                  </div>
                  <span className="badge badge-neutral">{items.length}</span>
                  <button onClick={() => setModal({ mode: 'add', stage })} title={`Add card to ${stage}`}>+</button>
                </header>
                {items.map(card => (
                  <article
                    className="pipeline-card"
                    key={`${card.source}-${card.id}`}
                    draggable
                    onDragStart={e => e.dataTransfer.setData('application/json', JSON.stringify(card))}
                    onClick={() => setDrawer(card)}
                  >
                    <div className="card-line">
                      <h3>{card.opportunity}</h3>
                      <StatusBadge tone={priorityTone(card.priority)}>{card.priority}</StatusBadge>
                    </div>
                    <p>{card.id} · {card.type}</p>
                    <div className="card-meta">
                      <span>{card.due ? <StatusBadge tone={dueTone(card.due)}>{card.due}</StatusBadge> : 'No due date'}</span>
                      <span>{card.service}</span>
                      <span>Owner: {card.owner}</span>
                    </div>
                    <div className="card-actions">
                      <span>{card.action}</span>
                      <div>
                        {stageIdx > 0 && (
                          <button onClick={e => { e.stopPropagation(); moveCard(card, -1); }} title="Move left">
                            <ArrowLeftIcon />
                          </button>
                        )}
                        {stageIdx < PIPELINE_STAGES.length - 1 && (
                          <button onClick={e => { e.stopPropagation(); moveCard(card, 1); }} title="Move right">
                            <ArrowRightIcon />
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </section>
            );
          })}
        </div>
      ) : (
        /* -- List View ----------------------------------─ */
        <Card>
          <DataTable
            columns={listColumns}
            rows={visible}
            onRowClick={setDrawer}
            empty="No pipeline records found."
          />
        </Card>
      )}

      {/* -- Detail Drawer --------------------------------─ */}
      {drawer && (
        <div className="pipeline-drawer-overlay" onClick={() => setDrawer(null)}>
          <div className="pipeline-drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div className="avatar-sm">{(drawer.opportunity || 'U').charAt(0)}</div>
                <div className="drawer-title">
                  <h3>{drawer.opportunity}</h3>
                  <p>{drawer.id} · {drawer.type} <StatusBadge tone="blue">{drawer.stage}</StatusBadge></p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setDrawer(null)}><CloseIcon /></button>
            </div>

            {/* Action Buttons */}
            <div className="pipeline-action-cards">
              <button className="pipeline-action-btn" onClick={() => handleAddNote(drawer)}>Add Note</button>
              <button className="pipeline-action-btn" onClick={() => handleAddFollowUp(drawer)}>Add Follow-up</button>
              {canAssign && (
                <button className="pipeline-action-btn" onClick={() => handleAssignOwner(drawer)}>Assign Owner</button>
              )}
              <button className="pipeline-action-btn" onClick={() => handleConvertToDeal(drawer)}>Convert to Deal</button>
              <button className="pipeline-action-btn" onClick={() => handleMarkDormant(drawer)}>Mark Dormant</button>
              <button className="pipeline-action-btn pipeline-action-btn-danger" onClick={() => handleMarkLost(drawer)}>Mark Lost</button>
            </div>

            {/* Pipeline Card Details */}
            <Card>
              <div className="section-header" style={{ marginBottom: 16 }}>
                <h4>Pipeline Card Details</h4>
                <Button variant="secondary" onClick={() => setModal({ mode: 'edit', card: drawer })}>Edit</Button>
              </div>
              <div className="detail-grid">
                {[
                  ['ID', drawer.id],
                  ['Opportunity', drawer.opportunity],
                  ['Type', drawer.type],
                  ['Current Stage', drawer.stage],
                  ['Service', drawer.service],
                  ['Owner', drawer.owner],
                  ['Priority', drawer.priority],
                  ['Due', drawer.due || '-'],
                  ['Age', drawer.age],
                  ['Status', drawer.status],
                  ['Message / Note', drawer.note || drawer.action]
                ].map(([k, v]) => (
                  <div key={k}>
                    <small>{k}</small>
                    <strong>{v}</strong>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Activity for this card */}
            <Card>
              <h4>Recent Activity</h4>
              {drawerActivities.length === 0
                ? <p style={{ color: 'var(--muted)' }}>No activity logged yet.</p>
                : drawerActivities.slice(-8).reverse().map(a => (
                    <div className="activity-row" key={a.id}>
                      <StatusBadge tone="blue">{a.type}</StatusBadge>
                      <p style={{ margin: '6px 0 0', fontSize: 14 }}>{a.description}</p>
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>{new Date(a.created_at).toLocaleString()}</span>
                    </div>
                  ))
              }
            </Card>
          </div>
        </div>
      )}

      {/* -- Activity Drawer ------------------------------─ */}
      {activityOpen && (
        <div className="pipeline-drawer-overlay" onClick={() => setActivityOpen(false)}>
          <div className="pipeline-activity-drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Recent Activity</h3>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Button variant="secondary" onClick={() => setUnread(false)}>
                  {unread ? 'Mark read' : 'Read'}
                </Button>
                <button className="close-btn" onClick={() => setActivityOpen(false)}><CloseIcon /></button>
              </div>
            </div>
            <div className="drawer-body">
              {recentActivities.length === 0
                ? <p className="empty-state">No recent activity.</p>
                : recentActivities.map(a => {
                    const entity = a.related_entity || 'System';
                    const tag = entity === 'leads' ? 'Lead' : entity === 'requirements' ? 'Requirement' : entity === 'deals' ? 'Deal' : 'System';
                    return (
                      <div className="activity-row" key={a.id}>
                        <StatusBadge tone={tag === 'Lead' ? 'blue' : tag === 'Requirement' ? 'amber' : tag === 'Deal' ? 'green' : 'neutral'}>{tag}</StatusBadge>
                        <strong style={{ marginLeft: 8 }}>{a.type}</strong>
                        <p style={{ margin: '4px 0 0', fontSize: 14 }}>{a.description}</p>
                        <span className="activity-time">{new Date(a.created_at).toLocaleString()}</span>
                      </div>
                    );
                  })
              }
            </div>
          </div>
        </div>
      )}

      {/* -- Add Note Modal -------------------------------- */}
      {noteModal && (
        <Modal title={`Add Note - ${noteModal.opportunity}`} onClose={() => setNoteModal(null)}>
          <form className="form-grid" onSubmit={saveNote}>
            <label className="full">Type
              <select name="type">
                <option>Note</option>
                <option>Call</option>
                <option>Email</option>
                <option>Meeting</option>
                <option>WhatsApp</option>
              </select>
            </label>
            <label className="full">Description
              <textarea name="description" required rows="3" placeholder="Enter note or discussion details..." />
            </label>
            <div className="modal-actions">
              <Button variant="secondary" type="button" onClick={() => setNoteModal(null)}>Cancel</Button>
              <Button type="submit">Save Note</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* -- Add / Edit Pipeline Card Modal ---------------- */}
      {modal && (
        <Modal title={modal.mode === 'edit' ? 'Edit Pipeline Card' : 'Add Pipeline Card'} onClose={() => setModal(null)}>
          <form className="form-grid" onSubmit={saveCard}>
            {modal.mode === 'edit' && (
              <label>ID
                <input name="id" defaultValue={modal.card?.id || ''} disabled />
              </label>
            )}
            {modal.mode === 'edit' && (
              <label>Owner
                <input name="owner" defaultValue={modal.card?.owner || currentUser?.id || ''} disabled={!canAssign} />
              </label>
            )}
            <label>Opportunity / Title
              <input name="opportunity" defaultValue={modal.card?.opportunity || ''} required />
            </label>
            <label>Type
              <select name="type" defaultValue={modal.card?.type || 'Lead'} disabled={modal.mode === 'edit'}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </label>
            {modal.mode === 'edit' && (
              <label>Current Stage
                <select name="stage" defaultValue={modal.card?.stage || modal.stage || 'Prospecting'}>
                  {PIPELINE_STAGES.map(s => <option key={s}>{s}</option>)}
                </select>
              </label>
            )}
            <label>Service
              <select name="service" defaultValue={modal.card?.service || SERVICES[0]}>
                {SERVICES.map(s => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label>Priority
              <select name="priority" defaultValue={modal.card?.priority || 'Medium'}>
                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
              </select>
            </label>
            <label>Due Date
              <input type="date" name="due" defaultValue={modal.card?.due || ''} />
            </label>
            <label className="full">Next Action / Note
              <textarea name="action" defaultValue={modal.card?.action || modal.card?.note || ''} rows="3" />
            </label>
            <div className="modal-actions">
              <Button variant="secondary" type="button" onClick={() => setModal(null)}>Cancel</Button>
              <Button type="submit">{modal.mode === 'edit' ? 'Save Changes' : 'Add Card'}</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
