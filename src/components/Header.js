import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">JS Game Hub</Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/" className="hover:text-blue-200">Home</Link></li>
            <li><Link to="/about" className="hover:text-blue-200">About</Link></li>
            <li><Link to="/chronologic" className="hover:text-blue-200">Chronologic</Link></li>
            <li><Link to="/chainling" className="hover:text-blue-200">Chainling</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;