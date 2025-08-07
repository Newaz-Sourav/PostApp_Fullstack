import React, { useState } from 'react';
import { toast } from "react-toastify";
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

const Login = () => {

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    age: ''
  });

  const [LoginerrorMessage, setLoginErrorMessage] = useState('');
  const [RegerrorMessage, setRegErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginErrorMessage('');
    try {
      await axios.post(
        'https://backend-postapp.onrender.com/login',
        loginData,
        { withCredentials: true }
      );
      toast.success("Login successful! Redirecting...");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setLoginErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRegErrorMessage('');
    try {
      await axios.post(
        'https://backend-postapp.onrender.com/register',
        formData,
        { withCredentials: true }
      );
      toast.success("Registration successful! Redirecting...");
      setFormData({ username: '', name: '', email: '', password: '', age: '' });
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      setRegErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 via-blue-200 to-indigo-300 px-6 py-12">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 flex flex-col">
        
        {/* Toggle buttons */}
        <div className="flex mb-8 rounded-xl bg-gray-100 shadow-inner overflow-hidden">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 font-semibold transition-colors duration-300
              ${isLogin ? "bg-indigo-600 text-white shadow-lg" : "text-indigo-700 hover:bg-indigo-100"}`}
            type="button"
            aria-label="Switch to Login"
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 font-semibold transition-colors duration-300
              ${!isLogin ? "bg-indigo-600 text-white shadow-lg" : "text-indigo-700 hover:bg-indigo-100"}`}
            type="button"
            aria-label="Switch to Sign Up"
          >
            Sign Up
          </button>
        </div>

        {/* Form section */}
        <div className="min-h-[480px] flex items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            {isLogin ? (
              <motion.form
                key="login"
                onSubmit={handleLogin}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={formVariants}
                className="flex flex-col gap-5 w-full"
                noValidate
              >
                <div className="flex flex-col gap-2">
                  <label htmlFor="loginEmail" className="text-sm font-medium text-gray-700">Email</label>
                  <input
                    id="loginEmail"
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={e => setLoginData({ ...loginData, [e.target.name]: e.target.value })}
                    placeholder="you@example.com"
                    required
                    className="w-full border border-gray-300 rounded-xl px-5 py-3 text-gray-700 placeholder-gray-400
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    autoComplete="email"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="loginPassword" className="text-sm font-medium text-gray-700">Password</label>
                  <input
                    id="loginPassword"
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={e => setLoginData({ ...loginData, [e.target.name]: e.target.value })}
                    placeholder="••••••••"
                    required
                    className="w-full border border-gray-300 rounded-xl px-5 py-3 text-gray-700 placeholder-gray-400
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    autoComplete="current-password"
                  />
                </div>

                {LoginerrorMessage && (
                  <p className="text-red-600 bg-red-100 px-4 py-2 rounded-xl text-sm text-center font-medium">
                    {LoginerrorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700
                    transition disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center gap-3"
                  aria-busy={loading}
                >
                  {loading && <Loader2 className="animate-spin w-5 h-5" />}
                  {!loading && "Login"}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                onSubmit={handleSubmit}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={formVariants}
                className="flex flex-col gap-4 w-full"
                noValidate
              >
                <div className="flex flex-col gap-2">
                  <label htmlFor="username" className="text-sm font-medium text-indigo-700">Username</label>
                  <input
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="newuser123"
                    required
                    className="w-full border border-indigo-500 bg-indigo-50 text-indigo-900 rounded-xl px-5 py-3
                      placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    autoComplete="username"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-medium text-indigo-700">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full border border-indigo-500 bg-indigo-50 text-indigo-900 rounded-xl px-5 py-3
                      placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    autoComplete="name"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-medium text-indigo-700">Email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="w-full border border-indigo-500 bg-indigo-50 text-indigo-900 rounded-xl px-5 py-3
                      placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    autoComplete="email"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="password" className="text-sm font-medium text-indigo-700">Password</label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    required
                    className="w-full border border-indigo-500 bg-indigo-50 text-indigo-900 rounded-xl px-5 py-3
                      placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    autoComplete="new-password"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="age" className="text-sm font-medium text-indigo-700">Age</label>
                  <input
                    id="age"
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="18"
                    min="1"
                    required
                    className="w-full border border-indigo-500 bg-indigo-50 text-indigo-900 rounded-xl px-5 py-3
                      placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>

                {RegerrorMessage && (
                  <p className="text-red-600 bg-red-100 px-4 py-2 rounded-xl text-sm text-center font-medium">
                    {RegerrorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700
                    transition disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center gap-3"
                  aria-busy={loading}
                >
                  {loading && <Loader2 className="animate-spin w-5 h-5" />}
                  {!loading && "Sign Up"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Login;
