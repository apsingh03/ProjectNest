import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Authentication from "./Pages/Authentication";
import ProjectDetail from "./components/ProjectDetail/ProjectDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projectDetail/:projectId" element={<ProjectDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/auth" element={<Authentication />} />
      </Routes>
    </Router>
  );
}

export default App;
