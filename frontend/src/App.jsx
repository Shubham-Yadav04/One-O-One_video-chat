/**
    * @description      : 
    * @author           : lenovo
    * @group            : 
    * @created          : 13/09/2025 - 12:04:39
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 13/09/2025
    * - Author          : lenovo
    * - Modification    : 
**/
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import "./App.css";
import HomePage from "./HomePage/HomePage";

import ChatRoom from "./ChatRoom/ChatRoom";
import Login from "./Signing/Login";
import Signup from "./Signing/Signup";
import Dashboard from "./Dashboard/DashBoard";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chatRoom/" element={<ChatRoom />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
