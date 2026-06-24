# AI Change Audit Report

## Generated On
2026-06-24_17-46-48

## Branch
main

## Baseline Commit
de4429f

## Task Summary
Apply Unstop-inspired universal CRM design system and replace previous sales CRM design document

## Git Status
```text
 A "UNSTOP CRM DESIGN.md"
 M css/style.css
 M js/database.js
 M js/reports.js
D  "sales crm design.md"
```

## Files Changed
```text
A	UNSTOP CRM DESIGN.md
M	css/style.css
M	js/database.js
M	js/reports.js
D	sales crm design.md
```

## Change Summary
```text
 UNSTOP CRM DESIGN.md | 145 +++++++++++++
 css/style.css        | 256 ++++++++++++++--------
 js/database.js       |   4 +-
 js/reports.js        |   2 +-
 sales crm design.md  | 593 ---------------------------------------------------
 5 files changed, 320 insertions(+), 680 deletions(-)
```

## Full Diff
```diff
diff --git a/UNSTOP CRM DESIGN.md b/UNSTOP CRM DESIGN.md
new file mode 100644
index 0000000..75e42af
--- /dev/null
+++ b/UNSTOP CRM DESIGN.md
@@ -0,0 +1,145 @@
+# Unstop CRM Design System
+
+This file captures the relevant Unstop-inspired visual system for the Sales CRM. It replaces the older warm editorial CRM design direction.
+
+## Design Intent
+
+The CRM should feel like a bright, youth-first opportunity and hiring platform:
+
+- Clean white and soft-blue workspace.
+- Royal-blue primary actions.
+- Rounded, approachable cards.
+- Dense but friendly dashboard surfaces.
+- Gamified status accents through yellow, green, purple, orange, and cyan.
+- Fast scanning for sales, sourcing, delivery, reporting, and settings workflows.
+
+## Golden Rules
+
+- Use white and soft blue as the primary application floor.
+- Avoid cream, tan, brown, espresso, dark editorial cards, and serif-led typography.
+- Use a clean sans-serif UI voice everywhere.
+- Keep CTAs blue, clear, and pill-shaped.
+- Use subtle borders and soft shadows instead of heavy dark panels.
+- Keep master data, reports, and settings dense but readable.
+
+## Color Tokens
+
+```text
+Primary: #1C5DFF
+Primary Active: #0F46D9
+Primary Soft: #EAF1FF
+Primary Disabled: #B8CBFF
+
+Ink: #101828
+Body Strong: #1D2939
+Body: #344054
+Muted: #667085
+Muted Soft: #98A2B3
+
+Hairline: #E4E7EC
+Hairline Soft: #F2F4F7
+
+Canvas: #FFFFFF
+Surface White: #FFFFFF
+Surface Soft: #F8FAFC
+Surface Blue Soft: #F4F8FF
+Surface Blue Card: #EAF1FF
+Surface Yellow Soft: #FFF7D6
+Surface Purple Soft: #F2ECFF
+Accent Purple Soft: #EEE9FF
+Surface Green Soft: #EAFBF1
+Surface Red Soft: #FFF1F0
+
+Accent Yellow: #FFC83D
+Accent Purple: #7A5CFF
+Accent Orange: #FF8A00
+Accent Cyan: #00AEEF
+
+Success: #12B76A
+Warning: #F79009
+Error: #F04438
+Info: #2E90FA
+```
+
+## Typography
+
+Use:
+
+```text
+Inter, Manrope, Arial, sans-serif
+```
+
+Avoid serif display fonts. Headings should be bold and direct. Body copy should be compact and highly readable.
+
+Recommended usage:
+
+- Page titles: 32-36px, 700 weight.
+- Card headings: 18-22px, 700 weight.
+- Form labels and nav items: 13-14px, 600 weight.
+- Table text: 13-14px, 400-500 weight.
+- KPI/stat numbers: 28-32px, 700 weight.
+
+## Component Rules
+
+### Buttons
+
+- Primary: royal blue background, white text, pill radius.
+- Secondary: white background, blue text, blue border, pill radius.
+- Danger: red background, white text.
+- Use compact button height for dense admin screens.
+
+### Cards
+
+- White surface.
+- Soft border.
+- Rounded corners.
+- Mild shadow.
+- Use soft-blue page background so cards stand out naturally.
+
+### Tables
+
+- White table surface.
+- Light hairline borders.
+- Soft-blue header rows.
+- Muted column headers.
+- Blue hover state.
+
+### Forms
+
+- White input background.
+- Light grey border.
+- Blue focus ring.
+- Rounded 8px controls.
+
+### Navigation
+
+- Sidebar should be white, not dark.
+- Active navigation should use primary-soft blue with royal-blue text.
+- Hover states should stay soft and clean.
+
+### Status Accents
+
+- Success / selected / completed: green.
+- Warning / pending / deadlines: orange.
+- Error / overdue / rejected: red.
+- Info / guidance: blue.
+- Highlight / important stat: yellow.
+
+## Applied Scope
+
+This design system applies universally to:
+
+- Dashboard
+- Leads
+- Pipeline
+- Requirements & Sourcing
+- Deals
+- Database
+- Reports / MIS
+- Settings
+- Login
+- Modals
+- Tables
+- Kanban
+- Forms
+- Audit logs
diff --git a/css/style.css b/css/style.css
index ff589a5..a8e8f8b 100644
--- a/css/style.css
+++ b/css/style.css
@@ -1,28 +1,49 @@
 :root {
-  --primary: #cc785c;
-  --primary-active: #a9583e;
-  --primary-disabled: #e6dfd8;
-  --ink: #141413;
-  --body: #3d3d3a;
-  --body-strong: #252523;
-  --muted: #6c6a64;
-  --muted-soft: #8e8b82;
-  --hairline: #e6dfd8;
-  --canvas: #f5f0e8;
-  --surface-soft: #f5f0e8;
-  --surface-card: #efe9de;
-  --surface-dark: #181715;
-  --surface-dark-elevated: #252320;
-  --on-primary: #ffffff;
-  --on-dark: #f5f0e8;
-  --on-dark-soft: #a09d96;
-
-  --success: #5db872;
-  --warning: #d4a017;
-  --error: #c64545;
-
-  --font-display: "Tiempos Headline", "Cormorant Garamond", serif;
-  --font-body: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
+  --primary: #1C5DFF;
+  --primary-active: #0F46D9;
+  --primary-soft: #EAF1FF;
+  --primary-disabled: #B8CBFF;
+  --ink: #101828;
+  --body: #344054;
+  --body-strong: #1D2939;
+  --muted: #667085;
+  --muted-soft: #98A2B3;
+  --text-secondary: #667085;
+  --hairline: #E4E7EC;
+  --hairline-soft: #F2F4F7;
+  --canvas: #FFFFFF;
+  --surface-white: #FFFFFF;
+  --surface-soft: #F8FAFC;
+  --surface-card: #FFFFFF;
+  --surface-blue-soft: #F4F8FF;
+  --surface-blue-card: #EAF1FF;
+  --surface-yellow-soft: #FFF7D6;
+  --surface-purple-soft: #F2ECFF;
+  --accent-purple-soft: #EEE9FF;
+  --surface-green-soft: #EAFBF1;
+  --surface-red-soft: #FFF1F0;
+  --surface-dark: #101828;
+  --surface-dark-elevated: #1D2939;
+  --on-primary: #FFFFFF;
+  --on-dark: #FFFFFF;
+  --on-dark-soft: #D0D5DD;
+
+  --accent-yellow: #FFC83D;
+  --accent-yellow-active: #E5AE1F;
+  --accent-purple: #7A5CFF;
+  --accent-orange: #FF8A00;
+  --accent-cyan: #00AEEF;
+  --success: #12B76A;
+  --warning: #F79009;
+  --error: #F04438;
+  --info: #2E90FA;
+
+  --shadow-soft: 0 4px 16px rgba(16, 24, 40, 0.06);
+  --shadow-card: 0 8px 30px rgba(16, 24, 40, 0.08);
+  --ring-primary: 0 0 0 3px rgba(28, 93, 255, 0.14);
+
+  --font-display: "Inter", "Manrope", Arial, sans-serif;
+  --font-body: "Inter", "Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
   --font-code: "JetBrains Mono", ui-monospace, monospace;

   --rounded-xs: 4px;
@@ -30,6 +51,7 @@
   --rounded-md: 8px;
   --rounded-lg: 12px;
   --rounded-xl: 16px;
+  --rounded-xxl: 24px;
   --rounded-pill: 9999px;

   --spacing-xxs: 4px;
@@ -57,14 +79,14 @@ body {

 h1, h2, h3, h4, h5, h6 {
   font-family: var(--font-display);
-  font-weight: 400;
+  font-weight: 700;
   color: var(--ink);
-  letter-spacing: -0.5px;
+  letter-spacing: 0;
 }

 h1 {
-  font-size: 48px;
-  letter-spacing: -1px;
+  font-size: 44px;
+  letter-spacing: 0;
 }

 h2 {
@@ -94,12 +116,13 @@ a:hover {
 /* Sidebar Navigation */
 .sidebar {
   width: 260px;
-  background-color: var(--surface-dark);
-  color: var(--on-dark);
+  background-color: var(--surface-white);
+  color: var(--body);
   display: flex;
   flex-direction: column;
   padding: var(--spacing-lg) 0;
-  border-right: 1px solid var(--surface-dark-elevated);
+  border-right: 1px solid var(--hairline);
+  box-shadow: 8px 0 24px rgba(16, 24, 40, 0.04);
 }

 .sidebar-header {
@@ -108,14 +131,14 @@ a:hover {
 }

 .sidebar-header h2 {
-  color: var(--on-dark);
+  color: var(--primary);
   font-size: 24px;
   margin-bottom: var(--spacing-xs);
 }

 .user-info {
   font-size: 14px;
-  color: var(--on-dark-soft);
+  color: var(--muted);
   margin-bottom: var(--spacing-sm);
 }

@@ -127,21 +150,23 @@ a:hover {
 .nav-item {
   padding: var(--spacing-sm) var(--spacing-lg);
   cursor: pointer;
-  font-weight: 500;
+  font-weight: 600;
   font-size: 14px;
-  color: var(--on-dark-soft);
+  color: var(--body);
   transition: all 0.2s ease;
+  margin: 2px var(--spacing-sm);
+  border-radius: var(--rounded-md);
 }

 .nav-item:hover, .nav-item.active {
-  background-color: var(--surface-dark-elevated);
-  color: var(--on-dark);
+  background-color: var(--primary-soft);
+  color: var(--primary);
 }

 /* Main Content Area */
 .main-content {
   flex-grow: 1;
-  background-color: var(--canvas);
+  background-color: var(--surface-blue-soft);
   overflow-y: auto;
   overflow-x: hidden;
   min-width: 0;
@@ -185,6 +210,10 @@ main #settings-container {
   padding-bottom: var(--spacing-md);
   border-bottom: 1px solid var(--hairline);
   width: 100%;
+  background: linear-gradient(180deg, var(--surface-white) 0%, var(--surface-blue-soft) 100%);
+  border-radius: var(--rounded-xl);
+  padding: var(--spacing-lg);
+  box-shadow: var(--shadow-soft);
 }

 .top-bar h2,
@@ -196,55 +225,83 @@ main #settings-container {
 /* Components */
 .card {
   background-color: var(--surface-card);
-  border-radius: var(--rounded-lg);
+  border: 1px solid var(--hairline);
+  border-radius: var(--rounded-xl);
   padding: var(--spacing-xl);
   margin-bottom: var(--spacing-lg);
+  box-shadow: var(--shadow-soft);
 }

 .dark-card {
-  background-color: var(--surface-dark);
-  color: var(--on-dark);
-  border-radius: var(--rounded-lg);
+  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-active) 100%);
+  color: var(--on-primary);
+  border-radius: var(--rounded-xl);
   padding: var(--spacing-xl);
   margin-bottom: var(--spacing-lg);
+  box-shadow: var(--shadow-card);
 }

 .dark-card h3 {
-  color: var(--on-dark);
+  color: var(--on-primary);
 }

 /* Buttons */
 .btn {
   font-family: var(--font-body);
-  font-weight: 500;
+  font-weight: 600;
   font-size: 14px;
   padding: 12px 20px;
-  border-radius: var(--rounded-md);
+  border-radius: var(--rounded-pill);
   border: none;
   cursor: pointer;
   display: inline-flex;
   align-items: center;
   justify-content: center;
-  transition: background-color 0.2s ease;
+  min-height: 40px;
+  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
 }

 .btn-primary {
   background-color: var(--primary);
   color: var(--on-primary);
+  box-shadow: 0 8px 20px rgba(28, 93, 255, 0.18);
 }

 .btn-primary:hover {
   background-color: var(--primary-active);
+  transform: translateY(-1px);
 }

 .btn-secondary {
-  background-color: var(--canvas);
-  color: var(--ink);
-  border: 1px solid var(--hairline);
+  background-color: var(--surface-white);
+  color: var(--primary);
+  border: 1px solid var(--primary);
 }

 .btn-secondary:hover {
-  background-color: var(--surface-card);
+  background-color: var(--primary-soft);
+  transform: translateY(-1px);
+}
+
+.btn-danger {
+  background-color: var(--error);
+  color: var(--on-primary);
+}
+
+.btn-danger:hover {
+  background-color: var(--error);
+  filter: brightness(0.95);
+  transform: translateY(-1px);
+}
+
+.btn-ghost {
+  background-color: transparent;
+  color: var(--body-strong);
+  border: 1px solid transparent;
+}
+
+.btn-ghost:hover {
+  background-color: var(--surface-soft);
 }

 /* Forms */
@@ -254,26 +311,27 @@ main #settings-container {

 .form-group label {
   display: block;
-  font-weight: 500;
+  font-weight: 600;
   margin-bottom: var(--spacing-xs);
   color: var(--body-strong);
+  font-size: 13px;
 }

 .form-control {
   width: 100%;
   padding: 10px 14px;
   font-family: var(--font-body);
-  font-size: 16px;
+  font-size: 14px;
   border: 1px solid var(--hairline);
   border-radius: var(--rounded-md);
-  background-color: var(--canvas);
+  background-color: var(--surface-white);
   color: var(--ink);
 }

 .form-control:focus {
   outline: none;
   border-color: var(--primary);
-  box-shadow: 0 0 0 3px rgba(204, 120, 92, 0.15);
+  box-shadow: var(--ring-primary);
 }

 /* Login View */
@@ -282,16 +340,17 @@ main #settings-container {
   height: 100vh;
   align-items: center;
   justify-content: center;
-  background-color: var(--canvas);
+  background: linear-gradient(180deg, var(--surface-white) 0%, var(--surface-blue-soft) 100%);
 }

 .login-card {
   background-color: var(--surface-card);
   padding: var(--spacing-xl);
-  border-radius: var(--rounded-lg);
+  border: 1px solid var(--hairline);
+  border-radius: var(--rounded-xl);
   width: 100%;
   max-width: 400px;
-  box-shadow: 0 4px 12px rgba(20, 20, 19, 0.05);
+  box-shadow: var(--shadow-card);
 }

 .login-card h2 {
@@ -303,6 +362,7 @@ main #settings-container {
 .data-table {
   width: 100%;
   border-collapse: collapse;
+  background-color: var(--surface-white);
 }

 .data-table th, .data-table td {
@@ -312,26 +372,40 @@ main #settings-container {
 }

 .data-table th {
-  font-weight: 500;
+  font-weight: 700;
   color: var(--muted);
   font-size: 14px;
+  background-color: var(--surface-blue-soft);
+}
+
+.data-table tbody tr:hover {
+  background-color: var(--primary-soft);
 }

 /* Badges */
 .badge {
-  padding: 4px 12px;
+  padding: 5px 12px;
   border-radius: var(--rounded-pill);
   font-size: 12px;
-  font-weight: 500;
-  letter-spacing: 1.5px;
+  font-weight: 700;
+  letter-spacing: 0;
   text-transform: uppercase;
+  display: inline-flex;
+  align-items: center;
+  gap: 4px;
 }

 .badge-coral {
-  background-color: var(--primary);
-  color: var(--on-primary);
+  background-color: var(--primary-soft);
+  color: var(--primary);
 }

+.badge-blue { background-color: var(--primary-soft); color: var(--primary); }
+.badge-yellow { background-color: var(--surface-yellow-soft); color: var(--body-strong); }
+.badge-purple { background-color: var(--accent-purple-soft); color: var(--accent-purple); }
+.badge-green { background-color: var(--surface-green-soft); color: var(--success); }
+.badge-red { background-color: var(--surface-red-soft); color: var(--error); }
+
 /* Hidden elements */
 .hidden {
   display: none !important;
@@ -339,9 +413,11 @@ main #settings-container {
 /* Sheet Style Table */
 .sheet-container {
   overflow-x: auto;
-  background-color: var(--surface-card);
-  border-radius: var(--rounded-lg);
+  background-color: var(--surface-white);
+  border: 1px solid var(--hairline);
+  border-radius: var(--rounded-xl);
   margin-bottom: var(--spacing-lg);
+  box-shadow: var(--shadow-soft);
 }
 .sheet-table {
   width: max-content;
@@ -356,34 +432,36 @@ main #settings-container {
   font-size: 13px;
 }
 .sheet-table th {
-  background-color: var(--surface-dark-elevated);
-  color: var(--on-dark);
-  font-weight: 500;
+  background-color: var(--primary);
+  color: var(--on-primary);
+  font-weight: 700;
   position: sticky;
   top: 0;
 }
 .sheet-table tbody tr:hover {
-  background-color: var(--canvas);
+  background-color: var(--surface-blue-soft);
 }

 /* Modal */
 .modal-overlay {
   position: fixed;
   top: 0; left: 0; right: 0; bottom: 0;
-  background-color: rgba(20, 20, 19, 0.5);
+  background-color: rgba(16, 24, 40, 0.52);
   display: flex;
   align-items: center;
   justify-content: center;
   z-index: 1000;
 }
 .modal {
-  background-color: var(--canvas);
-  border-radius: var(--rounded-lg);
+  background-color: var(--surface-white);
+  border: 1px solid var(--hairline);
+  border-radius: var(--rounded-xl);
   padding: var(--spacing-xl);
   width: 90%;
   max-width: 600px;
   max-height: 90vh;
   overflow-y: auto;
+  box-shadow: 0 24px 70px rgba(16, 24, 40, 0.22);
 }
 .modal-header {
   display: flex;
@@ -393,10 +471,10 @@ main #settings-container {
 }

 /* Utility Badges */
-.badge-overdue { background-color: var(--error); color: white; }
-.badge-priority-high { background-color: var(--primary-active); color: white; }
-.badge-priority-medium { background-color: var(--warning); color: white; }
-.badge-priority-low { background-color: var(--success); color: white; }
+.badge-overdue { background-color: var(--surface-red-soft); color: var(--error); }
+.badge-priority-high { background-color: var(--primary-soft); color: var(--primary-active); }
+.badge-priority-medium { background-color: var(--surface-yellow-soft); color: var(--warning); }
+.badge-priority-low { background-color: var(--surface-green-soft); color: var(--success); }

 /* Filter Bar */
 .filter-bar {
@@ -410,8 +488,17 @@ main #settings-container {
   height: 36px;
   padding: 0 10px;
   font-size: 13px;
-  border-radius: var(--rounded-sm);
+  border-radius: var(--rounded-pill);
   border: 1px solid var(--hairline);
+  background-color: var(--surface-white);
+  color: var(--body);
+}
+
+.filter-bar input:focus,
+.filter-bar select:focus {
+  outline: none;
+  border-color: var(--primary);
+  box-shadow: var(--ring-primary);
 }

 /* Kanban Board */
@@ -428,14 +515,15 @@ main #settings-container {
 }
 .kanban-col {
   width: 300px;
-  background-color: var(--surface-card);
-  border-radius: var(--rounded-md);
+  background-color: var(--surface-soft);
+  border-radius: var(--rounded-xl);
   padding: 12px;
   display: flex;
   flex-direction: column;
   gap: 12px;
   min-height: 300px;
   border: 1px solid var(--hairline);
+  box-shadow: var(--shadow-soft);
 }
 .kanban-col-header {
   font-weight: 600;
@@ -448,14 +536,14 @@ main #settings-container {
   padding-bottom: 8px;
 }
 .kanban-card {
-  background-color: var(--canvas);
+  background-color: var(--surface-white);
   border: 1px solid var(--hairline);
-  border-radius: var(--rounded-sm);
+  border-radius: var(--rounded-lg);
   padding: 12px;
   font-size: 13px;
   cursor: grab;
   transition: transform 0.2s, box-shadow 0.2s;
-  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
+  box-shadow: var(--shadow-soft);
   display: flex;
   flex-direction: column;
   gap: 8px;
@@ -465,13 +553,13 @@ main #settings-container {
 }
 .kanban-card:hover {
   transform: translateY(-2px);
-  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
+  box-shadow: var(--shadow-card);
 }
 .kanban-card.dragging {
   opacity: 0.5;
 }
 .kanban-col.drag-over {
-  background-color: var(--surface-soft);
+  background-color: var(--primary-soft);
   border: 1px dashed var(--primary);
 }
 .kanban-card-title {
diff --git a/js/database.js b/js/database.js
index 7099ddd..64085bc 100644
--- a/js/database.js
+++ b/js/database.js
@@ -180,7 +180,7 @@ class DatabaseManager {
         });

         if (['clients', 'contacts', 'normal-contacts', 'trainers', 'vendors'].includes(collection)) {
-          html += `<td><span style="font-size: 0.85em; color: #666;">${this.escapeHTML(this.getLinkedCounts(collection, record.id, allRecords))}</span></td>`;
+          html += `<td><span style="font-size: 0.85em; color: var(--muted);">${this.escapeHTML(this.getLinkedCounts(collection, record.id, allRecords))}</span></td>`;
         }

         if (!isEmp) {
@@ -189,7 +189,7 @@ class DatabaseManager {
           html += `
             <td>
               <button class="btn btn-secondary btn-db-action" data-action="edit" data-id="${eId}" data-coll="${eColl}" style="padding: 2px 6px; font-size: 11px;">Update Profile</button>
