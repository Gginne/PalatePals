import React from "react";
import Signup from "./auth/Signup";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./auth/Login";
import Session from "./Session";
import AuthLayout from "./auth/AuthLayout";


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Protected Routes */}
          
        
        <Route element={<AuthLayout />}>
            
            <Route exact path="/" element={<Dashboard />} />

        
            <Route exact path='/session/:sessionId' element={<Session />} />
            
          
        </Route>
        

          {/* Authentication Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
