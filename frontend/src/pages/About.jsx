import React from 'react';
import { FiTarget, FiUsers, FiLock } from 'react-icons/fi';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-4">About the Portal</h1>
        <p className="text-gray-600 text-lg mb-10">
          The School Complaint &amp; Suggestion Portal gives every student a direct, trackable channel to raise issues
          and share ideas with school management — no more lost forms or unanswered emails.
        </p>

        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          <div className="card">
            <FiTarget className="text-3xl text-primary-600 mb-3" />
            <h3 className="font-semibold text-gray-800 mb-1">Our Purpose</h3>
            <p className="text-sm text-gray-500">Give students a structured way to be heard, and give management a clear queue of what needs attention.</p>
          </div>
          <div className="card">
            <FiUsers className="text-3xl text-primary-600 mb-3" />
            <h3 className="font-semibold text-gray-800 mb-1">Who It's For</h3>
            <p className="text-sm text-gray-500">Every enrolled student, and the headmaster's office responsible for reviewing and resolving issues.</p>
          </div>
          <div className="card">
            <FiLock className="text-3xl text-primary-600 mb-3" />
            <h3 className="font-semibold text-gray-800 mb-1">Privacy First</h3>
            <p className="text-sm text-gray-500">Choose to submit anonymously at any time — your name is never shown unless you allow it.</p>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-3">How it works</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Register for a student account using your school email.</li>
            <li>Submit a complaint or suggestion, choosing a category and priority.</li>
            <li>Receive a unique ticket ID (e.g. CMP-2026-0001) to track your submission.</li>
            <li>Watch the status update as the school management reviews and acts on it.</li>
            <li>Read direct replies from the admin team on your complaint thread.</li>
          </ol>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
