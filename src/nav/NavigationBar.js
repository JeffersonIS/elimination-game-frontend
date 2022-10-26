import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../assets/logo.png';
import './nav.css'

function NavigationBar() {
  return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light" className='p-0'>
      <Container>
        <a href="/">
          <img src={logo} className="nav-img" alt="logo" />
        </a>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        <Navbar.Collapse id="responsive-navbar-nav" className='mt-2'>
          <Nav className="auto nav-container">
            <Nav.Link href="/">View Games</Nav.Link>
            <Nav.Link href="/game/create-new-game">Create Game</Nav.Link>
            <Nav.Link href="/manage-data">Manage Data</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;