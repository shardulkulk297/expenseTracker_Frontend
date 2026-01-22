import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const YourProfile = () => {
  const [financer, setFinancer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/user/getLoggedInUserDetails", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      });
      setFinancer(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFinancer({ ...financer, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put("http://localhost:8081/api/financer/profile/update", financer, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      });
      toast.success("Profile updated successfully!");
      setEditMode(false);
      setFinancer(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    fetchProfile(); // Reset to original data
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{minHeight: '70vh'}}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light min-vh-100 py-5">
       <nav aria-label="breadcrumb" className="mb-1">
        <ol className="breadcrumb bg-light px-3 py-2 rounded shadow-sm">
          <li className="breadcrumb-item">
            <a href="/financer" className="text-decoration-none">🏠 Dashboard</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Your-Profile
          </li>
        </ol>
      </nav>
      <div className="container">
     
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            
            {/* Header */}
            <div className="text-center mb-4">
              <h1 className="fw-bold text-dark mb-2">My Profile</h1>
              <p className="text-muted">Manage your account information and settings</p>
            </div>

            {/* Main Profile Card */}
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              
              {/* Profile Header Section */}
              <div className="bg-gradient bg-primary text-white p-4">
                <div className="row align-items-center">
                  <div className="col">
                    <h3 className="fw-bold mb-1">{financer.name}</h3>
                    <p className="mb-2 opacity-75">{financer.email}</p>
                  </div>
                  <div className="col-auto">
                    {!editMode ? (
                      <button 
                        type="button" 
                        className="btn btn-light btn-lg rounded-pill px-4"
                        onClick={() => setEditMode(true)}
                      >
                        <i className="fas fa-edit me-2"></i>
                        Edit Profile
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Profile Form Section */}
              <div className="card-body p-5">
                <form onSubmit={handleUpdate}>
                  <div className="row g-4">
                    
                    {/* Full Name */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-dark mb-2">
                        <i className="fas fa-user text-primary me-2"></i>
                        Full Name
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          className="form-control form-control-lg border-2 rounded-3"
                          name="name"
                          value={financer.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <div className="form-control form-control-lg border-0 bg-light rounded-3">
                          {financer.name}
                        </div>
                      )}
                    </div>

                    {/* Email (Read Only) */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-dark mb-2">
                        <i className="fas fa-envelope text-primary me-2"></i>
                        Email Address
                      </label>
                      <div className="form-control form-control-lg border-0 bg-light rounded-3 text-muted">
                        {financer.email}
                        <small className="d-block text-muted mt-1">Email cannot be changed</small>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-dark mb-2">
                        <i className="fas fa-phone text-primary me-2"></i>
                        Contact Number
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          className="form-control form-control-lg border-2 rounded-3"
                          name="contact"
                          value={financer.contact || ""}
                          onChange={handleChange}
                          placeholder="Enter your contact number"
                        />
                      ) : (
                        <div className="form-control form-control-lg border-0 bg-light rounded-3">
                          {financer.contact || <span className="text-muted">Not provided</span>}
                        </div>
                      )}
                    </div>

                    {/* Reputation Score (Read Only) */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-dark mb-2">
                        <i className="fas fa-star text-primary me-2"></i>
                        Reputation Score
                      </label>
                      <div className="form-control form-control-lg border-0 bg-light rounded-3 text-muted">
                        {financer.reputationScore} points
                        <small className="d-block text-muted mt-1">Earned through reviews and contributions</small>
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="col-12">
                      <label className="form-label fw-semibold text-dark mb-2">
                        <i className="fas fa-info-circle text-primary me-2"></i>
                        Bio
                      </label>
                      {editMode ? (
                        <textarea
                          className="form-control form-control-lg border-2 rounded-3"
                          rows="4"
                          name="bio"
                          value={financer.bio || ""}
                          onChange={handleChange}
                          placeholder="Tell us about yourself..."
                          style={{ resize: 'none' }}
                        />
                      ) : (
                        <div className="form-control form-control-lg border-0 bg-light rounded-3" style={{ minHeight: '120px' }}>
                          {financer.bio || <span className="text-muted">No bio provided</span>}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {editMode && (
                      <div className="col-12">
                        <hr className="my-4" />
                        <div className="d-flex justify-content-end gap-3">
                          <button 
                            type="button" 
                            className="btn btn-outline-secondary btn-lg px-4 rounded-pill"
                            onClick={handleCancel}
                          >
                            <i className="fas fa-times me-2"></i>
                            Cancel
                          </button>
                          <button 
                            type="submit" 
                            className="btn btn-primary btn-lg px-4 rounded-pill"
                          >
                            <i className="fas fa-save me-2"></i>
                            Save Changes
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                </form>
              </div>

            </div>

            {/* Additional Info Cards */}
            <div className="row mt-4">
              <div className="col-md-6 mb-3">
                <div className="card border-0 shadow-sm rounded-3 h-100">
                  <div className="card-body text-center p-4">
                    <i className="fas fa-shield-alt text-success fa-2x mb-3"></i>
                    <h6 className="fw-bold text-dark">Account Security</h6>
                    <p className="text-muted small mb-0">Your account is protected with secure authentication</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="card border-0 shadow-sm rounded-3 h-100">
                  <div className="card-body text-center p-4">
                    <i className="fas fa-trophy text-warning fa-2x mb-3"></i>
                    <h6 className="fw-bold text-dark">financer Status</h6>
                    <p className="text-muted small mb-0">Active financer with {financer.reputationScore} reputation points</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default YourProfile;