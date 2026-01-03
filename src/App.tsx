import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import PageTransition from "./components/layout/PageTransition";
import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen w-full">
        <Navbar />
        <PageTransition>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </PageTransition>
      </div>
    </Router>
  );
}
