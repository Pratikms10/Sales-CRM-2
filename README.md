# Sales CRM

A comprehensive, browser-based Sales CRM (Customer Relationship Management) system built with **React 18** and **Vite**. Designed for sales teams in corporate training, video content development, and automation consulting businesses.

> **Zero backend dependencies.** All data is persisted locally in the browser's `localStorage` via an internal `DatabaseContext`.

---

## ✨ Features

### 🔐 Role-Based Access Control
Three built-in roles with different permission levels, managed via `AuthContext`:

| Role | Access Level | Capabilities |
|------|-------------|--------------|
| **Manager** | Full Access | View all records, manage settings, view audit logs, import/export data |
| **Team Lead** | Team Access | View and manage records within their team, view audit logs |
| **Employee** | Own Access | View and manage only their own records |

### 📋 Leads Tracker
- Full lead lifecycle management from prospecting to conversion.
- Comprehensive lead details: company info, contact person, designation, email, phone, LinkedIn, website, industry, city/country.
- Multi-criteria filtering: status, priority, service interest, source, follow-up date, owner.
- Lead statuses: New → Contacted → Interested → Follow-up → Requirement Expected → Converted / Not Interested / Dormant / Lost.
- Activity logging per lead (Call, Email, WhatsApp, LinkedIn, Meeting, Note).

### 🔀 Pipeline Kanban Board
- Visual drag-and-drop pipeline view across sales stages.
- Stages: Prospecting → Outreach → Follow-up → Requirement Gathering → Proposal Shared → PO Pending → Sourcing → Converted → Post-Sale / Dormant / Lost.
- Filter by owner, stage, service, priority, and overdue follow-ups.
- Aggregates Leads, Requirements, and Deals into a single unified pipeline.

### 📝 Requirements & Sourcing
- Capture client requirements with full details: title, description, budget, priority, technology, audience, duration, mode, location.
- Proposal and PO tracking (proposal number, date, amount, version, approval status).
- Sourcing candidates with evaluation criteria: skill match, experience, commercial rate, availability, communication, subject expertise.

### 💼 Deals Mission Control
- End-to-end deal lifecycle workspace, featuring immediate-save tabs.
- **Details & Execution**: Delivery tracking (session plans, attendance, feedback), trainer/vendor assignment, coordination.
- **Finance & Payments**: Client invoicing, trainer payouts, reimbursements.
- **Post-Sales**: Client feedback, closure, upsell/cross-sell opportunities, reference requests, repeat business.
- Smart conversion workflows from Requirements directly into Deals.

### 🗄️ Database (Master Lists)
- **Clients**: Company details, industry, GST, billing/shipping addresses, account tier.
- **Contacts**: People linked to client companies with job titles and departments.
- **Trainers**: Expertise, daily rates, availability, certifications.
- **Vendors**: Services provided, payment terms, point of contact.
- **Service Lines**: Configurable service offerings.

### 📊 Reports / MIS
- Role-aware analytics and reporting.
- Insights based on lead conversion, pipeline health, deal performance.

### ⚙️ Settings & Import
- **Data Import**: Bulk import leads, contacts, clients, trainers, and vendors via CSV or JSON files with preview and validation before committing.
- **Duplicate Detection**: Automatic duplicate checking based on configurable keys (email, phone, company name, GST, LinkedIn).

### 📝 Audit Logs
- Comprehensive activity tracking for compliance and transparency.
- Logs all CRUD operations, logins/logouts, stage changes, assignments, and more.

---

## 🏗️ Project Structure

The project has been migrated to a component-driven React architecture:

```
Sales-CRM-2/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components (Modal, Button, StatusBadge, Layouts)
│   ├── context/            # React Contexts (AuthContext, DatabaseContext)
│   ├── pages/              # Route views (Dashboard, Leads, Pipeline, Deals, etc.)
│   ├── utils/              # Helper functions (crmStore.js for localStorage)
│   ├── App.jsx             # Main Router configuration
│   ├── main.jsx            # Application entry point
│   └── styles.css          # Global styling and specific page styles
├── index.html              # Vite entry template
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- `npm` or `yarn`

### Installation
1. Clone the repository or extract the source folder.
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally (Development)
Start the Vite development server:
```bash
npm run dev
```
Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production
To create a production-ready build:
```bash
npm run build
```
The optimized static files will be placed in the `dist` directory. You can preview the build using:
```bash
npm run preview
```

### Login
On the login screen, select a role to log in:
- **Manager (Full Access)** — Alice
- **Team Lead (Team Access)** — Bob
- **Employee (Own Access)** — Charlie

> No password required. This is a demo/prototype authentication system.

---

## 📦 Data Model

The CRM manages multiple entity types persisted locally via `crmStore.js`.
Key collections include:
- `users`, `teams`, `service_lines`
- `leads`, `contacts`, `clients`, `requirements`, `deals`
- `sourcing_candidates`, `trainers`, `vendors`
- `tasks`, `activities`, `auditLogs`

---

## 🔒 Security Model

### Record-Level Access Control
- **Manager**: Can access all records across all teams.
- **Team Lead**: Can access records belonging to their team (`team_id` match).
- **Employee**: Can only access records they own (`owner_id`), are assigned to (`assigned_to`), or created (`created_by`).

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Core Framework** | React 18 |
| **Build Tool** | Vite |
| **Routing** | React Router DOM |
| **Styling** | Vanilla CSS (via `styles.css`) |
| **Storage** | Browser `localStorage` |

---

## ⚠️ Important Notes

- **Data Persistence**: All data is stored in the browser's `localStorage`. Clearing browser data will reset the application.
- **Seed Data**: On first load, the system seeds sample data for demonstration purposes. This only happens once.
- **No Backend**: This is a fully client-side application. There is no server, API, or database — everything runs natively in the browser via Context.
- **Single Browser**: Data is local to the browser instance. Different browsers or devices will have separate data stores.

---

## 📄 License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.
