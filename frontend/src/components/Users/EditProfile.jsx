import React, { useState, useEffect } from 'react';
import { getCurrentUser, updateProfile } from '../../services/api';

const EditProfile = () => {
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getCurrentUser();
      setProfileData(data);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileData);
      alert('Profile updated successfully');
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  return (
    <div className="edit-profile">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="firstName" value={profileData.firstName || ''} onChange={handleChange} placeholder="First Name" />
        <input type="text" name="lastName" value={profileData.lastName || ''} onChange={handleChange} placeholder="Last Name" />
        <input type="email" name="email" value={profileData.email || ''} onChange={handleChange} placeholder="Email" />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile; 