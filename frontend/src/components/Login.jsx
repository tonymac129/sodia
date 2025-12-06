import { useGoogleLogin } from "@react-oauth/google";

function Login({ setUserData }) {
  const login = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      console.log(credentialResponse);
      handleLogin(credentialResponse.access_token);
    },
    onError: () => {
      console.log("Login Failed");
    },
  });

  function handleLogin(jwt) {
    fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((res) => res.json())
      .then((user) => {
        setUserData(user);
      })
      .catch((err) => console.error(err));
  }

  return (
    <div className="login-btn" onClick={() => login()}>
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/250px-Google_Favicon_2025.svg.png" />{" "}
      Sign in with Google
    </div>
  );
}

export default Login;
