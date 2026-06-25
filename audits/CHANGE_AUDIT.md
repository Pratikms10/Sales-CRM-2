# AI Change Audit Report

## Generated On
2026-06-25_11-19-58

## Branch
main

## Baseline Commit
199b2a8

## Task Summary
Fix Dashboard top bar spacing so content starts below it

## Git Status
```text
 M css/style.css
 A fix.js
 A fix_layout.js
 M index.html
```

## Files Changed
```text
M	css/style.css
A	fix.js
A	fix_layout.js
M	index.html
```

## Change Summary
```text
 css/style.css | 857 ++++++++++++++++++++++++++++++++++++++++++++++++----------
 fix.js        |  79 ++++++
 fix_layout.js | 150 ++++++++++
 index.html    | 461 +++++++++++++++++++++----------
 4 files changed, 1250 insertions(+), 297 deletions(-)
```

## Full Diff
```diff
diff --git a/css/style.css b/css/style.css
index 1bc23e1..25183d6 100644
--- a/css/style.css
+++ b/css/style.css
@@ -77,7 +77,12 @@ body {
   font-size: 16px;
 }

-h1, h2, h3, h4, h5, h6 {
+h1,
+h2,
+h3,
+h4,
+h5,
+h6 {
   font-family: var(--font-display);
   font-weight: 700;
   color: var(--ink);
@@ -158,7 +163,8 @@ a:hover {
   border-radius: var(--rounded-md);
 }

-.nav-item:hover, .nav-item.active {
+.nav-item:hover,
+.nav-item.active {
   background-color: var(--primary-soft);
   color: var(--primary);
 }
@@ -182,12 +188,12 @@ a:hover {
   display: block;
 }

-.main-content > .tab-pane {
+.main-content>.tab-pane {
   margin: 0;
   padding: 0;
 }

-.main-content > .tab-pane > * {
+.main-content>.tab-pane>* {
   width: 100%;
   max-width: 100%;
 }
@@ -365,7 +371,8 @@ main #settings-container {
   background-color: var(--surface-white);
 }

-.data-table th, .data-table td {
+.data-table th,
+.data-table td {
   padding: var(--spacing-sm);
   text-align: left;
   border-bottom: 1px solid var(--hairline);
@@ -400,16 +407,36 @@ main #settings-container {
   color: var(--primary);
 }

-.badge-blue { background-color: var(--primary-soft); color: var(--primary); }
-.badge-yellow { background-color: var(--surface-yellow-soft); color: var(--body-strong); }
-.badge-purple { background-color: var(--accent-purple-soft); color: var(--accent-purple); }
-.badge-green { background-color: var(--surface-green-soft); color: var(--success); }
-.badge-red { background-color: var(--surface-red-soft); color: var(--error); }
+.badge-blue {
+  background-color: var(--primary-soft);
+  color: var(--primary);
+}
+
+.badge-yellow {
+  background-color: var(--surface-yellow-soft);
+  color: var(--body-strong);
+}
+
+.badge-purple {
+  background-color: var(--accent-purple-soft);
+  color: var(--accent-purple);
+}
+
+.badge-green {
+  background-color: var(--surface-green-soft);
+  color: var(--success);
+}
+
+.badge-red {
+  background-color: var(--surface-red-soft);
+  color: var(--error);
+}

 /* Hidden elements */
 .hidden {
   display: none !important;
 }
+
 /* Sheet Style Table */
 .sheet-container {
   overflow-x: auto;
@@ -419,18 +446,22 @@ main #settings-container {
   margin-bottom: var(--spacing-lg);
   box-shadow: var(--shadow-soft);
 }
+
 .sheet-table {
   width: max-content;
   min-width: 100%;
   border-collapse: collapse;
 }
-.sheet-table th, .sheet-table td {
+
+.sheet-table th,
+.sheet-table td {
   padding: 8px 12px;
   text-align: left;
   border: 1px solid var(--hairline);
   white-space: nowrap;
   font-size: 13px;
 }
+
 .sheet-table th {
   background-color: var(--primary);
   color: var(--on-primary);
@@ -438,6 +469,7 @@ main #settings-container {
   position: sticky;
   top: 0;
 }
+
 .sheet-table tbody tr:hover {
   background-color: var(--surface-blue-soft);
 }
@@ -445,13 +477,17 @@ main #settings-container {
 /* Modal */
 .modal-overlay {
   position: fixed;
-  top: 0; left: 0; right: 0; bottom: 0;
+  top: 0;
+  left: 0;
+  right: 0;
+  bottom: 0;
   background-color: rgba(16, 24, 40, 0.52);
   display: flex;
   align-items: center;
   justify-content: center;
   z-index: 1000;
 }
+
 .modal {
   background-color: var(--surface-white);
   border: 1px solid var(--hairline);
@@ -463,6 +499,7 @@ main #settings-container {
   overflow-y: auto;
   box-shadow: 0 24px 70px rgba(16, 24, 40, 0.22);
 }
+
 .modal-header {
   display: flex;
   justify-content: space-between;
@@ -471,10 +508,25 @@ main #settings-container {
 }

 /* Utility Badges */
-.badge-overdue { background-color: var(--surface-red-soft); color: var(--error); }
-.badge-priority-high { background-color: var(--primary-soft); color: var(--primary-active); }
-.badge-priority-medium { background-color: var(--surface-yellow-soft); color: var(--warning); }
-.badge-priority-low { background-color: var(--surface-green-soft); color: var(--success); }
+.badge-overdue {
+  background-color: var(--surface-red-soft);
+  color: var(--error);
+}
+
+.badge-priority-high {
+  background-color: var(--primary-soft);
+  color: var(--primary-active);
+}
+
+.badge-priority-medium {
+  background-color: var(--surface-yellow-soft);
+  color: var(--warning);
+}
+
+.badge-priority-low {
+  background-color: var(--surface-green-soft);
+  color: var(--success);
+}

 /* Filter Bar */
 .filter-bar {
@@ -484,7 +536,9 @@ main #settings-container {
   flex-wrap: wrap;
   align-items: center;
 }
-.filter-bar input, .filter-bar select {
+
+.filter-bar input,
+.filter-bar select {
   height: 36px;
   padding: 0 10px;
   font-size: 13px;
@@ -507,12 +561,14 @@ main #settings-container {
   padding-bottom: 16px;
   margin-top: 16px;
 }
+
 .kanban-board {
   display: flex;
   gap: 16px;
   min-width: max-content;
   align-items: flex-start;
 }
+
 .kanban-col {
   width: 300px;
   background-color: var(--surface-soft);
@@ -525,6 +581,7 @@ main #settings-container {
   border: 1px solid var(--hairline);
   box-shadow: var(--shadow-soft);
 }
+
 .kanban-col-header {
   font-weight: 600;
   color: var(--body-strong);
@@ -535,6 +592,7 @@ main #settings-container {
   border-bottom: 1px solid var(--hairline);
   padding-bottom: 8px;
 }
+
 .kanban-card {
   background-color: var(--surface-white);
   border: 1px solid var(--hairline);
@@ -548,28 +606,35 @@ main #settings-container {
   flex-direction: column;
   gap: 8px;
 }
+
 .kanban-card:active {
   cursor: grabbing;
 }
+
 .kanban-card:hover {
   transform: translateY(-2px);
   box-shadow: var(--shadow-card);
 }
+
 .kanban-card.dragging {
   opacity: 0.5;
 }
+
 .kanban-col.drag-over {
   background-color: var(--primary-soft);
   border: 1px dashed var(--primary);
 }
+
 .kanban-card-title {
   font-weight: 600;
   color: var(--body-strong);
 }
+
 .kanban-card-meta {
   color: var(--muted);
   font-size: 11px;
 }
+
 .kanban-card-actions {
   display: flex;
   gap: 4px;
@@ -580,8 +645,15 @@ main #settings-container {
 }

 @keyframes dashFadeIn {
-  from { opacity: 0; transform: translateY(8px); }
-  to { opacity: 1; transform: translateY(0); }
+  from {
+    opacity: 0;
+    transform: translateY(8px);
+  }
+
+  to {
+    opacity: 1;
+    transform: translateY(0);
+  }
 }

 /* ================================================================
@@ -599,12 +671,12 @@ main #settings-container {
   border: 1px solid var(--hairline);
   border-radius: var(--rounded-xxl);
   box-shadow: var(--shadow-soft);
-  margin-bottom: 20px;
-  position: sticky;
-  top: 0;
+  margin-bottom: 24px;
+  position: relative;
   z-index: 50;
   animation: dashFadeIn 0.3s ease;
 }
+
 .te-topbar-left {
   display: flex;
   align-items: center;
@@ -612,6 +684,7 @@ main #settings-container {
   flex: 1 1 auto;
   min-width: 0;
 }
+
 .te-topbar-title {
   margin: 0;
   color: var(--ink);
@@ -621,12 +694,14 @@ main #settings-container {
   white-space: nowrap;
   letter-spacing: -0.2px;
 }
+
 .te-search-wrap {
   position: relative;
   flex: 1 1 520px;
   max-width: 480px;
   min-width: 260px;
 }
+
 .te-search-icon {
   position: absolute;
   left: 14px;
@@ -635,6 +710,7 @@ main #settings-container {
   color: var(--muted-soft);
   pointer-events: none;
 }
+
 .te-search-input {
   width: 100%;
   padding: 10px 14px 10px 40px;
@@ -646,17 +722,20 @@ main #settings-container {
   color: var(--ink);
   transition: border-color 0.2s, box-shadow 0.2s;
 }
+
 .te-search-input:focus {
   outline: none;
   border-color: var(--primary);
   box-shadow: var(--ring-primary);
   background: var(--surface-white);
 }
+
 .te-topbar-controls {
   display: flex;
   align-items: center;
   gap: 8px;
 }
+
 .te-topbar-btn {
   display: inline-flex;
   align-items: center;
@@ -671,9 +750,14 @@ main #settings-container {
   font-family: var(--font-body);
   cursor: pointer;
   transition: background 0.2s, transform 0.15s;
-  box-shadow: 0 4px 12px rgba(28,93,255,0.18);
+  box-shadow: 0 4px 12px rgba(28, 93, 255, 0.18);
 }
-.te-topbar-btn:hover { background: var(--primary-active); transform: translateY(-1px); }
+
+.te-topbar-btn:hover {
+  background: var(--primary-active);
+  transform: translateY(-1px);
+}
+
 .te-topbar-icon-btn {
   width: 36px;
   height: 36px;
@@ -687,20 +771,28 @@ main #settings-container {
   cursor: pointer;
   transition: background 0.2s, border-color 0.2s;
 }
+
 .te-topbar-icon-btn:hover {
   background: var(--primary-soft);
   border-color: var(--primary);
   color: var(--primary);
 }
-.te-notif-btn { position: relative; }
+
+.te-notif-btn {
+  position: relative;
+}
+
 .te-notif-dot {
   position: absolute;
-  top: 6px; right: 6px;
-  width: 8px; height: 8px;
+  top: 6px;
+  right: 6px;
+  width: 8px;
+  height: 8px;
   background: var(--error);
   border-radius: 50%;
   border: 2px solid var(--surface-white);
 }
+
 .te-profile-chip {
   display: inline-flex;
   align-items: center;
@@ -713,9 +805,14 @@ main #settings-container {
   transition: border-color 0.2s;
   font-family: var(--font-body);
 }
-.te-profile-chip:hover { border-color: var(--primary); }
+
+.te-profile-chip:hover {
+  border-color: var(--primary);
+}
+
 .te-avatar {
-  width: 28px; height: 28px;
+  width: 28px;
+  height: 28px;
   border-radius: 50%;
   background: linear-gradient(135deg, var(--primary) 0%, var(--accent-purple) 100%);
   color: #fff;
@@ -725,11 +822,23 @@ main #settings-container {
   font-size: 12px;
   font-weight: 700;
 }
-.te-profile-name { font-size: 13px; font-weight: 600; color: var(--body-strong); }
-.te-profile-role { font-size: 11px; color: var(--muted); }
+
+.te-profile-name {
+  font-size: 13px;
+  font-weight: 600;
+  color: var(--body-strong);
+}
+
+.te-profile-role {
+  font-size: 11px;
+  color: var(--muted);
+}

 /* New dropdown */
-.te-topbar-btn-wrap { position: relative; }
+.te-topbar-btn-wrap {
+  position: relative;
+}
+
 .te-new-dropdown {
   position: absolute;
   top: calc(100% + 8px);
@@ -738,10 +847,11 @@ main #settings-container {
   background: var(--surface-white);
   border: 1px solid var(--hairline);
   border-radius: var(--rounded-lg);
-  box-shadow: 0 12px 40px rgba(16,24,40,0.12);
+  box-shadow: 0 12px 40px rgba(16, 24, 40, 0.12);
   z-index: 100;
   padding: 6px 0;
 }
+
 .te-dropdown-group-label {
   padding: 6px 14px 2px;
   font-size: 11px;
@@ -750,7 +860,13 @@ main #settings-container {
   text-transform: uppercase;
   letter-spacing: 0.5px;
 }
-.te-dropdown-divider { height: 1px; background: var(--hairline); margin: 4px 0; }
+
+.te-dropdown-divider {
+  height: 1px;
+  background: var(--hairline);
+  margin: 4px 0;
+}
+
 .te-dropdown-item {
   display: block;
   width: 100%;
@@ -765,7 +881,11 @@ main #settings-container {
   font-family: var(--font-body);
   transition: background 0.15s;
 }
-.te-dropdown-item:hover { background: var(--primary-soft); color: var(--primary); }
+
+.te-dropdown-item:hover {
+  background: var(--primary-soft);
+  color: var(--primary);
+}

 /* --- Hero --- */
 .te-hero {
@@ -774,11 +894,22 @@ main #settings-container {
   border-radius: var(--rounded-xxl);
   box-shadow: var(--shadow-soft);
   padding: 28px 32px 24px;
+  margin-top: 24px;
   margin-bottom: 24px;
   animation: dashFadeIn 0.4s ease;
 }
-.te-hero-inner { position: relative; }
-.te-hero-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
+
+.te-hero-inner {
+  position: relative;
+}
+
+.te-hero-top {
+  display: flex;
+  justify-content: space-between;
+  align-items: flex-start;
+  margin-bottom: 12px;
+}
+
 .te-pulse-strip {
   display: flex;
   align-items: center;
@@ -787,8 +918,10 @@ main #settings-container {
   font-weight: 600;
   color: var(--muted);
 }
+
 .te-pulse-icon {
-  width: 24px; height: 24px;
+  width: 24px;
+  height: 24px;
   display: inline-flex;
   align-items: center;
   justify-content: center;
@@ -796,24 +929,44 @@ main #settings-container {
   border-radius: 50%;
   color: var(--primary);
 }
-.te-pulse-label { color: var(--body-strong); font-size: 13px; }
+
+.te-pulse-label {
+  color: var(--body-strong);
+  font-size: 13px;
+}
+
 .te-live-dot {
-  width: 8px; height: 8px;
+  width: 8px;
+  height: 8px;
   background: var(--success);
   border-radius: 50%;
   animation: livePulse 2s infinite;
 }
+
 @keyframes livePulse {
-  0%, 100% { opacity: 1; }
-  50% { opacity: 0.4; }
+
+  0%,
+  100% {
+    opacity: 1;
+  }
+
+  50% {
+    opacity: 0.4;
+  }
+}
+
+.te-live-text {
+  color: var(--success);
+  font-size: 12px;
 }
-.te-live-text { color: var(--success); font-size: 12px; }
+
 .te-date-card {
   display: flex;
   flex-direction: column;
   align-items: flex-end;
   gap: 2px;
 }
+
 .te-date-today {
   font-size: 11px;
   font-weight: 700;
@@ -821,7 +974,13 @@ main #settings-container {
   color: var(--primary);
   letter-spacing: 0.5px;
 }
-.te-date-full { font-size: 13px; color: var(--body); font-weight: 500; }
+
+.te-date-full {
+  font-size: 13px;
+  color: var(--body);
+  font-weight: 500;
+}
+
 .te-hero-heading {
   font-size: 26px;
   font-weight: 800;
@@ -836,6 +995,7 @@ main #settings-container {
   grid-template-columns: repeat(4, 1fr);
   gap: 16px;
 }
+
 .te-pcard {
   border-radius: var(--rounded-xl);
   padding: 20px;
@@ -845,38 +1005,97 @@ main #settings-container {
   position: relative;
   transition: transform 0.2s, box-shadow 0.2s;
 }
-.te-pcard:hover { transform: translateY(-3px); box-shadow: var(--shadow-card); }
+
+.te-pcard:hover {
+  transform: translateY(-3px);
+  box-shadow: var(--shadow-card);
+}
+
 .te-pcard-navy {
   background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
   color: #fff;
-  border: 1px solid rgba(255,255,255,0.06);
+  border: 1px solid rgba(255, 255, 255, 0.06);
 }
-.te-pcard-navy .te-pcard-icon { color: rgba(255,255,255,0.7); }
-.te-pcard-navy .te-pcard-value { color: #fff; }
-.te-pcard-navy .te-pcard-title { color: rgba(255,255,255,0.85); }
-.te-pcard-navy .te-pcard-footer { color: rgba(255,255,255,0.5); }
+
+.te-pcard-navy .te-pcard-icon {
+  color: rgba(255, 255, 255, 0.7);
+}
+
+.te-pcard-navy .te-pcard-value {
+  color: #fff;
+}
+
+.te-pcard-navy .te-pcard-title {
+  color: rgba(255, 255, 255, 0.85);
+}
+
+.te-pcard-navy .te-pcard-footer {
+  color: rgba(255, 255, 255, 0.5);
+}
+
 .te-pcard-white {
   background: var(--surface-white);
   border: 1px solid var(--hairline);
   color: var(--ink);
 }
+
 .te-pcard-violet {
   background: linear-gradient(135deg, var(--primary) 0%, var(--accent-purple) 100%);
   color: #fff;
-  border: 1px solid rgba(255,255,255,0.1);
-}
-.te-pcard-violet .te-pcard-icon { color: rgba(255,255,255,0.7); }
-.te-pcard-violet .te-pcard-value { color: #fff; }
-.te-pcard-violet .te-pcard-title { color: rgba(255,255,255,0.9); }
-.te-pcard-violet .te-pcard-footer { color: rgba(255,255,255,0.5); }
-.te-pcard-icon { margin-bottom: 4px; }
-.te-icon-red { color: var(--error); }
-.te-icon-amber { color: var(--warning); }
-.te-icon-blue { color: var(--primary); }
-.te-icon-green { color: var(--success); }
-.te-icon-purple { color: var(--accent-purple); }
-.te-pcard-value { font-size: 28px; font-weight: 800; line-height: 1; }
-.te-pcard-title { font-size: 13px; font-weight: 600; }
+  border: 1px solid rgba(255, 255, 255, 0.1);
+}
+
+.te-pcard-violet .te-pcard-icon {
+  color: rgba(255, 255, 255, 0.7);
+}
+
+.te-pcard-violet .te-pcard-value {
+  color: #fff;
+}
+
+.te-pcard-violet .te-pcard-title {
+  color: rgba(255, 255, 255, 0.9);
+}
+
+.te-pcard-violet .te-pcard-footer {
+  color: rgba(255, 255, 255, 0.5);
+}
+
+.te-pcard-icon {
+  margin-bottom: 4px;
+}
+
+.te-icon-red {
+  color: var(--error);
+}
+
+.te-icon-amber {
+  color: var(--warning);
+}
+
+.te-icon-blue {
+  color: var(--primary);
+}
+
+.te-icon-green {
+  color: var(--success);
+}
+
+.te-icon-purple {
+  color: var(--accent-purple);
+}
+
+.te-pcard-value {
+  font-size: 28px;
+  font-weight: 800;
+  line-height: 1;
+}
+
+.te-pcard-title {
+  font-size: 13px;
+  font-weight: 600;
+}
+
 .te-pcard-badge {
   display: inline-flex;
   align-self: flex-start;
@@ -885,18 +1104,49 @@ main #settings-container {
   font-size: 11px;
   font-weight: 700;
 }
-.te-badge-red { background: rgba(240,68,56,0.15); color: var(--error); }
-.te-badge-amber { background: rgba(247,144,9,0.15); color: var(--warning); }
-.te-badge-blue { background: rgba(28,93,255,0.12); color: var(--primary); }
-.te-badge-violet { background: rgba(122,92,255,0.15); color: #c4b5fd; }
-.te-badge-muted { background: var(--hairline-soft); color: var(--muted); }
-.te-pcard-footer { font-size: 11px; margin-top: auto; opacity: 0.7; }
-.te-pcard-pills { display: flex; gap: 6px; margin-top: 6px; }
+
+.te-badge-red {
+  background: rgba(240, 68, 56, 0.15);
+  color: var(--error);
+}
+
+.te-badge-amber {
+  background: rgba(247, 144, 9, 0.15);
+  color: var(--warning);
+}
+
+.te-badge-blue {
+  background: rgba(28, 93, 255, 0.12);
+  color: var(--primary);
+}
+
+.te-badge-violet {
+  background: rgba(122, 92, 255, 0.15);
+  color: #c4b5fd;
+}
+
+.te-badge-muted {
+  background: var(--hairline-soft);
+  color: var(--muted);
+}
+
+.te-pcard-footer {
+  font-size: 11px;
+  margin-top: auto;
+  opacity: 0.7;
+}
+
+.te-pcard-pills {
+  display: flex;
+  gap: 6px;
+  margin-top: 6px;
+}
+
 .te-pill {
   padding: 2px 8px;
   border-radius: var(--rounded-pill);
-  background: rgba(255,255,255,0.15);
-  color: rgba(255,255,255,0.85);
+  background: rgba(255, 255, 255, 0.15);
+  color: rgba(255, 255, 255, 0.85);
   font-size: 10px;
   font-weight: 600;
 }
@@ -909,8 +1159,20 @@ main #settings-container {
   margin-bottom: 14px;
   margin-top: 8px;
 }
-.te-section-title { font-size: 18px; font-weight: 700; color: var(--ink); margin: 0; }
-.te-section-sub { font-size: 12px; color: var(--muted); margin: 2px 0 0; }
+
+.te-section-title {
+  font-size: 18px;
+  font-weight: 700;
+  color: var(--ink);
+  margin: 0;
+}
+
+.te-section-sub {
+  font-size: 12px;
+  color: var(--muted);
+  margin: 2px 0 0;
+}
+
 .te-btn-outline {
   padding: 6px 14px;
   border: 1px solid var(--hairline);
@@ -923,8 +1185,17 @@ main #settings-container {
   cursor: pointer;
   transition: border-color 0.2s, background 0.2s;
 }
-.te-btn-outline:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-soft); }
-.te-btn-sm { padding: 4px 12px; font-size: 11px; }
+
+.te-btn-outline:hover {
+  border-color: var(--primary);
+  color: var(--primary);
+  background: var(--primary-soft);
+}
+
+.te-btn-sm {
+  padding: 4px 12px;
+  font-size: 11px;
+}

 /* --- Approval Queue --- */
 .te-approval-row {
@@ -933,6 +1204,7 @@ main #settings-container {
   gap: 12px;
   margin-bottom: 24px;
 }
+
 .te-approval-card {
   display: flex;
   align-items: center;
@@ -943,21 +1215,48 @@ main #settings-container {
   border-radius: var(--rounded-xl);
   transition: transform 0.2s, box-shadow 0.2s;
 }
-.te-approval-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-card); }
+
+.te-approval-card:hover {
+  transform: translateY(-2px);
+  box-shadow: var(--shadow-card);
+}
+
 .te-approval-icon {
-  width: 36px; height: 36px;
+  width: 36px;
+  height: 36px;
   display: flex;
   align-items: center;
   justify-content: center;
   border-radius: var(--rounded-md);
   flex-shrink: 0;
 }
-.te-approval-icon.te-icon-amber { background: var(--surface-yellow-soft); }
-.te-approval-icon.te-icon-blue { background: var(--surface-blue-card); }
-.te-approval-icon.te-icon-green { background: var(--surface-green-soft); }
-.te-approval-icon.te-icon-purple { background: var(--accent-purple-soft); }
-.te-approval-label { font-size: 13px; font-weight: 600; color: var(--body-strong); }
-.te-approval-count { font-size: 12px; color: var(--muted); }
+
+.te-approval-icon.te-icon-amber {
+  background: var(--surface-yellow-soft);
+}
+
+.te-approval-icon.te-icon-blue {
+  background: var(--surface-blue-card);
+}
+
+.te-approval-icon.te-icon-green {
+  background: var(--surface-green-soft);
+}
+
+.te-approval-icon.te-icon-purple {
+  background: var(--accent-purple-soft);
+}
+
+.te-approval-label {
+  font-size: 13px;
+  font-weight: 600;
+  color: var(--body-strong);
+}
+
+.te-approval-count {
+  font-size: 12px;
+  color: var(--muted);
+}

 /* --- Two-column layout --- */
 .te-two-col {
@@ -966,7 +1265,9 @@ main #settings-container {
   gap: 20px;
   margin-bottom: 24px;
 }
-.te-col-left, .te-col-right {
+
+.te-col-left,
+.te-col-right {
   background: var(--surface-white);
   border: 1px solid var(--hairline);
   border-radius: var(--rounded-xl);
@@ -974,7 +1275,12 @@ main #settings-container {
 }

 /* Work Queue */
-.te-work-queue { display: flex; flex-direction: column; gap: 0; }
+.te-work-queue {
+  display: flex;
+  flex-direction: column;
+  gap: 0;
+}
+
 .te-wq-row {
   display: flex;
   align-items: center;
@@ -984,23 +1290,70 @@ main #settings-container {
   transition: background 0.15s;
   cursor: default;
 }
-.te-wq-row:last-child { border-bottom: none; }
-.te-wq-row:hover { background: var(--surface-soft); border-radius: var(--rounded-md); margin: 0 -8px; padding: 12px 8px; }
+
+.te-wq-row:last-child {
+  border-bottom: none;
+}
+
+.te-wq-row:hover {
+  background: var(--surface-soft);
+  border-radius: var(--rounded-md);
+  margin: 0 -8px;
+  padding: 12px 8px;
+}
+
 .te-wq-icon {
-  width: 32px; height: 32px;
+  width: 32px;
+  height: 32px;
   display: flex;
   align-items: center;
   justify-content: center;
   border-radius: var(--rounded-md);
   flex-shrink: 0;
 }
-.te-wq-icon.te-status-red { background: var(--surface-red-soft); color: var(--error); }
-.te-wq-icon.te-status-amber { background: var(--surface-yellow-soft); color: var(--warning); }
-.te-wq-icon.te-status-blue { background: var(--surface-blue-card); color: var(--primary); }
-.te-wq-body { flex: 1; min-width: 0; }
-.te-wq-title { font-size: 13px; font-weight: 600; color: var(--body-strong); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
-.te-wq-meta { font-size: 11px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
-.te-wq-status { text-align: right; flex-shrink: 0; }
+
+.te-wq-icon.te-status-red {
+  background: var(--surface-red-soft);
+  color: var(--error);
+}
+
+.te-wq-icon.te-status-amber {
+  background: var(--surface-yellow-soft);
+  color: var(--warning);
+}
+
+.te-wq-icon.te-status-blue {
+  background: var(--surface-blue-card);
+  color: var(--primary);
+}
+
+.te-wq-body {
+  flex: 1;
+  min-width: 0;
+}
+
+.te-wq-title {
+  font-size: 13px;
+  font-weight: 600;
+  color: var(--body-strong);
+  white-space: nowrap;
+  overflow: hidden;
+  text-overflow: ellipsis;
+}
+
+.te-wq-meta {
+  font-size: 11px;
+  color: var(--muted);
+  white-space: nowrap;
+  overflow: hidden;
+  text-overflow: ellipsis;
+}
+
+.te-wq-status {
+  text-align: right;
+  flex-shrink: 0;
+}
+
 .te-wq-badge {
   display: inline-block;
   padding: 2px 8px;
@@ -1008,13 +1361,36 @@ main #settings-container {
   font-size: 10px;
   font-weight: 700;
 }
-.te-wq-badge.te-status-red { background: var(--surface-red-soft); color: var(--error); }
-.te-wq-badge.te-status-amber { background: var(--surface-yellow-soft); color: var(--warning); }
-.te-wq-badge.te-status-blue { background: var(--surface-blue-card); color: var(--primary); }
-.te-wq-time { display: block; font-size: 11px; color: var(--muted); margin-top: 2px; }
+
+.te-wq-badge.te-status-red {
+  background: var(--surface-red-soft);
+  color: var(--error);
+}
+
+.te-wq-badge.te-status-amber {
+  background: var(--surface-yellow-soft);
+  color: var(--warning);
+}
+
+.te-wq-badge.te-status-blue {
+  background: var(--surface-blue-card);
+  color: var(--primary);
+}
+
+.te-wq-time {
+  display: block;
+  font-size: 11px;
+  color: var(--muted);
+  margin-top: 2px;
+}

 /* Risk alerts */
-.te-risk-list { display: flex; flex-direction: column; gap: 8px; }
+.te-risk-list {
+  display: flex;
+  flex-direction: column;
+  gap: 8px;
+}
+
 .te-risk-row {
   display: flex;
   align-items: center;
@@ -1025,7 +1401,10 @@ main #settings-container {
   font-weight: 500;
   color: var(--body-strong);
 }
-.te-risk-text { flex: 1; }
+
+.te-risk-text {
+  flex: 1;
+}

 /* Empty states */
 .te-empty-state {
@@ -1038,16 +1417,21 @@ main #settings-container {
   text-align: center;
   gap: 8px;
 }
-.te-empty-state p { font-size: 13px; margin: 0; }
+
+.te-empty-state p {
+  font-size: 13px;
+  margin: 0;
+}

 /* --- Drawers --- */
 .te-drawer-overlay {
   position: fixed;
   inset: 0;
-  background: rgba(16,24,40,0.3);
+  background: rgba(16, 24, 40, 0.3);
   z-index: 900;
   transition: opacity 0.25s;
 }
+
 .te-drawer {
   position: fixed;
   top: 0;
@@ -1057,17 +1441,27 @@ main #settings-container {
   height: 100vh;
   background: var(--surface-white);
   border-left: 1px solid var(--hairline);
-  box-shadow: -8px 0 40px rgba(16,24,40,0.12);
+  box-shadow: -8px 0 40px rgba(16, 24, 40, 0.12);
   z-index: 950;
   display: flex;
   flex-direction: column;
   animation: drawerSlideIn 0.25s ease;
 }
+
 @keyframes drawerSlideIn {
-  from { transform: translateX(100%); }
-  to { transform: translateX(0); }
+  from {
+    transform: translateX(100%);
+  }
+
+  to {
+    transform: translateX(0);
+  }
+}
+
+.te-drawer.hidden {
+  display: none !important;
 }
-.te-drawer.hidden { display: none !important; }
+
 .te-drawer-header {
   display: flex;
   justify-content: space-between;
@@ -1075,9 +1469,15 @@ main #settings-container {
   padding: 20px 24px;
   border-bottom: 1px solid var(--hairline);
 }
-.te-drawer-header h3 { font-size: 18px; margin: 0; }
+
+.te-drawer-header h3 {
+  font-size: 18px;
+  margin: 0;
+}
+
 .te-drawer-close {
-  width: 32px; height: 32px;
+  width: 32px;
+  height: 32px;
   border: none;
   background: var(--surface-soft);
   border-radius: 50%;
@@ -1089,19 +1489,31 @@ main #settings-container {
   color: var(--muted);
   transition: background 0.2s;
 }
-.te-drawer-close:hover { background: var(--hairline); color: var(--ink); }
+
+.te-drawer-close:hover {
+  background: var(--hairline);
+  color: var(--ink);
+}
+
 .te-drawer-body {
   flex: 1;
   overflow-y: auto;
   padding: 20px 24px;
 }
-.te-drawer-empty { color: var(--muted-soft); font-size: 13px; text-align: center; padding: 24px 0; }
+
+.te-drawer-empty {
+  color: var(--muted-soft);
+  font-size: 13px;
+  text-align: center;
+  padding: 24px 0;
+}

 /* Activity items */
 .te-activity-item {
   padding: 10px 0;
   border-bottom: 1px solid var(--hairline-soft);
 }
+
 .te-activity-tag {
   display: inline-block;
   padding: 2px 8px;
@@ -1110,25 +1522,76 @@ main #settings-container {
   font-weight: 700;
   margin-bottom: 4px;
 }
-.te-tag-blue { background: var(--primary-soft); color: var(--primary); }
-.te-tag-purple { background: var(--accent-purple-soft); color: var(--accent-purple); }
-.te-tag-green { background: var(--surface-green-soft); color: var(--success); }
-.te-tag-amber { background: var(--surface-yellow-soft); color: var(--warning); }
-.te-tag-red { background: var(--surface-red-soft); color: var(--error); }
-.te-tag-gray { background: var(--hairline-soft); color: var(--muted); }
-.te-activity-desc { font-size: 13px; color: var(--body-strong); font-weight: 500; }
-.te-activity-time { font-size: 11px; color: var(--muted); margin-top: 2px; }
+
+.te-tag-blue {
+  background: var(--primary-soft);
+  color: var(--primary);
+}
+
+.te-tag-purple {
+  background: var(--accent-purple-soft);
+  color: var(--accent-purple);
+}
+
+.te-tag-green {
+  background: var(--surface-green-soft);
+  color: var(--success);
+}
+
+.te-tag-amber {
+  background: var(--surface-yellow-soft);
+  color: var(--warning);
+}
+
+.te-tag-red {
+  background: var(--surface-red-soft);
+  color: var(--error);
+}
+
+.te-tag-gray {
+  background: var(--hairline-soft);
+  color: var(--muted);
+}
+
+.te-activity-desc {
+  font-size: 13px;
+  color: var(--body-strong);
+  font-weight: 500;
+}
+
+.te-activity-time {
+  font-size: 11px;
+  color: var(--muted);
+  margin-top: 2px;
+}

 /* Calendar drawer */
-.te-mini-cal { margin-bottom: 16px; }
-.te-cal-month { font-size: 14px; font-weight: 700; color: var(--body-strong); margin-bottom: 8px; text-align: center; }
+.te-mini-cal {
+  margin-bottom: 16px;
+}
+
+.te-cal-month {
+  font-size: 14px;
+  font-weight: 700;
+  color: var(--body-strong);
+  margin-bottom: 8px;
+  text-align: center;
+}
+
 .te-cal-grid {
   display: grid;
   grid-template-columns: repeat(7, 1fr);
   gap: 2px;
   text-align: center;
 }
-.te-cal-day-label { font-size: 10px; font-weight: 700; color: var(--muted); padding: 4px 0; }
+
+.te-cal-day-label {
+  font-size: 10px;
+  font-weight: 700;
+  color: var(--muted);
+  padding: 4px 0;
+}
+
 .te-cal-day {
   font-size: 12px;
   padding: 6px 0;
@@ -1136,12 +1599,14 @@ main #settings-container {
   color: var(--body);
   cursor: default;
 }
+
 .te-cal-today {
   background: var(--primary);
   color: var(--on-primary);
   font-weight: 700;
   border-radius: 50%;
 }
+
 .te-cal-event {
   display: flex;
   align-items: flex-start;
@@ -1149,9 +1614,25 @@ main #settings-container {
   padding: 8px 0;
   border-bottom: 1px solid var(--hairline-soft);
 }
-.te-cal-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 4px; flex-shrink: 0; }
-.te-cal-title { font-size: 12px; font-weight: 600; color: var(--body-strong); }
-.te-cal-detail { font-size: 11px; color: var(--muted); }
+
+.te-cal-dot {
+  width: 8px;
+  height: 8px;
+  border-radius: 50%;
+  margin-top: 4px;
+  flex-shrink: 0;
+}
+
+.te-cal-title {
+  font-size: 12px;
+  font-weight: 600;
+  color: var(--body-strong);
+}
+
+.te-cal-detail {
+  font-size: 11px;
+  color: var(--muted);
+}

 /* Profile drawer */
 .te-profile-card {
@@ -1162,8 +1643,10 @@ main #settings-container {
   border-bottom: 1px solid var(--hairline);
   margin-bottom: 20px;
 }
+
 .te-profile-avatar-lg {
-  width: 48px; height: 48px;
+  width: 48px;
+  height: 48px;
   border-radius: 50%;
   background: linear-gradient(135deg, var(--primary) 0%, var(--accent-purple) 100%);
   color: #fff;
@@ -1173,40 +1656,118 @@ main #settings-container {
   font-size: 20px;
   font-weight: 700;
 }
-.te-profile-name-lg { font-size: 16px; font-weight: 700; color: var(--ink); }
-.te-profile-role-lg { font-size: 12px; color: var(--muted); }
+
+.te-profile-name-lg {
+  font-size: 16px;
+  font-weight: 700;
+  color: var(--ink);
+}
+
+.te-profile-role-lg {
+  font-size: 12px;
+  color: var(--muted);
+}
+
 .te-profile-stats {
   display: grid;
   grid-template-columns: 1fr 1fr;
   gap: 12px;
   margin-bottom: 20px;
 }
+
 .te-pstat {
   background: var(--surface-soft);
   border-radius: var(--rounded-md);
   padding: 12px;
   text-align: center;
 }
-.te-pstat-val { display: block; font-size: 22px; font-weight: 800; color: var(--primary); }
-.te-pstat-label { display: block; font-size: 11px; color: var(--muted); margin-top: 2px; }
-.te-profile-access h4 { font-size: 13px; font-weight: 700; color: var(--body-strong); margin-bottom: 4px; }
-.te-profile-access p { font-size: 12px; color: var(--muted); margin: 0; }
+
+.te-pstat-val {
+  display: block;
+  font-size: 22px;
+  font-weight: 800;
+  color: var(--primary);
+}
+
+.te-pstat-label {
+  display: block;
+  font-size: 11px;
+  color: var(--muted);
+  margin-top: 2px;
+}
+
+.te-profile-access h4 {
+  font-size: 13px;
+  font-weight: 700;
+  color: var(--body-strong);
+  margin-bottom: 4px;
+}
+
+.te-profile-access p {
+  font-size: 12px;
+  color: var(--muted);
+  margin: 0;
+}

 /* --- Responsive --- */
 @media (max-width: 1100px) {
-  .te-priority-cards { grid-template-columns: repeat(2, 1fr); }
-  .te-approval-row { grid-template-columns: repeat(2, 1fr); }
-  .te-two-col { grid-template-columns: 1fr; }
+  .te-priority-cards {
+    grid-template-columns: repeat(2, 1fr);
+  }
+
+  .te-approval-row {
+    grid-template-columns: repeat(2, 1fr);
+  }
+
+  .te-two-col {
+    grid-template-columns: 1fr;
+  }
 }
+
 @media (max-width: 700px) {
-  .te-dash-topbar { flex-direction: column; gap: 10px; }
-  .te-topbar-left { width: 100%; flex-direction: column; align-items: stretch; gap: 10px; }
-  .te-topbar-title { font-size: 22px; }
-  .te-search-wrap { max-width: 100%; }
-  .te-priority-cards { grid-template-columns: 1fr; }
-  .te-approval-row { grid-template-columns: 1fr; }
-  .te-hero { padding: 20px 16px; }
-  .te-hero-heading { font-size: 20px; }
-  .te-topbar-controls { flex-wrap: wrap; justify-content: center; }
-  .te-profile-name, .te-profile-role { display: none; }
-}
+  .te-dash-topbar {
+    flex-direction: column;
+    gap: 10px;
+  }
+
+  .te-topbar-left {
+    width: 100%;
+    flex-direction: column;
+    align-items: stretch;
+    gap: 10px;
+  }
+
+  .te-topbar-title {
+    font-size: 22px;
+  }
+
+  .te-search-wrap {
+    max-width: 100%;
+  }
+
+  .te-priority-cards {
+    grid-template-columns: 1fr;
+  }
+
+  .te-approval-row {
+    grid-template-columns: 1fr;
+  }
+
+  .te-hero {
+    padding: 20px 16px;
+  }
+
+  .te-hero-heading {
+    font-size: 20px;
+  }
+
+  .te-topbar-controls {
+    flex-wrap: wrap;
+    justify-content: center;
+  }
+
+  .te-profile-name,
+  .te-profile-role {
+    display: none;
+  }
+}
\ No newline at end of file
diff --git a/fix.js b/fix.js
new file mode 100644
index 0000000..045a743
--- /dev/null
+++ b/fix.js
@@ -0,0 +1,79 @@
+const fs = require('fs');
+
+// 1. Fix css/style.css
+let css = fs.readFileSync('css/style.css', 'utf8');
+css = css.replace(
+  '.main-content {\n  flex-grow: 1;\n  background-color: var(--canvas);\n  overflow-y: auto;\n  padding: var(--spacing-xl);\n}',
+  '.main-content {\n  flex-grow: 1;\n  background-color: var(--canvas);\n  overflow-y: auto;\n  overflow-x: hidden;\n  min-width: 0;\n  padding: var(--spacing-xl);\n}'
+);
+fs.writeFileSync('css/style.css', css);
+
+// 2. Fix index.html
+let html = fs.readFileSync('index.html', 'utf8');
+
+// Replace global top-bar
+html = html.replace(
+  /<main class="main-content">\s*<div class="top-bar">\s*<h2 id="page-title">Dashboard<\/h2>\s*<div>\s*<button class="btn btn-primary hidden" id="add-record-btn">\+ New Record<\/button>\s*<\/div>\s*<\/div>/g,
+  '<main class="main-content">\n      <span id="page-title" style="display:none;"></span>\n      <button class="btn btn-primary hidden" id="add-record-btn" style="display:none;">+ New Record</button>'
+);
+
+// Dashboard
+html = html.replace(
+  /<div id="tab-dashboard" class="tab-pane active">\s*<div id="dashboard-container"><\/div>/g,
+  '<div id="tab-dashboard" class="tab-pane active">\n        <div class="top-bar">\n          <h2 style="margin: 0;">Dashboard</h2>\n        </div>\n        <div id="dashboard-container"></div>'
+);
+
+// Leads
+html = html.replace(
+  /<div class="card">\s*<div style="display: flex; justify-content: space-between; align-items: center;">\s*<h3>Leads Tracker<\/h3>\s*<div>\s*<button class="btn btn-primary" id="btn-add-lead">\+ Add Lead<\/button>\s*<\/div>\s*<\/div>\s*<p>Presales tracking and lead management\.<\/p>/g,
+  '<div class="top-bar">\n          <h2 style="margin: 0;">Leads Tracker</h2>\n          <div>\n            <button class="btn btn-primary" id="btn-add-lead">+ Add Lead</button>\n          </div>\n        </div>\n        <p style="color: var(--muted); margin-bottom: 20px;">Presales tracking and lead management.</p>\n        <div class="card">'
+);
+
+// Pipeline
+html = html.replace(
+  /<div class="card">\s*<div style="display: flex; justify-content: space-between; align-items: center;">\s*<h3>Pipeline Kanban<\/h3>\s*<\/div>\s*<p>Manage leads, requirements, and deals across the sales cycle\.<\/p>/g,
+  '<div class="top-bar">\n          <h2 style="margin: 0;">Pipeline Kanban</h2>\n        </div>\n        <p style="color: var(--muted); margin-bottom: 20px;">Manage leads, requirements, and deals across the sales cycle.</p>\n        <div class="card">'
+);
+
+// Sourcing
+html = html.replace(
+  /<div class="card"\s*style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">\s*<div>\s*<h3>Requirements & Sourcing<\/h3>\s*<p>Fulfill client needs\.<\/p>\s*<\/div>\s*<div style="display: flex; gap: 8px;">\s*<button class="btn btn-primary" onclick="window\.requirementsManager\.openRequirementModal\(\)">\+ Add\s*Requirement<\/button>\s*<\/div>\s*<\/div>/g,
+  '<div class="top-bar">\n          <div style="display: flex; align-items: baseline; gap: 10px;">\n            <h2 style="margin: 0;">Requirements & Sourcing</h2>\n            <span style="color: var(--muted); font-size: 14px;">Fulfill client needs.</span>\n          </div>\n          <div style="display: flex; gap: 8px;">\n            <button class="btn btn-primary" onclick="window.requirementsManager.openRequirementModal()">+ Add Requirement</button>\n          </div>\n        </div>'
+);
+
+// Deals
+html = html.replace(
+  /<div class="card"\s*style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">\s*<div>\s*<h3>Deals Management<\/h3>\s*<p>Track closed-won clients and invoicing\.<\/p>\s*<\/div>\s*<div style="display: flex; gap: 8px;">\s*<button class="btn btn-primary" onclick="window\.dealsManager\.openDealModal\(\)">\+ Add Deal<\/button>\s*<\/div>\s*<\/div>/g,
+  '<div class="top-bar">\n          <div style="display: flex; align-items: baseline; gap: 10px;">\n            <h2 style="margin: 0;">Deals Management</h2>\n            <span style="color: var(--muted); font-size: 14px;">Track closed-won clients and invoicing.</span>\n          </div>\n          <div style="display: flex; gap: 8px;">\n            <button class="btn btn-primary" onclick="window.dealsManager.openDealModal()">+ Add Deal</button>\n          </div>\n        </div>'
+);
+
+// Database
+html = html.replace(
+  /<div id="tab-database" class="tab-pane">\s*<div class="card">\s*<div style="display: flex; justify-content: space-between; align-items: center;">\s*<h3>Database<\/h3>\s*<div id="db-actions">/g,
+  '<div id="tab-database" class="tab-pane">\n        <div class="top-bar">\n          <h2 style="margin: 0;">Database</h2>\n          <div id="db-actions">'
+);
+html = html.replace(
+  /<button class="btn btn-secondary" onclick="window\.databaseManager\.openModal\('contacts'\)">\+ Contact<\/button>\s*<\/div>\s*<\/div>\s*<p>Manage central entities\.<\/p>/g,
+  '<button class="btn btn-secondary" onclick="window.databaseManager.openModal(\'contacts\')">+ Contact</button>\n          </div>\n        </div>\n        <p style="color: var(--muted); margin-bottom: 20px;">Manage central entities.</p>\n        <div class="card">'
+);
+
+// Reports
+html = html.replace(
+  /<div class="card" style="margin-bottom: 20px;">\s*<div style="display: flex; justify-content: space-between; align-items: center;">\s*<h2 style="margin: 0;">Reports & MIS<\/h2>\s*<button class="btn btn-secondary" onclick="window\.reportsManager\.generateReport\(\)">Refresh Report<\/button>\s*<\/div>/g,
+  '<div class="top-bar">\n          <h2 style="margin: 0;">Reports & MIS</h2>\n          <button class="btn btn-primary" onclick="window.reportsManager.generateReport()">Refresh Report</button>\n        </div>\n        <div class="card" style="margin-bottom: 20px;">'
+);
+
+// Settings
+html = html.replace(
+  /<div id="tab-settings" class="tab-pane">\s*<div id="settings-main-view">\s*<div class="card">\s*<div style="display: flex; justify-content: space-between; align-items: center;">\s*<h2 style="margin: 0;">Settings<\/h2>\s*<button class="btn btn-secondary" id="btn-toggle-logs">View Logs<\/button>\s*<\/div>\s*<\/div>/g,
+  '<div id="tab-settings" class="tab-pane">\n        <div id="settings-main-view">\n          <div class="top-bar">\n            <h2 style="margin: 0;">Settings</h2>\n            <button class="btn btn-secondary" id="btn-toggle-logs">View Logs</button>\n          </div>'
+);
+
+// Logs
+html = html.replace(
+  /<div id="settings-logs-view" class="hidden">\s*<div class="card">\s*<div style="display: flex; justify-content: space-between; align-items: center;">\s*<h2 style="margin: 0;">User Logs<\/h2>\s*<button class="btn btn-secondary" id="btn-toggle-settings">Back to Settings<\/button>\s*<\/div>\s*<\/div>/g,
+  '<div id="settings-logs-view" class="hidden">\n          <div class="top-bar">\n            <h2 style="margin: 0;">User Logs</h2>\n            <button class="btn btn-secondary" id="btn-toggle-settings">Back to Settings</button>\n          </div>'
+);
+
+fs.writeFileSync('index.html', html);
+console.log('Done');
diff --git a/fix_layout.js b/fix_layout.js
new file mode 100644
index 0000000..f495492
--- /dev/null
+++ b/fix_layout.js
@@ -0,0 +1,150 @@
+/**
+ * fix_layout.js
+ * Standardizes layout margins and headers for all 8 CRM tabs.
+ * - Moves per-tab h3 title+action buttons out of card into .top-bar (plain background)
+ * - Settings and Logs views are split into two toggle-able views each with their own top-bar
+ * - CSS gets a .page-header-bar alias for future proofing
+ */
+const fs = require('fs');
+
+let html = fs.readFileSync('index.html', 'utf8');
+
+// ΓöÇΓöÇΓöÇ 1. Global top-bar: keep h2#page-title but mark it display:none (JS-driven) ΓöÇ
+// The global top-bar currently shows the h2. We'll replace it so each tab manages its own.
+html = html.replace(
+  /(<div class="top-bar">)\s*<h2 id="page-title">Dashboard<\/h2>\s*<div>\s*<button class="btn btn-primary hidden" id="add-record-btn">\+ New Record<\/button>\s*<\/div>\s*<\/div>/,
+  '<span id="page-title" style="display:none;"></span>'
+);
+
+// ΓöÇΓöÇΓöÇ 2. Dashboard: inject top-bar inside tab-pane ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+html = html.replace(
+  /(<div id="tab-dashboard" class="tab-pane active">)\s*(<div id="dashboard-container">)/,
+  '$1\n        <div class="top-bar">\n          <h2>Dashboard</h2>\n        </div>\n        $2'
+);
+
+// ΓöÇΓöÇΓöÇ 3. Leads: lift h3 out of card into top-bar ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+html = html.replace(
+  /(<div id="tab-leads" class="tab-pane">)\s*<div class="card">\s*<div style="display: flex; justify-content: space-between; align-items: center;">\s*<h3>Leads Tracker<\/h3>\s*<div>\s*(<button class="btn btn-primary" id="btn-add-lead">\+ Add Lead<\/button>)\s*<\/div>\s*<\/div>\s*<p>Presales tracking and lead management\.<\/p>/,
+  '$1\n        <div class="top-bar">\n          <h2>Leads</h2>\n          <div>$2</div>\n        </div>\n        <div class="card">'
+);
+
+// ΓöÇΓöÇΓöÇ 4. Pipeline: lift h3 out of card into top-bar ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+html = html.replace(
+  /(<div id="tab-pipeline" class="tab-pane">)\s*<div class="card">\s*<div style="display: flex; justify-content: space-between; align-items: center;">\s*<h3>Pipeline Kanban<\/h3>\s*<\/div>\s*<p>Manage leads, requirements, and deals across the sales cycle\.<\/p>/,
+  '$1\n        <div class="top-bar">\n          <h2>Pipeline</h2>\n        </div>\n        <div class="card">'
+);
+
+// ΓöÇΓöÇΓöÇ 5. Requirements & Sourcing: lift card-header into top-bar ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+html = html.replace(
+  /(<div id="tab-sourcing" class="tab-pane">)\s*<div class="card" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">\s*<div>\s*<h3>Requirements &amp; Sourcing<\/h3>\s*<p>Fulfill client needs\.<\/p>\s*<\/div>\s*<div style="display: flex; gap: 8px;">\s*(<button class="btn btn-primary" onclick="window\.requirementsManager\.openRequirementModal\(\)">\+ Add\s*Requirement<\/button>)\s*<\/div>\s*<\/div>/,
+  '$1\n        <div class="top-bar">\n          <h2>Requirements &amp; Sourcing</h2>\n          <div style="display:flex;gap:8px;">$2</div>\n        </div>'
+);
+
+// ΓöÇΓöÇΓöÇ 6. Deals: lift card-header into top-bar ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+html = html.replace(
+  /(<div id="tab-deals" class="tab-pane">)\s*<div class="card" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">\s*<div>\s*<h3>Deals<\/h3>\s*<p>Delivery, finance, and post-sales tracking\.<\/p>\s*<\/div>\s*<div style="display: flex; gap: 8px;">\s*(<button class="btn btn-primary" onclick="window\.dealsManager\.openDealModal\(\)">\+ Add Deal<\/button>)\s*<\/div>\s*<\/div>/,
+  '$1\n        <div class="top-bar">\n          <h2>Deals</h2>\n          <div style="display:flex;gap:8px;">$2</div>\n        </div>'
+);
+
+// ΓöÇΓöÇΓöÇ 7. Database: lift card-header into top-bar ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+html = html.replace(
+  /(<div id="tab-database" class="tab-pane">)\s*<div class="card">\s*<div style="display: flex; justify-content: space-between; align-items: center;">\s*<div>\s*<h3>Database Master Lists<\/h3>\s*<p>Central repository for master data\. Search and manage existing records across the system\.<\/p>\s*<\/div>\s*(<button class="btn btn-secondary btn-db-add" onclick="window\.databaseManager\.goToImport\(\)">Import Data<\/button>)\s*<\/div>\s*<\/div>/,
+  '$1\n        <div class="top-bar">\n          <h2>Database</h2>\n          $2\n        </div>'
+);
+
+// ΓöÇΓöÇΓöÇ 8. Reports: lift card-header into top-bar, keep filters in a card ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
+html = html.replace(
+  /(<div id="tab-reports" class="tab-pane">)\s*<div class="card">\s*<div style="display: flex; justify-content: space-between; align-items: center;">\s*<div>\s*<h3>Reports \/ MIS<\/h3>\s*<p>Analytics based on your role access\.<\/p>\s*<\/div>\s*<div style="display: flex; gap: 8px;">\s*([\s\S]*?)<\/div>\s*<\/div>\s*<div class="filters" style="display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap;">/,
+  (match, tabOpen, buttonsHtml) => {
+    return `${tabOpen}\n        <div class="top-bar">\n          <h2>Reports / MIS</h2>\n          <div style="display:flex;gap:8px;flex-wrap:wrap;">${buttonsHtml.trim()}</div>\n        </div>\n        <div class="card">\n          <div class="filters" style="display: flex; gap: 10px; flex-wrap: wrap;">`;
+  }
+);
+// Close the card after the Filter Report button and before KPIs
+html = html.replace(
+  /(<button class="btn btn-secondary" onclick="window\.reportsManager\.render\(\)">Filter Report<\/button>)\s*<\/div>\s*<\/div>\s*(<div class="card" id="report-kpis")/,
+  '$1\n          </div>\n        </div>\n\n        $2'
+);
+
+// ΓöÇΓöÇΓöÇ 9. Settings: wrap in settings-main-view/logs-view, add proper top-bars ΓöÇΓöÇ
+const settingsBlock = html.match(/<div id="tab-settings" class="tab-pane">([\s\S]*?)<\/div>\s*\n\s*<\/main>/);
+if (settingsBlock) {
+  const replacement = `<div id="tab-settings" class="tab-pane">
+        <div id="settings-main-view">
+          <div class="top-bar">
+            <h2>Settings</h2>
+            <button class="btn btn-secondary hidden" id="btn-toggle-logs">View Logs</button>
+          </div>
+          <!-- Static Import Foundation required by app.js/import.js -->
+          <div class="card" id="settings-import-foundation">
+            <h3>Import Foundation</h3>
+            <div class="form-group">
+              <label for="import-collection">Target Entity</label>
+              <select id="import-collection" class="form-control">
+                <option value="leads">Leads</option>
+                <option value="contacts">Contacts</option>
+                <option value="clients">Clients</option>
+                <option value="requirements">Requirements</option>
+                <option value="trainers">Trainers</option>
+                <option value="vendors">Vendors</option>
+                <option value="serviceLines">Service Lines</option>
+              </select>
+            </div>
+            <div class="form-group">
+              <label for="import-file">Select CSV or JSON File</label>
+              <input type="file" id="import-file" class="form-control" accept=".csv,.json">
+            </div>
+            <button id="preview-import-btn" class="btn btn-secondary">Preview Import</button>
+            <div id="import-preview-section" style="margin-top: 16px; display: none;">
+              <h4>Import Preview</h4>
+              <div id="import-preview-results" style="margin-bottom: 16px;"></div>
+              <button id="commit-import-btn" class="btn btn-primary">Commit Import</button>
+            </div>
+          </div>
+          <div id="settings-container"></div>
+          <!-- Legacy audit logs (role-gated) -->
+          <div id="audit-logs-section" class="card hidden">
+            <h3>Audit Logs</h3>
+            <div id="audit-logs-container"></div>
+          </div>
+        </div>
+
+        <div id="settings-logs-view" class="hidden">
+          <div class="top-bar">
+            <h2>System &amp; User Logs</h2>
+            <button class="btn btn-secondary" id="btn-toggle-settings">Back to Settings</button>
+          </div>
+          <div class="card">
+            <div class="filter-bar" style="flex-wrap:wrap;">
+              <select id="filter-log-dept" class="form-control" style="width:auto;min-width:140px;">
+                <option value="">All Departments</option>
+              </select>
+              <select id="filter-log-stage" class="form-control" style="width:auto;min-width:140px;">
+                <option value="">All Stages</option>
+              </select>
+              <select id="filter-log-status" class="form-control" style="width:auto;min-width:140px;">
+                <option value="">All Statuses</option>
+              </select>
+              <select id="filter-log-action" class="form-control" style="width:auto;">
+                <option value="">All Actions</option>
+                <option value="create">Create</option>
+                <option value="update">Update</option>
+                <option value="delete">Delete</option>
+                <option value="login">Login</option>
+              </select>
+              <input type="text" id="filter-log-user" class="form-control" placeholder="Search User..." style="width:auto;min-width:140px;">
+              <button id="btn-reset-log-filters" class="btn btn-secondary">Reset Filters</button>
+            </div>
+          </div>
+          <div class="card">
+            <div id="logs-table-container"></div>
+          </div>
+        </div>
+      </div>
+
+    </main>`;
+
+  html = html.replace(/<div id="tab-settings" class="tab-pane">([\s\S]*?)<\/div>\s*\n\s*<\/main>/, replacement);
+}
+
+fs.writeFileSync('index.html', html);
+console.log('Done! Lines: ' + html.split('\n').length);
diff --git a/index.html b/index.html
index b90d20e..d4b695a 100644
--- a/index.html
+++ b/index.html
@@ -1,5 +1,6 @@
 <!DOCTYPE html>
 <html lang="en">
+
 <head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
@@ -10,21 +11,28 @@
       body * {
         visibility: hidden;
       }
-      #tab-reports, #tab-reports * {
+
+      #tab-reports,
+      #tab-reports * {
         visibility: visible;
       }
+
       #tab-reports {
         position: absolute;
         left: 0;
         top: 0;
         width: 100%;
       }
-      .sidebar, .btn, .filters {
+
+      .sidebar,
+      .btn,
+      .filters {
         display: none !important;
       }
     }
   </style>
 </head>
+
 <body>

   <!-- Login View -->
@@ -73,7 +81,8 @@
       <div class="top-bar" id="global-top-bar">
         <div>
           <h2 id="page-title">Dashboard</h2>
-          <p id="page-subtitle" style="margin: 0; font-size: 0.9em; color: var(--text-secondary); margin-top: 4px; line-height: 1.4;"></p>
+          <p id="page-subtitle"
+            style="margin: 0; font-size: 0.9em; color: var(--text-secondary); margin-top: 4px; line-height: 1.4;"></p>
         </div>
         <div style="display: flex; gap: 10px; align-items: center;">
           <button class="btn btn-primary hidden" id="add-record-btn">+ New Record</button>
@@ -90,10 +99,10 @@
       <div id="tab-leads" class="tab-pane">
         <div class="card">
           <div style="display: flex; justify-content: space-between; align-items: center;">
-              <h3>Leads Tracker</h3>
-              <div>
-                <button class="btn btn-primary" id="btn-add-lead">+ Add Lead</button>
-              </div>
+            <h3>Leads Tracker</h3>
+            <div>
+              <button class="btn btn-primary" id="btn-add-lead">+ Add Lead</button>
+            </div>
           </div>
           <p>Presales tracking and lead management.</p>

@@ -228,13 +237,15 @@
       </div>

       <div id="tab-sourcing" class="tab-pane">
-        <div class="card" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
+        <div class="card"
+          style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
           <div>
             <h3>Requirements & Sourcing</h3>
             <p>Fulfill client needs.</p>
           </div>
           <div style="display: flex; gap: 8px;">
-            <button class="btn btn-primary" onclick="window.requirementsManager.openRequirementModal()">+ Add Requirement</button>
+            <button class="btn btn-primary" onclick="window.requirementsManager.openRequirementModal()">+ Add
+              Requirement</button>
           </div>
         </div>

@@ -311,7 +322,8 @@
       </div>

       <div id="tab-deals" class="tab-pane">
-        <div class="card" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
+        <div class="card"
+          style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
           <div>
             <h3>Deals</h3>
             <p>Delivery, finance, and post-sales tracking.</p>
@@ -386,16 +398,19 @@
               <h3>Database Master Lists</h3>
               <p>Central repository for master data. Search and manage existing records across the system.</p>
             </div>
-            <button class="btn btn-secondary btn-db-add" onclick="window.databaseManager.goToImport()">Import Data</button>
+            <button class="btn btn-secondary btn-db-add" onclick="window.databaseManager.goToImport()">Import
+              Data</button>
           </div>
         </div>

         <div class="card">
           <div style="display: flex; justify-content: space-between; align-items: center;">
             <h3>Clients</h3>
-            <button class="btn btn-primary btn-db-add" onclick="window.databaseManager.openModal('clients')">+ Add Client</button>
+            <button class="btn btn-primary btn-db-add" onclick="window.databaseManager.openModal('clients')">+ Add
+              Client</button>
           </div>
-          <input type="text" id="db-search-clients" class="form-control" placeholder="Search Clients..." style="margin: 10px 0; max-width: 300px;">
+          <input type="text" id="db-search-clients" class="form-control" placeholder="Search Clients..."
+            style="margin: 10px 0; max-width: 300px;">
           <div id="db-clients-list" class="table-container"></div>
         </div>

@@ -404,52 +419,64 @@
             <h3>Leads Master</h3>
             <!-- No add button here, leads added via Leads Tab -->
           </div>
-          <input type="text" id="db-search-leads" class="form-control" placeholder="Search Leads..." style="margin: 10px 0; max-width: 300px;">
+          <input type="text" id="db-search-leads" class="form-control" placeholder="Search Leads..."
+            style="margin: 10px 0; max-width: 300px;">
           <div id="db-leads-list" class="table-container"></div>
         </div>

         <div class="card">
           <div style="display: flex; justify-content: space-between; align-items: center;">
             <h3>Normal Contacts</h3>
-            <button class="btn btn-primary btn-db-add" onclick="window.databaseManager.openModal('contacts', null, { contact_type: 'Normal' })">+ Add Normal Contact</button>
+            <button class="btn btn-primary btn-db-add"
+              onclick="window.databaseManager.openModal('contacts', null, { contact_type: 'Normal' })">+ Add Normal
+              Contact</button>
           </div>
-          <input type="text" id="db-search-normal-contacts" class="form-control" placeholder="Search Normal Contacts..." style="margin: 10px 0; max-width: 300px;">
+          <input type="text" id="db-search-normal-contacts" class="form-control" placeholder="Search Normal Contacts..."
+            style="margin: 10px 0; max-width: 300px;">
           <div id="db-normal-contacts-list" class="table-container"></div>
         </div>

         <div class="card">
           <div style="display: flex; justify-content: space-between; align-items: center;">
             <h3>Contacts (Linked)</h3>
-            <button class="btn btn-primary btn-db-add" onclick="window.databaseManager.openModal('contacts')">+ Add Contact</button>
+            <button class="btn btn-primary btn-db-add" onclick="window.databaseManager.openModal('contacts')">+ Add
+              Contact</button>
           </div>
-          <input type="text" id="db-search-contacts" class="form-control" placeholder="Search Contacts..." style="margin: 10px 0; max-width: 300px;">
+          <input type="text" id="db-search-contacts" class="form-control" placeholder="Search Contacts..."
+            style="margin: 10px 0; max-width: 300px;">
           <div id="db-contacts-list" class="table-container"></div>
         </div>

         <div class="card">
           <div style="display: flex; justify-content: space-between; align-items: center;">
             <h3>Vendors</h3>
-            <button class="btn btn-primary btn-db-add" onclick="window.databaseManager.openModal('vendors')">+ Add Vendor</button>
+            <button class="btn btn-primary btn-db-add" onclick="window.databaseManager.openModal('vendors')">+ Add
+              Vendor</button>
           </div>
-          <input type="text" id="db-search-vendors" class="form-control" placeholder="Search Vendors..." style="margin: 10px 0; max-width: 300px;">
+          <input type="text" id="db-search-vendors" class="form-control" placeholder="Search Vendors..."
+            style="margin: 10px 0; max-width: 300px;">
           <div id="db-vendors-list" class="table-container"></div>
         </div>

         <div class="card">
           <div style="display: flex; justify-content: space-between; align-items: center;">
             <h3>Trainers</h3>
-            <button class="btn btn-primary btn-db-add" onclick="window.databaseManager.openModal('trainers')">+ Add Trainer</button>
+            <button class="btn btn-primary btn-db-add" onclick="window.databaseManager.openModal('trainers')">+ Add
+              Trainer</button>
           </div>
-          <input type="text" id="db-search-trainers" class="form-control" placeholder="Search Trainers..." style="margin: 10px 0; max-width: 300px;">
+          <input type="text" id="db-search-trainers" class="form-control" placeholder="Search Trainers..."
+            style="margin: 10px 0; max-width: 300px;">
           <div id="db-trainers-list" class="table-container"></div>
         </div>

         <div class="card">
           <div style="display: flex; justify-content: space-between; align-items: center;">
             <h3>Service Database</h3>
-            <button class="btn btn-primary btn-db-add" onclick="window.databaseManager.openModal('serviceLines')">+ Add Service Line</button>
+            <button class="btn btn-primary btn-db-add" onclick="window.databaseManager.openModal('serviceLines')">+ Add
+              Service Line</button>
           </div>
-          <input type="text" id="db-search-serviceLines" class="form-control" placeholder="Search Service Lines..." style="margin: 10px 0; max-width: 300px;">
+          <input type="text" id="db-search-serviceLines" class="form-control" placeholder="Search Service Lines..."
+            style="margin: 10px 0; max-width: 300px;">
           <div id="db-serviceLines-list" class="table-container"></div>
         </div>
       </div>
@@ -486,16 +513,34 @@
             <input type="date" id="report-start-date" class="form-control" placeholder="Start Date">
             <input type="date" id="report-end-date" class="form-control" placeholder="End Date">

-            <select id="report-owner" class="form-control"><option value="">All Owners</option></select>
-            <select id="report-service" class="form-control"><option value="">All Services</option></select>
-            <select id="report-client" class="form-control"><option value="">All Clients</option></select>
-            <select id="report-trainer" class="form-control"><option value="">All Trainers</option></select>
-            <select id="report-vendor" class="form-control"><option value="">All Vendors</option></select>
+            <select id="report-owner" class="form-control">
+              <option value="">All Owners</option>
+            </select>
+            <select id="report-service" class="form-control">
+              <option value="">All Services</option>
+            </select>
+            <select id="report-client" class="form-control">
+              <option value="">All Clients</option>
+            </select>
+            <select id="report-trainer" class="form-control">
+              <option value="">All Trainers</option>
+            </select>
+            <select id="report-vendor" class="form-control">
+              <option value="">All Vendors</option>
+            </select>

-            <select id="report-status" class="form-control"><option value="">All Statuses</option></select>
-            <select id="report-city" class="form-control"><option value="">All Cities</option></select>
-            <select id="report-payment" class="form-control"><option value="">All Payment Statuses</option></select>
-            <select id="report-stage" class="form-control"><option value="">All Deal Stages</option></select>
+            <select id="report-status" class="form-control">
+              <option value="">All Statuses</option>
+            </select>
+            <select id="report-city" class="form-control">
+              <option value="">All Cities</option>
+            </select>
+            <select id="report-payment" class="form-control">
+              <option value="">All Payment Statuses</option>
+            </select>
+            <select id="report-stage" class="form-control">
+              <option value="">All Deal Stages</option>
+            </select>

             <button class="btn btn-secondary" onclick="window.reportsManager.render()">Filter Report</button>
           </div>
@@ -603,8 +648,10 @@
                 <option value="tl1">Bob</option>
                 <option value="emp1">Charlie</option>
               </select>
-              <input type="date" id="filter-log-start-date" class="form-control" style="flex: 0 0 auto; min-width: 130px;" title="Start Date">
-              <input type="date" id="filter-log-end-date" class="form-control" style="flex: 0 0 auto; min-width: 130px;" title="End Date">
+              <input type="date" id="filter-log-start-date" class="form-control"
+                style="flex: 0 0 auto; min-width: 130px;" title="Start Date">
+              <input type="date" id="filter-log-end-date" class="form-control" style="flex: 0 0 auto; min-width: 130px;"
+                title="End Date">
               <button class="btn btn-secondary" id="btn-reset-log-filters" style="flex: 0 0 auto;">Reset</button>
             </div>
           </div>
@@ -629,15 +676,21 @@
       <form id="form-lead">
         <input type="hidden" id="lead-id">
         <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
-          <div class="form-group"><label>Company Name</label><input type="text" id="lead-company" class="form-control" required></div>
-          <div class="form-group"><label>Contact Person</label><input type="text" id="lead-contact" class="form-control" required></div>
-          <div class="form-group"><label>Designation</label><input type="text" id="lead-designation" class="form-control"></div>
+          <div class="form-group"><label>Company Name</label><input type="text" id="lead-company" class="form-control"
+              required></div>
+          <div class="form-group"><label>Contact Person</label><input type="text" id="lead-contact" class="form-control"
+              required></div>
+          <div class="form-group"><label>Designation</label><input type="text" id="lead-designation"
+              class="form-control"></div>
           <div class="form-group"><label>Email</label><input type="email" id="lead-email" class="form-control"></div>
           <div class="form-group"><label>Phone</label><input type="text" id="lead-phone" class="form-control"></div>
-          <div class="form-group"><label>LinkedIn</label><input type="text" id="lead-linkedin" class="form-control"></div>
+          <div class="form-group"><label>LinkedIn</label><input type="text" id="lead-linkedin" class="form-control">
+          </div>
           <div class="form-group"><label>Website</label><input type="text" id="lead-website" class="form-control"></div>
-          <div class="form-group"><label>Industry</label><input type="text" id="lead-industry" class="form-control"></div>
-          <div class="form-group"><label>Company Size</label><input type="text" id="lead-company-size" class="form-control"></div>
+          <div class="form-group"><label>Industry</label><input type="text" id="lead-industry" class="form-control">
+          </div>
+          <div class="form-group"><label>Company Size</label><input type="text" id="lead-company-size"
+              class="form-control"></div>
           <div class="form-group"><label>City</label><input type="text" id="lead-city" class="form-control"></div>
           <div class="form-group"><label>Country</label><input type="text" id="lead-country" class="form-control"></div>

@@ -687,8 +740,10 @@
               <option value="High">High</option>
             </select>
           </div>
-          <div class="form-group"><label>Last Contact Date</label><input type="date" id="lead-last-contact" class="form-control"></div>
-          <div class="form-group"><label>Next Follow-up Date</label><input type="date" id="lead-next-followup" class="form-control"></div>
+          <div class="form-group"><label>Last Contact Date</label><input type="date" id="lead-last-contact"
+              class="form-control"></div>
+          <div class="form-group"><label>Next Follow-up Date</label><input type="date" id="lead-next-followup"
+              class="form-control"></div>
           <div class="form-group">
             <label>Follow-up Type</label>
             <select id="lead-followup-type" class="form-control">
@@ -700,7 +755,8 @@
               <option value="Meeting">Meeting</option>
             </select>
           </div>
-          <div class="form-group"><label>Owner ID (optional)</label><input type="text" id="lead-owner-id" class="form-control" placeholder="Assign to user ID"></div>
+          <div class="form-group"><label>Owner ID (optional)</label><input type="text" id="lead-owner-id"
+              class="form-control" placeholder="Assign to user ID"></div>
         </div>
         <div class="form-group" style="margin-top: 16px;">
           <label>Remarks</label>
@@ -710,16 +766,21 @@
         <div class="form-section" style="margin-top: 16px;">
           <div class="form-section-title">Attachments / References</div>
           <div class="form-grid">
-            <div class="form-group"><label>Visiting Card</label><input type="text" id="lead-visiting-card" class="form-control" placeholder="Link or note"></div>
-            <div class="form-group"><label>Requirement Note</label><input type="text" id="lead-req-note" class="form-control" placeholder="Link or note"></div>
-            <div class="form-group"><label>Email Screenshot</label><input type="text" id="lead-email-ss" class="form-control" placeholder="Link or note"></div>
-            <div class="form-group"><label>Reference Document</label><input type="text" id="lead-ref-doc" class="form-control" placeholder="Link or note"></div>
+            <div class="form-group"><label>Visiting Card</label><input type="text" id="lead-visiting-card"
+                class="form-control" placeholder="Link or note"></div>
+            <div class="form-group"><label>Requirement Note</label><input type="text" id="lead-req-note"
+                class="form-control" placeholder="Link or note"></div>
+            <div class="form-group"><label>Email Screenshot</label><input type="text" id="lead-email-ss"
+                class="form-control" placeholder="Link or note"></div>
+            <div class="form-group"><label>Reference Document</label><input type="text" id="lead-ref-doc"
+                class="form-control" placeholder="Link or note"></div>
           </div>
         </div>

         <div class="form-section" id="lead-timeline-section" style="display: none; margin-top: 16px;">
           <div class="form-section-title">Activity Timeline</div>
-          <div id="lead-timeline-container" style="font-size: 0.85em; max-height: 200px; overflow-y: auto; background: var(--surface-soft); padding: 10px; border-radius: var(--rounded-md); border: 1px solid var(--hairline);">
+          <div id="lead-timeline-container"
+            style="font-size: 0.85em; max-height: 200px; overflow-y: auto; background: var(--surface-soft); padding: 10px; border-radius: var(--rounded-md); border: 1px solid var(--hairline);">
           </div>
         </div>
         <button type="submit" class="btn btn-primary" style="margin-top: 16px;">Save Lead</button>
@@ -769,12 +830,18 @@
           <!-- Intake Fields -->
           <div class="card" style="padding: 12px;">
             <h4>1. Intake Details</h4>
-            <div class="form-group"><label>Title</label><input type="text" id="req-title" class="form-control" required></div>
-            <div class="form-group"><label>Client ID</label><input type="text" id="req-client-id" class="form-control"></div>
-            <div class="form-group"><label>Contact ID</label><input type="text" id="req-contact-id" class="form-control"></div>
-            <div class="form-group"><label>Company Name</label><input type="text" id="req-company" class="form-control"></div>
-            <div class="form-group"><label>Contact Person</label><input type="text" id="req-contact-person" class="form-control"></div>
-            <div class="form-group"><label>Designation</label><input type="text" id="req-designation" class="form-control"></div>
+            <div class="form-group"><label>Title</label><input type="text" id="req-title" class="form-control" required>
+            </div>
+            <div class="form-group"><label>Client ID</label><input type="text" id="req-client-id" class="form-control">
+            </div>
+            <div class="form-group"><label>Contact ID</label><input type="text" id="req-contact-id"
+                class="form-control"></div>
+            <div class="form-group"><label>Company Name</label><input type="text" id="req-company" class="form-control">
+            </div>
+            <div class="form-group"><label>Contact Person</label><input type="text" id="req-contact-person"
+                class="form-control"></div>
+            <div class="form-group"><label>Designation</label><input type="text" id="req-designation"
+                class="form-control"></div>
             <div class="form-group"><label>Phone</label><input type="text" id="req-phone" class="form-control"></div>
             <div class="form-group"><label>Email</label><input type="email" id="req-email" class="form-control"></div>
             <div class="form-group"><label>Service Type</label>
@@ -785,9 +852,12 @@
                 <option value="Automation Consulting">Automation Consulting</option>
               </select>
             </div>
-            <div class="form-group"><label>Technology/Topic</label><input type="text" id="req-tech" class="form-control"></div>
-            <div class="form-group"><label>Audience</label><input type="text" id="req-audience" class="form-control"></div>
-            <div class="form-group"><label>Duration</label><input type="text" id="req-duration" class="form-control"></div>
+            <div class="form-group"><label>Technology/Topic</label><input type="text" id="req-tech"
+                class="form-control"></div>
+            <div class="form-group"><label>Audience</label><input type="text" id="req-audience" class="form-control">
+            </div>
+            <div class="form-group"><label>Duration</label><input type="text" id="req-duration" class="form-control">
+            </div>
             <div class="form-group"><label>Mode</label>
               <select id="req-mode" class="form-control">
                 <option value="Online">Online</option>
@@ -795,9 +865,12 @@
                 <option value="Hybrid">Hybrid</option>
               </select>
             </div>
-            <div class="form-group"><label>Location</label><input type="text" id="req-location" class="form-control"></div>
-            <div class="form-group"><label>Preferred Dates</label><input type="text" id="req-dates" class="form-control"></div>
-            <div class="form-group"><label>Budget</label><input type="number" id="req-budget" class="form-control"></div>
+            <div class="form-group"><label>Location</label><input type="text" id="req-location" class="form-control">
+            </div>
+            <div class="form-group"><label>Preferred Dates</label><input type="text" id="req-dates"
+                class="form-control"></div>
+            <div class="form-group"><label>Budget</label><input type="number" id="req-budget" class="form-control">
+            </div>
             <div class="form-group"><label>Trainer Type</label>
               <select id="req-trainer-type" class="form-control">
                 <option value="Freelancer">Freelancer</option>
@@ -806,7 +879,8 @@
               </select>
             </div>
             <div class="form-group"><label>Lab Needs</label><input type="text" id="req-lab" class="form-control"></div>
-            <div class="form-group"><label>Recording Needs</label><input type="text" id="req-recording" class="form-control"></div>
+            <div class="form-group"><label>Recording Needs</label><input type="text" id="req-recording"
+                class="form-control"></div>
             <div class="form-group"><label>Priority</label>
               <select id="req-priority" class="form-control">
                 <option value="Low">Low</option>
@@ -828,10 +902,14 @@
                 <option value="Approved">Approved</option>
               </select>
             </div>
-            <div class="form-group"><label>Proposal Number</label><input type="text" id="req-prop-num" class="form-control"></div>
-            <div class="form-group"><label>Proposal Date</label><input type="date" id="req-prop-date" class="form-control"></div>
-            <div class="form-group"><label>Proposal Amount</label><input type="number" id="req-prop-amt" class="form-control"></div>
-            <div class="form-group"><label>Proposal Version</label><input type="text" id="req-prop-ver" class="form-control"></div>
+            <div class="form-group"><label>Proposal Number</label><input type="text" id="req-prop-num"
+                class="form-control"></div>
+            <div class="form-group"><label>Proposal Date</label><input type="date" id="req-prop-date"
+                class="form-control"></div>
+            <div class="form-group"><label>Proposal Amount</label><input type="number" id="req-prop-amt"
+                class="form-control"></div>
+            <div class="form-group"><label>Proposal Version</label><input type="text" id="req-prop-ver"
+                class="form-control"></div>
             <div class="form-group"><label>Approval Status</label>
               <select id="req-prop-appr" class="form-control">
                 <option value="Pending">Pending</option>
@@ -848,16 +926,24 @@
                 <option value="Rejected">Rejected</option>
               </select>
             </div>
-            <div class="form-group"><label>PO Number</label><input type="text" id="req-po-num" class="form-control"></div>
-            <div class="form-group"><label>PO Amount</label><input type="number" id="req-po-amt" class="form-control"></div>
-            <div class="form-group"><label>PO Received Date</label><input type="date" id="req-po-date" class="form-control"></div>
-            <div class="form-group"><label>PO Attachment Ref</label><input type="text" id="req-po-att" class="form-control"></div>
-            <div class="form-group"><label>Commercial Remarks</label><textarea id="req-comm-remarks" class="form-control" rows="2"></textarea></div>
+            <div class="form-group"><label>PO Number</label><input type="text" id="req-po-num" class="form-control">
+            </div>
+            <div class="form-group"><label>PO Amount</label><input type="number" id="req-po-amt" class="form-control">
+            </div>
+            <div class="form-group"><label>PO Received Date</label><input type="date" id="req-po-date"
+                class="form-control"></div>
+            <div class="form-group"><label>PO Attachment Ref</label><input type="text" id="req-po-att"
+                class="form-control"></div>
+            <div class="form-group"><label>Commercial Remarks</label><textarea id="req-comm-remarks"
+                class="form-control" rows="2"></textarea></div>
             <hr style="margin: 10px 0;">
             <h4>Attachments / References</h4>
-            <div class="form-group"><label>Requirement Document</label><input type="text" id="req-doc-ref" class="form-control" placeholder="Link or note"></div>
-            <div class="form-group"><label>Email Reference</label><input type="text" id="req-email-ref" class="form-control" placeholder="Link or note"></div>
-            <div class="form-group"><label>Proposal Attachment</label><input type="text" id="req-prop-att-ref" class="form-control" placeholder="Link or note"></div>
+            <div class="form-group"><label>Requirement Document</label><input type="text" id="req-doc-ref"
+                class="form-control" placeholder="Link or note"></div>
+            <div class="form-group"><label>Email Reference</label><input type="text" id="req-email-ref"
+                class="form-control" placeholder="Link or note"></div>
+            <div class="form-group"><label>Proposal Attachment</label><input type="text" id="req-prop-att-ref"
+                class="form-control" placeholder="Link or note"></div>
             <hr style="margin: 10px 0;">
             <h4>Confirmation</h4>
             <div class="form-group"><label>Confirmation Type</label>
@@ -869,18 +955,25 @@
                 <option value="Internal Approval">Internal Approval</option>
               </select>
             </div>
-            <div class="form-group"><label>Confirmation Date</label><input type="date" id="req-confirm-date" class="form-control"></div>
-            <div class="form-group"><label>Confirmation Remarks</label><textarea id="req-confirm-remarks" class="form-control" rows="2"></textarea></div>
+            <div class="form-group"><label>Confirmation Date</label><input type="date" id="req-confirm-date"
+                class="form-control"></div>
+            <div class="form-group"><label>Confirmation Remarks</label><textarea id="req-confirm-remarks"
+                class="form-control" rows="2"></textarea></div>
           </div>
         </div>

         <div class="card" style="margin-top: 16px;" id="sourcing-tracker-section">
-          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 6px;">
+          <div
+            style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 6px;">
             <div style="margin-top: 16px;">
               <h4>3. Sourcing Tracker</h4>
               <div style="display: flex; gap: 6px; flex-wrap: wrap;">
-                <button type="button" class="btn btn-secondary" onclick="window.requirementsManager.openCandidateModal(null, 'Trainer')">+ Add Trainer Candidate</button>
-                <button type="button" class="btn btn-secondary" onclick="window.requirementsManager.openCandidateModal(null, 'Vendor')">+ Add Vendor Candidate</button>
+                <button type="button" class="btn btn-secondary"
+                  onclick="window.requirementsManager.openCandidateModal(null, 'Trainer')">+ Add Trainer
+                  Candidate</button>
+                <button type="button" class="btn btn-secondary"
+                  onclick="window.requirementsManager.openCandidateModal(null, 'Vendor')">+ Add Vendor
+                  Candidate</button>
               </div>
             </div>
           </div>
@@ -908,11 +1001,16 @@

         <div style="margin-top: 16px; display: flex; gap: 10px; flex-wrap: wrap;">
           <button type="submit" class="btn btn-primary">Save Requirement</button>
-          <button type="button" class="btn btn-secondary" id="btn-convert-deal" onclick="window.requirementsManager.convertToDeal()">Convert to Deal</button>
-          <button type="button" class="btn btn-secondary" id="btn-req-add-proposal" onclick="window.requirementsManager.focusProposal()">Add Proposal</button>
-          <button type="button" class="btn btn-secondary" id="btn-req-upload-po" onclick="window.requirementsManager.focusPO()">Upload PO</button>
-          <button type="button" class="btn btn-secondary" id="btn-req-lost" onclick="window.requirementsManager.markLost()">Mark Lost</button>
-          <button type="button" class="btn btn-secondary" id="btn-req-hold" onclick="window.requirementsManager.markOnHold()">Mark On Hold</button>
+          <button type="button" class="btn btn-secondary" id="btn-convert-deal"
+            onclick="window.requirementsManager.convertToDeal()">Convert to Deal</button>
+          <button type="button" class="btn btn-secondary" id="btn-req-add-proposal"
+            onclick="window.requirementsManager.focusProposal()">Add Proposal</button>
+          <button type="button" class="btn btn-secondary" id="btn-req-upload-po"
+            onclick="window.requirementsManager.focusPO()">Upload PO</button>
+          <button type="button" class="btn btn-secondary" id="btn-req-lost"
+            onclick="window.requirementsManager.markLost()">Mark Lost</button>
+          <button type="button" class="btn btn-secondary" id="btn-req-hold"
+            onclick="window.requirementsManager.markOnHold()">Mark On Hold</button>
         </div>
       </form>
     </div>
@@ -930,12 +1028,15 @@
         <input type="hidden" id="cand-trainer-id">
         <input type="hidden" id="cand-vendor-id">
         <div style="margin-bottom: 15px; display:flex; gap: 10px;">
-          <button type="button" class="btn btn-secondary" onclick="window.requirementsManager.selectExistingTrainer()">Select Existing Trainer</button>
-          <button type="button" class="btn btn-secondary" onclick="window.requirementsManager.selectExistingVendor()">Select Existing Vendor</button>
+          <button type="button" class="btn btn-secondary"
+            onclick="window.requirementsManager.selectExistingTrainer()">Select Existing Trainer</button>
+          <button type="button" class="btn btn-secondary"
+            onclick="window.requirementsManager.selectExistingVendor()">Select Existing Vendor</button>
         </div>

         <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
-          <div class="form-group"><label>Candidate Name</label><input type="text" id="cand-name" class="form-control" required></div>
+          <div class="form-group"><label>Candidate Name</label><input type="text" id="cand-name" class="form-control"
+              required></div>
           <div class="form-group"><label>Candidate Type</label>
             <select id="cand-type" class="form-control">
               <option value="Trainer">Trainer</option>
@@ -958,7 +1059,8 @@
             </select>
           </div>
           <div class="form-group"><label>Experience</label><input type="text" id="cand-exp" class="form-control"></div>
-          <div class="form-group"><label>Commercial Rate</label><input type="number" id="cand-rate" class="form-control"></div>
+          <div class="form-group"><label>Commercial Rate</label><input type="number" id="cand-rate"
+              class="form-control"></div>
           <div class="form-group"><label>Availability</label>
             <select id="cand-avail" class="form-control">
               <option value="Available">Available</option>
@@ -987,7 +1089,8 @@
               <option value="Yes">Yes</option>
             </select>
           </div>
-          <div class="form-group"><label>Shared Date</label><input type="date" id="cand-shared-date" class="form-control"></div>
+          <div class="form-group"><label>Shared Date</label><input type="date" id="cand-shared-date"
+              class="form-control"></div>
           <div class="form-group"><label>Client Feedback</label>
             <select id="cand-feedback" class="form-control">
               <option value="Pending">Pending</option>
@@ -1001,14 +1104,21 @@
         <div class="card" style="margin-top: 16px; padding: 12px;">
           <h4>Trainer Evaluation</h4>
           <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
-            <div class="form-group"><label>Communication</label><input type="text" id="eval-comm" class="form-control"></div>
-            <div class="form-group"><label>Subject Expertise</label><input type="text" id="eval-subj" class="form-control"></div>
-            <div class="form-group"><label>Past Experience</label><input type="text" id="eval-past" class="form-control"></div>
-            <div class="form-group"><label>Methodology</label><input type="text" id="eval-meth" class="form-control"></div>
-            <div class="form-group"><label>Commercial Fit</label><input type="text" id="eval-comm-fit" class="form-control"></div>
-            <div class="form-group"><label>Flexibility</label><input type="text" id="eval-flex" class="form-control"></div>
+            <div class="form-group"><label>Communication</label><input type="text" id="eval-comm" class="form-control">
+            </div>
+            <div class="form-group"><label>Subject Expertise</label><input type="text" id="eval-subj"
+                class="form-control"></div>
+            <div class="form-group"><label>Past Experience</label><input type="text" id="eval-past"
+                class="form-control"></div>
+            <div class="form-group"><label>Methodology</label><input type="text" id="eval-meth" class="form-control">
+            </div>
+            <div class="form-group"><label>Commercial Fit</label><input type="text" id="eval-comm-fit"
+                class="form-control"></div>
+            <div class="form-group"><label>Flexibility</label><input type="text" id="eval-flex" class="form-control">
+            </div>
           </div>
-          <div class="form-group" style="margin-top: 10px;"><label>Past Feedback</label><textarea id="eval-past-fb" class="form-control" rows="2"></textarea></div>
+          <div class="form-group" style="margin-top: 10px;"><label>Past Feedback</label><textarea id="eval-past-fb"
+              class="form-control" rows="2"></textarea></div>
         </div>

         <button type="submit" class="btn btn-primary" style="margin-top: 16px;">Save Candidate</button>
@@ -1034,13 +1144,20 @@
           <!-- Column 1: Setup & Finance -->
           <div class="card" style="padding: 12px;">
             <h4>1. Setup & Finance</h4>
-            <div class="form-group"><label>Project Name</label><input type="text" id="deal-project" class="form-control" required></div>
-            <div class="form-group"><label>Client ID</label><input type="text" id="deal-client" class="form-control"></div>
-            <div class="form-group"><label>Contact ID</label><input type="text" id="deal-contact" class="form-control"></div>
-            <div class="form-group"><label>Service Type</label><input type="text" id="deal-service" class="form-control"></div>
-            <div class="form-group"><label>Deal Amount</label><input type="number" id="deal-amount" class="form-control"></div>
-            <div class="form-group"><label>Owner ID</label><input type="text" id="deal-owner" class="form-control"></div>
-            <div class="form-group"><label>Start Date</label><input type="date" id="deal-start" class="form-control"></div>
+            <div class="form-group"><label>Project Name</label><input type="text" id="deal-project" class="form-control"
+                required></div>
+            <div class="form-group"><label>Client ID</label><input type="text" id="deal-client" class="form-control">
+            </div>
+            <div class="form-group"><label>Contact ID</label><input type="text" id="deal-contact" class="form-control">
+            </div>
+            <div class="form-group"><label>Service Type</label><input type="text" id="deal-service"
+                class="form-control"></div>
+            <div class="form-group"><label>Deal Amount</label><input type="number" id="deal-amount"
+                class="form-control"></div>
+            <div class="form-group"><label>Owner ID</label><input type="text" id="deal-owner" class="form-control">
+            </div>
+            <div class="form-group"><label>Start Date</label><input type="date" id="deal-start" class="form-control">
+            </div>
             <div class="form-group"><label>End Date</label><input type="date" id="deal-end" class="form-control"></div>
             <div class="form-group"><label>Mode</label><input type="text" id="deal-mode" class="form-control"></div>
             <div class="form-group"><label>Location</label><input type="text" id="deal-loc" class="form-control"></div>
@@ -1056,9 +1173,12 @@
             </div>
             <hr style="margin: 10px 0;">
             <h4>Invoicing & Payment</h4>
-            <div class="form-group"><label>Client Invoice No</label><input type="text" id="deal-inv-no" class="form-control"></div>
-            <div class="form-group"><label>Invoice Date</label><input type="date" id="deal-inv-date" class="form-control"></div>
-            <div class="form-group"><label>Invoice Amount</label><input type="number" id="deal-inv-amt" class="form-control"></div>
+            <div class="form-group"><label>Client Invoice No</label><input type="text" id="deal-inv-no"
+                class="form-control"></div>
+            <div class="form-group"><label>Invoice Date</label><input type="date" id="deal-inv-date"
+                class="form-control"></div>
+            <div class="form-group"><label>Invoice Amount</label><input type="number" id="deal-inv-amt"
+                class="form-control"></div>
             <div class="form-group"><label>Payment Status</label>
               <select id="deal-pay-status" class="form-control">
                 <option value="Pending">Pending</option>
@@ -1067,7 +1187,8 @@
                 <option value="Overdue">Overdue</option>
               </select>
             </div>
-            <div class="form-group"><label>Payment Follow-up</label><input type="date" id="deal-pay-follow" class="form-control"></div>
+            <div class="form-group"><label>Payment Follow-up</label><input type="date" id="deal-pay-follow"
+                class="form-control"></div>
           </div>

           <!-- Column 2: Trainer & Delivery -->
@@ -1076,25 +1197,31 @@
             <div class="form-group"><label>Trainer Name</label>
               <div style="display: flex; gap: 4px;">
                 <input type="text" id="deal-trainer-name" class="form-control" readonly>
-                <button type="button" class="btn btn-secondary" onclick="window.dealsManager.assignTrainer()" style="padding: 0 8px;">Assign</button>
+                <button type="button" class="btn btn-secondary" onclick="window.dealsManager.assignTrainer()"
+                  style="padding: 0 8px;">Assign</button>
               </div>
             </div>
             <div class="form-group"><label>Vendor Name</label>
               <div style="display: flex; gap: 4px;">
                 <input type="text" id="deal-vendor-name" class="form-control" readonly>
-                <button type="button" class="btn btn-secondary" onclick="window.dealsManager.assignVendor()" style="padding: 0 8px;">Assign</button>
+                <button type="button" class="btn btn-secondary" onclick="window.dealsManager.assignVendor()"
+                  style="padding: 0 8px;">Assign</button>
               </div>
             </div>
-            <div class="form-group"><label>Trainer Rate</label><input type="text" id="deal-trainer-rate" class="form-control"></div>
+            <div class="form-group"><label>Trainer Rate</label><input type="text" id="deal-trainer-rate"
+                class="form-control"></div>
             <div class="form-group"><label>Trainer Confirmation</label>
               <select id="deal-trainer-conf" class="form-control">
                 <option value="Pending">Pending</option>
                 <option value="Confirmed">Confirmed</option>
               </select>
             </div>
-            <div class="form-group"><label>Trainer Documents</label><input type="text" id="deal-trainer-docs" class="form-control"></div>
-            <div class="form-group"><label>Travel Details</label><input type="text" id="deal-travel" class="form-control"></div>
-            <div class="form-group"><label>Hotel Booking</label><input type="text" id="deal-hotel" class="form-control"></div>
+            <div class="form-group"><label>Trainer Documents</label><input type="text" id="deal-trainer-docs"
+                class="form-control"></div>
+            <div class="form-group"><label>Travel Details</label><input type="text" id="deal-travel"
+                class="form-control"></div>
+            <div class="form-group"><label>Hotel Booking</label><input type="text" id="deal-hotel" class="form-control">
+            </div>
             <div class="form-group"><label>Trainer Reminder</label>
               <select id="deal-reminder" class="form-control">
                 <option value="Not Sent">Not Sent</option>
@@ -1112,8 +1239,10 @@
                 <option value="Cancelled">Cancelled</option>
               </select>
             </div>
-            <div class="form-group"><label>Session Plan</label><input type="text" id="deal-session" class="form-control"></div>
-            <div class="form-group"><label>Attendance List</label><input type="text" id="deal-attendance" class="form-control"></div>
+            <div class="form-group"><label>Session Plan</label><input type="text" id="deal-session"
+                class="form-control"></div>
+            <div class="form-group"><label>Attendance List</label><input type="text" id="deal-attendance"
+                class="form-control"></div>
             <div class="form-group"><label>Day 1 Check-in</label>
               <select id="deal-day1" class="form-control">
                 <option value="Pending">Pending</option>
@@ -1121,18 +1250,25 @@
                 <option value="Issues Reported">Issues Reported</option>
               </select>
             </div>
-            <div class="form-group"><label>Training Notes</label><textarea id="deal-notes" class="form-control" rows="2"></textarea></div>
-            <div class="form-group"><label>Booking Details</label><input type="text" id="deal-booking" class="form-control"></div>
-            <div class="form-group"><label>Resource Links</label><input type="text" id="deal-res-links" class="form-control"></div>
-            <div class="form-group"><label>Recording Link</label><input type="text" id="deal-rec-link" class="form-control"></div>
-            <div class="form-group"><label>Batch Report Status</label><input type="text" id="deal-batch-status" class="form-control"></div>
+            <div class="form-group"><label>Training Notes</label><textarea id="deal-notes" class="form-control"
+                rows="2"></textarea></div>
+            <div class="form-group"><label>Booking Details</label><input type="text" id="deal-booking"
+                class="form-control"></div>
+            <div class="form-group"><label>Resource Links</label><input type="text" id="deal-res-links"
+                class="form-control"></div>
+            <div class="form-group"><label>Recording Link</label><input type="text" id="deal-rec-link"
+                class="form-control"></div>
+            <div class="form-group"><label>Batch Report Status</label><input type="text" id="deal-batch-status"
+                class="form-control"></div>
           </div>

           <!-- Column 3: Post-Sales & Feedback -->
           <div class="card" style="padding: 12px;">
             <h4>3. Post-Sales & Closure</h4>
-            <div class="form-group"><label>Trainer Invoice Ref</label><input type="text" id="deal-tr-inv" class="form-control"></div>
-            <div class="form-group"><label>Trainer Payout Date</label><input type="date" id="deal-tr-pay-date" class="form-control"></div>
+            <div class="form-group"><label>Trainer Invoice Ref</label><input type="text" id="deal-tr-inv"
+                class="form-control"></div>
+            <div class="form-group"><label>Trainer Payout Date</label><input type="date" id="deal-tr-pay-date"
+                class="form-control"></div>
             <div class="form-group"><label>Trainer Payment Status</label>
               <select id="deal-tr-pay-status" class="form-control">
                 <option value="Pending">Pending</option>
@@ -1140,13 +1276,19 @@
                 <option value="Hold">Hold</option>
               </select>
             </div>
-            <div class="form-group"><label>Reimbursements</label><input type="text" id="deal-reimb" class="form-control"></div>
+            <div class="form-group"><label>Reimbursements</label><input type="text" id="deal-reimb"
+                class="form-control"></div>
             <hr style="margin: 10px 0;">
-            <div class="form-group"><label>Client Feedback</label><input type="text" id="deal-fb-client" class="form-control"></div>
-            <div class="form-group"><label>Learner Feedback</label><input type="text" id="deal-fb-learner" class="form-control"></div>
-            <div class="form-group"><label>Trainer Feedback</label><input type="text" id="deal-fb-trainer" class="form-control"></div>
-            <div class="form-group"><label>Post Test Status</label><input type="text" id="deal-post-test" class="form-control"></div>
-            <div class="form-group"><label>Completion Report</label><input type="text" id="deal-comp-report" class="form-control"></div>
+            <div class="form-group"><label>Client Feedback</label><input type="text" id="deal-fb-client"
+                class="form-control"></div>
+            <div class="form-group"><label>Learner Feedback</label><input type="text" id="deal-fb-learner"
+                class="form-control"></div>
+            <div class="form-group"><label>Trainer Feedback</label><input type="text" id="deal-fb-trainer"
+                class="form-control"></div>
+            <div class="form-group"><label>Post Test Status</label><input type="text" id="deal-post-test"
+                class="form-control"></div>
+            <div class="form-group"><label>Completion Report</label><input type="text" id="deal-comp-report"
+                class="form-control"></div>
             <div class="form-group"><label>Final Closure</label>
               <select id="deal-closure" class="form-control">
                 <option value="Pending">Pending</option>
@@ -1154,26 +1296,39 @@
               </select>
             </div>
             <hr style="margin: 10px 0;">
-            <div class="form-group"><label>Upsell Opportunity</label><textarea id="deal-upsell" class="form-control" rows="2"></textarea></div>
-            <div class="form-group"><label>Cross-Sell</label><input type="text" id="deal-cross" class="form-control"></div>
-            <div class="form-group"><label>Reference Request</label><input type="text" id="deal-ref" class="form-control"></div>
-            <div class="form-group"><label>Weekly Touchpoint</label><input type="text" id="deal-touch" class="form-control"></div>
-            <div class="form-group"><label>Repeat Business</label><input type="text" id="deal-repeat" class="form-control"></div>
+            <div class="form-group"><label>Upsell Opportunity</label><textarea id="deal-upsell" class="form-control"
+                rows="2"></textarea></div>
+            <div class="form-group"><label>Cross-Sell</label><input type="text" id="deal-cross" class="form-control">
+            </div>
+            <div class="form-group"><label>Reference Request</label><input type="text" id="deal-ref"
+                class="form-control"></div>
+            <div class="form-group"><label>Weekly Touchpoint</label><input type="text" id="deal-touch"
+                class="form-control"></div>
+            <div class="form-group"><label>Repeat Business</label><input type="text" id="deal-repeat"
+                class="form-control"></div>
           </div>
         </div>

         <div style="margin-top: 16px; display: flex; gap: 10px; flex-wrap: wrap;">
           <button type="submit" class="btn btn-primary">Save Deal</button>
           <!-- SOP Quick Actions -->
-          <button type="button" class="btn btn-secondary" onclick="window.dealsManager.focusField('deal-session')">Add Delivery Schedule</button>
-          <button type="button" class="btn btn-secondary" onclick="window.dealsManager.focusField('deal-booking')">Add Booking</button>
-          <button type="button" class="btn btn-secondary" onclick="window.dealsManager.focusField('deal-inv-no')">Add Invoice</button>
-          <button type="button" class="btn btn-secondary" onclick="window.dealsManager.focusField('deal-tr-inv')">Upload Trainer Invoice</button>
-          <button type="button" class="btn btn-secondary" onclick="window.dealsManager.focusField('deal-pay-follow')">Add Payment Follow-up</button>
-          <button type="button" class="btn btn-secondary" onclick="window.dealsManager.focusField('deal-fb-client')">Add Feedback</button>
-          <button type="button" class="btn btn-secondary" onclick="window.dealsManager.markCompleted()">Mark Completed</button>
+          <button type="button" class="btn btn-secondary" onclick="window.dealsManager.focusField('deal-session')">Add
+            Delivery Schedule</button>
+          <button type="button" class="btn btn-secondary" onclick="window.dealsManager.focusField('deal-booking')">Add
+            Booking</button>
+          <button type="button" class="btn btn-secondary" onclick="window.dealsManager.focusField('deal-inv-no')">Add
+            Invoice</button>
+          <button type="button" class="btn btn-secondary" onclick="window.dealsManager.focusField('deal-tr-inv')">Upload
+            Trainer Invoice</button>
+          <button type="button" class="btn btn-secondary"
+            onclick="window.dealsManager.focusField('deal-pay-follow')">Add Payment Follow-up</button>
+          <button type="button" class="btn btn-secondary" onclick="window.dealsManager.focusField('deal-fb-client')">Add
+            Feedback</button>
+          <button type="button" class="btn btn-secondary" onclick="window.dealsManager.markCompleted()">Mark
+            Completed</button>
           <button type="button" class="btn btn-secondary" onclick="window.dealsManager.closeDeal()">Close Deal</button>
-          <button type="button" class="btn btn-secondary" onclick="window.dealsManager.focusField('deal-upsell')">Add Upsell Follow-up</button>
+          <button type="button" class="btn btn-secondary" onclick="window.dealsManager.focusField('deal-upsell')">Add
+            Upsell Follow-up</button>
         </div>
       </form>
     </div>
@@ -1189,14 +1344,18 @@
     <div class="modal" style="max-width: 600px;">
       <div class="modal-header">
         <h3 id="modal-settings-user-title">Manage User</h3>
-        <button class="btn btn-secondary" onclick="document.getElementById('modal-settings-user').classList.add('hidden')">Close</button>
+        <button class="btn btn-secondary"
+          onclick="document.getElementById('modal-settings-user').classList.add('hidden')">Close</button>
       </div>
       <form id="form-settings-user">
         <input type="hidden" id="settings-user-id">
         <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
-          <div class="form-group"><label>First Name</label><input type="text" id="settings-user-firstname" class="form-control" required></div>
-          <div class="form-group"><label>Last Name</label><input type="text" id="settings-user-lastname" class="form-control" required></div>
-          <div class="form-group"><label>Email</label><input type="email" id="settings-user-email" class="form-control" required></div>
+          <div class="form-group"><label>First Name</label><input type="text" id="settings-user-firstname"
+              class="form-control" required></div>
+          <div class="form-group"><label>Last Name</label><input type="text" id="settings-user-lastname"
+              class="form-control" required></div>
+          <div class="form-group"><label>Email</label><input type="email" id="settings-user-email" class="form-control"
+              required></div>
           <div class="form-group">
             <label>Role</label>
             <select id="settings-user-role" class="form-control" required>
@@ -1229,7 +1388,8 @@
           </div>
           <div class="form-group" style="display: flex; align-items: center; gap: 8px;">
             <input type="checkbox" id="settings-user-reset">
-            <label for="settings-user-reset" style="margin: 0; font-weight: normal;">Require Password Reset on Login</label>
+            <label for="settings-user-reset" style="margin: 0; font-weight: normal;">Require Password Reset on
+              Login</label>
           </div>
         </div>
         <div style="margin-top: 16px;">
@@ -1259,7 +1419,8 @@
     <div class="modal" style="max-width: 500px;">
       <div class="modal-header">
         <h3>Configure Role Permissions</h3>
-        <button class="btn btn-secondary" onclick="document.getElementById('modal-settings-role').classList.add('hidden')">Close</button>
+        <button class="btn btn-secondary"
+          onclick="document.getElementById('modal-settings-role').classList.add('hidden')">Close</button>
       </div>
       <form id="form-settings-role">
         <div class="form-group">
@@ -1312,7 +1473,8 @@
     <div class="modal" style="max-width: 600px;">
       <div class="modal-header">
         <h3>Record Drill-down</h3>
-        <button class="btn btn-secondary" onclick="document.getElementById('modal-report-drilldown').classList.add('hidden')">Close</button>
+        <button class="btn btn-secondary"
+          onclick="document.getElementById('modal-report-drilldown').classList.add('hidden')">Close</button>
       </div>
       <div id="drilldown-content" style="max-height: 400px; overflow-y: auto; padding-right: 10px;">
         <!-- Filled by reports.js -->
@@ -1330,4 +1492,5 @@
   <script src="js/dashboard.js"></script>
   <script src="js/app.js"></script>
 </body>
-</html>
+
+</html>
\ No newline at end of file
```

## Tests Run
```text
git diff --check; node --check js/dashboard.js; manual dashboard overlap check
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