-              <button class="btn btn-secondary btn-db-action" data-action="archive" data-id="${eId}" data-coll="${eColl}" style="padding: 2px 6px; font-size: 11px; background-color: #fee;">Archive</button>
+              <button class="btn btn-secondary btn-db-action" data-action="archive" data-id="${eId}" data-coll="${eColl}" style="padding: 2px 6px; font-size: 11px; background-color: var(--surface-red-soft); color: var(--error); border-color: var(--error);">Archive</button>
               <button class="btn btn-secondary btn-db-action" data-action="check-dup" data-id="${eId}" data-coll="${eColl}" style="padding: 2px 6px; font-size: 11px;">Check Dup</button>
             </td>
           `;
diff --git a/js/reports.js b/js/reports.js
index e9ab53e..512e77b 100644
--- a/js/reports.js
+++ b/js/reports.js
@@ -231,7 +231,7 @@ class ReportsManager {
     this.currentReportCols = [];

     const formatKPI = (title, value) => `
-      <div style="flex: 1; min-width: 200px; background: var(--surface-card); padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border-left: 4px solid var(--primary);">
+      <div style="flex: 1; min-width: 200px; background: var(--surface-card); padding: 20px; border-radius: var(--rounded-xl); box-shadow: var(--shadow-soft); border-left: 4px solid var(--primary);">
         <h4 style="margin: 0 0 10px 0; color: var(--muted); font-size: 14px;">${this.escapeHTML(title)}</h4>
         <div style="font-size: 24px; font-weight: bold; color: var(--body-strong, var(--text-color, inherit));">${this.escapeHTML(value)}</div>
       </div>
