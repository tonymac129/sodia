import { motion } from "framer-motion";
import { useState } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";

function Modal({ setShown, title, description, login = false, setUser = null }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      const newLogin = await api.post("/user", { username: username, password: password });
      if (newLogin.data.message === "Logged in") {
        toast.success("Successfully logged in!");
        setUser(newLogin.data.username);
        setShown(false);
      } else {
        toast.error("Please input the correct password");
      }
    } catch (error) {
      toast.error("Please input the correct password");
    }
  }

  return (
    <motion.div
      className="modal-bg"
      onClick={(e) => {
        if (e.target === e.currentTarget) setShown(false);
      }}
    >
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
            <input
              type="text"
              value={password}
              onInput={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="modal-input"
            />
          </div>
        )}
        <button className="modal-close" onClick={() => (login ? handleLogin() : setShown(false))}>
          {login ? "Login" : "Close"}
        </button>
      </div>
    </motion.div>
  );
}

export default Modal;
