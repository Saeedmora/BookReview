import React from 'react';
import Header from '../components/Header.jsx';

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="mb-4">
          Welcome to MyBookApp! This application allows users to search for books, read and write reviews, and mark their favorite reviews.
          Our platform provides an engaging way to discover and share book experiences.
        </p>
        <p>
          As graduates of the WBS Coding School, I and my team member Clara developed this full-stack web application as part of our final project.
          Our project is based on the MERN stack (MongoDB, Express.js, React, and Node.js).
        </p>
      </div>
    </div>
  );
};

export default AboutUsPage;