diff --git a/sales crm design.md b/sales crm design.md
deleted file mode 100644
index f3d9378..0000000
--- a/sales crm design.md
+++ /dev/null
@@ -1,593 +0,0 @@
----
-version: alpha
-name: Claude-design-analysis
-description: A warm-canvas editorial interface for Anthropic's Claude product. The system anchors on a tinted cream canvas with serif display headlines, warm coral CTAs, and dark navy product surfaces (code editor mockups, model showcase cards). Brand voltage comes from the cream/coral pairing — deliberately warm and humanist where most AI brands use cool blue + slate. Type voice runs a slab-serif display ("Copernicus" / Tiempos Headline) for h1/h2 and a humanist sans for body. The signature Anthropic black-radial-spike mark anchors the wordmark.
-
-golden_rule:
-  canvas_replacement: "Use surface-soft (#f5f0e8) as the global canvas/default page floor everywhere the old cream canvas was used."
-  old_canvas_removed: "The old canvas cream token must not be used anywhere in the application design system."
-
-colors:
-  primary: "#cc785c"
-  primary-active: "#a9583e"
-  primary-disabled: "#e6dfd8"
-  ink: "#141413"
-  body: "#3d3d3a"
-  body-strong: "#252523"
-  muted: "#6c6a64"
-  muted-soft: "#8e8b82"
-  hairline: "#e6dfd8"
-  hairline-soft: "#ebe6df"
-  canvas: "#f5f0e8"
-  surface-soft: "#f5f0e8"
-  surface-card: "#efe9de"
-  surface-cream-strong: "#e8e0d2"
-  surface-dark: "#181715"
-  surface-dark-elevated: "#252320"
-  surface-dark-soft: "#1f1e1b"
-  on-primary: "#ffffff"
-  on-dark: "#f5f0e8"
-  on-dark-soft: "#a09d96"
-  accent-teal: "#5db8a6"
-  accent-amber: "#e8a55a"
-  success: "#5db872"
-  warning: "#d4a017"
-  error: "#c64545"
-
-typography:
-  display-xl:
-    fontFamily: "Copernicus, Tiempos Headline, serif"
-    fontSize: 64px
-    fontWeight: 400
-    lineHeight: 1.05
-    letterSpacing: -1.5px
-  display-lg:
-    fontFamily: "Copernicus, Tiempos Headline, serif"
-    fontSize: 48px
-    fontWeight: 400
-    lineHeight: 1.1
-    letterSpacing: -1px
-  display-md:
-    fontFamily: "Copernicus, Tiempos Headline, serif"
-    fontSize: 36px
-    fontWeight: 400
-    lineHeight: 1.15
-    letterSpacing: -0.5px
-  display-sm:
-    fontFamily: "Copernicus, Tiempos Headline, serif"
-    fontSize: 28px
-    fontWeight: 400
-    lineHeight: 1.2
-    letterSpacing: -0.3px
-  title-lg:
-    fontFamily: "StyreneB, Inter, sans-serif"
-    fontSize: 22px
-    fontWeight: 500
-    lineHeight: 1.3
-    letterSpacing: 0
-  title-md:
-    fontFamily: "StyreneB, Inter, sans-serif"
-    fontSize: 18px
-    fontWeight: 500
-    lineHeight: 1.4
-    letterSpacing: 0
-  title-sm:
-    fontFamily: "StyreneB, Inter, sans-serif"
-    fontSize: 16px
-    fontWeight: 500
-    lineHeight: 1.4
-    letterSpacing: 0
-  body-md:
-    fontFamily: "StyreneB, Inter, sans-serif"
-    fontSize: 16px
-    fontWeight: 400
-    lineHeight: 1.55
-    letterSpacing: 0
-  body-sm:
-    fontFamily: "StyreneB, Inter, sans-serif"
-    fontSize: 14px
-    fontWeight: 400
-    lineHeight: 1.55
-    letterSpacing: 0
-  caption:
-    fontFamily: "StyreneB, Inter, sans-serif"
-    fontSize: 13px
-    fontWeight: 500
-    lineHeight: 1.4
-    letterSpacing: 0
-  caption-uppercase:
-    fontFamily: "StyreneB, Inter, sans-serif"
-    fontSize: 12px
-    fontWeight: 500
-    lineHeight: 1.4
-    letterSpacing: 1.5px
-  code:
-    fontFamily: "JetBrains Mono, ui-monospace, monospace"
-    fontSize: 14px
-    fontWeight: 400
-    lineHeight: 1.6
-    letterSpacing: 0
-  button:
-    fontFamily: "StyreneB, Inter, sans-serif"
-    fontSize: 14px
-    fontWeight: 500
-    lineHeight: 1
-    letterSpacing: 0
-  nav-link:
-    fontFamily: "StyreneB, Inter, sans-serif"
-    fontSize: 14px
-    fontWeight: 500
-    lineHeight: 1.4
-    letterSpacing: 0
-
-rounded:
-  xs: 4px
-  sm: 6px
-  md: 8px
-  lg: 12px
-  xl: 16px
-  pill: 9999px
-  full: 9999px
-
-spacing:
-  xxs: 4px
-  xs: 8px
-  sm: 12px
-  md: 16px
-  lg: 24px
-  xl: 32px
-  xxl: 48px
-  section: 96px
-
-components:
-  button-primary:
-    backgroundColor: "{colors.primary}"
-    textColor: "{colors.on-primary}"
-    typography: "{typography.button}"
-    rounded: "{rounded.md}"
-    padding: 12px 20px
-    height: 40px
-  button-primary-active:
-    backgroundColor: "{colors.primary-active}"
-    textColor: "{colors.on-primary}"
-    rounded: "{rounded.md}"
-  button-primary-disabled:
-    backgroundColor: "{colors.primary-disabled}"
-    textColor: "{colors.muted}"
-    rounded: "{rounded.md}"
-  button-secondary:
-    backgroundColor: "{colors.canvas}"
-    textColor: "{colors.ink}"
-    typography: "{typography.button}"
-    rounded: "{rounded.md}"
-    padding: 12px 20px
-    height: 40px
-  button-secondary-on-dark:
-    backgroundColor: "{colors.surface-dark-elevated}"
-    textColor: "{colors.on-dark}"
-    typography: "{typography.button}"
-    rounded: "{rounded.md}"
-    padding: 12px 20px
-  button-text-link:
-    backgroundColor: transparent
-    textColor: "{colors.ink}"
-    typography: "{typography.button}"
-  button-icon-circular:
-    backgroundColor: "{colors.canvas}"
-    textColor: "{colors.ink}"
-    rounded: "{rounded.full}"
-    size: 36px
-  text-link:
-    backgroundColor: transparent
-    textColor: "{colors.primary}"
-    typography: "{typography.body-md}"
-  top-nav:
-    backgroundColor: "{colors.canvas}"
-    textColor: "{colors.ink}"
-    typography: "{typography.nav-link}"
-    height: 64px
-  hero-band:
-    backgroundColor: "{colors.canvas}"
-    textColor: "{colors.ink}"
-    typography: "{typography.display-xl}"
-    padding: 96px
-  hero-illustration-card:
-    backgroundColor: "{colors.canvas}"
-    textColor: "{colors.ink}"
-    rounded: "{rounded.xl}"
-  feature-card:
-    backgroundColor: "{colors.surface-card}"
-    textColor: "{colors.ink}"
-    typography: "{typography.title-md}"
-    rounded: "{rounded.lg}"
-    padding: 32px
-  product-mockup-card-dark:
-    backgroundColor: "{colors.surface-dark}"
-    textColor: "{colors.on-dark}"
-    typography: "{typography.title-md}"
-    rounded: "{rounded.lg}"
-    padding: 32px
-  code-window-card:
-    backgroundColor: "{colors.surface-dark}"
-    textColor: "{colors.on-dark}"
-    typography: "{typography.code}"
-    rounded: "{rounded.lg}"
-    padding: 24px
-  model-comparison-card:
-    backgroundColor: "{colors.canvas}"
-    textColor: "{colors.ink}"
-    typography: "{typography.title-md}"
-    rounded: "{rounded.lg}"
-    padding: 32px
-  pricing-tier-card:
-    backgroundColor: "{colors.canvas}"
-    textColor: "{colors.ink}"
-    typography: "{typography.title-lg}"
-    rounded: "{rounded.lg}"
-    padding: 32px
-  pricing-tier-card-featured:
-    backgroundColor: "{colors.surface-dark}"
-    textColor: "{colors.on-dark}"
-    typography: "{typography.title-lg}"
-    rounded: "{rounded.lg}"
-    padding: 32px
-  callout-card-coral:
-    backgroundColor: "{colors.primary}"
-    textColor: "{colors.on-primary}"
-    typography: "{typography.title-md}"
-    rounded: "{rounded.lg}"
-    padding: 32px
-  connector-tile:
-    backgroundColor: "{colors.canvas}"
-    textColor: "{colors.ink}"
-    typography: "{typography.title-sm}"
-    rounded: "{rounded.lg}"
-    padding: 20px
-  text-input:
-    backgroundColor: "{colors.canvas}"
-    textColor: "{colors.ink}"
-    typography: "{typography.body-md}"
-    rounded: "{rounded.md}"
-    padding: 10px 14px
-    height: 40px
-  text-input-focused:
-    backgroundColor: "{colors.canvas}"
-    textColor: "{colors.ink}"
-    rounded: "{rounded.md}"
-  cookie-consent-card:
-    backgroundColor: "{colors.surface-dark}"
-    textColor: "{colors.on-dark}"
-    typography: "{typography.body-sm}"
-    rounded: "{rounded.lg}"
-    padding: 24px
-  category-tab:
-    backgroundColor: transparent
-    textColor: "{colors.muted}"
-    typography: "{typography.nav-link}"
-    padding: 8px 14px
-    rounded: "{rounded.md}"
-  category-tab-active:
-    backgroundColor: "{colors.surface-card}"
-    textColor: "{colors.ink}"
-    typography: "{typography.nav-link}"
-    rounded: "{rounded.md}"
-  badge-pill:
-    backgroundColor: "{colors.surface-card}"
-    textColor: "{colors.ink}"
-    typography: "{typography.caption}"
-    rounded: "{rounded.pill}"
-    padding: 4px 12px
-  badge-coral:
-    backgroundColor: "{colors.primary}"
-    textColor: "{colors.on-primary}"
-    typography: "{typography.caption-uppercase}"
-    rounded: "{rounded.pill}"
-    padding: 4px 12px
-  cta-band-coral:
-    backgroundColor: "{colors.primary}"
-    textColor: "{colors.on-primary}"
-    typography: "{typography.display-sm}"
-    rounded: "{rounded.lg}"
-    padding: 64px
-  cta-band-dark:
-    backgroundColor: "{colors.surface-dark}"
-    textColor: "{colors.on-dark}"
-    typography: "{typography.display-sm}"
-    rounded: "{rounded.lg}"
-    padding: 64px
-  footer:
-    backgroundColor: "{colors.surface-dark}"
-    textColor: "{colors.on-dark-soft}"
-    typography: "{typography.body-sm}"
-    padding: 64px
----
-
-## Overview
-
-Claude.com is the warmest, most editorial interface in the AI-product category. The base atmosphere is a **tinted cream canvas** (`{colors.canvas}` — #f5f0e8) — distinctly warm, deliberately not the cool gray-white that every other AI brand uses. Headlines run a **slab-serif display** ("Copernicus" / Tiempos Headline) at weight 400 with negative letter-spacing, paired with **StyreneB / Inter** body sans. The combination feels like a literary publication, not a SaaS marketing page.
-
-Brand voltage comes from the **cream + coral pairing** — coral (`{colors.primary}` — #cc785c) is the signature Anthropic accent, used on every primary CTA, on the brand wordmark, and on full-bleed callout cards. The coral is warm, slightly muted, never cyan/blue — a deliberate counter-positioning against OpenAI's cool slate, Google's saturated blue, and Microsoft's corporate cyan.
-
-The system has three surface modes that alternate page-by-page:
-1. **Cream canvas** (`{colors.canvas}`) — default body floor
-2. **Light cream cards** (`{colors.surface-card}`) — feature card backgrounds
-3. **Dark navy product surfaces** (`{colors.surface-dark}`) — code editor mockups, model showcase cards, pre-footer CTAs, footer itself
-
-The dark surfaces are where Claude shows its product chrome — code blocks, terminal output, model comparison tables, agentic-flow diagrams. The cream-to-dark contrast is the page's pacing rhythm.
-
-**Key Characteristics:**
-- Warm cream canvas (`{colors.canvas}` — #f5f0e8) with dark warm-ink text (`{colors.ink}` — #141413). The brand's defining color choice.
-- Coral primary CTA (`{colors.primary}` — #cc785c). Used scarcely on individual buttons, generously on full-bleed coral callout cards.
-- Slab-serif display headlines via Copernicus / Tiempos Headline at weight 400 with negative letter-spacing. Pairs with humanist sans body for a literary editorial voice.
-- Dark navy product mockup cards (`{colors.surface-dark}` — #181715) carrying code blocks, terminal panels, model comparison data — the brand shows the product chrome at scale rather than abstract marketing illustrations.
-- Light cream feature cards (`{colors.surface-card}` — #efe9de) — slightly darker than canvas, used for content-driven feature explanations.
-- Anthropic radial-spike mark — a small black asterisk-like glyph (4-spoke radial) — appears as the brand wordmark prefix and as a content marker.
-- Border radius is hierarchical: `{rounded.md}` (8px) for buttons + inputs, `{rounded.lg}` (12px) for content + product cards, `{rounded.xl}` (16px) for the hero illustration container, `{rounded.pill}` for badges.
-- Section rhythm `{spacing.section}` (96px) — modern-SaaS standard. Internal card padding stays generous at `{spacing.xl}` (32px).
-
-## Colors
-
-### Brand & Accent
-- **Coral / Primary** (`{colors.primary}` — #cc785c): The signature Anthropic warm coral. Used on every primary CTA background, on full-bleed coral callout cards, on the brand wordmark accent. The most-recognized Anthropic color outside of the spike-mark logo.
-- **Coral Active** (`{colors.primary-active}` — #a9583e): The press / hover-darker variant.
-- **Coral Disabled** (`{colors.primary-disabled}` — #e6dfd8): A desaturated cream-tinted disabled state.
-- **Accent Teal** (`{colors.accent-teal}` — #5db8a6): Used sparingly on secondary product surfaces (terminal status indicators, "active connection" dots in connectors page).
-- **Accent Amber** (`{colors.accent-amber}` — #e8a55a): A small companion warm-tone used on category badges and inline highlights.
-
-### Surface
-- **Canvas** (`{colors.canvas}` — #f5f0e8): The default page floor. Tinted cream — warm, deliberately not pure white.
-- **Surface Soft** (`{colors.surface-soft}` — #f5f0e8): Section dividers, very-soft band backgrounds.
-- **Surface Card** (`{colors.surface-card}` — #efe9de): Feature cards, content cards. One step darker than canvas.
-- **Surface Cream Strong** (`{colors.surface-cream-strong}` — #e8e0d2): A strongest-cream variant used on selected category tabs and emphasized section bands.
-- **Surface Dark** (`{colors.surface-dark}` — #181715): Code editor mockups, model showcase cards, footer. The dominant dark surface.
-- **Surface Dark Elevated** (`{colors.surface-dark-elevated}` — #252320): Elevated cards inside dark bands (settings panels in mockups).
-- **Surface Dark Soft** (`{colors.surface-dark-soft}` — #1f1e1b): Slightly lighter dark, used for code block backgrounds inside larger dark cards.
-- **Hairline** (`{colors.hairline}` — #e6dfd8): The 1px border tone on cream surfaces. Same hex as `{colors.primary-disabled}` — borders feel like one elevation step rather than ink lines.
-- **Hairline Soft** (`{colors.hairline-soft}` — #ebe6df): Barely-visible divider used inside the same band.
-
-### Text
-- **Ink** (`{colors.ink}` — #141413): All headlines and primary text. Warm dark, slightly off-pure-black.
-- **Body Strong** (`{colors.body-strong}` — #252523): Emphasized paragraphs, lead text.
-- **Body** (`{colors.body}` — #3d3d3a): Default running-text color.
-- **Muted** (`{colors.muted}` — #6c6a64): Sub-headings, breadcrumbs, footer-adjacent secondary text.
-- **Muted Soft** (`{colors.muted-soft}` — #8e8b82): Captions, fine-print, copyright lines.
-- **On Primary** (`{colors.on-primary}` — #ffffff): Text on coral buttons.
-- **On Dark** (`{colors.on-dark}` — #f5f0e8): Cream-tinted white used on dark surfaces (echoes the canvas tone).
-- **On Dark Soft** (`{colors.on-dark-soft}` — #a09d96): Footer body text, secondary labels in dark mockups.
-
-### Semantic
-- **Success** (`{colors.success}` — #5db872): Green status dots, "available" indicators.
-- **Warning** (`{colors.warning}` — #d4a017): Warning callouts (rare on marketing surfaces).
-- **Error** (`{colors.error}` — #c64545): Validation errors.
-
-## Typography
-
-### Font Family
-The system runs **Copernicus** (or **Tiempos Headline** as substitute) as the slab-serif display face for headlines, and **StyreneB** (or **Inter** as substitute) as the humanist sans for body, navigation, and UI labels. **JetBrains Mono** handles code blocks. The fallback stack walks `Tiempos Headline, Garamond, "Times New Roman", serif` for display and `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` for body.
-
-The display/body split is editorial:
-- Copernicus serif (weight 400, negative tracking) → h1, h2, h3, hero display
-- StyreneB sans (weight 400-500) → body, navigation, buttons, captions, labels
-- JetBrains Mono → all code blocks and terminal text
-
-### Hierarchy
-
-| Token | Size | Weight | Line Height | Letter Spacing | Use |
-|---|---|---|---|---|---|
-| `{typography.display-xl}` | 64px | 400 | 1.05 | -1.5px | Homepage h1 ("Meet your thinking partner") — Copernicus serif |
-| `{typography.display-lg}` | 48px | 400 | 1.1 | -1px | Section heads — Copernicus |
-| `{typography.display-md}` | 36px | 400 | 1.15 | -0.5px | Sub-section heads, model names — Copernicus |
-| `{typography.display-sm}` | 28px | 400 | 1.2 | -0.3px | Pricing tier names, callout headlines — Copernicus |
-| `{typography.title-lg}` | 22px | 500 | 1.3 | 0 | Pricing plan size labels — StyreneB |
-| `{typography.title-md}` | 18px | 500 | 1.4 | 0 | Feature card titles, intro paragraphs |
-| `{typography.title-sm}` | 16px | 500 | 1.4 | 0 | Connector tile titles, list labels |
-| `{typography.body-md}` | 16px | 400 | 1.55 | 0 | Default running-text — StyreneB |
-| `{typography.body-sm}` | 14px | 400 | 1.55 | 0 | Footer body, fine-print |
-| `{typography.caption}` | 13px | 500 | 1.4 | 0 | Badge labels, captions |
-| `{typography.caption-uppercase}` | 12px | 500 | 1.4 | 1.5px | Category tags, "NEW" badges |
-| `{typography.code}` | 14px | 400 | 1.6 | 0 | Code blocks — JetBrains Mono |
-| `{typography.button}` | 14px | 500 | 1.0 | 0 | Standard button labels |
-| `{typography.nav-link}` | 14px | 500 | 1.4 | 0 | Top-nav menu items |
-
-### Principles
-Display sizes use weight 400 (regular), never bold. Negative letter-spacing (-0.3 to -1.5px) is essential — Copernicus without it reads as off-brand. The serif character is what gives Anthropic its literary, considered voice; switching to a sans-serif display would make Claude feel like every other AI tool.
-
-Body type stays at weight 400 for paragraphs, weight 500 for labels and emphasized phrases. The sans body is humanist (StyreneB) — never geometric. Inter is an acceptable substitute because of its similar humanist proportions; Helvetica or Arial would be too neutral and break the warm-editorial feel.
-
-### Note on Font Substitutes
-If Copernicus / Tiempos Headline is unavailable, **Cormorant Garamond** at weight 500 with -0.02em letter-spacing is the closest open-source approximation. **EB Garamond** is a fallback. For StyreneB, **Inter** is the closest match — both are humanist sans designed for screen reading. **Söhne** is another close alternative if licensed.
-
-## Layout
-
-### Spacing System
-- **Base unit:** 4px.
-- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
-- **Section padding:** `{spacing.section}` (96px) — modern-SaaS rhythm.
-- **Card internal padding:** `{spacing.xl}` (32px) for feature cards, pricing tier cards, model comparison cards; `{spacing.lg}` (24px) for code-window cards and connector tiles.
-- **Callout / CTA bands:** `{spacing.xxl}` (48px) inside coral callout cards; 64px inside the larger dark CTA band.
-
-### Grid & Container
-- **Max content width:** ~1200px centered.
-- **Editorial body:** Single 12-column grid; hero often uses 6/6 split (h1 left, illustration right).
-- **Feature card grids:** 3-up at desktop, 2-up at tablet, 1-up at mobile.
-- **Connector tile grids:** 4-up or 6-up at desktop, 2-up at tablet, 1-up at mobile.
-- **Pricing grid:** 3-up at desktop (Free / Pro / Team / Enterprise often), 1-up at mobile.
-
-### Whitespace Philosophy
-The cream canvas + serif display + generous internal padding create an editorial pacing — Claude reads like a long-form magazine column rather than a marketing template. Whitespace between bands stays uniform at 96px; whitespace inside cards is generous (32px), letting type breathe.
-
-## Elevation & Depth
-
-| Level | Treatment | Use |
-|---|---|---|
-| Flat | No shadow, no border | Body sections, top nav, hero bands |
-| Soft hairline | 1px `{colors.hairline}` border | Inputs, sub-nav, occasionally on cards |
-| Cream card | `{colors.surface-card}` background — no shadow | Feature cards, content cards |
-| Dark surface card | `{colors.surface-dark}` background — no shadow | Code editor mockups, model showcase cards |
-| Subtle drop shadow | Faint shadow at low alpha | Hover-elevated states (the system uses `0 1px 3px rgba(20,20,19,0.08)` rarely) |
-
-The elevation philosophy is **color-block first, shadow rare**. Most depth comes from the cream-vs-dark surface contrast. Shadows are minimal. The dark surface mockups have their own internal product chrome (code editor scrollbars, line numbers, syntax highlighting) which adds detail without needing external shadows.
-
-### Decorative Depth
-- The Anthropic spike-mark glyph (4-spoke radial asterisk) appears as a small black mark in the brand wordmark and inline as a content marker.
-- Code editor mockups carry their own internal depth: syntax-highlighted text in muted blues / oranges / grays, line numbers in `{colors.muted-soft}`, status bars at the bottom in `{colors.surface-dark-elevated}`.
-- Some hero illustrations use simple line-art with coral and dark-navy strokes on cream — minimal, hand-drawn-feeling, never photorealistic.
-
-## Shapes
-
-### Border Radius Scale
-
-| Token | Value | Use |
-|---|---|---|
-| `{rounded.xs}` | 4px | Reserved for badge accents and tiny dropdowns |
-| `{rounded.sm}` | 6px | Small inline buttons, dropdown items |
-| `{rounded.md}` | 8px | Standard CTA buttons, text inputs, category tabs |
-| `{rounded.lg}` | 12px | Content cards (feature, pricing, code-window, model-comparison) |
-| `{rounded.xl}` | 16px | Hero illustration container, the larger marquee components |
-| `{rounded.pill}` | 9999px | Badge pills, "NEW" tags |
-| `{rounded.full}` | 9999px / 50% | Avatar substitutes, icon buttons |
-
-### Photography & Illustrations
-Claude's hero rarely uses photography. Instead it uses:
-- Simple line-art illustrations with coral + dark-navy strokes on the cream canvas
-- Code editor mockups (the dominant "hero" treatment on developer-focused pages)
-- Terminal output mockups with monospace text on dark
-- Model comparison cards (Opus / Sonnet / Haiku) with abstract geometric thumbnails
-
-When photography is used (rare — mostly testimonials), avatars crop to perfect circles at 40px diameter.
-
-## Components
-
-### Top Navigation
-
-**`top-nav`** — Cream nav bar pinned to the top of every page. 64px tall, `{colors.canvas}` background. Carries the Anthropic spike-mark + "Claude" wordmark at left, primary horizontal menu (Product, Solutions, Use Cases, Pricing, Research, Company) center-left, right-side cluster with "Sign in" text-link, "Try Claude" `{component.button-primary}` (coral). Menu items in `{typography.nav-link}` (StyreneB 14px / 500).
-
-### Buttons
-
-**`button-primary`** — The signature coral CTA. Background `{colors.primary}` (#cc785c), text `{colors.on-primary}` (white), type `{typography.button}` (StyreneB 14px / 500), padding 12px × 20px, height 40px, rounded `{rounded.md}` (8px). Active state `button-primary-active` darkens to `{colors.primary-active}` (#a9583e).
-
-**`button-secondary`** — Cream button with hairline outline. Background `{colors.canvas}`, text `{colors.ink}`, 1px hairline border, same padding + height + radius as primary.
-
-**`button-secondary-on-dark`** — Used over `{colors.surface-dark}` cards. Background `{colors.surface-dark-elevated}` (#252320), text `{colors.on-dark}`. Stays dark — the system never inverts to a light secondary on dark surfaces.
-
-**`button-text-link`** — Inline text button, no background. Used for "Sign in" in the top nav and inline CTA links.
-
-**`button-icon-circular`** — 36px circular icon button. Background `{colors.canvas}`, hairline border, ink-color icon. Used for carousel arrows, share, "view more".
-
-**`text-link`** — Inline body links in `{colors.primary}` (the coral). Underlined on press; the coral inline link is one of the system's most distinctive small details.
-
-### Cards & Containers
-
-**`hero-band`** — Cream-canvas hero with a 6-6 grid: h1 + sub-headline + button row on the left, hero illustration card or product mockup card on the right. Vertical padding `{spacing.section}` (96px).
-
-**`hero-illustration-card`** — A larger card holding the hero's right-side artifact — sometimes a coral-stroke line illustration on cream background, sometimes a dark code editor mockup. Background `{colors.canvas}` or `{colors.surface-dark}` depending on context, rounded `{rounded.xl}` (16px).
-
-**`feature-card`** — Used in 3-up feature grids. Background `{colors.surface-card}` (#efe9de — slightly darker cream), rounded `{rounded.lg}` (12px), internal padding `{spacing.xl}` (32px). Carries a small icon at top, an `{typography.title-md}` headline, and a body description in `{typography.body-md}`.
-
-**`product-mockup-card-dark`** — Dark navy card showing actual Claude product chrome (chat interface, code editor, agent controls). Background `{colors.surface-dark}`, rounded `{rounded.lg}`, internal padding `{spacing.xl}` (32px). Carries text labels in `{colors.on-dark}` and product UI fragments below.
-
-**`code-window-card`** — A specialized dark card showing a code editor with line numbers, syntax-highlighted code in `{typography.code}` (JetBrains Mono), and sometimes a "Run" button or terminal output panel below. Background `{colors.surface-dark}` with `{colors.surface-dark-soft}` for the inner code block, rounded `{rounded.lg}`, padding `{spacing.lg}` (24px). The signature visual element of Claude Code product pages.
-
-**`model-comparison-card`** — Used on the homepage's "Which problem are you up against?" section comparing Opus / Sonnet / Haiku. Background `{colors.canvas}` with hairline border, rounded `{rounded.lg}`, internal padding `{spacing.xl}` (32px). Carries the model name, a short capability blurb, and a `{component.text-link}` to learn more.
-
-**`pricing-tier-card`** — Standard tier card. Background `{colors.canvas}` with hairline border, rounded `{rounded.lg}`, padding `{spacing.xl}` (32px). Carries the plan name in `{typography.title-lg}` (StyreneB), price in `{typography.display-sm}` (Copernicus serif!), feature checklist in `{typography.body-md}`, and a `{component.button-primary}` at the bottom.
-
-**`pricing-tier-card-featured`** — The featured tier (typically "Pro" or "Team"). Background flips to `{colors.surface-dark}`, text inverts to `{colors.on-dark}`. The dark surface IS the featured-tier signal.
-
-**`callout-card-coral`** — A full-bleed coral card carrying a major call-to-action. Background `{colors.primary}` (#cc785c), text `{colors.on-primary}` (white), rounded `{rounded.lg}`, padding `{spacing.xxl}` (48px). The coral surface IS the voltage; the CTA inside uses an inverted button style (cream/canvas button on coral).
-
-**`connector-tile`** — Used on the connectors page's integration grid. Background `{colors.canvas}` with hairline border, rounded `{rounded.lg}`, padding 20px. Each tile carries a logo at top, a `{typography.title-sm}` connector name, and a short description.
-
-### Inputs & Forms
-
-**`text-input`** — Standard text input. Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-md}`, rounded `{rounded.md}` (8px), padding 10px × 14px, height 40px. 1px hairline border in `{colors.hairline}`.
-
-**`text-input-focused`** — Focus state. Border thickens or shifts to `{colors.primary}` (coral) for emphasis. Carries a 3px coral-at-15%-alpha outer ring.
-
-**`cookie-consent-card`** — Bottom-right floating dark cookie banner. Background `{colors.surface-dark}`, text `{colors.on-dark}`, rounded `{rounded.lg}`, padding `{spacing.lg}` (24px). One of the few places dark surface appears at small scale on cream pages.
-
-### Tags / Badges
-
-**`badge-pill`** — Small pill label used for category tags. Background `{colors.surface-card}`, text `{colors.ink}`, type `{typography.caption}` (13px / 500), rounded `{rounded.pill}`, padding 4px × 12px.
-
-**`badge-coral`** — Coral-fill badge for "NEW", "BETA", featured highlights. Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.caption-uppercase}` (12px / 500 / 1.5px tracking), rounded `{rounded.pill}`, padding 4px × 12px.
-
-### Tab / Filter
-
-**`category-tab`** + **`category-tab-active`** — Used in sub-nav rows on solutions / connectors pages. Inactive: transparent background, `{colors.muted}` text. Active: `{colors.surface-card}` background, `{colors.ink}` text. Padding 8px × 14px, rounded `{rounded.md}`.
-
-### CTA / Footer
-
-**`cta-band-coral`** — A pre-footer "Try Claude" CTA card. Full-width coral fill, white type, rounded `{rounded.lg}`, padding 64px. Carries an h2 in `{typography.display-sm}` (still serif!), a sub-line, and a cream-button CTA.
-
-**`cta-band-dark`** — Alternative pre-footer band on developer-focused pages. Background `{colors.surface-dark}`, text `{colors.on-dark}`, rounded `{rounded.lg}`, padding 64px. Often pairs with a code-window card.
-
-**`footer`** — Dark navy footer that closes every page. Background `{colors.surface-dark}` (#181715), text `{colors.on-dark-soft}`. 4-column link list at desktop covering Product / Company / Resources / Legal. Vertical padding 64px. The Anthropic spike-mark + "Anthropic" wordmark sits at the top in `{colors.on-dark}`. The footer never inverts.
-
-## Do's and Don'ts
-
-### Do
-- Anchor every page on the cream canvas. Pure white reads as "any other AI tool"; the warm tint is the brand differentiator.
-- Use Copernicus serif for every display headline. Pair with StyreneB sans body. Negative letter-spacing on display sizes is non-negotiable.
-- Reserve `{colors.primary}` (coral) for primary CTAs and full-bleed `{component.callout-card-coral}` moments. Don't paint accent moments coral elsewhere.
-- Use `{component.product-mockup-card-dark}` and `{component.code-window-card}` to show actual Claude product chrome. Don't paint marketing illustrations of code when you can show real code.
-- Pair `{component.feature-card}` (cream) with `{component.product-mockup-card-dark}` (navy) in alternating bands. The cream-to-dark rhythm is the brand's pacing mechanism.
-- Use the Anthropic spike-mark glyph as the brand wordmark prefix. Never invert the mark to white-on-dark within the wordmark itself.
-- Apply `{spacing.section}` (96px) between major bands.
-
-### Don't
-- Don't use cool grays or pure white for canvas. Cream is the brand.
-- Don't bold serif display weight. Copernicus at 700 reads as bombastic; the system stays at 400.
-- Don't use cool blue or saturated cyan as a brand accent. The coral is the brand voltage.
-- Don't put coral everywhere. The coral is scarce on individual elements and generous only on full-bleed coral callout cards.
-- Don't use Inter for display headlines. The serif character is the brand voice.
-- Don't repeat the same surface mode in two consecutive bands. The pacing alternates: cream → cream-card → dark-mockup → cream → coral-callout → dark-footer.
-- Don't add hover state styling beyond what the system already encodes — primary darkens on press; nothing else changes.
-
-## Responsive Behavior
-
-### Breakpoints
-
-| Name | Width | Key Changes |
-|---|---|---|
-| Mobile | < 768px | Hamburger nav; hero h1 64→32px; hero-illustration-card stacks below content; feature grids 1-up; connector tiles 2-up; pricing 1-up; footer 4 cols → 1 |
-| Tablet | 768–1024px | Top nav stays horizontal but tightens; feature cards 2-up; connector tiles 3-up; pricing 2-up |
-| Desktop | 1024–1440px | Full top-nav with all menu items; 3-up feature cards; 4-up or 6-up connector tiles; 3-up pricing tiers |
-| Wide | > 1440px | Same as desktop with more outer breathing room; max content width caps at 1200px |
-
-### Touch Targets
-- `{component.button-primary}` at minimum 40 × 40px.
-- `{component.button-icon-circular}` at exactly 36 × 36 — slightly under WCAG 44 but visually centered.
-- `{component.text-input}` height is 40px.
-- Connector tile entire card area is tappable; effective tap area >> 44px.
-
-### Collapsing Strategy
-- Top nav collapses to hamburger at < 768px; menu opens as a full-screen cream sheet.
-- Hero band's 6-6 grid collapses to single-column on mobile — h1 + sub-head + buttons first, then the illustration / mockup card below.
-- Feature grids reduce columns rather than scaling cards down.
-- Pricing tier cards collapse 4 → 2 → 1; featured-tier dark surface stays visually distinct at every breakpoint.
-- Code-window cards retain code legibility at every breakpoint by allowing horizontal scroll within the card rather than wrapping code lines.
-
-### Image Behavior
-- Code blocks inside dark mockups stay at fixed font-size; horizontal scroll on mobile rather than wrapping.
-- Hero illustrations scale proportionally; line-art strokes thin slightly on mobile.
-- Avatar photos in testimonials crop to circles at every breakpoint.
-
-## Iteration Guide
-
-1. Focus on ONE component at a time. Reference its YAML key (`{component.feature-card}`, `{component.code-window-card}`).
-2. Variants of an existing component (`-active`, `-disabled`, `-focused`) live as separate entries in `components:`.
-3. Use `{token.refs}` everywhere — never inline hex.
-4. Never document hover. Default and Active/Pressed states only.
-5. Display headlines stay Copernicus serif 400 with negative tracking. Body stays StyreneB / Inter 400. The split is unbreakable.
-6. Cream + coral + dark navy is the trinity. Don't introduce a fourth surface tone (no purple cards, no green sections).
-7. When in doubt about emphasis: bigger Copernicus serif before bolder weight.
-
-## Known Gaps
-
-- Copernicus and StyreneB are licensed Anthropic typefaces and not available as public web fonts. Substitutes (Tiempos Headline / Cormorant Garamond / EB Garamond for serif; Inter / Söhne for sans) are documented in the typography section.
-- The Anthropic radial-spike-mark is a brand glyph rendered as inline SVG; it's not formalized as a system token here. Treat it as a logo asset.
-- Animation and transition timings (chat message reveal, code block typewriter effect on the homepage, agentic-flow diagram animations) are not in scope.
-- Form validation states beyond `{component.text-input-focused}` are not extracted — error / success states would need a sign-up or feedback flow to confirm.
-- The actual Claude product surface (claude.ai chat interface) shares some tokens with the marketing site but adds many product-specific components (chat bubbles, message tools, file upload chips, conversation history sidebar) that are out of scope for this marketing-surface document.
-- The "agent" / "computer use" demo cards on certain pages display animated Claude controlling a browser — the static screenshot doesn't fully capture the animation chrome.
```

## Tests Run
```text
git diff --check -- . ':(exclude)audits/CHANGE_AUDIT.md'; node --check js/app.js; node --check js/auth.js; node --check js/db.js; node --check js/schema.js; node --check js/import.js; node --check js/dashboard.js; node --check js/leads.js; node --check js/pipeline.js; node --check js/requirements.js; node --check js/deals.js; node --check js/database.js; node --check js/reports.js; node --check js/settings.js; rg old warm theme scan
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
