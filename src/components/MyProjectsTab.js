'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function MyProjectsTab({ user, jobs, proposals, fetchData }) {
  const [acceptedJobs, setAcceptedJobs] = useState([]);
  const [deletingJobId, setDeletingJobId] = useState(null);

  useEffect(() => {
    if (proposals.length > 0 && jobs.length > 0) {
      const myAcceptedProposals = proposals.filter(
        p => parseInt(p.freelancerId) === parseInt(user.id) && p.status === 'ACCEPTED'
      );
      const acceptedJobIds = myAcceptedProposals.map(p => p.jobId);
      setAcceptedJobs(jobs.filter(job => acceptedJobIds.includes(job.id)));
    }
  }, [proposals, jobs, user.id]);

  const jobHasAcceptedProposals = (jobId) => proposals.some(p => p.jobId === jobId && p.status === 'ACCEPTED');

  const handleDeleteJob = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) return;
    try {
      await axios.delete(`/api/jobs/${jobId}`);
      setDeletingJobId(null);
      fetchData();
    } catch (err) {
      alert('Failed to delete job: ' + (err.response?.data?.error || err.message));
      setDeletingJobId(null);
    }
  };

  const myCreatedJobs = jobs.filter(job => parseInt(job.createdBy) === parseInt(user.id));
  const allMyProjects = [...myCreatedJobs, ...acceptedJobs];

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

  const Badge = ({ bg, color, children, style = {} }) => (
    <div style={{
      display: 'inline-block', backgroundColor: bg, color,
      padding: '6px 12px', borderRadius: '4px', fontSize: '11px',
      fontWeight: '700', letterSpacing: '0.5px', ...style
    }}>{children}</div>
  );

  const SmallBtn = ({ onClick, bg, children }) => (
    <button onClick={onClick} style={{
      background: bg, color: '#ffffff', padding: '4px 8px',
      borderRadius: '4px', fontWeight: '600', fontSize: '11px', border: 'none', cursor: 'pointer'
    }}>{children}</button>
  );

  return (
    <div style={{ width: '100%' }}>
      <div style={{ padding: '0' }}>
        <h1 style={{
          fontSize: '48px', fontFamily: 'Georgia, serif', color: '#1a1a1a',
          marginTop: '0', marginBottom: '1rem', marginLeft: '16px',
          fontWeight: '400', letterSpacing: '-1px'
        }}>My projects</h1>

        {allMyProjects.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', margin: '0 16px' }}>
            {allMyProjects.map((job) => {
              const catColor = categoryColors[job.category] || categoryColors.default;
              const isAcceptedJob = acceptedJobs.some(j => j.id === job.id);
              const isOwnJob = parseInt(job.createdBy) === parseInt(user.id);
              const canDelete = isOwnJob && !jobHasAcceptedProposals(job.id);

              return (
                <div key={job.id} className="job-card" style={{
                  background: '#ffffff', border: '1px solid #e5e7eb',
                  borderRadius: '8px', overflow: 'hidden', position: 'relative'
                }}>
                  {/* Image */}
                  <img 
                    src={codeImages[job.id % codeImages.length]}
                    alt="Job"
                    style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                  />

                  <div style={{ padding: '20px' }}>
                    {/* Show ACCEPTED badge for: freelancer's accepted jobs OR client's jobs with accepted proposals */}
                    {(isAcceptedJob || (isOwnJob && jobHasAcceptedProposals(job.id))) && 
                      <Badge bg="#10b981" color="#ffffff" style={{ marginBottom: '8px', marginRight: '8px' }}>✓ ACCEPTED</Badge>
                    }
                    <Badge bg={catColor.bg} color={catColor.text} style={{ marginBottom: '12px' }}>{job.category || 'PROJECT'}</Badge>

                    <h3 style={{ fontSize: '16px', fontFamily: 'Georgia, serif', color: '#1a1a1a', margin: '8px 0', lineHeight: '1.4', fontWeight: '400' }}>
                      {job.title}
                    </h3>

                    <p style={{
                      fontSize: '13px', color: '#6b7280', marginBottom: '8px', lineHeight: '1.4',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                    }}>{job.description}</p>

                    <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '12px' }}>
                      Posted by: <span style={{ color: '#6b7280', fontWeight: '500' }}>{job.author?.name || 'Unknown'}</span>
                    </p>

                    <p className="job-budget" style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a', marginBottom: '2px' }}>${job.budget}</p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                        Posted: {new Date(job.createdAt || Date.now()).toLocaleDateString()}
                      </p>

                      {canDelete && (
                        deletingJobId === job.id ? (
                          <div style={{ display: 'flex', gap: '4px', animation: 'fadeIn 0.2s ease' }}>
                            <SmallBtn onClick={() => handleDeleteJob(job.id)} bg="#ef4444">Delete</SmallBtn>
                            <SmallBtn onClick={() => setDeletingJobId(null)} bg="#6b7280">Cancel</SmallBtn>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeletingJobId(job.id)}
                            style={{
                              background: 'transparent', color: '#ef4444', fontSize: '16px',
                              border: '1px solid #ef4444', borderRadius: '4px', cursor: 'pointer',
                              padding: '4px 6px', transition: 'all 0.2s ease',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#fef2f2'}
                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                          >🗑️</button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px', backgroundColor: '#f3f4f6', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>No projects yet. Use the "New Project" button to create one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
