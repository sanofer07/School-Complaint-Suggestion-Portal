import React from 'react';
import { Link } from 'react-router-dom';
import { FiMessageSquare, FiTrendingUp, FiCheckCircle, FiShield, FiArrowRight } from 'react-icons/fi';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const features = [
  { icon: <FiMessageSquare />, title: 'Submit Complaints', desc: 'Raise issues about infrastructure, academics, transport, safety, and more — with or without your name attached.' },
  { icon: <FiTrendingUp />, title: 'Track Progress', desc: 'Follow your complaint from submission to resolution with a unique ticket ID and live status updates.' },
  { icon: <FiCheckCircle />, title: 'Get Responses', desc: 'Receive direct replies from school management and see exactly what action was taken.' },
  { icon: <FiShield />, title: 'Stay Anonymous', desc: 'Sensitive issue? Submit anonymously and your identity stays protected throughout the process.' },
];

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
            <span className="inline-block bg-white/10 text-primary-100 text-sm font-medium px-4 py-1 rounded-full mb-6">
              Ticket CMP-2026-0001 and counting
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              Your voice, <span className="text-primary-300">heard and tracked</span>
            </h1>
            <p className="mt-6 text-lg text-primary-100 max-w-2xl mx-auto">
              A simple way for students to raise complaints and suggestions, and for school management to respond — transparently, every step of the way.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Link to="/register" className="bg-white text-primary-700 font-semibold px-6 py-3 rounded-lg hover:bg-primary-50 transition flex items-center gap-2">
                Get Started <FiArrowRight />
              </Link>
              <Link to="/login" className="border border-white/40 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition">
                Student Login
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">How the portal helps you</h2>
            <p className="text-gray-500 mt-2">From raising an issue to seeing it resolved.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="card hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center text-2xl mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Status flow */}
        <section className="bg-white border-t border-gray-100 py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-10">Every complaint moves through clear stages</h2>
            <div className="flex flex-wrap justify-center items-center gap-3">
              {['Submitted', 'Under Review', 'In Progress', 'Resolved'].map((s, i) => (
                <React.Fragment key={s}>
                  <span className="px-4 py-2 rounded-full bg-primary-50 text-primary-700 font-medium text-sm">{s}</span>
                  {i < 3 && <FiArrowRight className="text-gray-300" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Ready to make your voice count?</h2>
          <p className="text-gray-500 mt-2">Create your student account and submit your first complaint or suggestion in minutes.</p>
          <Link to="/register" className="btn-primary inline-flex items-center gap-2 mt-6">
            Create Account <FiArrowRight />
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
