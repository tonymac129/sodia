import { Link } from "react-router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

function Nav() {
  const [mode, setMode] = useState(JSON.parse(localStorage.getItem("sodia-mode")) || false);

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
      <div>Profile btn</div>
    </div>
  );
}

export default Nav;
