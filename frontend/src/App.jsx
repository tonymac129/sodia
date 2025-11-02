import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Home from "./pages/Home";
import Post from "./pages/Post";

function App() {
  const [mode, setMode] = useState(JSON.parse(localStorage.getItem("sodia-mode")) || false);

  useEffect(() => {
    if (!mode) {
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
    }
    localStorage.setItem("sodia-mode", mode);
  }, [mode]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/" element={<Post />} />
        <Route path="/post/:id" element={<Post />} />
      </Routes>
      <motion.img
        onClick={() => setMode(!mode)}
        whileHover={{ scale: 1.1, y: -2 }}
        src="/icons/ui/mode.svg"
        className="mode-btn"
        title="Toggle light mode"
      />
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
