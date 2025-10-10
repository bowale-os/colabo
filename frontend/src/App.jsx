import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useDispatch } from "react-redux"; 
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { getUserInfo } from "./api";
import { AuthProvider, useAuth } from "./AuthContext";


function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { accessToken, setAccessToken } = useAuth();


    useEffect(() => {
    async function checkUser() {
      try {
        const res = await getUserInfo(accessToken, setAccessToken);
        if (res && res.user && res.user._id) {
          setUser(res);
          console.log("User info retrieved:", res);
        } else {
          console.error("No valid user info found");
          setUser(null);
        }
      } catch {
          console.error("No valid user info found");
          setUser(null);
      }
      setLoading(false);
    }
    checkUser();
  }, []);
  

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mb-4 mx-auto">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-600 font-medium">were you already logged in?</p>
        </div>
      </div>
    );
  }

  return (
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/dashboard" element={
              <ProtectedRoute user={user}>
                <Dashboard />
              </ProtectedRoute>
            } />
          </Routes>
      </BrowserRouter>
  );
}
