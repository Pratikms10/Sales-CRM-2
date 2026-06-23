class Database {
  constructor() {
    this.seedData();
  }

  seedData() {
    if (!localStorage.getItem('crm_records')) {
      const initialRecords = [
        {
          id: 'rec_1',
          title: 'Acme Corp Deal',
          owner_id: 'mgr1',
          assigned_to: 'mgr1',
          team_id: 'management',
          created_by: 'mgr1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'rec_2',
          title: 'Alpha Team Lead Project',
          owner_id: 'tl1',
          assigned_to: 'tl1',
          team_id: 'team_alpha',
          created_by: 'mgr1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'rec_3',
          title: 'Employee 1 Task',
          owner_id: 'emp1',
          assigned_to: 'emp1',
          team_id: 'team_alpha',
          created_by: 'tl1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'rec_4',
          title: 'Employee 2 Task',
          owner_id: 'emp2',
          assigned_to: 'emp2',
          team_id: 'team_beta',
          created_by: 'mgr1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      localStorage.setItem('crm_records', JSON.stringify(initialRecords));
    }

    if (!localStorage.getItem('crm_audits')) {
      localStorage.setItem('crm_audits', JSON.stringify([]));
    }
  }

  getRecords(user) {
    const allRecords = JSON.parse(localStorage.getItem('crm_records') || '[]');

    if (!user) return [];

    if (user.role === 'manager') {
      return allRecords;
    } else if (user.role === 'team_lead') {
      return allRecords.filter(r => r.team_id === user.team_id);
    } else if (user.role === 'employee') {
      return allRecords.filter(r =>
        r.owner_id === user.id ||
        r.assigned_to === user.id ||
        r.created_by === user.id
      );
    }
    return [];
  }

  addRecord(title, user) {
    const records = JSON.parse(localStorage.getItem('crm_records') || '[]');
    const newRecord = {
      id: 'rec_' + Math.random().toString(36).substr(2, 9),
      title: title,
      owner_id: user.id,
      assigned_to: user.id,
      team_id: user.team_id,
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    records.push(newRecord);
    localStorage.setItem('crm_records', JSON.stringify(records));

    this.logAudit('create', `Created record ${newRecord.id}`, user);
    return newRecord;
  }

  logAudit(action, details, user) {
    const allowedActions = ['login', 'logout', 'create', 'update', 'delete', 'assign', 'approve', 'import', 'export', 'stage_change'];
    if (!allowedActions.includes(action)) return;

    const audits = JSON.parse(localStorage.getItem('crm_audits') || '[]');
    audits.push({
      timestamp: new Date().toISOString(),
      action: action,
      details: details,
      user_id: user ? user.id : 'unknown',
      user_role: user ? user.role : 'unknown'
    });
    localStorage.setItem('crm_audits', JSON.stringify(audits));
  }

  getAudits() {
    return JSON.parse(localStorage.getItem('crm_audits') || '[]');
  }
}

const db = new Database();
