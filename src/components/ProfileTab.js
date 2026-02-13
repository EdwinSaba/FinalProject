'use client';
import { useMemo, useState, useEffect } from 'react';
import axios from 'axios';

export default function ProfileTab({ user, jobs, proposals }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setDarkMode(localStorage.getItem('darkMode') === 'true');
    const interval = setInterval(() => {
      setDarkMode(localStorage.getItem('darkMode') === 'true');
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const userProposals = useMemo(() => {
    if (!proposals || !user) return [];
    if (user.role === 'client') {
      const clientJobIds = jobs.map(job => job.id);
      return proposals.filter(p => clientJobIds.includes(p.jobId));
    }
    return proposals.filter(p => parseInt(p.freelancerId) === parseInt(user.id));
  }, [proposals, user, jobs]);

  const handleProposal = async (proposalId, status) => {
    try {
      await axios.patch(`/api/proposals/${proposalId}`, { status });
      alert(`Proposal ${status.toLowerCase()}!`);
    } catch (err) {
      alert(`Failed: ${err.response?.data?.error || err.message}`);
    }
  };

  // Reusable styles
  const colors = {
    bg: darkMode ? '#2d2d2d' : '#ffffff',
    border: darkMode ? '#404040' : '#e5e7eb',
    shadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.05)',
    text: darkMode ? '#f0ede5' : '#1a1a1a',
    muted: darkMode ? '#a0a0a0' : '#6b7280',
    faint: darkMode ? '#808080' : '#9ca3af',
    body: darkMode ? '#c0c0c0' : '#374151',
    emptyBg: darkMode ? '#2d2d2d' : '#f3f4f6',
  };

  const card = {
    background: colors.bg,
    borderRadius: '8px',
    padding: '20px',
    border: `1px solid ${colors.border}`,
    boxShadow: colors.shadow,
  };

  const heading = {
    fontSize: '24px',
    fontFamily: 'Georgia, serif',
    color: colors.text,
    marginBottom: '24px',
    fontWeight: '400',
  };

  const statusBadge = (status) => ({
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    background: status === 'ACCEPTED' ? '#dcfce7' : status === 'REJECTED' ? '#fee2e2' : '#dbeafe',
    color: status === 'ACCEPTED' ? '#166534' : status === 'REJECTED' ? '#991b1b' : '#0c4a6e',
  });

  const btn = (bg) => ({
    background: bg,
    color: '#ffffff',
    padding: '10px',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '13px',
    border: 'none',
    cursor: 'pointer',
  });

  const EmptyState = ({ text }) => (
    <div style={{ textAlign: 'center', padding: '32px', backgroundColor: colors.emptyBg, borderRadius: '8px', border: `1px solid ${colors.border}` }}>
      <p style={{ color: colors.muted, margin: 0 }}>{text}</p>
    </div>
  );

  const CardList = ({ children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>{children}</div>
  );

  return (
    <div style={{ width: '100%' }}>
      <div style={{ padding: '0' }}>
        {/* User Profile */}
        <div style={{ ...card, padding: '32px', marginBottom: '32px' }}>
          <h2 style={{ ...heading, marginTop: 0 }}>Your Profile</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              border: `1px solid ${darkMode ? '#505050' : '#d1d5db'}`,
              background: darkMode ? '#404040' : '#e5e7eb',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem'
            }}>👤</div>
            <div>
              <p style={{ fontSize: '18px', fontWeight: '600', color: colors.text, margin: 0 }}>{user?.name}</p>
              <p style={{ color: colors.muted, textTransform: 'capitalize', margin: 0 }}>{user?.role}</p>
              <p style={{ fontSize: '13px', color: colors.faint, margin: 0 }}>{user?.email}</p>
            </div>
          </div>
        </div>

        {user?.role === 'client' && (
          <>
            {/* Posted Jobs */}
            <div style={{ marginBottom: '48px' }}>
              <h2 style={heading}>Job Requests You Sent Out</h2>
              {jobs?.length > 0 ? (
                <CardList>
                  {jobs.map((job) => (
                    <div key={job.id} style={card}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.text, margin: 0 }}>{job.title}</h3>
                        <span style={{ fontSize: '16px', fontWeight: '600', color: colors.text }}>${job.budget}</span>
                      </div>
                      <p style={{ color: colors.muted, lineHeight: '1.5', margin: 0 }}>{job.description}</p>
                      <p style={{ fontSize: '12px', color: colors.faint, margin: 0, marginTop: '12px' }}>
                        Posted: {new Date(job.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </CardList>
              ) : <EmptyState text="You haven't posted any jobs yet." />}
            </div>

            {/* Received Proposals */}
            <div>
              <h2 style={heading}>Proposals to Accept</h2>
              {userProposals.length > 0 ? (
                <CardList>
                  {userProposals.map((proposal) => (
                    <div key={proposal.id} style={card}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                        <div>
                          <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.text, margin: 0 }}>Freelancer Proposal</h3>
                          <p style={{ fontSize: '13px', color: colors.muted, margin: 0 }}>
                            For: {jobs.find(j => j.id === proposal.jobId)?.title || 'Unknown Job'}
                          </p>
                        </div>
                        <span style={statusBadge(proposal.status)}>{proposal.status}</span>
                      </div>
                      <p style={{ color: colors.body, lineHeight: '1.5', margin: 0, marginBottom: '16px' }}>
                        {proposal.message || 'No message provided'}
                      </p>
                      {proposal.status === 'PENDING' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <button onClick={() => handleProposal(proposal.id, 'ACCEPTED')} style={btn('#10b981')}>Accept</button>
                          <button onClick={() => handleProposal(proposal.id, 'REJECTED')} style={btn('#ef4444')}>Reject</button>
                        </div>
                      )}
                    </div>
                  ))}
                </CardList>
              ) : <EmptyState text="No proposals received yet." />}
            </div>
          </>
        )}

        {user?.role === 'freelancer' && (
          <div>
            <h2 style={heading}>Your Submitted Proposals</h2>
            {userProposals.length > 0 ? (
              <CardList>
                {userProposals.map((proposal) => (
                  <div key={proposal.id} style={card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.text, margin: 0 }}>Job Proposal</h3>
                        <p style={{ fontSize: '13px', color: colors.muted, margin: 0 }}>Job ID: {proposal.jobId}</p>
                      </div>
                      <span style={statusBadge(proposal.status)}>{proposal.status}</span>
                    </div>
                    <p style={{ color: colors.body, lineHeight: '1.5', margin: 0 }}>{proposal.message || 'No message provided'}</p>
                  </div>
                ))}
              </CardList>
            ) : <EmptyState text="No proposals received yet." />}
          </div>
        )}
      </div>
    </div>
  );
}