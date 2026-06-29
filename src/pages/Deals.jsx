import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../components/UI/Button.jsx';
import Modal from '../components/UI/Modal.jsx';
import StatusBadge from '../components/UI/StatusBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useDatabase } from '../context/DatabaseContext.jsx';

const SERVICES = ['Corporate Training', 'Video Content Development', 'Automation Consulting'];
const SERVICE_LABELS = { 'Corporate Training': 'Training', 'Video Content Development': 'Video', 'Automation Consulting': 'Automation' };
const DEAL_STATUSES = ['Planning', 'Confirmed', 'Live', 'Completed', 'Closed', 'Cancelled'];
const PAYMENT_STATUSES = ['Pending', 'Partial', 'Received', 'Overdue'];
const DELIVERY_STATUSES = ['Not Started', 'In Progress', 'Partially Completed', 'Completed', 'Cancelled'];
const MODE_OPTIONS = ['Online', 'Offline', 'Hybrid'];
const REMINDER_OPTIONS = ['Sent', 'Pending'];
const DUE_OPTIONS = ['10 days', '30 days', '45 days', 'Custom'];
const TRAINER_INVOICE_OPTIONS = ['Received', 'Pending'];
const TRAINER_PAYMENT_OPTIONS = ['Pending', 'Paid', 'Hold'];
const REIMBURSEMENT_OPTIONS = ['Uploaded', 'Pending'];
const REFERENCE_OPTIONS = ['Requested', 'Received', 'Not Asked'];
const TOUCHPOINT_OPTIONS = ['10 days', '15 days', '30 days', '45 days', 'Custom'];
const REPEAT_OPTIONS = ['Open', 'In Discussion', 'Won', 'Lost'];
const CLOSURE_OPTIONS = ['Open', 'Pending', 'Closed'];

const emptyDeal = {
  title: '', linked_source_id: '', company_name: '', service_interest: 'Corporate Training', contact_person: '',
  email: '', phone: '', amount: '', owner_id: '', start_date: '', end_date: '', time: '', days: '', hours: '',
  mode: 'Online', location: '', status: 'Planning', payment_status: 'Pending', delivery_status: 'Not Started',
  pipeline_stage: 'Converted', trainer_name: '', trainer_phone: '', trainer_email: '', trainer_rate: '',
  travel_details: '', booking_details: '', trainer_reminder: 'Pending', day1_feedback: '', certifications: '',
  labs: '', test: '', resource_links: '', primary_forms: '', secondary_forms: '', client_invoice_no: '',
  client_invoice_date: '', invoice_amount: '', payment_follow_up_date: '', payment_due_date_type: '30 days',
  trainer_invoice: 'Pending', trainer_payout_date: '', trainer_payment_status: 'Pending', trainer_due_term: '30 days',
  reimbursement_bills: 'Pending', reference_request: 'Not Asked', weekly_touchpoint: '15 days',
  repeat_business_status: 'Open', client_feedback: '', closure_status: 'Open'
};

const SearchIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;

function toneForStatus(status) {
  const s = (status || '').toLowerCase();
  if (s === 'completed' || s === 'closed') return 'green';
  if (s === 'live' || s === 'confirmed') return 'blue';
  if (s === 'planning') return 'amber';
  if (s === 'cancelled') return 'red';
  return 'neutral';
}

function toneForPayment(status) {
  const s = (status || '').toLowerCase();
  if (s === 'received' || s === 'paid') return 'green';
  if (s === 'partial') return 'amber';
  if (s === 'overdue') return 'red';
  return 'neutral';
}

function progressForDeal(deal) {
  const status = (deal?.status || '').toLowerCase();
  const delivery = (deal?.delivery_status || '').toLowerCase();
  const closure = (deal?.closure_status || '').toLowerCase();
  if (status === 'completed' || status === 'closed' || closure === 'closed') return 100;
  if (delivery === 'completed') return 85;
  if (delivery === 'partially completed') return 65;
  if (delivery === 'in progress' || status === 'live') return 45;
  if (status === 'confirmed') return 25;
  return 10;
}

