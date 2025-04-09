"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DefaultUserIcon from "@/public/user.png";
import VerifiedBadge from "@/public/verified.webp";

const ProfilePopup = ({ userData, onClose, onLogout }) => {
  const router = useRouter();
  const popupRef = useRef(null);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [formData, setFormData] = useState({
    username: userData?.username || "",
    phone: userData?.phone || "",
    address: userData?.address || "",
    city: userData?.city || "",
    country: userData?.country || "",
    postalCode: userData?.postalCode || "",
    area: userData?.area || ""
  });
  const [securitySettingsOpen, setSecuritySettingsOpen] = useState(false);
  const [referralCount, setReferralCount] = useState(userData?.referralCount || 0);
  const [activeReferrals, setActiveReferrals] = useState(userData?.activeReferrals || 0);

  // Initialize form data when userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.username || "",
        phone: userData.phone || "",
        address: userData.address || "",
        city: userData.city || "",
        country: userData.country || "",
        postalCode: userData.postalCode || "",
        area: userData.area || ""
      });
    }
  }, [userData]);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleUsernameUpdate = async () => {
    try {
      const response = await fetch('/api/auth/update_username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newUsername: formData.username }),
      });

      if (response.ok) {
        setIsEditingUsername(false);
        router.refresh();
      }
    } catch (error) {
      console.error('Error updating username:', error);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const response = await fetch('/api/auth/updateuser_profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          postalCode: formData.postalCode,
          area: formData.area
        }),
      });
  
      const data = await response.json();
      
      if (response.ok) {
        setIsEditingProfile(false);
        // Update local state with the returned user data
        setFormData(prev => ({
          ...prev,
          phone: data.user.phone || prev.phone,
          address: data.user.address || prev.address,
          city: data.user.city || prev.city,
          country: data.user.country || prev.country,
          postalCode: data.user.postalCode || prev.postalCode,
          area: data.user.area || prev.area
        }));
        router.refresh();
      } else {
        console.error('Profile update failed:', data.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div 
        ref={popupRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in"
      >
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
          <h3 className="text-lg font-medium text-gray-900">User Profile</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <div className="px-6 py-4">
          {/* User Info Section */}
          <div className="flex items-center space-x-4 mb-6">
            <Image
              src={userData?.avatar || DefaultUserIcon}
              alt="User Avatar"
              width={80}
              height={80}
              className="rounded-full border-2 border-green-500"
            />
            <div className="flex-1">
              <div className="flex items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  {isEditingUsername ? (
                    <input
                      type="text"
                      name="username"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="border-b border-gray-300 focus:border-green-500 outline-none w-full"
                    />
                  ) : (
                    userData?.name || "username"
                  )}
                </h2>
                {userData?.verified && (
                  <Image
                    src={VerifiedBadge}
                    alt="Verified"
                    width={16}
                    height={16}
                    className="ml-2"
                  />
                )}
                {isEditingUsername ? (
                  <button
                    onClick={handleUsernameUpdate}
                    className="ml-2 text-sm bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingUsername(true)}
                    className="ml-2 text-sm text-gray-500 hover:text-green-600 transition"
                  >
                    Edit
                  </button>
                )}
              </div>
              <p className="text-gray-600">{userData?.email || "user@example.com"}</p>
              <p className="text-xs text-gray-400 mt-1">  Member since: {new Date(userData?.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Profile Details Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-gray-800">Profile Details</h4>
              {isEditingProfile ? (
                <div className="flex space-x-2">
                  <button
                    onClick={handleProfileUpdate}
                    className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="text-sm text-green-600 hover:text-green-800 font-medium"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                {isEditingProfile ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="border-b border-gray-300 focus:border-green-500 outline-none text-right"
                    placeholder="Add phone number"
                  />
                ) : (
                  <span className="text-gray-800">{userData?.phone || "Not provided"}</span>
                )}
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Address:</span>
                {isEditingProfile ? (
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="border-b border-gray-300 focus:border-green-500 outline-none text-right"
                    placeholder="Street address"
                  />
                ) : (
                  <span className="text-gray-800">{userData?.address || "Not provided"}</span>
                )}
              </div>

              {isEditingProfile && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">City:</span>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="border-b border-gray-300 focus:border-green-500 outline-none text-right"
                      placeholder="City"
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Country:</span>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="border-b border-gray-300 focus:border-green-500 outline-none text-right"
                      placeholder="Country"
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Postal Code:</span>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="border-b border-gray-300 focus:border-green-500 outline-none text-right"
                      placeholder="Postal code"
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Area:</span>
                    <input
                      type="text"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      className="border-b border-gray-300 focus:border-green-500 outline-none text-right"
                      placeholder="Select area"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Account Actions */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Change Email</span>
              {userData?.verified ? (
                <span className="text-gray-400 text-sm">
                  Can't change email of verified account
                </span>
              ) : (
                <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                  Change
                </button>
              )}
            </div>
          </div>

          {/* Referral Section */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="font-medium text-gray-800 mb-2">Referral Program</h4>
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-gray-600">Total Referrals</p>
                <p className="font-bold text-green-600">{referralCount}</p>
              </div>
              <div>
                <p className="text-gray-600">Active Referrals</p>
                <p className="font-bold text-green-600">{activeReferrals}</p>
              </div>
              <button className="text-green-600 hover:text-green-800 font-medium">
                View All
              </button>
            </div>
          </div>

          {/* Settings Section */}
          <div className="mb-6">
            <button
              onClick={() => setSecuritySettingsOpen(!securitySettingsOpen)}
              className="flex justify-between items-center w-full text-left py-2"
            >
              <span className="font-medium text-gray-800">Security Settings</span>
              <svg
                className={`w-5 h-5 text-gray-500 transform transition-transform ${securitySettingsOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {securitySettingsOpen && (
              <div className="mt-2 pl-4 border-l-2 border-gray-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Two-Factor Authentication</span>
                  <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                    Enable
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Password</span>
                  <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                    Change
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Connected Devices</span>
                  <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                    Manage
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePopup;