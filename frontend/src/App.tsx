import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Authentication from "./Pages/Authentication";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getLoggedInfoAsync } from "./Redux/Slices/UserAuthSlice";
import Cookies from "js-cookie";
function App() {
  // const [count, setCount] = useState(0);

  const userLoggedData = useSelector(
    (state) => state?.client_auth?.userDetails
  );
  // console.log("userLoggedData - ", userLoggedData);
  const dispatch = useDispatch();
  async function fetch() {
    await dispatch(getLoggedInfoAsync());
  }

  console.log("Cookie token:", Cookies.get("token"));
  console.log("document.cookie:", document.cookie);
  useEffect(() => {
    fetch();

    return () => {};
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/auth" element={<Authentication />} />
      </Routes>
    </Router>
  );
}

export default App;
