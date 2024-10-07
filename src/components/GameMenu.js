import React from 'react';
import { Link } from 'react-router-dom';

function GameMenu() {
  return (
    <nav>
      <ul>
        <li><Link to="/chronologic">Chronologic</Link></li>
        <li><Link to="/chainling">Chainling</Link></li>
      </ul>
    </nav>
  );
}

export default GameMenu;