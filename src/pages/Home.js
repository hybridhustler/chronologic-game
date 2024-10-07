import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Welcome to JS Game Hub</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Chronologic</h2>
          <p className="mb-4">Test your knowledge of historical dates in this challenging puzzle game.</p>
          <Link to="/chronologic" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Play Chronologic</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Chainling</h2>
          <p className="mb-4">Create word chains and challenge your vocabulary in this fast-paced word game.</p>
          <Link to="/chainling" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">Play Chainling</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;