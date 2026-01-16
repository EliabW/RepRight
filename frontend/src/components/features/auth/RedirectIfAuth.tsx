import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import LoadingPage from "@/components/common/LoadingPage";

// defaults to dashboard redirect
function RedirectIfAuth({
  redirectTo = "/dashboard",
}: {
  redirectTo?: string;
}) {
  const { isAuthenticated, loading } = useAuth();

  // show loading while checking auth
  if (loading) return <LoadingPage message="Checking authentication..." />;

  // if logged in, redirect
  if (isAuthenticated) return <Navigate to={redirectTo} replace />;

  // otherwise render the wrapped routes
  return <Outlet />;
}

export default RedirectIfAuth;
