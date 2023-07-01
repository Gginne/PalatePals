import React from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Navigate, Outlet } from "react-router-dom"
import { Button, Navbar } from "react-bootstrap";

export default function AuthLayout() {
  const { currentUser, logout } = useAuth()

  return currentUser !== null ? (
    <>
    <Navbar className="bg-white shadow-sm d-flex align-items-center justify-content-between" data-bs-theme="dark">
      <h3>{currentUser.email}</h3>
      <Button variant="danger" onClick={logout}>Logout</Button>
    </Navbar>
      <Outlet />
     </>

  ) : (
    <Navigate to={"/login"} replace />
  );
}
