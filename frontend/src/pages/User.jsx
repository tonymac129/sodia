import toast from "react-hot-toast";
import api from "../lib/axios";
import { useState, useEffect, useRef } from "react";
import Modal from "../components/Modal";
import { pfps } from "../assets/assets";

function User({ userID }) {
  const [user, setUser] = useState({});
  const [show, setShow] = useState(false);
  const [profile, setProfile] = useState(false);
  const [selected, setSelected] = useState(0);
  const displayRef = useRef();
  const passwordRef = useRef();
  const bioRef = useRef();

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await api.get(`/user/${userID}`);
        setUser(user.data);
        setSelected(user.data.pfp);
      } catch (error) {
        toast.error("Error: " + error);
      }
    }
    fetchUser();
  }, [userID]);

  useEffect(() => {
    async function updatePfp() {
      try {
        const updatedUser = await api.put(`/user/${userID}`, { ...user, pfp: selected });
        console.log(updatedUser.data);
        setUser(updatedUser.data);
      } catch (error) {
        toast.error("Error: " + error);
      }
    }
    if (user.username) {
      updatePfp();
    }
  }, [selected]);

  function hidePassword() {
    return "•".repeat(user.password?.length);
  }

  function handleEdit(type) {
    let element;
    switch (type) {
      case "p":
        element = passwordRef.current;
        break;
      case "d":
        element = displayRef.current;
        break;
      case "b":
        element = bioRef.current;
        break;
    }
    element.contentEditable = true;
    element.focus();
    element.addEventListener("blur", async () => {
      try {
        let newUser;
        if (type === "d") {
          newUser = { ...user, displayName: element.innerText };
        } else if (type === "p") {
          newUser = { ...user, password: element.innerText };
        } else {
          newUser = { ...user, bio: element.innerText };
        }
        await api.put(`/user/${userID}`, newUser);
        setUser(newUser);
        element.contentEditable = false;
        toast.success(`${type === "p" ? "Password" : type === "d" ? "Display name" : "Bio"} updated successfully`);
      } catch (error) {
        toast.error("Error: failed to edit display name");
      }
    });
  }

  async function handleDelete() {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await api.delete("/user/" + userID);
        console.log("safdklasdfkjsda");
        sessionStorage.removeItem("sodia-logged");
        toast.success("Account successfully deleted");
        setTimeout(() => {
          window.location.href = "/";
        }, 100);
      } catch (error) {
        toast.error("Failed to delete account");
      }
    }
  }

  return (
    <div className="wrap">
      <title>{`${userID} | Sodia`}</title>
      <div className="user-page">
        <img onClick={() => setProfile(true)} src={pfps.pfps[selected]} title="Edit profile picture" className="user-pfp" />
        <h2 className="user-name">
          <div ref={displayRef}>{user.displayName}</div>
          <img onClick={() => handleEdit("d")} src="/icons/ui/edit.svg" title="Edit display name" />
        </h2>
        <div className="user-bio">
          <div ref={bioRef}>{user.bio ? user.bio : "No bio added"}</div>
          <img onClick={() => handleEdit("b")} src="/icons/ui/edit.svg" title="Edit bio" />
        </div>
        <div className="user-info">Username: {user.username}</div>
        <div className="user-info">
          Password: <span ref={passwordRef}>{show ? user.password : hidePassword()}</span>
          <img
            src={show ? "/icons/ui/hide.svg" : "/icons/ui/show.svg"}
            title={`${show ? "Hide" : "Show"} password`}
            onClick={() => setShow(!show)}
          />
          {show && <img onClick={() => handleEdit("p")} src="/icons/ui/edit.svg" title="Edit password" />}
        </div>
        <div className="user-info">Account created on: {new Date(user.createdAt).toLocaleDateString()}</div>
        <button
          className="user-btn"
          onClick={() => {
            sessionStorage.removeItem("sodia-logged");
            window.location.href = "/";
          }}
        >
          Log out
        </button>
        <button className="user-btn warning-btn" onClick={handleDelete}>
          Delete account
        </button>
      </div>
      {profile && (
        <Modal
          setShown={setProfile}
          ogtitle="Choose Profile Picture"
          ogdescription="Choose a profile picture to display on your Sodia account."
          profile={true}
          selected={selected}
          setSelected={setSelected}
        />
      )}
    </div>
  );
}

export default User;
