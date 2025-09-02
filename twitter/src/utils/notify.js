export const requestPermission = async () => {
  if (!("Notification" in window)) return false;
  if (window.Notification.permission === "default") {
    const p = await window.Notification.requestPermission();
    return p === "granted";
  }
  return window.Notification.permission === "granted";
};

export const showTweetNotification = (tweetText) => {
  if ("Notification" in window && window.Notification.permission === "granted") {
    new window.Notification("New Tweet 🚨", {
      body: tweetText,
      icon: "/logo192.png"
    });
  }
};
