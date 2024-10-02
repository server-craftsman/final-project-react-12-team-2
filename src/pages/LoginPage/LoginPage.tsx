import { Link } from 'react-router-dom';
// import image from '../../assets/1.png';
import google from '../../assets/2.png';
import gif from '../../assets/login-bg.gif';
const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#02005d94]">
      <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="w-1/2 bg-[#170656] p-8 flex flex-col justify-center items-center">
          <Link to="/">
            <img src={gif} alt="Study" className="w-3/4 mb-4 ml-20 rounded-full" />
          </Link>
          <h2 className="text-2xl font-bold text-white">Edu Learn</h2>
          
        </div>
        <div className="w-1/2 p-8">
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-gray-800">Login</h2>
          </div>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700">Username or email</label>
              <input
                type="text"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#02005dc6]"
                placeholder="Please enter your username or email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#02005dc6]"
                placeholder="Please enter your password"
              />
            </div>
            <div className="flex justify-between items-center mb-4">
              <a href="#" className="text-sm text-[#02005dc6] hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="mb-4">
              <button className="w-full bg-[#02005dc6] text-white py-2 rounded-md hover:bg-[#02005dc6]">
                Sign in
              </button>
            </div>
            <div className="flex items-center justify-center mb-4">
              <span className="text-gray-500">or</span>
            </div>
            <div className="mb-4">
              <button className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-md flex items-center justify-center hover:bg-gray-100">
                <img src={google} alt="Google" className="w-5 h-5 mr-2 rounded-full" />
                Sign in with Google
              </button>
            </div>
            <div className="text-center">
              <span className="text-gray-500">Are you new? </span>
              <Link to="/register" className="text-[#02005dc6] hover:underline">
                Create an Account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
