import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Modal from "./Modal";

function Nav({ user, setUser }) {
  const [mode, setMode] = useState(JSON.parse(localStorage.getItem("sodia-mode")) || false);
  const [login, setLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!mode) {
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
    }
    localStorage.setItem("sodia-mode", mode);
  }, [mode]);

  return (
    <div className="nav">
      <Link to="/" className="nav-logo">
        Sodia
      </Link>
      <input type="text" placeholder="Search coming soon" className="nav-search" />
      <motion.img
        onClick={() => setMode(!mode)}
        whileHover={{ scale: 1.1, y: -2 }}
        src="/icons/ui/mode.svg"
        className="mode-btn"
        title="Toggle light mode"
      />
      {user.length > 0 ? (
        <motion.img
          onClick={() => navigate("/user")}
          whileHover={{ scale: 1.1, y: -2 }}
          className="nav-btn"
          src="/icons/ui/user.svg"
          title={`Logged in as ${user}`}
        />
      ) : (
        <button className="nav-signup" onClick={() => setLogin(true)}>Sign up</button>
      )}
      {login && (
        <Modal
          setShown={setLogin}
          title="Sign up/Log in"
          description="Sign up for an account on Sodia to start posting and chatting!"
          login={true}
          setUser={setUser}
        />
      )}
    </div>
  );
}

export default Nav;
