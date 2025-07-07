import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaSignOutAlt } from 'react-icons/fa';
import { resetState } from '../../redux/slice/userslice';
import './header.css';

function Header() {
  const { loginUserStatus } = useSelector(state => state.userLogin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signOut = () => {
    dispatch(resetState());
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Navbar className="header" expand="lg">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="nav-link brand-text">
          VJKHOJ
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="navbar-collapse">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="nav-link">Home</Nav.Link>
            {!loginUserStatus ? (
              <>
                <Nav.Link as={Link} to="/login" className="nav-link">Login</Nav.Link>
                <Nav.Link as={Link} to="/register" className="nav-link">Register</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/chat" className="nav-link">Chat</Nav.Link>
                <Nav.Link onClick={signOut} className="nav-link d-flex align-items-center">
                  <FaSignOutAlt style={{ marginRight: '5px' }} />
                  Logout
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
