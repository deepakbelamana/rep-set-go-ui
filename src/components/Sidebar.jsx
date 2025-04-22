import { useState } from "react";
import { Offcanvas, Button, Nav } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';

export default function Sidebar() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  return (
    <>
      <Button 
        variant="success" 
        className="profile-icon rounded-circle position-fixed"
        onClick={handleShow}
        style={{
          top: '20px',
          right: '20px',
          width: '40px',
          height: '40px',
          zIndex: '1000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px'
        }}
      >
        <FaUser />
      </Button>

      <Offcanvas 
        show={show} 
        onHide={handleClose}
        placement="end"
        className="bg-dark text-light"
      >
        <Offcanvas.Header closeButton closeVariant="white" className="border-secondary">
          <Offcanvas.Title>Profile</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column gap-3">
            <Button variant="success" className="w-100">
              View Profile
            </Button>
            <Button variant="danger" className="w-100" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
} 