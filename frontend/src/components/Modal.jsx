import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { pfps } from "../assets/assets";
import Login from "./Login";

const clientId = "624001488812-vg7t5fiqj0prh7mfpheudqu83af5aagf.apps.googleusercontent.com";

function Modal({
  setShown,
  ogtitle,
  ogdescription = "",
  login = false,
  setUser = null,
  profile = false,
  selected = null,
  setSelected = null,
  follows = null,
  following = false,
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [title, setTitle] = useState(ogtitle);
  const [description, setDiscription] = useState(ogdescription);
  const [signup, setSignup] = useState(false);
  const [followUsers, setFollowUsers] = useState([]);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    async function checkGoogleOAuth() {
      try {
        const newLogin = await api.post("/login", { data: userData });
        console.log(userData);
        
        toast.success("Successfully logged in!");
        sessionStorage.setItem("sodia-logged", newLogin.data.username);
        setUser(newLogin.data.username);
        setShown(false);
      } catch (error) {
        console.error("Error: " + error);
      }
    }
    if (userData.email_verified) checkGoogleOAuth();
  }, [userData]);

  useEffect(() => {
    if (login) {
      if (signup) {
        setTitle("Sign up");
        setDiscription("Sign up for an account on Sodia to start posting and chatting!");
      } else {
        setTitle("Log in");
        setDiscription("Log in to your Sodia account to create posts, comment, like, and more!");
      }
    }
  }, [signup]);

  useEffect(() => {
    async function fetchFollows() {
      const allUsers = await Promise.all(
        follows.map(async (follow) => {
          const res = await api.get("/user/" + follow);
          return { ...res.data };
        })
      );
      setFollowUsers(allUsers);
    }
    if (follows) fetchFollows();
  }, [follows]);

  async function handleSignup() {
    try {
      const newAccount = await api.post("/user", { username: username, password: password, displayName: displayName });
      if (newAccount.data.message === "Logged in") {
        toast.success("Account created successfully!");
        sessionStorage.setItem("sodia-logged", newAccount.data.username);
        setUser(newAccount.data.username);
        setShown(false);
      } else {
        toast.error("Please enter all credentials.");
      }
    } catch (error) {
      toast.error("Something went wrong, please try again.");
    }
  }

  async function handleLogin() {
    try {
      const existingUser = await api.get("/user/" + username);
      if (!existingUser) {
        toast.error("Account doesn't exist!");
        return;
      }
      const newLogin = await api.post("/user", { username: username, password: password, displayName: displayName });
      if (newLogin.data.message === "Logged in") {
        toast.success("Successfully logged in!");
        sessionStorage.setItem("sodia-logged", newLogin.data.username);
        setUser(newLogin.data.username);
        setShown(false);
      }
    } catch (error) {
      toast.error("Please input the correct credentials");
    }
  }

  return (
    <motion.div
      className="modal-bg"
      onClick={(e) => {
        if (e.target === e.currentTarget) setShown(false);
      }}
    >
      <GoogleOAuthProvider clientId={clientId}>
        <div className="modal">
          <h2 className="modal-title">{title}</h2>
          <p className="modal-description">{description}</p>
          {login && (
            <div className="modal-inputs">
              <input
                type="text"
                value={username}
                onInput={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="modal-input"
              />
              {signup && (
                <input
                  type="text"
                  value={displayName}
                  onInput={(e) => setDisplayName(e.target.value)}
                  placeholder="Display name"
                  className="modal-input"
                />
              )}
              <input
                type="password"
                value={password}
                onInput={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="modal-input"
              />
              <div className="modal-separate">
                <span>or</span>
              </div>
              <Login setUserData={setUserData} />
              {signup ? (
                <div>
                  Already have an account?{" "}
                  <span className="modal-link" onClick={() => setSignup(false)}>
                    Log in
                  </span>
                </div>
              ) : (
                <div>
                  Don't have an account yet?{" "}
                  <span className="modal-link" onClick={() => setSignup(true)}>
                    Sign up
                  </span>
                </div>
              )}
            </div>
          )}
          {profile && (
            <div className="modal-pictures">
              {pfps.pfps.map((pfp, index) => {
                return (
                  <img
                    key={index}
                    src={pfp}
                    className={`modal-picture ${selected === index ? "modal-selected" : ""}`}
                    onClick={() => setSelected(index)}
                  />
                );
              })}
            </div>
          )}
          {follows && (
            <div className="modal-follows">
              {followUsers.map((follow) => {
                return (
                  <Link to={`/user/${follow.username}`} className="modal-follow">
                    <img src={pfps.pfps[follow.pfp]} /> {follow.username}
                  </Link>
                );
              })}
            </div>
          )}
          <button className="modal-close" onClick={() => (login ? (signup ? handleSignup() : handleLogin()) : setShown(false))}>
            {login ? title : "Close"}
          </button>
        </div>
      </GoogleOAuthProvider>
    </motion.div>
  );
}

export default Modal;
