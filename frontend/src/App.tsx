import "./App.css";
import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Authentication from "./Pages/Authentication";
import { useSelector } from "react-redux";

function App() {
  // const [count, setCount] = useState(0);

  // const userLoggedData = useSelector(
  //   (state) => state?.client_auth?.userDetails
  // );

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
