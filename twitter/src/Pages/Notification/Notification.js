import React, { useState, useEffect } from "react";
import "../pages.css";

const NotificationSettings = () => {
  const [enabled, setEnabled] = useState(
    localStorage.getItem("notificationsEnabled") === "true"
  );

  // Request browser permission
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notifications.");
      return false;
    }

    let permission = window.Notification.permission;
    if (permission === "default") {
      permission = await window.Notification.requestPermission();
    }
    return permission === "granted";
  };

  // Show a popup notification
  const showTweetNotification = (tweet) => {
    if (window.Notification.permission === "granted") {
      new window.Notification("New Tweet Alert 🚨", {
        body: tweet,
        icon: "/logo192.png", // replace with your app logo
      });
    }
  };

  // Sync localStorage when user changes setting
  useEffect(() => {
    localStorage.setItem("notificationsEnabled", enabled);
  }, [enabled]);

  const toggleNotifications = async () => {
    if (!enabled) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        alert("Please allow notifications in your browser.");
        return;
      }
    }
    setEnabled(!enabled);
  };

  // ✅ Optional: Test button to trigger popup instantly
  const testNotification = () => {
    if (enabled) {
      showTweetNotification("This is a test tweet about cricket 🏏 and science 🔬");
    } else {
      alert("Enable notifications first!");
    }
  };

  return (
    <div className="page">
      <h2 className="pageTitle">Notification Settings</h2>

      <div className="notification-toggle">
        <p>
          Notifications are <strong>{enabled ? "Enabled ✅" : "Disabled ❌"}</strong>
        </p>
        <button onClick={toggleNotifications}>
          {enabled ? "Disable Notifications" : "Enable Notifications"}
        </button>

        <br />
        <button onClick={testNotification} style={{ marginTop: "10px" }}>
          🔔 Test Notification
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings;
