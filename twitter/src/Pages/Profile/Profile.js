import React, { useState, useEffect } from "react";
import Mainprofile from "./Mainprofile/Mainprofile";
import { useUserAuth } from "../../context/UserAuthContext";

// ✅ helper to request permission
const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notifications.");
    return false;
  }
  let permission = Notification.permission;
  if (permission === "default") {
    permission = await Notification.requestPermission();
  }
  return permission === "granted";
};

// ✅ helper to show notification
const showTweetNotification = (tweetText) => {
  if (Notification.permission === "granted") {
    new Notification("New Tweet 🚨", {
      body: tweetText,
      icon: "/logo192.png", // you can replace with your logo
    });
  }
};

const Profile = () => {
  const { user } = useUserAuth();

  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem("notificationsEnabled") === "true"
  );

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("notificationsEnabled", notificationsEnabled);
  }, [notificationsEnabled]);

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        alert("Please allow notifications in your browser settings.");
        return;
      }
    }
    setNotificationsEnabled(!notificationsEnabled);
  };

  const testNotification = () => {
    if (!notificationsEnabled) {
      alert("Enable notifications first!");
      return;
    }
    showTweetNotification(
      "This is a test tweet 🚨 containing cricket 🏏 and science 🔬"
    );
  };

  return (
    <div className="profilePage">
      {/* CSS injection (you can move to .css file later) */}
      <style>{`
        .profilePage {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .profileHeader {
          width: 100%;
          position: relative;
          text-align: center;
        }

        .profileHeader .cover {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 0;
        }

        .profileHeader .avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #fff;
          margin-top: -60px;
          z-index: 2;
          background: #fff;
        }

        .user-info {
          text-align: center;
          margin-top: 10px;
        }

        .user-info h2 {
          margin: 0;
          font-size: 20px;
          font-weight: bold;
        }

        .user-info p {
          margin: 0;
          font-size: 14px;
          color: gray;
        }

        .notification-settings {
          margin-top: 20px;
          text-align: center;
        }

        .notification-settings h3 {
          margin-bottom: 10px;
        }

        .notification-settings button {
          padding: 8px 16px;
          background: #1d9bf0;
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-size: 14px;
          margin: 5px;
        }

        .notification-settings button:hover {
          background: #0d8ae5;
        }
      `}</style>

      {/* Existing profile content */}
      <Mainprofile user={user} />

      {/* Notifications settings */}
      <div className="notification-settings">
        <h3>Notification Settings</h3>
        <button onClick={toggleNotifications}>
          {notificationsEnabled ? "Disable Notifications" : "Enable Notifications"}
        </button>
        <button onClick={testNotification}>🔔 Test Notification</button>
      </div>
    </div>
  );
};

export default Profile;
