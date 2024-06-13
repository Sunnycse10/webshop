// components/Layout.js
import Link from 'next/link';
import Head from 'next/head';
import { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';

import { useState, useEffect, MouseEvent } from 'react';
import { useRouter } from 'next/router';
import '../styles/main.css';

const Layout = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount,resetCartCount } = useContext(CartContext);

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  }

  const hideDropdown = () => {
    setIsOpen(false);
  }

  useEffect(() => {
    // Check if the user is authenticated
    // This is just a placeholder, replace it with your actual authentication logic
    const authenticatedUser = JSON.parse(localStorage.getItem('user'));
    setUser(authenticatedUser);
  }, []);

  const handleLogout = () => {
    // Handle user logout
    // This is just a placeholder, replace it with your actual logout logic
    localStorage.removeItem('user');
    resetCartCount();
    router.push('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Perform search action, e.g., redirect to a search results page
    router.push(`/search?query=${searchQuery}`);
  };
  const populateDB = async(e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8000/api/populate-db/", {
      method: 'POST', // Assuming it's a POST request
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (res.ok)
    {
      const message = await res.json();
      alert(message.message);
      handleLogout();
      
      }

  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link href="/" passHref>
            <span className="navbar-brand">webShop</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link text-warning" type="submit" onClick={populateDB}>
                  Populate DB
                </a>
               
              </li>
              {user && (
                <>
                <li className="nav-item">
                  <Link href="/myitems" passHref>
                    <span className="nav-link">My Items</span>
                  </Link>
                  </li>
                  <li className="nav-item">
                  <Link href="/addItem" passHref>
                    <span className="nav-link">Add Item</span>
                  </Link>
                  </li>
                  </>

              )}
              {user && (
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={toggleDropdown}>
                    Edit
                  </a>
                  <div className={`dropdown-menu ${isOpen ? 'show' : ''}`} aria-labelledby="navbarDropdown">
                    <Link className="dropdown-item" href="/editAccount">Edit Acount </Link>
                    <a className="dropdown-item" href="#">Add more feature </a>
                  </div>
                  {isOpen && (
                    <button type="button" // <4>
                      className="modal-backdrop opacity-0"
                      style={{ zIndex: 999, cursor: 'auto' }}
                      onClick={hideDropdown}>
                      Hide dropdown
                    </button>
                  )}
                </li>
              )}
              <li className='nav-item'>
              <form id="searchbar" className="d-flex" onSubmit={handleSearch}>
                <input name="search"
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  />
                <button className="btn btn-warning" type="submit">
                  Search
                </button>
                </form>
                </li>
            </ul>
            <div className="d-flex">
              {user ? (
                <button onClick={handleLogout} className="btn btn-warning">Log out</button>
              ) : (
                <Link href="/login" passHref>
                  <span className="btn btn-warning">Log in</span>
                </Link>
              )}
              <Link href="/cart">
                <img id="cart-icon" src="cart.png" alt="Cart"/>
              </Link>
              <p id="cart-total">{cartCount}</p>
            </div>
          </div>
        </div>
      </nav>
      <div className="container mt-4">
        {children}
      </div>
      <script
        src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
        integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r"
        crossOrigin="anonymous"
      ></script>
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js"
        integrity="sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy"
        crossOrigin="anonymous"
      ></script>
    </div>
  );
};

export default Layout;
