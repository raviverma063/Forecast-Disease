<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Dashboard Layout</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    html, body { font-family: 'Inter', sans-serif; background: #0f172a; color: #f9fafb; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState } = React;

    // --- Icons (same as your set) ---
    const Icons = { 
      Menu: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>,
      LayoutDashboard: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>,
      Map: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>,
      Users: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
      ShieldCheck: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>,
      Siren: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path d="M12 22v-4"/><path d="M12 8v4"/></svg>,
      User: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
      Bot: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M12 8V4H8"/></svg>
    };

    // --- Pages ---
    const DashboardPage = () => (
      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 bg-gray-800/50 rounded-2xl shadow-lg hover:scale-[1.01] transition">
          <h2 className="text-xl font-semibold mb-2">Welcome Back 👋</h2>
          <p className="text-gray-400">Here’s your quick overview.</p>
        </div>
        <div className="p-6 bg-gray-800/50 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Insights</h2>
          <p className="text-gray-400">Latest travel & health insights appear here.</p>
        </div>
      </div>
    );
    const TravelInsightsPage = () => <div className="p-6 bg-gray-800/50 rounded-2xl">Travel Insights content</div>;
    const CommunityPage = () => <div className="p-6 bg-gray-800/50 rounded-2xl">Community content</div>;
    const PreventionPage = () => <div className="p-6 bg-gray-800/50 rounded-2xl">Prevention content</div>;
    const EmergencyPage = () => <div className="p-6 bg-gray-800/50 rounded-2xl">Emergency content</div>;
    const ProfilePage = () => <div className="p-6 bg-gray-800/50 rounded-2xl">Profile content</div>;

    // --- Navigation ---
    const navItems = [
      { id: "dashboard", label: "Dashboard", icon: Icons.LayoutDashboard, component: DashboardPage },
      { id: "travel-insights", label: "Travel Insights", icon: Icons.Map, component: TravelInsightsPage },
      { id: "community", label: "Community", icon: Icons.Users, component: CommunityPage },
      { id: "prevention", label: "Prevention", icon: Icons.ShieldCheck, component: PreventionPage },
      { id: "emergency", label: "Emergency", icon: Icons.Siren, component: EmergencyPage },
      { id: "profile", label: "Profile", icon: Icons.User, component: ProfilePage }
    ];

    const NavLink = ({ item, isActive, onClick }) => (
      <a 
        href={`#${item.id}`}
        onClick={(e) => { e.preventDefault(); onClick(item.id); }}
        className={`flex items-center gap-3 px-4 py-2 rounded-xl transition font-medium ${
          isActive ? "bg-indigo-600 text-white" : "text-gray-400 hover:bg-gray-700 hover:text-white"
        }`}
      >
        <item.icon className="w-5 h-5" />
        {item.label}
      </a>
    );

    // --- Main Layout ---
    function App() {
      const [activePage, setActivePage] = useState("dashboard");
      const [mobileOpen, setMobileOpen] = useState(false);
      const ActivePageComponent = navItems.find(n => n.id === activePage)?.component;

      return (
        <div className="min-h-screen flex">
          {/* Sidebar */}
          <aside className="hidden md:flex flex-col w-64 bg-gray-900 border-r border-gray-800">
            <div className="h-16 flex items-center px-6 font-bold text-xl">
              <Icons.Bot className="w-6 h-6 mr-2"/> Forecast Frontier
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navItems.map((n) => (
                <NavLink key={n.id} item={n} isActive={activePage === n.id} onClick={setActivePage}/>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="h-16 flex items-center justify-between border-b border-gray-800 px-4 md:px-8 bg-gray-900/60 backdrop-blur">
              <button className="md:hidden p-2" onClick={() => setMobileOpen(true)}>
                <Icons.Menu className="w-6 h-6"/>
              </button>
              <h1 className="font-semibold text-lg md:text-xl">Forecast Frontier</h1>
              <div className="hidden md:flex items-center gap-4">
                <input type="text" placeholder="Search..." className="px-3 py-1 rounded-lg bg-gray-800 text-sm text-gray-200 focus:outline-none"/>
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">R</div>
              </div>
            </header>

            {/* Page */}
            <main className="flex-1 p-6">
              <ActivePageComponent/>
            </main>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)}>
              <div className="absolute left-0 top-0 w-3/4 max-w-sm h-full bg-gray-900 shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
                <h2 className="flex items-center gap-2 font-semibold mb-6">
                  <Icons.Bot className="w-5 h-5"/> Forecast Frontier
                </h2>
                {navItems.map((n) => (
                  <a key={n.id} href="#" className="block mb-3" onClick={(e) => { e.preventDefault(); setActivePage(n.id); setMobileOpen(false);}}>
                    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                      activePage === n.id ? "bg-indigo-600 text-white" : "text-gray-400 hover:bg-gray-700 hover:text-white"
                    }`}>
                      <n.icon className="w-5 h-5"/>{n.label}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    ReactDOM.render(<App/>, document.getElementById("root"));
  </script>
</body>
</html>
