
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";

// function AuthLayout({ children, authentication = true, allowedRoles = [] }) {
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { authStatus, userData } = useSelector((state) => state.auth);
//   const currentRole = userData?.user?.role;

//   useEffect(() => {
//     // Small delay to prevent flashing
//     const timer = setTimeout(() => {
//       // Require login but user not authenticated → redirect to login
//       if (authentication && !authStatus) {
//         navigate("/login", { replace: true, state: { from: location } });
//         setLoading(false);
//         return;
//       }

//       // Authenticated user on public route (login/register) → redirect to dashboard
//       if (!authentication && authStatus) {
//         navigate("/", { replace: true });
//         setLoading(false);
//         return;
//       }

//       // Authenticated user trying to access login page → redirect to dashboard
//       if (authStatus && location.pathname === "/login") {
//         navigate("/", { replace: true });
//         setLoading(false);
//         return;
//       }

//       // RBAC: Check if user has required role
//       if (authentication && allowedRoles.length > 0) {
//         if (!currentRole || !allowedRoles.includes(currentRole)) {
//           navigate("/unauthorized", { replace: true });
//           setLoading(false);
//           return;
//         }
//       }

//       // All checks passed → render the page
//       setLoading(false);
//     }, 50); // 50ms delay to prevent flash

//     return () => clearTimeout(timer);
//   }, [authStatus, currentRole, authentication, allowedRoles, navigate, location.pathname]);

//   // Show loading screen with minimal flash
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-[#f1f5f9]">
//         <span className="loading loading-bars loading-lg text-[#003d7a]"></span>
//       </div>
//     );
//   }

//   return <>{children}</>;
// }

// export default AuthLayout;


import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function AuthLayout({ authentication = true, allowedRoles = [] }) {
  const location = useLocation();
  const { authStatus, userData, isLoading } = useSelector(
    (state) => state.auth
  );

  const currentRole = userData?.user?.role;

  // ✅ 1. Wait until auth is fully resolved
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f1f5f9]">
        <span className="loading loading-bars loading-lg text-[#003d7a]"></span>
      </div>
    );
  }

  // ✅ 2. Public routes (login)
  if (!authentication) {
    return authStatus ? (
      <Navigate to="/" replace />
    ) : (
      <Outlet />
    );
  }

  // ✅ 3. Protected routes (not logged in)
  if (authentication && !authStatus) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // ✅ 4. Role-based access
  if (
    authentication &&
    allowedRoles.length > 0 &&
    (!currentRole || !allowedRoles.includes(currentRole))
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ 5. Authorized → render route
  return <Outlet />;
}

export default AuthLayout;
