import toast from "react-hot-toast";
import api from "../lib/axios";
import { useState, useEffect } from "react";

function User({ userID }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await api.get(`/user/${userID}`);
        setUser(user.data);
      } catch (error) {
        toast.error("Error: " + error);
      }
    }
    fetchUser();
  }, [userID]);

  return (
    <div className="wrap">
      <title>{`${userID} | Sodia`}</title>
      <div className="user-page">
        <div className="user-info">Username: {user.username}</div>
        <div className="user-info">Password: {user.password}</div>
        <div className="user-info">Account created on: {new Date(user.createdAt).toLocaleDateString()}</div>
        <button className="user-btn" onClick={() => window.location.href = "/"}>
          Log out
        </button>
      </div>
    </div>
  );
}

export default User;
