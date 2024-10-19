import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Welcome to JS Game Hub</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Retronym</h2>
          <p className="mb-4">Create modern terms for old concepts in this fast-paced word game that challenges your linguistic creativity and historical awareness.</p>
          <Link to="/retronym" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Play Retronym</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">NumberFall</h2>
          <p className="mb-4">Tetris meets math in this addictive puzzle game where falling numbers create sums and strategy is key.</p>
          <Link to="/numberfall" className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Play NumberFall</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Blog</h2>
          <p className="mb-4">Read our latest blog posts about game strategies, updates, and more.</p>
          <Link to="/blog" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Visit Blog</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;