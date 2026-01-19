// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";

// function AuthLayout({
//   children,
//   authentication = true,
//   allowedRoles = [],
// }) {
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { authStatus, userData } = useSelector((state) => state.auth);
//   const currentRole = userData?.role;

//   useEffect(() => {
//     // Require login but user not authenticated → redirect to login
//     if (authentication && !authStatus) {
//       navigate("/login", { replace: true, state: { from: location } });
//       setLoading(false);
//       return;
//     }

//     // Authenticated user on public route (login/register) → redirect to dashboard
//     if (!authentication && authStatus) {
//       navigate("/dashboard", { replace: true });
//       setLoading(false);
//       return;
//     }

//     // Authenticated user trying to access login page → redirect to dashboard
//     if (authStatus && location.pathname === "/login") {
//       navigate("/", { replace: true });
//       setLoading(false);
//       return;
//     }

//     // RBAC: Check if user has required role
//     if (authentication && allowedRoles.length > 0) {
//       if (!currentRole || !allowedRoles.includes(currentRole)) {
//         navigate("/unauthorized", { replace: true });
//         setLoading(false);
//         return;
//       }
//     }

//     // All checks passed → render the page
//     setLoading(false);
//   }, [authStatus, currentRole, authentication, allowedRoles, navigate, location.pathname]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <span className="loading loading-bars loading-lg"></span>
//       </div>
//     );
//   }

//   return <>{children}</>;
// }

// export default AuthLayout;



// src/components/AuthLayout.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

function AuthLayout({ children, authentication = true, allowedRoles = [] }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const { authStatus, userData } = useSelector((state) => state.auth);
  const currentRole = userData?.user?.role;

  useEffect(() => {
    // Small delay to prevent flashing
    const timer = setTimeout(() => {
      // Require login but user not authenticated → redirect to login
      if (authentication && !authStatus) {
        navigate("/login", { replace: true, state: { from: location } });
        setLoading(false);
        return;
      }

      // Authenticated user on public route (login/register) → redirect to dashboard
      if (!authentication && authStatus) {
        navigate("/", { replace: true });
        setLoading(false);
        return;
      }

      // Authenticated user trying to access login page → redirect to dashboard
      if (authStatus && location.pathname === "/login") {
        navigate("/", { replace: true });
        setLoading(false);
        return;
      }

      // RBAC: Check if user has required role
      if (authentication && allowedRoles.length > 0) {
        if (!currentRole || !allowedRoles.includes(currentRole)) {
          navigate("/unauthorized", { replace: true });
          setLoading(false);
          return;
        }
      }

      // All checks passed → render the page
      setLoading(false);
    }, 50); // 50ms delay to prevent flash

    return () => clearTimeout(timer);
  }, [authStatus, currentRole, authentication, allowedRoles, navigate, location.pathname]);

  // Show loading screen with minimal flash
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f1f5f9]">
        <span className="loading loading-bars loading-lg text-[#003d7a]"></span>
      </div>
    );
  }

  return <>{children}</>;
}

export default AuthLayout;