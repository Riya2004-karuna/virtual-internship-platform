import React from 'react';
import './footer.css';
import { AiFillFacebook } from "react-icons/ai";
import { FaInstagram } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

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
          <a href="#"><AiFillFacebook /></a>
          <a href="#"><FaInstagram/></a>
          <a href="#"><FaGithub/></a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;