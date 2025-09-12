import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Home from "./components/Home";
import Tutoring from "./pages/Tutoring";
import Calculator from "./pages/Calculator";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Questions from "./pages/Questions";
import DesmosTutoring from "./components/DesmosTutoring";
import "./Global.css";


export default function App() {
  const [user, setUser] = useState(undefined); // undefined = still checking auth

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsubscribe();
  }, []);

  if (user === undefined) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <Router>
      {user ? (
        <div className="app-container">
          <Sidebar />
          <div className="main-content">
            <Topbar />
            <Routes>
<Route path="/tutoring" element={<DesmosTutoring />} />
              <Route path="/" element={<Home />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/questions" element={<Questions />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}
