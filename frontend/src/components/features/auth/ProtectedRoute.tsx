import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import LoadingPage from "@/components/common/LoadingPage";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

function ProtectedRoute({ session = false }: { session?: unknown }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingPage message="Ensuring authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {!session && (
        <>
          <Header />
          <main className="pt-20">
            <Outlet />
          </main>
          <Footer />
        </>
      )}
      {session && <Outlet />}
    </>
  );
}

export default ProtectedRoute;
