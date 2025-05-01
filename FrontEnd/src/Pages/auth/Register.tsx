import React from 'react';
import { Link } from 'react-router-dom';
import InputField from '../../components/UI/InputField';
import TelInput from '../../components/UI/TelInput';

const Register = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="flex justify-center flex-1 gap-32">
        <div className="p-8 self-center">
            <div className="space-y-2 mb-5">
                <h1 className="text-5xl font-poppins italic font-bold text-primary">Welcome To Aalam Al-Kutub</h1>
                <p className="text-gray-600">
                    Already have an account? {" "}
                    <Link to="/signin" className="text-emerald-600 hover:underline">Log in</Link>
                </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 flex flex-col">
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

                <TelInput />

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
                    className="w-fit px-8 bg-emerald-500 text-white rounded-full py-2.5 font-medium hover:bg-emerald-600 transition-colors"
                >
                    Sign Up
                </button>
            </form>
        </div>
        <div className='w-3/12 h-full'>
            <img src="/Image/books_background.jpg" alt="books" className='h-full object-cover object-right' />
        </div>
    </div>
  );
};

export default Register;