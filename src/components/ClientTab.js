'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ClientTab({ user, jobs, proposals, setJobs, fetchData }) {
  const [jobsWithProposals, setJobsWithProposals] = useState([]);

  useEffect(() => {
    if (jobs && proposals.length > 0) {
      const userId = parseInt(user.id);
      const userJobs = jobs.filter(job => parseInt(job.createdBy) === userId);
      const jobIdsWithProposals = proposals.filter(p => parseInt(p.freelancerId) !== userId).map(p => p.jobId);
      setJobsWithProposals(userJobs.filter(job => jobIdsWithProposals.includes(job.id)));
    } else {
      setJobsWithProposals([]);
    }
  }, [jobs, proposals, user.id]);

  const getProposalsForJob = (jobId) => proposals.filter(p => 
    parseInt(p.jobId) === parseInt(jobId) && parseInt(p.freelancerId) !== parseInt(user.id)
  );

  const handleProposalAction = async (proposalId, status) => {
    try {
      await axios.patch(`/api/proposals/${proposalId}`, { status });
      fetchData();
    } catch (err) {
      alert('Failed to update proposal: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteProposal = async (proposalId) => {
    if (!confirm('Are you sure you want to delete this proposal?')) return;
    try {
      await axios.delete(`/api/proposals/${proposalId}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete proposal: ' + (err.response?.data?.error || err.message));
    }
  };

  const categoryColors = {
    'Biology': { bg: '#fbbf24', text: '#78350f' },
    'Marine Sci': { bg: '#60a5fa', text: '#0c2340' },
    'Ecology': { bg: '#34d399', text: '#064e3b' },
    'Astronomy': { bg: '#a78bfa', text: '#4c1d95' },
    'Geology': { bg: '#fed7aa', text: '#7c2d12' },
    default: { bg: '#e5e7eb', text: '#374151' }
  };

  const codeImages = [
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=400&h=200&fit=crop'
  ];

  const Badge = ({ bg, color, children }) => (
    <div style={{
      display: 'inline-block', backgroundColor: bg, color, padding: '6px 12px',
      borderRadius: '4px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '12px'
    }}>{children}</div>
  );

  const StatusBtn = ({ bg, children, onClick, flex = false, style = {} }) => (
    <button onClick={onClick} style={{
      flex: flex ? 1 : undefined, background: bg, color: '#ffffff', padding: '10px',
      borderRadius: '6px', fontWeight: '600', fontSize: '13px', border: 'none', cursor: 'pointer', ...style
    }}>{children}</button>
  );

  const StatusBox = ({ bg, children }) => (
    <div style={{
      padding: '10px', borderRadius: '6px', fontWeight: '600',
      fontSize: '13px', textAlign: 'center', background: bg, color: '#ffffff'
    }}>{children}</div>
  );

  return (
    <div style={{ width: '100%' }}>
      <div style={{ padding: '0' }}>
        <h1 style={{
          fontSize: '48px', fontFamily: 'Georgia, serif', color: '#1a1a1a',
          marginTop: '0', marginBottom: '1rem', marginLeft: '16px',
          fontWeight: '400', letterSpacing: '-1px'
        }}>Job Proposals</h1>

        {jobsWithProposals.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', margin: '0 16px' }}>
            {jobsWithProposals.map((job) => {
              const catColor = categoryColors[job.category] || categoryColors.default;
              return (
                <div key={job.id} className="job-card" style={{
                  background: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={codeImages[job.id % codeImages.length]}
                    alt="Job"
                    style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                  />

                  <div style={{ padding: '20px' }}>
                    <Badge bg={catColor.bg} color={catColor.text}>POSTED</Badge>

                    <h3 style={{ fontSize: '16px', fontFamily: 'Georgia, serif', color: '#1a1a1a', margin: '8px 0', fontWeight: '400', lineHeight: '1.4' }}>
                      {job.title}
                    </h3>

                    <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px', lineHeight: '1.4' }}>
                      {job.description.substring(0, 60)}...
                    </p>

                    <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '12px' }}>
                      Posted by: <span style={{ color: '#6b7280', fontWeight: '500' }}>{job.author?.name || 'Unknown'}</span>
                    </p>

                    <p className="job-budget" style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a', marginBottom: '12px' }}>${job.budget}</p>

                    {getProposalsForJob(job.id).map((proposal) => (
                      <div key={proposal.id} style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', marginTop: '12px' }}>
                        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                          <strong>From:</strong> {proposal.freelancer?.name || proposal.freelancer?.email || 'Unknown'}
                        </p>

                        {proposal.status === 'PENDING' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <StatusBtn bg="#10b981" flex onClick={() => handleProposalAction(proposal.id, 'ACCEPTED')}>Accept</StatusBtn>
                            <StatusBtn bg="#ef4444" flex onClick={() => handleProposalAction(proposal.id, 'REJECTED')}>Deny</StatusBtn>
                          </div>
                        ) : proposal.status === 'REJECTED' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <StatusBox bg="#ef4444">✗ Denied</StatusBox>
                            <StatusBtn bg="#6b7280" onClick={() => handleDeleteProposal(proposal.id)} 
                              style={{ padding: '8px', fontWeight: '500', fontSize: '12px' }}>🗑️ Delete Proposal</StatusBtn>
                          </div>
                        ) : (
                          <StatusBox bg="#10b981">✓ Accepted</StatusBox>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px', backgroundColor: '#f3f4f6', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>
              No proposals received yet. When freelancers submit proposals for your jobs, they will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}