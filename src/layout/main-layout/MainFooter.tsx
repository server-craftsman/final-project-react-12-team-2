import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope } from "react-icons/fa";

const StudentFooter: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="bg-gradient-to-r from-[#02005dc6] to-[#1a237e] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-3xl font-extrabold">
              <span className="mr-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-purple-500">Edu</span>
              <span className="relative">
                <span className="animate-pulse text-white">Learn</span>
                <span className="from-gold absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 transform bg-gradient-to-r to-amber-300 transition-transform duration-300 group-hover:scale-x-100"></span>
              </span>
            </h3>
            <p className="text-sm">Elevating your learning experience with cutting-edge online education.</p>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-gold transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-gold transition-colors duration-300">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold transition-colors duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold transition-colors duration-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-semibold">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="hover:text-gold transition-colors duration-300">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-gold transition-colors duration-300">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-gold transition-colors duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-gold transition-colors duration-300">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-semibold">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gold transition-colors duration-300">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="hover:text-gold transition-colors duration-300">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="hover:text-gold transition-colors duration-300">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="hover:text-gold transition-colors duration-300">
                <FaLinkedin size={24} />
              </a>
            </div>
            <Link to="/contact" className="bg-gold mt-4 inline-flex transform items-center rounded from-purple-500 to-pink-500 px-4 py-2 text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-gradient-to-r hover:shadow-lg">
              <FaEnvelope className="mr-2 animate-pulse" />
              <span className="font-semibold">Contact Us</span>
            </Link>
          </div>
        </div>
        <div className="mt-8 border-t border-indigo-700 pt-8 text-center">
          <p>
            &copy; {new Date().getFullYear()}
            <Link to="/" className="hover:text-gold transition-colors duration-300" onClick={scrollToTop}>
              <span className="ml-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Edu Learn. </span>
            </Link>
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default StudentFooter;
