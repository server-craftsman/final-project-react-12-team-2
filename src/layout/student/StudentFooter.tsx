import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const StudentFooter: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-[#02005dc6] to-[#1a237e] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Edu Learn</h3>
            <p className="text-sm">Elevating your learning experience with cutting-edge online education.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-gold transition-colors duration-300">Home</Link></li>
              <li><Link to="/courses" className="hover:text-gold transition-colors duration-300">Courses</Link></li>
              <li><Link to="/about" className="hover:text-gold transition-colors duration-300">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-gold transition-colors duration-300">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/faq" className="hover:text-gold transition-colors duration-300">FAQ</Link></li>
              <li><Link to="/help" className="hover:text-gold transition-colors duration-300">Help Center</Link></li>
              <li><Link to="/privacy" className="hover:text-gold transition-colors duration-300">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-gold transition-colors duration-300">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gold transition-colors duration-300"><FaFacebook size={24} /></a>
              <a href="#" className="hover:text-gold transition-colors duration-300"><FaTwitter size={24} /></a>
              <a href="#" className="hover:text-gold transition-colors duration-300"><FaInstagram size={24} /></a>
              <a href="#" className="hover:text-gold transition-colors duration-300"><FaLinkedin size={24} /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-indigo-700 text-center">
          <p>&copy; {new Date().getFullYear()} Edu Learn. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default StudentFooter;
