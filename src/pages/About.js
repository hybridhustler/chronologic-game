import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">About Game Hub</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="mb-4">
          Game Hub is a collection of entertaining and educational games designed to challenge your mind and test your skills. 
          Our games are crafted to provide a fun and engaging experience while also promoting learning and cognitive development.
        </p>
        <p className="mb-4">
          Currently, we offer two exciting games:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li><strong>Chronologic:</strong> A game that tests your knowledge of historical dates and events.</li>
          <li><strong>Chainling:</strong> A word game that challenges your vocabulary and quick thinking.</li>
        </ul>
        <p>
          We're constantly working on new games and features to add to our collection. Stay tuned for updates and new releases!
        </p>
      </div>
    </div>
  );
};

export default About;