
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import MyProjectsTab from "../components/MyProjectsTab";
import ClientTab from "../components/ClientTab";
import FreelancerTab from "../components/FreelancerTab";
import ProfileTab from "../components/ProfileTab";
import "./dashboard.css";


export default function Home() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [activeTab, setActiveTab] = useState("myprojects");
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [authForm, setAuthForm] = useState({ email: "", password: "", name: "", role: "freelancer" });
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newJob, setNewJob] = useState({ title: "", description: "", budget: "" });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, proposalsRes] = await Promise.all([
        axios.get("/api/jobs"),
        axios.get("/api/proposals")
      ]);
      setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);
      setProposals(Array.isArray(proposalsRes.data) ? proposalsRes.data : []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { if (user) fetchData(); }, [user]);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const url = authMode === "signup" ? "/api/auth/signup" : "/api/auth/signin";
      const payload = authMode === "signup"
        ? { ...authForm }
        : { email: authForm.email, password: authForm.password };
      const res = await axios.post(url, payload);
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      setShowAuth(false);
      setAuthForm({ email: "", password: "", name: "", role: "freelancer" });
      alert(authMode === "signup" ? "Signup successful!" : "Signed in successfully!");
    } catch (err) {
      alert((authMode === "signup" ? "Signup" : "Signin") + " failed: " + (err.response?.data?.error || err.message));
    }
  };

  const handleLogout = () => {
    setUser(null);
    setJobs([]);
    localStorage.removeItem("user");
    setShowAuth(false);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newJob.title.trim() || !newJob.description.trim() || !newJob.budget) {
      alert("Please fill in all fields");
      return;
    }
    try {
      await axios.post("/api/jobs", {
        ...newJob,
        budget: parseFloat(newJob.budget),
        createdBy: user.id
      });
      setNewJob({ title: "", description: "", budget: "" });
      fetchData();
      setShowNewProjectModal(false);
      alert("Job posted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to post job: " + (err.response?.data?.error || err.message));
    }
  };

  // Auth UI
  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: "#FAF6F2", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: 400, width: "100%", padding: 40 }}>
          <h1 style={{ textAlign: "center", color: "#1a1a1a", marginBottom: 32, fontSize: 28, fontFamily: "Georgia, serif", fontWeight: 400 }}>Freelance Hub</h1>
          {!showAuth ? (
            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => { setAuthMode("signin"); setShowAuth(true); }}
                style={{ width: "100%", padding: "12px 24px", background: "#8B7355", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontFamily: "Georgia, serif", fontWeight: 600, cursor: "pointer", marginBottom: 12 }}
              >Sign In</button>
              <button
                onClick={() => { setAuthMode("signup"); setShowAuth(true); }}
                style={{ width: "100%", padding: "12px 24px", background: "#6b7280", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontFamily: "Georgia, serif", fontWeight: 600, cursor: "pointer" }}
              >Sign Up</button>
            </div>
          ) : (
            <form onSubmit={handleAuth} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 24 }}>
              <h3 style={{ marginTop: 0, marginBottom: 20, fontSize: 18, fontFamily: "Georgia, serif", color: "#1a1a1a", fontWeight: 400 }}>{authMode === "signin" ? "Sign In" : "Create Account"}</h3>
              {authMode === "signup" && (
                <input
                  placeholder="Full Name"
                  value={authForm.name}
                  onChange={e => setAuthForm({ ...authForm, name: e.target.value })}
                  required
                  style={{ width: "100%", padding: "10px 12px", background: "#FAF6F2", border: "1px solid #d1d5db", borderRadius: 8, color: "#1a1a1a", marginBottom: 8, fontSize: 14, boxSizing: "border-box" }}
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={authForm.email}
                onChange={e => setAuthForm({ ...authForm, email: e.target.value })}
                required
                style={{ width: "100%", padding: "10px 12px", background: "#FAF6F2", border: "1px solid #d1d5db", borderRadius: 8, color: "#1a1a1a", marginBottom: 8, fontSize: 14, boxSizing: "border-box" }}
              />
              <input
                type="password"
                placeholder="Password"
                value={authForm.password}
                onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
                required
                style={{ width: "100%", padding: "10px 12px", background: "#FAF6F2", border: "1px solid #d1d5db", borderRadius: 8, color: "#1a1a1a", marginBottom: 12, fontSize: 14, boxSizing: "border-box" }}
              />
              <button type="submit" style={{ width: "100%", padding: "12px 24px", background: "#8B7355", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontFamily: "Georgia, serif", fontWeight: 600, cursor: "pointer" }}>
                {authMode === "signin" ? "Sign In" : "Sign Up"}
              </button>
              <button
                type="button"
                onClick={() => setShowAuth(false)}
                style={{ marginTop: 8, width: "100%", padding: 12, background: "transparent", border: "1px solid #d1d5db", color: "#6b7280", borderRadius: 8, cursor: "pointer", fontSize: 14, fontFamily: "Georgia, serif" }}
              >Back</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Main App with Tabs
  return (
    <>
      <Navbar user={user} activeTab={activeTab} setActiveTab={setActiveTab} showNewProjectModal={showNewProjectModal} setShowNewProjectModal={setShowNewProjectModal} proposals={proposals} />
      {showNewProjectModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(2px)" }}>
          <div className="new-job-modal" style={{ background: "#FAF6F2", borderRadius: 12, padding: 40, maxWidth: 600, width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
            <button
              className="modal-close-btn"
              onClick={() => { setShowNewProjectModal(false); setNewJob({ title: "", description: "", budget: "" }); }}
              style={{ position: "absolute", top: 16, right: 16, width: 32, height: 32, border: "none", background: "#f3f4f6", borderRadius: "50%", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
              onMouseEnter={e => (e.target.style.background = "#e5e7eb")}
              onMouseLeave={e => (e.target.style.background = "#f3f4f6")}
            >✕</button>
            <h2 style={{ fontSize: 28, fontFamily: "Georgia, serif", color: "#1a1a1a", marginBottom: 24, marginTop: 0, fontWeight: 400 }}>Post a New Job</h2>
            <form onSubmit={handlePost} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: "#1a1a1a" }}>Job Title</label>
                <input
                  placeholder="e.g., Web Design for E-commerce Site"
                  value={newJob.title}
                  onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                  style={{ width: "100%", padding: 12, border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14, fontFamily: "inherit", color: "#1a1a1a", background: "#fff", boxSizing: "border-box" }}
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: "#1a1a1a" }}>Budget ($)</label>
                <input
                  type="number"
                  placeholder="e.g., 5000"
                  value={newJob.budget}
                  onChange={e => setNewJob({ ...newJob, budget: e.target.value })}
                  style={{ width: "100%", padding: 12, border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14, fontFamily: "inherit", color: "#1a1a1a", background: "#fff", boxSizing: "border-box" }}
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: "#1a1a1a" }}>Job Description</label>
                <textarea
                  placeholder="Describe your project, requirements, timeline..."
                  value={newJob.description}
                  onChange={e => setNewJob({ ...newJob, description: e.target.value })}
                  style={{ width: "100%", padding: 12, border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14, fontFamily: "inherit", color: "#1a1a1a", background: "#fff", resize: "vertical", minHeight: 140, boxSizing: "border-box" }}
                  required
                />
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button
                  type="submit"
                  style={{ background: "#1a1a1a", color: "#fff", padding: "12px 24px", borderRadius: 6, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer", flex: 1, transition: "all 0.2s" }}
                  onMouseEnter={e => (e.target.style.background = "#2a2a2a")}
                  onMouseLeave={e => (e.target.style.background = "#1a1a1a")}
                >Post Job</button>
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => { setShowNewProjectModal(false); setNewJob({ title: "", description: "", budget: "" }); }}
                  style={{ background: "#f3f4f6", color: "#1a1a1a", padding: "12px 24px", borderRadius: 6, fontWeight: 600, fontSize: 14, border: "1px solid #d1d5db", cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={e => (e.target.style.background = "#e5e7eb")}
                  onMouseLeave={e => (e.target.style.background = "#f3f4f6")}
                >Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="main-content" style={{ minHeight: "100vh", background: "#FAF6F2" }}>
        {activeTab === "myprojects" && <MyProjectsTab user={user} jobs={jobs} proposals={proposals} fetchData={fetchData} />}
        {activeTab === "client" && <ClientTab user={user} jobs={jobs} proposals={proposals} setJobs={setJobs} fetchData={fetchData} />}
        {activeTab === "freelancer" && <FreelancerTab user={user} jobs={jobs} proposals={proposals} fetchData={fetchData} />}
        {activeTab === "profile" && <ProfileTab user={user} jobs={jobs} proposals={proposals} />}
      </div>
    </>
  );
}