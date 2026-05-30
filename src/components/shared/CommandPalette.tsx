import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Navigation, User as UserIcon, Truck, Settings, ShieldAlert, BarChart } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut';
import { mockVehicles } from '../../data/mockVehicles';
import { mockDrivers } from '../../data/mockDrivers';

export const CommandPalette = () => {
  const { commandPaletteOpen, openCommandPalette, closeCommandPalette } = useUIStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Hook command palette shortcut (Ctrl + K)
  useKeyboardShortcut('k', () => {
    if (commandPaletteOpen) {
      closeCommandPalette();
    } else {
      openCommandPalette();
    }
  }, true);

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      // Auto-focus input on open
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [commandPaletteOpen]);

  // Command palette navigation items
  const pages = [
    { label: 'Go to Dashboard', path: '/dashboard', icon: Sparkles, category: 'Navigation' },
    { label: 'Go to Fleet Vehicles', path: '/vehicles', icon: Truck, category: 'Navigation' },
    { label: 'Go to Transit Requests', path: '/requests', icon: Navigation, category: 'Navigation' },
    { label: 'Go to Analytics & Reports', path: '/reports', icon: BarChart, category: 'Navigation' },
    { label: 'Go to Settings', path: '/settings', icon: Settings, category: 'Navigation' },
  ];

  // Dynamic search list
  const filteredVehicles = mockVehicles.filter(v => 
    v.number.toLowerCase().includes(query.toLowerCase()) || 
    v.type.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3).map(v => ({
    label: `Vehicle: ${v.number} (${v.type})`,
    path: '/vehicles',
    icon: Truck,
    category: 'Fleet Vehicles'
  }));

  const filteredDrivers = mockDrivers.filter(d => 
    d.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3).map(d => ({
    label: `Driver: ${d.name} (${d.status})`,
    path: '/requests',
    icon: UserIcon,
    category: 'Fleet Drivers'
  }));

  const filteredPages = pages.filter(p => 
    p.label.toLowerCase().includes(query.toLowerCase())
  );

  const results = [...filteredPages, ...filteredVehicles, ...filteredDrivers];

  const handleSelect = (item: typeof results[0]) => {
    navigate(item.path);
    closeCommandPalette();
  };

  // Keyboard navigation inside palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!commandPaletteOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeCommandPalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, selectedIndex, results]);

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={closeCommandPalette}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col pointer-events-auto"
            >
              {/* Search Bar */}
              <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
                <Search className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a command or search fleet..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  className="w-full py-4 text-sm text-slate-800 dark:text-slate-100 bg-transparent border-0 outline-none placeholder-gray-400"
                />
                <kbd className="px-1.5 py-0.5 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-gray-400 rounded text-[10px]">
                  ESC
                </kbd>
              </div>

              {/* Search Results */}
              <div className="flex-1 overflow-y-auto max-h-80 p-2">
                {results.length > 0 ? (
                  <div>
                    {/* Render Category Items */}
                    {Object.entries(
                      results.reduce((groups, item) => {
                        const cat = item.category;
                        if (!groups[cat]) groups[cat] = [];
                        groups[cat].push(item);
                        return groups;
                      }, {} as Record<string, typeof results>)
                    ).map(([category, items]) => (
                      <div key={category} className="mb-2">
                        <div className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 px-3 py-1 tracking-wider">
                          {category}
                        </div>
                        <div className="space-y-0.5">
                          {items.map((item) => {
                            // Find absolute index of item in flat list for active class highlight
                            const flatIndex = results.indexOf(item);
                            const Icon = item.icon;
                            const isSelected = flatIndex === selectedIndex;

                            return (
                              <button
                                key={item.label}
                                onClick={() => handleSelect(item)}
                                onMouseEnter={() => setSelectedIndex(flatIndex)}
                                className={`w-full flex items-center px-3 py-2.5 rounded-xl text-left text-sm transition-colors ${
                                  isSelected
                                    ? 'bg-brand-blue text-white'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                                }`}
                              >
                                <Icon className={`h-4 w-4 mr-3 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                                <span className="flex-1 font-medium">{item.label}</span>
                                {isSelected && (
                                  <kbd className="text-[10px] px-1 py-0.5 bg-blue-700 text-blue-100 rounded">
                                    ENTER
                                  </kbd>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                    No results found for "<span className="font-semibold">{query}</span>"
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between text-[10px] text-gray-400">
                <span>Use arrows <kbd>↑</kbd><kbd>↓</kbd> to navigate</span>
                <span>Press <kbd>↵</kbd> to select</span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
