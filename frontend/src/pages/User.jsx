import toast from "react-hot-toast";
import api from "../lib/axios";
import { useState, useEffect, useRef } from "react";
import Modal from "../components/Modal";
import { pfps } from "../assets/assets";
import Post from "../components/Post";
import { useParams, useNavigate } from "react-router";

function User({ userID, posts, setPosts }) {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [show, setShow] = useState(false);
  const [profile, setProfile] = useState(false);
  const [selected, setSelected] = useState(0);
  const [savedPosts, setSavedPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [viewer, setViewer] = useState(false);
  const [following, setFollowing] = useState(false);
  const [viewFollows, setViewFollows] = useState(false);
  const displayRef = useRef();
  const passwordRef = useRef();
  const bioRef = useRef();
  const navigate = useNavigate();

  if (id === userID) {
    navigate("/user");
  }

  useEffect(() => {
    async function fetchUser() {
      try {
        let user;
        if (id) {
          user = await api.get(`/user/${id}`);
          setUser(user.data);

          const currentUser = await api.get(`/user/${userID}`);
          console.log(currentUser.data.following);
          if (currentUser.data.following?.includes(user.data.username)) {
            setFollowing(true);
          }
          setViewer(true);
        } else {
          setViewer(false);
          user = await api.get(`/user/${userID}`);
          setUser(user.data);
        }
        setSelected(user.data.pfp);
      } catch (error) {
        navigate("/");
        toast.error("Error: " + error);
      }
    }
    fetchUser();
    setViewFollows(false);
  }, [userID, id]);
  //fix bug of viewing user data gets changed to the current users data

  useEffect(() => {
    if (user.saved) {
      async function getSavedPosts() {
        try {
          const userPosts = await Promise.all(user.saved?.map((post) => api.get("/" + post)));
          setSavedPosts(userPosts);
        } catch (error) {
          toast.error("Error: " + error);
        }
      }
      getSavedPosts();
    }
  }, [user.saved]);

  useEffect(() => {
    async function updatePfp() {
      try {
        const updatedUser = await api.put(`/user/${user.username}`, { ...user, pfp: selected });
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

  async function handleFollow() {
    if (following) {
      try {
        const currentUser = await api.get(`/user/${userID}`);
        console.log(
          currentUser.data.following.filter((follow) => follow === user.username),
          currentUser.data.following,
          user.username
        );

        const newUser = await api.put(`/user/${userID}`, {
          ...currentUser.data,
          following: currentUser.data.following.filter((follow) => follow !== user.username),
        });

        const newFollow = await api.put(`/user/${user.username}`, {
          ...user,
          followers: user.followers.filter((follow) => follow !== currentUser.data.username),
        });
        setUser(newFollow.data);
        setFollowing(false);
      } catch (error) {
        toast.error(error);
      }
    } else {
      try {
        const currentUser = await api.get(`/user/${userID}`);
        const newUser = await api.put(`/user/${userID}`, {
          ...currentUser.data,
          following: [...(currentUser.data.following || []), user.username],
        });
        const newFollow = await api.put(`/user/${user.username}`, {
          ...user,
          followers: [...(user.followers || []), currentUser.data.username],
        });
        setFollowing(true);
        setUser(newFollow.data);
      } catch (error) {
        toast.error(error);
      }
    }
  }

  async function handleDelete() {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await api.delete("/user/" + userID);
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

  useEffect(() => {
    setUserPosts(posts.filter((post) => post.op === user.username));
  }, [user, posts]);

  return (
    <div className="wrap">
      <title>{`${userID} | Sodia`}</title>
      <div className="user-page">
        <div className="user-content">
          <img
            onClick={() => {
              if (!viewer) {
                setProfile(true);
              }
            }}
            src={selected % 1 === 0 ? pfps.pfps[selected] : selected}
            title="Edit profile picture"
            className="user-pfp"
          />
          <h2 className="user-name">
            <div ref={displayRef}>{user.displayName}</div>
            {!viewer && <img onClick={() => handleEdit("d")} src="/icons/ui/edit.svg" title="Edit display name" />}
          </h2>
          <div className="user-info">{user.username}</div>
          <div className="follow">
            <div className="follow-count">
              <span className="user-count" onClick={() => setViewFollows(true)}>
                {user.followers?.length} followers
              </span>{" "}
              •{" "}
              <span className="user-count" onClick={() => setViewFollows(1)}>
                {user.following?.length} following
              </span>
            </div>
            {viewer && (
              <button className="follow-btn" title={`Follow ${user.username}`} onClick={handleFollow}>
                {following ? "Following" : "Follow"}
              </button>
            )}
          </div>
          <div className="user-bio">
            <div ref={bioRef}>{user.bio ? user.bio : "No bio added"}</div>
            {!viewer && <img onClick={() => handleEdit("b")} src="/icons/ui/edit.svg" title="Edit bio" />}
          </div>
          {!viewer&&user.password && (
            <div className="user-info">
              Password: <span ref={passwordRef}>{show ? user.password : hidePassword()}</span>
              <img
                src={show ? "/icons/ui/hide.svg" : "/icons/ui/show.svg"}
                title={`${show ? "Hide" : "Show"} password`}
                onClick={() => setShow(!show)}
              />
              {show && <img onClick={() => handleEdit("p")} src="/icons/ui/edit.svg" title="Edit password" />}
            </div>
          )}
          <div className="user-info">Joined {new Date(user.createdAt).toLocaleDateString()}</div>
          {!viewer && (
            <>
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
            </>
          )}
        </div>
        <div className="user-posted">
          <div className="user-posts">
            <h2 className="user-posts-title">{viewer ? user.displayName + "'s" : "Your"} posts</h2>
            <div className="saved-posts">
              {userPosts.length > 0 ? (
                userPosts.map((postData) => {
                  const post = postData;
                  return <Post userID={userID} postData={post} posts={posts} setPosts={setPosts} />;
                })
              ) : (
                <div className="normal-message">You haven't posted anything yet, want to get started?</div>
              )}
            </div>
          </div>
          <div className="user-posts">
            <h2 className="user-posts-title">{viewer ? user.displayName + "'s" : "Your"} saved posts</h2>
            <div className="saved-posts">
              {savedPosts.length > 0 ? (
                savedPosts.map((postData) => {
                  const post = postData.data;
                  return <Post userID={userID} postData={post} posts={posts} setPosts={setPosts} />;
                })
              ) : (
                <div className="normal-message">You haven't saved any posts, explore the feed to discover new stuff!</div>
              )}
            </div>
          </div>
        </div>
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
      {viewFollows && (
        <Modal
          setShown={setViewFollows}
          ogtitle={viewFollows === 1 ? `Followed by ${user.displayName}` : `${user.displayName}'s Followers`}
          follows={viewFollows === 1 ? user.following : user.followers}
          following={viewFollows === 1}
        />
      )}
    </div>
  );
}

export default User;
