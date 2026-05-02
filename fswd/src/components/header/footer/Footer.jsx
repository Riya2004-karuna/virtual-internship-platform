import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer> 
      <div className="footer-content">
        <p>
          &copy; 2026 Your Internship Platform. All rights reserved.
          <br />
          Made with ❤️ <a href="#">Prajakta & Riya</a>
        </p>

        <div className="social-links">
          <a href="#" aria-label="Facebook">Facebook</a>
          <a href="#" aria-label="Instagram">Instagram</a>
          <a href="#" aria-label="GitHub">GitHub</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
