import React, { useEffect, useState, useRef } from "react";
import "./Feed.css";
import Posts from "./Posts/Posts";
import Tweetbox from "./Tweetbox/Tweetbox";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const notifiedIdsRef = useRef(new Set());

  useEffect(() => {
    const interval = setInterval(fetchAndNotify, 10000); // every 10s
    fetchAndNotify(); // initial fetch
    return () => clearInterval(interval);
  }, []);

  const fetchAndNotify = () => {
    fetch("http://localhost:5000/post")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        handleNotifications(data);
      })
      .catch((err) => console.error("Fetch error:", err));
  };

  const handleNotifications = (data) => {
    const notificationsEnabled = localStorage.getItem("notificationsEnabled") === "true";

    if (!notificationsEnabled || !("Notification" in window)) return;

    data.forEach((tweet) => {
      const content = tweet?.post?.toLowerCase();

      if (
        content &&
        (content.includes("cricket") || content.includes("science")) &&
        !notifiedIdsRef.current.has(tweet._id)
      ) {
        if (Notification.permission === "granted") {
          new Notification("New Tweet Alert 🚨", {
            body: tweet.post,
            icon: "/favicon.ico",
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              new Notification("New Tweet Alert 🚨", {
                body: tweet.post,
                icon: "/favicon.ico",
              });
            }
          });
        }

        notifiedIdsRef.current.add(tweet._id);
      }
    });
  };

  return (
    <div className="feed">
      <div className="feed__header">
        <h2>Home</h2>
      </div>
      <Tweetbox />
      {posts.map((p) => (
        <Posts key={p._id} p={p} />
      ))}
    </div>
  );
};

export default Feed;
