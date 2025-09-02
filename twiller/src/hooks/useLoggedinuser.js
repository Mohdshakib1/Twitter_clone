import React, { useEffect, useState } from "react";
import { useUserAuth } from "../context/UserAuthContext";

const useLoggedinuser = () => {
  const { user } = useUserAuth();
  const email = user?.email;
  const [loggedinuser, setloggedinuser] = useState({});

  useEffect(() => {
    if (!email) return; // prevent fetch if email is null/undefined
    fetch(`https://twitter-clone-qup2.onrender.com/loggedinuser?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        setloggedinuser(data);
      })
      .catch((err) => console.error("Error fetching logged-in user:", err));
  }, [email]);   // ✅ only depends on email

  return [loggedinuser, setloggedinuser];
};

export default useLoggedinuser;
