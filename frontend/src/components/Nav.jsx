import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import { pfps } from "../assets/assets";
import toast from "react-hot-toast";
import api from "../lib/axios";

function Nav({ user, setUser, posts }) {
  const [mode, setMode] = useState(JSON.parse(localStorage.getItem("sodia-mode")) || false);
  const [login, setLogin] = useState(false);
  const [userData, setUserData] = useState({});
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef();

  useEffect(() => {
    const handleClick = (e) => {
      setSearching(searchRef.current.contains(e.target));
    };
    document.addEventListener("click", (e) => handleClick(e));
    return () => {
      document.removeEventListener("click", (e) => handleClick(e));
    };
  }, []);

  useEffect(() => {
    async function fetchUser() {
      try {
        const newUser = await api.get(`/user/${user}`);
        setUserData(newUser.data);
      } catch (error) {
        toast.error("Error: " + error);
      }
    }
    fetchUser();
  }, [user]);

  useEffect(() => {
    if (search.trim().length > 0) {
      let query = search.trim().toLowerCase();
      setSearchResults(
        posts.filter((post) => post.title.toLowerCase().includes(query) || post.content.toLowerCase().includes(query))
      );
    } else {
      setSearchResults([]);
    }
  }, [search]);

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
        <img src="/logo.png" />
        Sodia
      </Link>
      <div className="nav-search-container" ref={searchRef}>
        <input
          type="text"
          placeholder="Search posts"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`nav-search ${searching ? "nav-search-active" : ""}`}
        />
        {searchResults.length > 0 && searching && (
          <div className="nav-search-results">
            {searchResults.map((result) => {
              return (
                <Link to={`/post/${result._id}`} className="nav-search-result">
                  {result.title}
                </Link>
              );
            })}
          </div>
        )}
      </div>
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
          src={pfps.pfps[userData.pfp]}
          title={`Logged in as ${user}`}
        />
      ) : (
        <button className="nav-signup" onClick={() => setLogin(true)}>
          Log in
        </button>
      )}
      {login && (
        <Modal
          setShown={setLogin}
          ogtitle="Log in"
          ogdescription="Log in to your Sodia account to create posts, comment, like, and more!"
          login={true}
          setUser={setUser}
        />
      )}
    </div>
  );
}

export default Nav;
