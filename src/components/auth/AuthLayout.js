import React from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Navigate, Outlet, Link} from "react-router-dom"
import { Button, Navbar, Container } from "react-bootstrap";

export default function AuthLayout() {
  const { currentUser, logout } = useAuth()

  return currentUser !== null ? (
    <>
    <Navbar className="bg-white shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to='/'>Palate Pals</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: {currentUser.email}
          </Navbar.Text>
          <Button className="ml-3" variant="danger" onClick={logout}>Logout</Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
   
      <Outlet />
     </>

  ) : (
    <Navigate to={"/login"} replace />
  );
}
