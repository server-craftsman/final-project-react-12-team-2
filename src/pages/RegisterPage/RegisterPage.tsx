import image from '../../assets/1.png'; // Import the image
import { Link } from 'react-router-dom';
const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="w-1/2 bg-green-100 p-8 flex flex-col justify-center items-center">
          <Link to="/">
            <img src={image} alt="Study" className="w-3/4 mb-4 ml-10" />
          </Link>
          <h2 className="text-2xl font-bold text-gray-800">Exam Mastery Hub</h2>
          <p className="text-gray-600 mt-2 text-center">
            Unleash Your Academic Success with Exam Mastery Hub's Exam Excellence Platform
          </p>
        </div>
        <div className="w-1/2 p-8">
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-gray-800">Create an Account</h2>
          </div>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="Enter your username"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="Enter your password"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="Confirm your password"
              />
            </div>
            <div className="mb-4">
              <button className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600">
                Register
              </button>
            </div>
            <div className="text-center">
              <span className="text-gray-500">Already have an account? </span>
              <Link to="/login" className="text-green-500 hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
