import React from 'react';
import { Link } from 'react-router';
import InputField from '../components/UI/InputField';

const RegisterPage = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="min-h-screen flex items-start lg:items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Welcome To Aalam Al-Kutub</h1>
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/signin" className="text-emerald-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="First Name"
              name="firstName"
              type="text"
              required
            />
            <InputField
              label="Last Name"
              name="lastName"
              type="text"
              required
            />
          </div>

          <InputField
            label="Email Address"
            name="email"
            type="email"
            required
          />

          <div className="relative">
            <InputField
              label="Phone number"
              name="phone"
              type="tel"
              className="pl-12"
              required
            />
            <span className="absolute left-3 top-[38px] text-gray-500">+20</span>
          </div>

          <InputField
            label="National ID"
            name="nationalId"
            type="text"
            required
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            required
          />

          <div className="text-sm text-gray-600">
            By creating an account, you agree to our{" "}
            <Link to="/terms" className="text-emerald-600 hover:underline">
              Terms of use
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-emerald-600 hover:underline">
              Privacy Policy
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 text-white rounded-md py-2.5 font-medium hover:bg-emerald-600 transition-colors"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;