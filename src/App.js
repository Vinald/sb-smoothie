import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import supabase from "./config/supabaseClient";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Update from "./pages/Update";
import Login from "./pages/Login";

const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth();
  if (loading) return null;
  return session ? children : <Navigate to="/login" replace />;
};

const Nav = () => {
  const { session } = useAuth();
  return (
    <nav>
      <h1>Supa Smoothies</h1>
      <Link to="/">Home</Link>
      {session ? (
        <>
          <Link to="/create">Create New Smoothie</Link>
          <button className="nav-btn" onClick={() => supabase.auth.signOut()}>
            Logout
          </button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={<ProtectedRoute><Create /></ProtectedRoute>} />
          <Route path="/:id" element={<ProtectedRoute><Update /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
