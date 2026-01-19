// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import usePersistLogin from "./hooks/usePersistLogin"; // ← add this

// Pages & Components
import Login from "./components/Login";
import { ComingSoon } from "./components";
import AuthLayout from "./components/AuthLayout";
import App from "./App"; // main layout with Sidebar + Outlet
import { InvoiceViewPage, Unauthorized, EmployeePage, InvoiceFormPage, InvoicePage, DashboardPage } from "./pages";

// Persist Wrapper to handle loading during persist
function PersistWrapper({ children }) {
  const isLoading = usePersistLogin();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return children;
}

const publicRoutes = [
  {
    path: "/login",
    element: (
      <AuthLayout authentication={false}>
        <Login />
      </AuthLayout>
    ),
  },
  {
    path: "/invoice/view/:invoiceNumber",
    element: <InvoiceViewPage />,
  },
];

const commonProtectedRoutes = [
  { index: true, element: <DashboardPage /> },
  { path: "invoices", element: <InvoicePage /> },
  { path: "/employees", element: <EmployeePage /> },
   { path: "invoice/create", element: <InvoiceFormPage /> },
  { path: "invoice/edit/:id", element: <InvoiceFormPage /> },
  {path: "/invoice/view/:invoiceNumber", element: <InvoiceViewPage />} ,
  { path: "invoice/create", element: <InvoiceFormPage /> },
  { path: "invoice/edit/:id", element: <InvoiceFormPage /> },
];

const adminOnlyRoutes = [
  { path: "invoice/create", element: <InvoiceFormPage /> },
  { path: "invoice/edit/:id", element: <InvoiceFormPage /> },
];

const router = createBrowserRouter([
  ...publicRoutes,
  {
    path: "/",
    element: (
      <AuthLayout authentication={true}>
        <App />
      </AuthLayout>
    ),
    children: [
      ...commonProtectedRoutes,
      {
        element: (
          <AuthLayout authentication={true} allowedRoles={["super_admin"]}>
            <App />
          </AuthLayout>
        ),
        children: adminOnlyRoutes,
      },
      { path: "*", element: <ComingSoon /> },
    ],
  },
  { path: "/unauthorized", element: <Unauthorized /> },
  { path: "*", element: <Navigate to="/login" replace /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistWrapper>
        <RouterProvider router={router} />
      </PersistWrapper>
    </Provider>
  </StrictMode>
);