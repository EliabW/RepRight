import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./components/features/auth/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import RedirectIfAuth from "./components/features/auth/RedirectIfAuth.jsx";
import About from "./pages/About.tsx";
import ExerciseLibrary from "./pages/ExerciseLibrary.tsx";
import LiveSession from "./pages/Livesession.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/about" replace />} />
      {/* Auth routes (shouldn't be visible if logged in) */}
      <Route element={<RedirectIfAuth />}>
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/library" element={<ExerciseLibrary />} />
      </Route>

      <Route element={<ProtectedRoute session={true} />}>
        <Route path="/livesession" element={<LiveSession />} />
      </Route>
    </Routes>
  );
}

export default App;
