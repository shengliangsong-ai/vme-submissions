const fs = require('fs');

// Patch Sidebar.tsx
let sidebar = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
if (!sidebar.includes("id: 'teams'")) {
    sidebar = sidebar.replace("import { LayoutDashboard, CheckSquare", "import { Users, LayoutDashboard, CheckSquare");
    sidebar = sidebar.replace(
        "{ id: 'queue', label: 'Job Queue', icon: ListTodo },",
        "{ id: 'queue', label: 'Job Queue', icon: ListTodo },\n    { id: 'teams', label: 'Virtual Teams', icon: Users },"
    );
    fs.writeFileSync('src/components/Sidebar.tsx', sidebar);
}

// Patch App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');
if (!app.includes("VirtualTeams")) {
    app = app.replace("import { SelfDemo } from './components/SelfDemo';", "import { SelfDemo } from './components/SelfDemo';\nimport { VirtualTeams } from './components/VirtualTeams';");
    app = app.replace(
        "{currentTab === 'settings' && <SettingsView />}",
        "{currentTab === 'settings' && <SettingsView />}\n          {currentTab === 'teams' && <VirtualTeams />}"
    );
    fs.writeFileSync('src/App.tsx', app);
}
