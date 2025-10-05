import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./pages/Header";
import FullimgApp from "./components/HandleImageUpload";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bgwith" element={<FullimgApp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;