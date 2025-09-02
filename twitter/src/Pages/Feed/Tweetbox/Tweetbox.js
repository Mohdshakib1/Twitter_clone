import React, { useState } from "react";
import "./Tweetbox.css";
import { Avatar, Button } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import axios from "axios";
import { useUserAuth } from "../../../context/UserAuthContext";
import useLoggedinuser from "../../../hooks/useLoggedinuser";

// ✅ helper: trigger notification if allowed
const triggerTweetNotification = (post, userprofilepic) => {
  const notificationsEnabled =
    localStorage.getItem("notificationsEnabled") === "true";

  if (
    notificationsEnabled &&
    (post.toLowerCase().includes("cricket") ||
      post.toLowerCase().includes("science"))
  ) {
    if (Notification.permission === "granted") {
      new Notification("New Tweet Alert 🚨", {
        body: post,
        icon: userprofilepic || "/logo192.png",
      });
    }
  }
};

const Tweetbox = () => {
  const [post, setpost] = useState("");
  const [imageurl, setimageurl] = useState("");
  const [isloading, setisloading] = useState(false);
  const [name, setname] = useState("");
  const [username, setusername] = useState("");
  const { user } = useUserAuth();
  const [loggedinsuer] = useLoggedinuser();
  const email = user?.email;

  const userprofilepic = loggedinsuer[0]?.profileImage
    ? loggedinsuer[0].profileImage
    : user && user.photoURL;

  // upload image
  const handleuploadimage = (e) => {
    setisloading(true);
    const image = e.target.files[0];
    const formData = new FormData();
    formData.set("image", image);

    axios
      .post(
        "https://api.imgbb.com/1/upload?key=b0ea2f6cc0f276633b2a8a86d2c43335",
        formData
      )
      .then((res) => {
        setimageurl(res.data.data.display_url);
        setisloading(false);
      })
      .catch((e) => {
        console.error(e);
        setisloading(false);
      });
  };

  // post tweet
  const handletweet = (e) => {
    e.preventDefault();

    if (!post.trim() && !imageurl) {
      alert("Tweet cannot be empty!");
      return;
    }

    // check if logged-in user is email/password provider
    if (user?.providerData[0]?.providerId === "password") {
      fetch(`http://localhost:5000/loggedinuser?email=${email}`)
        .then((res) => res.json())
        .then((data) => {
          setname(data[0]?.name);
          setusername(data[0]?.username);
        });
    } else {
      setname(user?.displayName);
      setusername(email?.split("@")[0]);
    }

    if (name) {
      const userpost = {
        profilephoto: userprofilepic,
        post: post,
        photo: imageurl,
        username: username,
        name: name,
        email: email,
      };

      // ✅ trigger notification if "cricket" or "science" is in tweet
      triggerTweetNotification(post, userprofilepic);

      // reset inputs
      setpost("");
      setimageurl("");

      // send to backend
      fetch("http://localhost:5000/post", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(userpost),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Tweet saved:", data);
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="tweetBox">
      <form onSubmit={handletweet}>
        <div className="tweetBox__input">
          <Avatar
            src={
              loggedinsuer[0]?.profileImage
                ? loggedinsuer[0].profileImage
                : user && user.photoURL
            }
          />
          <input
            type="text"
            placeholder="What's happening?"
            onChange={(e) => setpost(e.target.value)}
            value={post}
            required
          />
        </div>

        <div className="imageIcon_tweetButton">
          <label htmlFor="image" className="imageIcon">
            {isloading ? (
              <p>Uploading Image...</p>
            ) : (
              <p>{imageurl ? "Image Uploaded ✅" : <AddPhotoAlternateOutlinedIcon />}</p>
            )}
          </label>
          <input
            type="file"
            id="image"
            className="imageInput"
            onChange={handleuploadimage}
          />

          <Button className="tweetBox__tweetButton" type="submit">
            Tweet
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Tweetbox;
