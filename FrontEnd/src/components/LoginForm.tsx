
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Checkbox from './UI/Checkbox';
import InputField from './UI/InputField';
import Button from './Button';



const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

//   const handleCheckboxChange = (checked: boolean) => {
//     setFormData({
//       ...formData,
//       rememberMe: checked
//     });
//   };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add authentication logic here
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="w-full max-w-md space-y-8 bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-xl">
        <h2 className="font-poppins text-3xl font-bold text-gray-700">Sign In</h2>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-2">
                Email or phone number
              </label>
              <InputField
                name="email"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                  Password
                </label>
                <div 
                  className="text-sm cursor-pointer text-gray-500 flex items-center"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  <span className="ml-1">{showPassword ? 'Hide' : 'Show'}</span>
                </div>
              </div>
              <div className="relative">
                <InputField
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="text-right mt-1">
                <a href="#" className="underline font-bold text-sm text-gray-600 hover:text-gray-800">
                  Forgot your password?
                </a>
              </div>
            </div>
          </div>

          <Button
            name='Sign In'
            type="submit"
            style="group relative w-full flex justify-center  p-4 border border-transparent text-md font-medium rounded-full text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
    
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox 
                name="remember-me"
                value={formData.rememberMe ? "on" : "off"}
                
                // onCheckedChange={handleCheckboxChange}
                // className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="block text-sm text-gray-600">
                Remember Me
              </label>
            </div>
            <div>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-800">
                Need Help?
              </a>
            </div>
          </div>
          
          <div>
            <p className="text-center text-sm text-gray-600">
              Don't have an account? 
              <Link to="/signup" className="ml-1  text-primary font-bold underline hover:text-gray-600">
                Sign Up
              </Link>
            </p>
          </div>
          
          <div className="relative flex items-center justify-center mt-6">
            <hr className="w-full border-t border-gray-300" />
          </div>
          
          <Button
            type="button"
            name="Continue as a guest"
            style="w-full py-6 border border-gray-300 rounded-md text-gray-500 bg-gray-50 hover:text-gray-600"
          />
        </form>
      </div>
    </div>
  );
};

export default LoginForm;