import image from '../../assets/register-bg.gif'; // Import the image
import { Link } from 'react-router-dom';
const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#02005d94]">
      <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="w-1/2 bg-[#170656] p-8 flex flex-col justify-center items-center">
          <Link to="/">
            <img src={image} alt="Study" className="w-3/4 mb-4 ml-10" />
          </Link>
          <h2 className="text-2xl font-bold text-white">Edu Learn</h2>
          
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
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#02005d94]"
                placeholder="Enter your username"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#02005d94]"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#02005d94]"
                placeholder="Enter your password"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#02005d94]"
                placeholder="Confirm your password"
              />
            </div>
            <div className="mb-4">
              <button className="w-full bg-[#02005d94] text-white py-2 rounded-md hover:bg-[#02005dc6]">
                Register
              </button>
            </div>
            <div className="text-center">
              <span className="text-gray-500">Already have an account? </span>
              <Link to="/login" className="text-[#02005dc6] hover:underline">
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
