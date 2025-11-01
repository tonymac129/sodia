import { Toaster } from "react-hot-toast";
import { HashRouter, Route, Routes } from "react-router";
import Home from "./pages/Home";
import Post from "./pages/Post";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/" element={<Post />} />
        <Route path="/post/:id" element={<Post />} />
      </Routes>
      <Toaster position="top-right" />
    </HashRouter>
  );
}

export default App;