function pad2(value) {
  return String(value).padStart(2, '0');
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function displayService(value) {
  return SERVICE_LABELS[value] || value || '-';
}

function Field({ label, value, onChange, type = 'text', options, textarea = false, disabled = false }) {
  return <label className="deal-field"><span>{label}</span>{options ? (
    <select value={value || ''} onChange={(event) => onChange(event.target.value)} disabled={disabled}>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  ) : textarea ? (
    <textarea rows="3" value={value || ''} onChange={(event) => onChange(event.target.value)} disabled={disabled} />
  ) : (
    <input type={type} value={value || ''} onChange={(event) => onChange(event.target.value)} disabled={disabled} />
  )}</label>;
}

export default function Deals() {
  const { currentUser } = useAuth();
  const { records, create, update, activity } = useDatabase();
  const [searchParams, setSearchParams] = useSearchParams();
  const didOpenFromQuery = useRef(false);

  const [topSearch, setTopSearch] = useState('');
  const [heroSearch, setHeroSearch] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [selectedDealId, setSelectedDealId] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [editing, setEditing] = useState(null);
  const [converting, setConverting] = useState(false);
  const [notice, setNotice] = useState('');

  const deals = records('deals');
  const requirements = records('requirements');
  const activities = records('activities');
  const selectedDeal = deals.find((deal) => deal.id === selectedDealId) || null;
  const canAssign = currentUser?.role === 'manager' || currentUser?.role === 'team_lead';

  useEffect(() => {
    if (didOpenFromQuery.current) return;
    if (searchParams.get('action') === 'add') {
      didOpenFromQuery.current = true;
      setEditing({ ...emptyDeal, owner_id: currentUser?.id || '' });
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
  }, [currentUser?.id, searchParams, setSearchParams]);

  useEffect(() => {
    if (selectedDealId && !selectedDeal) setSelectedDealId(null);
  }, [selectedDealId, selectedDeal]);

  const ownerOptions = useMemo(() => unique(deals.map((deal) => deal.owner_id || deal.assigned_to)), [deals]);

  const visibleDeals = useMemo(() => {
    const allSearch = `${topSearch} ${heroSearch}`.trim().toLowerCase();
    return deals.filter((deal) => {
      const haystack = [
        deal.id, deal.linked_source_id, deal.linked_requirement_id, deal.company_name, deal.title,
        deal.trainer_name, deal.vendor_name, deal.owner_id, deal.assigned_to, deal.payment_status,
        deal.closure_status, deal.delivery_status, deal.status, deal.service_interest
      ].join(' ').toLowerCase();
      if (allSearch && !haystack.includes(allSearch)) return false;
      if (ownerFilter && ![deal.owner_id, deal.assigned_to].includes(ownerFilter)) return false;
      if (statusFilter && deal.status !== statusFilter) return false;
      if (serviceFilter && deal.service_interest !== serviceFilter) return false;
      if (paymentFilter && deal.payment_status !== paymentFilter) return false;
      return true;
    }).reverse();
  }, [deals, heroSearch, ownerFilter, paymentFilter, serviceFilter, statusFilter, topSearch]);

  const eligibleRequirements = useMemo(() => requirements.filter((req) => {
    if ((req.status || '').toLowerCase() === 'converted' || req.linked_deal_id) return false;
    const ready = [req.po_status, req.approval_status, req.proposal_status, req.confirmation_type].join(' ').toLowerCase();
    return ready.includes('approved') || ready.includes('received') || ready.includes('accepted') || ready.includes('approval');
  }), [requirements]);

  const kpis = useMemo(() => {
    const active = deals.filter((deal) => !['Completed', 'Closed', 'Cancelled'].includes(deal.status)).length;
    const live = deals.filter((deal) => deal.status === 'Live' || deal.delivery_status === 'In Progress').length;
    const planning = deals.filter((deal) => deal.status === 'Planning' || !deal.trainer_name || !deal.booking_details).length;
    const completion = deals.filter((deal) => ['Completed', 'Partially Completed'].includes(deal.delivery_status) || ['Open', 'Pending'].includes(deal.closure_status)).length;
    const closure = deals.filter((deal) => ['Completed', 'Closed'].includes(deal.status) || ['Pending', 'Open'].includes(deal.closure_status)).length;
    return [
      ['Active deals', active, 'Confirmed projects'],
      ['Live delivery', live, 'Needs monitoring'],
      ['Planning', planning, 'Trainer / booking pending'],
      ['Completion', completion, 'Reports or feedback pending'],
      ['Closure', closure, 'Final action needed']
    ];
  }, [deals]);

  const workspaceActivities = useMemo(() => {
    if (!selectedDeal) return [];
    return activities.filter((item) => item.related_entity === 'deals' && item.related_id === selectedDeal.id).slice(-8).reverse();
  }, [activities, selectedDeal]);

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3200);
  };

  const logDealActivity = (type, description, dealId = selectedDeal?.id) => {
    if (!dealId) return;
    activity(type, description, 'deals', dealId);
  };

  const updateSelectedDeal = (field, value) => {
    if (!selectedDeal) return;
    const updates = { [field]: value };
    if (field === 'status' && value === 'Completed') {
      updates.delivery_status = 'Completed';
      updates.pipeline_stage = 'Post-Sale';
    }
    if (field === 'status' && value === 'Closed') {
      updates.closure_status = 'Closed';
      updates.pipeline_stage = 'Post-Sale';
    }
    update('deals', selectedDeal.id, updates);
    if (['status', 'payment_status', 'delivery_status', 'closure_status', 'trainer_payment_status'].includes(field)) {
      logDealActivity(`${field} updated`, `Changed ${field.replaceAll('_', ' ')} to ${value}`, selectedDeal.id);
    }
  };

  const clearFilters = () => {
    setTopSearch('');
    setHeroSearch('');
    setOwnerFilter('');
    setStatusFilter('');
    setServiceFilter('');
    setPaymentFilter('');
  };

  const openWorkspace = (deal) => {
    setSelectedDealId(deal.id);
    setActiveTab('details');
  };

  const markCompleted = () => {
    if (!selectedDeal) return;
    update('deals', selectedDeal.id, { status: 'Completed', delivery_status: 'Completed', closure_status: 'Pending', pipeline_stage: 'Post-Sale' });
    logDealActivity('Marked Completed', 'Deal marked completed and progress moved to 100%.', selectedDeal.id);
    showNotice('Deal marked completed.');
  };

  const saveDeal = (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const payload = { ...emptyDeal, ...data, amount: data.amount || '', invoice_amount: data.invoice_amount || data.amount || '' };
    if (editing?.id) {
      update('deals', editing.id, payload);
      logDealActivity('Deal Updated', `Updated ${payload.title || editing.id}`, editing.id);
      setSelectedDealId(editing.id);
    } else {
      const created = create('deals', payload);
      activity('Deal Created', `Created deal ${payload.title || created.id}`, 'deals', created.id);
      setSelectedDealId(created.id);
    }
    setEditing(null);
  };

  const startRequirementConversion = (requirement) => {
    setEditing({
      ...emptyDeal,
      linked_source_id: requirement.id,
      linked_requirement_id: requirement.id,
      title: requirement.title || `${requirement.company_name || 'Client'} Project`,
      company_name: requirement.company_name || requirement.client_name || '',
      service_interest: requirement.service_interest || requirement.service_type || 'Corporate Training',
      amount: requirement.budget || '',
      owner_id: requirement.owner_id || currentUser?.id || '',
      status: 'Confirmed'
    });
    setConverting(false);
  };

  const saveConvertedDeal = (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const sourceReq = requirements.find((req) => req.id === data.linked_source_id);
    if (!sourceReq || sourceReq.linked_deal_id || (sourceReq.status || '').toLowerCase() === 'converted') {
      showNotice('This requirement is already converted or no longer eligible.');
      setEditing(null);
      return;
    }
    const created = create('deals', { ...emptyDeal, ...data, status: 'Confirmed', pipeline_stage: 'Converted' });
    update('requirements', sourceReq.id, { status: 'Converted', pipeline_stage: 'Converted', linked_deal_id: created.id });
    activity('Converted to Deal', `Requirement converted to deal ${created.id}`, 'requirements', sourceReq.id);
    activity('Deal Created from Requirement', `Created from requirement ${sourceReq.id}`, 'deals', created.id);
    setSelectedDealId(created.id);
    setEditing(null);
  };

  const renderInput = (field, label, props = {}) => (
    <Field label={label} value={selectedDeal?.[field]} onChange={(value) => updateSelectedDeal(field, value)} {...props} />
  );

  return (
    <div className="page deals-page deal-mission-page">
      {notice && <div className="toast-notice">{notice}</div>}

      <header className="deal-top-header">
        <div className="deal-top-search"><SearchIcon /><input value={topSearch} onChange={(event) => setTopSearch(event.target.value)} placeholder="Search Deal ID, Requirement ID, Client, Project, Trainer, Owner..." /></div>
        <div className="deal-top-actions">
          <Button onClick={() => setEditing({ ...emptyDeal, owner_id: currentUser?.id || '' })}>+ New</Button>
          <div className="deal-profile-chip"><span>{(currentUser?.name || 'G').charAt(0)}</span><div><strong>{currentUser?.name || 'Guru'}</strong><small>{currentUser?.role === 'manager' ? 'Sales Manager' : currentUser?.role || 'Sales Manager'}</small></div></div>
        </div>
      </header>

      {!selectedDeal ? (
        <>
          <section className="deal-hero-panel">
            <div className="deal-hero-head">
              <div><p className="deal-eyebrow">Execution Workspace</p><h2>Deal Mission Control</h2><p>Delivery coordination, finance tracking, feedback and closure.</p></div>
              <div className="deal-hero-actions"><Button onClick={() => setEditing({ ...emptyDeal, owner_id: currentUser?.id || '' })}>Add Deal</Button><Button variant="secondary" onClick={() => setConverting(true)}>Convert from Requirement</Button></div>
            </div>
            <div className="deal-kpi-row">
              {kpis.map(([label, value, hint]) => <div className="deal-kpi-glass" key={label}><strong>{pad2(value)}</strong><span>{label}</span><small>{hint}</small></div>)}
            </div>
            <div className="deal-hero-filters">
              <input value={heroSearch} onChange={(event) => setHeroSearch(event.target.value)} placeholder="Search by client, project, trainer, payment, completion..." />
              <select value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)}><option value="">All Owners</option>{ownerOptions.map((owner) => <option key={owner} value={owner}>{owner}</option>)}</select>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="">All Statuses</option>{DEAL_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}</select>
              <select value={serviceFilter} onChange={(event) => setServiceFilter(event.target.value)}><option value="">All Services</option>{SERVICES.map((service) => <option key={service} value={service}>{displayService(service)}</option>)}</select>
              <select value={paymentFilter} onChange={(event) => setPaymentFilter(event.target.value)}><option value="">All Payments</option>{PAYMENT_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}</select>
              <button type="button" onClick={clearFilters}>Clear Filters</button>
            </div>
          </section>

          <section className="deal-flashcard-grid">
            {visibleDeals.length === 0 ? <div className="deal-empty-state">No deals match the current filters.</div> : visibleDeals.map((deal) => (
              <article className="deal-flashcard" key={deal.id} onClick={() => openWorkspace(deal)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter') openWorkspace(deal); }}>
                <div className="deal-card-top"><h3>{deal.title || 'Untitled Deal'}</h3><StatusBadge tone={toneForStatus(deal.status)}>{deal.status || 'Planning'}</StatusBadge></div>
                <p>{deal.company_name || 'Client pending'}</p>
                <div className="deal-pill-row"><span>{deal.id}</span>{(deal.linked_requirement_id || deal.linked_source_id) && <span>Req {deal.linked_requirement_id || deal.linked_source_id}</span>}</div>
                <dl>
                  <div><dt>Service</dt><dd>{displayService(deal.service_interest)}</dd></div>
                  <div><dt>Owner</dt><dd>{deal.owner_id || deal.assigned_to || '-'}</dd></div>
                  <div><dt>Trainer</dt><dd>{deal.trainer_name || 'Pending'}</dd></div>
                  <div><dt>Location / Mode</dt><dd>{deal.location || 'TBD'} - {deal.mode || 'Online'}</dd></div>
                  <div><dt>Schedule</dt><dd>{deal.start_date || '-'} - {deal.end_date || '-'}</dd></div>
                </dl>
              </article>
            ))}
          </section>
        </>
      ) : (
        <section className="deal-workspace-inline">
          <div className="deal-workspace-header">
            <div>
              <button className="deal-back-btn" onClick={() => setSelectedDealId(null)}>Back to Deals</button>
              <h2>{selectedDeal.title || 'Untitled Deal'}</h2>
              <p>{selectedDeal.company_name || 'Client pending'} - Deal ID {selectedDeal.id} {(selectedDeal.linked_requirement_id || selectedDeal.linked_source_id) ? `- Requirement ${selectedDeal.linked_requirement_id || selectedDeal.linked_source_id}` : ''}</p>
              <div className="deal-badge-row"><StatusBadge tone={toneForStatus(selectedDeal.status)}>{selectedDeal.status}</StatusBadge><StatusBadge tone={toneForPayment(selectedDeal.payment_status)}>{selectedDeal.payment_status}</StatusBadge></div>
            </div>
            <Button onClick={markCompleted} disabled={progressForDeal(selectedDeal) === 100}>Mark Completed</Button>
          </div>
          <div className="deal-progress"><span style={{ width: `${progressForDeal(selectedDeal)}%` }} /><strong>{progressForDeal(selectedDeal)}% Complete</strong></div>

          <nav className="deal-workspace-tabs">
            <button className={activeTab === 'details' ? 'active' : ''} onClick={() => setActiveTab('details')}>Details & Execution</button>
            <button className={activeTab === 'finance' ? 'active' : ''} onClick={() => setActiveTab('finance')}>Finance & Payments</button>
            <button className={activeTab === 'post' ? 'active' : ''} onClick={() => setActiveTab('post')}>Post-Sales & Completion</button>
          </nav>

          {activeTab === 'details' && <div className="deal-workspace-grid">
            <div className="deal-workspace-main">
              <section className="deal-panel"><h3>Deal Details</h3><div className="deal-field-grid">
                <Field label="Deal ID" value={selectedDeal.id} onChange={() => {}} disabled />
                {renderInput('linked_source_id', 'Linked Requirement ID')}
                {renderInput('company_name', 'Client Name')}
                {renderInput('title', 'Project / Training Name')}
                {renderInput('service_interest', 'Service Type', { options: SERVICES })}
                {renderInput('contact_person', 'Point of Contact')}
                {renderInput('email', 'Email ID', { type: 'email' })}
                {renderInput('phone', 'Contact Number')}
                {renderInput('amount', 'Deal Value Without GST', { type: 'number' })}
                {renderInput('owner_id', 'Deal Owner', { disabled: !canAssign })}
                {renderInput('start_date', 'Start Date', { type: 'date' })}
                {renderInput('end_date', 'End Date', { type: 'date' })}
                {renderInput('time', 'Time', { type: 'time' })}
                {renderInput('days', 'Days', { type: 'number' })}
                {renderInput('hours', 'Hours', { type: 'number' })}
                {renderInput('mode', 'Mode', { options: MODE_OPTIONS })}
                {renderInput('location', 'Location')}
                {renderInput('status', 'Status', { options: DEAL_STATUSES })}
              </div></section>

              <section className="deal-panel"><h3>Trainer / Client Coordination</h3><div className="deal-field-grid">
                {renderInput('trainer_name', 'Trainer Name')}
                {renderInput('trainer_phone', 'Trainer Phone Number')}
                {renderInput('trainer_email', 'Trainer Email ID', { type: 'email' })}
                {renderInput('trainer_rate', 'Trainer Rate Without GST', { type: 'number' })}
                {renderInput('travel_details', 'Travel Details')}
                {renderInput('booking_details', 'Booking Details')}
                {renderInput('trainer_reminder', 'Trainer Reminder', { options: REMINDER_OPTIONS })}
              </div></section>

              <section className="deal-panel"><h3>Delivery and Operations</h3><div className="deal-field-grid">
                {renderInput('delivery_status', 'Delivery Status', { options: DELIVERY_STATUSES })}
                {renderInput('day1_feedback', 'Day-1 Feedback')}
                {renderInput('certifications', 'Certifications')}
                {renderInput('labs', 'Labs')}
                {renderInput('test', 'Test')}
                {renderInput('resource_links', 'Resource Links')}
                {renderInput('primary_forms', 'Primary Forms')}
                {renderInput('secondary_forms', 'Secondary Forms')}
              </div></section>
            </div>
            <aside className="deal-workspace-side">
              <section className="deal-panel"><h3>Recent Activities</h3>{workspaceActivities.length === 0 ? <p className="muted">No recent activities.</p> : workspaceActivities.map((item) => <div className="deal-timeline-item" key={item.id}><strong>{item.type}</strong><span>{item.description}</span><small>{new Date(item.created_at).toLocaleString()}</small></div>)}</section>
              <section className="deal-panel"><h3>Key Documents</h3><div className="deal-document-list"><a href={selectedDeal.resource_links || '#'}>Resource Links</a><a href={selectedDeal.primary_forms || '#'}>Primary Forms</a><a href={selectedDeal.secondary_forms || '#'}>Secondary Forms</a></div></section>
              <section className="deal-panel"><h3>Next Action</h3><p><strong>{selectedDeal.trainer_reminder === 'Pending' ? 'Confirm trainer reminder' : 'Monitor delivery and payment status'}</strong></p><span>{selectedDeal.payment_follow_up_date ? `Payment follow-up on ${selectedDeal.payment_follow_up_date}` : 'Keep workspace fields updated as execution moves.'}</span></section>
            </aside>
          </div>}

          {activeTab === 'finance' && <div className="deal-two-panels">
            <section className="deal-panel"><h3>Client Payments</h3><div className="deal-field-grid">
              {renderInput('client_invoice_no', 'Client Invoice Number')}
              {renderInput('client_invoice_date', 'Client Invoice Date', { type: 'date' })}
              {renderInput('invoice_amount', 'Invoice Amount', { type: 'number' })}
              {renderInput('payment_status', 'Payment Status', { options: PAYMENT_STATUSES })}
              {renderInput('payment_follow_up_date', 'Payment Follow-up Date', { type: 'date' })}
              {renderInput('payment_due_date_type', 'Client Payment Due Date', { options: DUE_OPTIONS })}
            </div></section>
            <section className="deal-panel"><h3>Trainer / Vendor Payments</h3><div className="deal-field-grid">
              {renderInput('trainer_invoice', 'Trainer Invoice', { options: TRAINER_INVOICE_OPTIONS })}
              {renderInput('trainer_payout_date', 'Trainer Payout Date', { type: 'date' })}
              {renderInput('trainer_payment_status', 'Trainer Payment Status', { options: TRAINER_PAYMENT_OPTIONS })}
              {renderInput('trainer_due_term', 'Trainer Payment Due Date', { options: DUE_OPTIONS })}
              {renderInput('reimbursement_bills', 'Reimbursement Bills', { options: REIMBURSEMENT_OPTIONS })}
            </div></section>
          </div>}

          {activeTab === 'post' && <div className="deal-two-panels">
            <section className="deal-panel"><h3>Feedback and Completion</h3><div className="deal-field-grid">
              {renderInput('client_feedback', 'Client Feedback', { textarea: true })}
              {renderInput('closure_status', 'Final Closure Status', { options: CLOSURE_OPTIONS })}
            </div></section>
            <section className="deal-panel"><h3>Post-Sales</h3><div className="deal-field-grid">
              {renderInput('reference_request', 'Reference Request', { options: REFERENCE_OPTIONS })}
              {renderInput('weekly_touchpoint', 'Weekly Touchpoint', { options: TOUCHPOINT_OPTIONS })}
              {renderInput('repeat_business_status', 'Repeat Business Status', { options: REPEAT_OPTIONS })}
            </div></section>
          </div>}
        </section>
      )}

      {editing && !editing.linked_source_id && <Modal title={editing.id ? 'Edit Deal' : 'Add Deal'} onClose={() => setEditing(null)}><form className="form-grid" onSubmit={saveDeal}>
        <label>Project / Training Name<input name="title" defaultValue={editing.title} required /></label>
        <label>Client Name<input name="company_name" defaultValue={editing.company_name} required /></label>
        <label>Service Type<select name="service_interest" defaultValue={editing.service_interest}>{SERVICES.map((service) => <option key={service} value={service}>{displayService(service)}</option>)}</select></label>
        <label>Deal Value Without GST<input name="amount" type="number" defaultValue={editing.amount} /></label>
        <label>Owner ID<input name="owner_id" defaultValue={editing.owner_id || currentUser?.id || ''} disabled={!canAssign} /></label>
        <label>Status<select name="status" defaultValue={editing.status}>{DEAL_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
        <label>Payment Status<select name="payment_status" defaultValue={editing.payment_status}>{PAYMENT_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
        <label>Start Date<input name="start_date" type="date" defaultValue={editing.start_date} /></label>
        <label>End Date<input name="end_date" type="date" defaultValue={editing.end_date} /></label>
        <label>Mode<select name="mode" defaultValue={editing.mode}>{MODE_OPTIONS.map((mode) => <option key={mode}>{mode}</option>)}</select></label>
        <label>Location<input name="location" defaultValue={editing.location} /></label>
        <label>Trainer Name<input name="trainer_name" defaultValue={editing.trainer_name} /></label>
        <div className="modal-actions"><Button variant="secondary" type="button" onClick={() => setEditing(null)}>Cancel</Button><Button type="submit">Save Deal</Button></div>
      </form></Modal>}

      {converting && <Modal title="Convert Requirement to Deal" onClose={() => setConverting(false)}><div className="conversion-list">
        {eligibleRequirements.length === 0 ? <p className="empty-state">No eligible requirements ready for conversion.</p> : eligibleRequirements.map((requirement) => <button className="conversion-row" key={requirement.id} onClick={() => startRequirementConversion(requirement)}><strong>{requirement.title || requirement.company_name}</strong><span>{requirement.id} - {requirement.company_name || 'Client pending'}</span></button>)}
      </div></Modal>}

      {editing && editing.linked_source_id && <Modal title="Complete Conversion to Deal" onClose={() => setEditing(null)}><form className="form-grid" onSubmit={saveConvertedDeal}>
        <input type="hidden" name="linked_source_id" value={editing.linked_source_id} />
        <label>Project / Training Name<input name="title" defaultValue={editing.title} required /></label>
        <label>Client Name<input name="company_name" defaultValue={editing.company_name} required /></label>
        <label>Service Type<select name="service_interest" defaultValue={editing.service_interest}>{SERVICES.map((service) => <option key={service} value={service}>{displayService(service)}</option>)}</select></label>
        <label>Deal Value Without GST<input name="amount" type="number" defaultValue={editing.amount} /></label>
        <label>Owner ID<input name="owner_id" defaultValue={editing.owner_id} disabled={!canAssign} /></label>
        <div className="modal-actions"><Button variant="secondary" type="button" onClick={() => setEditing(null)}>Cancel</Button><Button type="submit">Create Deal & Convert</Button></div>
      </form></Modal>}
    </div>
  );
}
