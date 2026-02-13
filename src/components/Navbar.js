"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar({ user, activeTab, setActiveTab, showNewProjectModal, setShowNewProjectModal, proposals = [] }) {
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode') === 'true';
    setDarkMode(saved);
    if (saved) document.documentElement.classList.add('dark');
  }, []);

  const myProposals = proposals.filter(p => parseInt(p.freelancerId) === parseInt(user?.id));
  const activeCount = myProposals.filter(p => p.status === 'ACCEPTED').length;
  const pendingCount = myProposals.filter(p => p.status === 'PENDING').length;

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    document.documentElement.classList.toggle('dark', newMode);
  };

  const leftTabs = [
    { id: "myprojects", label: "My Projects" },
    { id: "client", label: "Proposals" },
    { id: "freelancer", label: "Freelancer" },
  ];

  // Reusable styles
  const circleBtn = {
    width: '40px', height: '40px', minWidth: '40px', minHeight: '40px',
    borderRadius: '50%', border: 'none', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontSize: '18px', cursor: 'pointer'
  };

  const menuItemBase = {
    display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
    padding: '14px 16px', textAlign: 'left', border: 'none', background: 'none',
    cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s ease'
  };

  const MenuItem = ({ icon, label, onClick, color = '#1a1a1a', hoverBg = '#FAF6F2', borderTop = false }) => (
    <button
      onClick={onClick}
      style={{ ...menuItemBase, color, borderTop: borderTop ? '1px solid #f3f4f6' : 'none' }}
      onMouseEnter={(e) => { e.target.style.background = hoverBg; e.target.style.paddingLeft = '20px'; }}
      onMouseLeave={(e) => { e.target.style.background = 'none'; e.target.style.paddingLeft = '16px'; }}
    >
      <span style={{ fontSize: '16px' }}>{icon}</span>
      <span>{label}</span>
    </button>
  );

  const StatBox = ({ count, label, colors }) => (
    <div style={{ textAlign: 'center', padding: '8px', borderRadius: '6px', background: colors.bg }}>
      <p style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700', color: colors.text }}>{count}</p>
      <p style={{ margin: 0, fontSize: '11px', color: colors.text, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
    </div>
  );

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', padding: '16px 32px',
      background: darkMode ? '#1f1f1f' : '#FAF6F2',
      borderBottom: darkMode ? '1px solid #333333' : '1px solid #e5e7eb',
      position: 'relative'
    }}>
      {/* Left: Logo + Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '48px', flex: '1', minWidth: 0 }}>
        <div style={{ width: '32px', height: '32px', minWidth: '32px' }}>
          <svg fill="none" viewBox="0 0 40 40" style={{ width: '100%', height: '100%' }}>
            <path clipRule="evenodd" fillRule="evenodd" fill={darkMode ? '#f0ede5' : '#1a1a1a'} d="M19.5235 11.6667C22.469 11.6667 24.8568 9.27883 24.8568 6.33333C24.8568 3.38783 22.469 1 19.5235 1C16.578 1 14.1901 3.38783 14.1901 6.33333C14.1901 9.27883 16.578 11.6667 19.5235 11.6667Z" />
            <path fill={darkMode ? '#f0ede5' : '#1a1a1a'} d="M28.1243 11.3706C23.9338 11.3706 19.5235 16.9524 19.5235 24.0952C19.5235 16.9524 15.1132 11.3706 10.9227 11.3706C8.00336 11.3706 5.99488 12.4214 5.99488 15.2034C5.99488 17.9854 9.17059 21.1168 13.7757 21.1168C19.5235 21.1168 18.8246 23.2804 18.7724 30.9312C18.7671 31.6928 18.7616 32.5233 18.7616 33.4286C18.7616 22.7619 4 18.8875 4 25.9351C4 29.6435 9.88174 30.7082 13.3801 31.8485C16.5302 32.8752 19.5235 35.2925 19.5235 38C19.5235 35.2925 22.5168 32.8752 25.6669 31.8485C29.1652 30.7082 35.047 29.6435 35.047 25.9351C35.047 18.8875 20.2854 22.7619 20.2854 33.4286C20.2854 32.5233 20.2798 31.6928 20.2746 30.9312C20.2223 23.2804 19.5235 21.1168 25.2713 21.1168C29.8764 21.1168 33.0521 17.9854 33.0521 15.2034C33.0521 12.4214 31.0436 11.3706 28.1243 11.3706Z" />
          </svg>
        </div>
        <div style={{ display: 'flex', gap: '48px' }}>
          {leftTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                color: activeTab === tab.id ? (darkMode ? '#f0ede5' : '#1a1a1a') : '#9ca3af',
                fontWeight: activeTab === tab.id ? '600' : '500',
                fontSize: '15px', cursor: 'pointer', border: 'none', background: 'none',
                padding: '4px 0', whiteSpace: 'nowrap',
                borderBottom: activeTab === tab.id ? (darkMode ? '2px solid #f0ede5' : '2px solid #1a1a1a') : '2px solid transparent'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Center: Search */}
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: '300px' }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '16px' }}>🔍</span>
          <input type="text" placeholder="Search" style={{
            width: '100%', padding: '8px 12px 8px 36px', border: '1px solid #d1d5db',
            borderRadius: '6px', fontSize: '14px', color: '#1a1a1a', background: '#ffffff', outline: 'none'
          }} />
        </div>
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1', justifyContent: 'flex-end', position: 'relative' }}>
        <button
          onClick={() => setShowNewProjectModal(true)}
          style={{
            padding: '8px 14px', background: '#f0ede5', color: '#1a1a1a', border: 'none',
            borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
            transition: 'all 0.2s ease', whiteSpace: 'nowrap', marginRight: '8px'
          }}
          onMouseEnter={(e) => e.target.style.background = '#e8e4db'}
          onMouseLeave={(e) => e.target.style.background = '#f0ede5'}
        >
          New Project
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          style={{ ...circleBtn, background: darkMode ? '#374151' : '#f0ede5', transition: 'all 0.3s ease' }}
          onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? '#4b5563' : '#e8e4db'}
          onMouseLeave={(e) => e.currentTarget.style.background = darkMode ? '#374151' : '#f0ede5'}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        {/* Profile */}
        <div onClick={() => setProfileDropdown(!profileDropdown)} style={{ cursor: 'pointer', position: 'relative' }}>
          <div
            style={{ ...circleBtn, background: '#f0ede5', transition: 'all 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#e8e4db'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#f0ede5'}
          >👤</div>

          {profileDropdown && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 12px)', right: 0,
              background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: '280px', zIndex: 50,
              overflow: 'hidden', animation: 'slideDown 0.2s ease-out'
            }}>
              <style>{`
                @keyframes slideDown {
                  from { opacity: 0; transform: translateY(-8px); }
                  to { opacity: 1; transform: translateY(0); }
                }
              `}</style>

              {/* Header */}
              <div style={{ padding: '20px', background: 'linear-gradient(135deg, #FAF6F2 0%, #faf8f3 100%)', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '44px', height: '44px', minWidth: '44px', minHeight: '44px',
                    borderRadius: '50%', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '22px', boxShadow: '0 2px 8px rgba(251, 191, 36, 0.2)'
                  }}>👤</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 2px 0', fontWeight: '700', color: '#1a1a1a', fontSize: '15px', fontFamily: 'Georgia, serif' }}>
                      {user?.name || 'User'}
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af', textTransform: 'capitalize' }}>
                      {user?.role || 'Member'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '12px 16px', borderBottom: '1px solid #f3f4f6', background: '#fafafa' }}>
                <StatBox count={activeCount} label="Active" colors={{ bg: '#f0fdf4', text: '#16a34a' }} />
                <StatBox count={pendingCount} label="Pending" colors={{ bg: '#fef3c7', text: '#d97706' }} />
              </div>

              {/* Menu */}
              <MenuItem icon="👤" label="View Full Profile" onClick={() => { setActiveTab('profile'); setProfileDropdown(false); }} />
              <MenuItem icon="📋" label="Submissions" onClick={() => { setActiveTab('profile'); setProfileDropdown(false); }} borderTop />
              <MenuItem icon="🚪" label="Logout" color="#ef4444" hoverBg="#fee2e2" borderTop
                onClick={() => { localStorage.removeItem('user'); window.location.href = '/'; setProfileDropdown(false); }} />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}