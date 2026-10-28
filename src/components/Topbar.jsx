import { Menu, ChevronDown, UserCircle } from 'lucide-react';

const roles = [
  { value: 'farmer', label: 'Farmer' },
  { value: 'retailer', label: 'Retailer' },
  { value: 'landowner', label: 'Landowner' },
];

function Topbar({ onMenuClick, currentRole, onRoleChange, onSignOut, displayName }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shrink-0">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-primary focus-visible:ring-offset-2"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold text-green-dark hidden sm:block">Dashboard</h2>
      </div>

      {/* Right side — User name + Role Switcher */}
      <div className="flex items-center gap-3">
        {displayName && (
          <div className="hidden sm:flex items-center gap-1.5 text-sm text-gray-700 font-medium">
            <UserCircle className="w-5 h-5 text-green-primary" />
            <span>{displayName}</span>
          </div>
        )}
        <label htmlFor="role-select" className="text-sm text-gray-500 hidden sm:inline">
          Viewing as:
        </label>
        <div className="relative">
          <select
            id="role-select"
            value={currentRole}
            onChange={(e) => onRoleChange(e.target.value)}
            className="appearance-none bg-green-primary/10 text-green-dark text-sm font-medium pl-3 pr-8 py-2 rounded-lg border border-green-primary/20 focus:outline-none focus:ring-2 focus:ring-green-primary/30 cursor-pointer"
          >
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-green-dark absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        {onSignOut && (
          <button
            onClick={onSignOut}
            className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary"
          >
            Sign out
          </button>
        )}
      </div>
    </header>
  );
}

export default Topbar;
