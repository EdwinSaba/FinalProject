'use client';
import axios from 'axios';

export default function FreelancerTab({ user, jobs, proposals, fetchData }) {
  const myProposals = proposals.filter(p => parseInt(p.freelancerId) === parseInt(user.id));
  const acceptedJobIds = myProposals.filter(p => p.status === 'ACCEPTED').map(p => p.jobId);
  const availableJobs = jobs.filter(job => parseInt(job.createdBy) !== parseInt(user.id) && !acceptedJobIds.includes(job.id));

  const getProposalForJob = (jobId) => myProposals.find(p => parseInt(p.jobId) === parseInt(jobId));

  const handleSubmitProposal = async (jobId, jobBudget) => {
    const existing = getProposalForJob(jobId);
    if (existing && existing.status !== 'REJECTED') {
      alert('You already submitted a proposal for this job!');
      return;
    }
    try {
      await axios.post(`/api/proposals`, {
        jobId: parseInt(jobId), freelancerId: parseInt(user.id),
        message: 'Interested in this job!', bidAmount: jobBudget || 0
      });
      fetchData();
    } catch (err) {
      alert('Failed to submit proposal: ' + (err.response?.data?.error || err.message));
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

  return (
    <div style={{ width: '100%' }}>
      <div style={{ padding: '0' }}>
        <h1 style={{
          fontSize: '48px', fontFamily: 'Georgia, serif', color: '#1a1a1a',
          marginTop: '0', marginBottom: '1rem', marginLeft: '16px',
          fontWeight: '400', letterSpacing: '-1px'
        }}>Available Jobs</h1>

        {availableJobs.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', margin: '0 16px' }}>
            {availableJobs.map((job) => {
              const catColor = categoryColors[job.category] || categoryColors.default;
              const proposal = getProposalForJob(job.id);
              const isPending = proposal?.status === 'PENDING';
              const isRejected = proposal?.status === 'REJECTED';
              const hasSent = proposal && !isRejected;

              return (
                <div key={job.id} className="job-card" style={{
                  background: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb',
                  overflow: 'hidden', boxSizing: 'border-box'
                }}>
                  <img 
                    src={codeImages[job.id % codeImages.length]}
                    alt="Job"
                    style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                  />

                  <div style={{ padding: '20px' }}>
                    <Badge bg={catColor.bg} color={catColor.text}>{job.category || 'PROJECT'}</Badge>

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

                    {hasSent ? (
                      <div style={{
                        background: '#10b981', color: '#ffffff', padding: '10px',
                        borderRadius: '6px', fontWeight: '600', fontSize: '13px', textAlign: 'center'
                      }}>✓ Proposal Sent!</div>
                    ) : (
                      <button
                        onClick={() => handleSubmitProposal(job.id, job.budget)}
                        style={{
                          width: '100%', background: '#1a1a1a', color: '#ffffff', padding: '10px',
                          borderRadius: '6px', fontWeight: '600', fontSize: '13px', border: 'none', cursor: 'pointer'
                        }}
                      >{isRejected ? 'Resubmit Proposal' : 'Submit Proposal'}</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px', backgroundColor: '#f3f4f6', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>No jobs available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
