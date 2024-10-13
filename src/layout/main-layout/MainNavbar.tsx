import { Link } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import { FaSearch, FaBell, FaUserCircle, FaBars } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems } = useCart();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-tone fixed left-0 right-0 top-0 z-50 shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="group flex flex-shrink-0 items-center">
              <div className="relative">
                <img
                  className="border-gold h-10 w-auto rounded-full border-2 shadow-md transition-all duration-300 group-hover:scale-110 sm:h-12 md:h-14"
                  src={logo}
                  alt="Logo"
                />
                <div className="from-gold absolute inset-0 rounded-full bg-gradient-to-br to-amber-300 opacity-0 transition-opacity duration-300 group-hover:opacity-25"></div>
              </div>
              <span className="ml-3 text-xl font-bold tracking-wide text-white sm:text-2xl">
                Edu Learn
              </span>
            </Link>
          </div>
          <div className="hidden items-center space-x-4 lg:flex">
            <div className="hidden lg:block">
              <div className="flex items-baseline space-x-4 lg:space-x-6">
                <Link
                  to="/"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 transition-all duration-200 ease-in-out hover:bg-indigo-700 hover:text-white"
                >
                  Home
                </Link>
                <div className="group relative">
                  <button className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 transition-all duration-200 ease-in-out hover:bg-indigo-700 hover:text-white">
                    Courses
                  </button>
                  <div className="invisible absolute left-0 mt-2 w-48 rounded-md bg-white opacity-0 shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-in-out group-hover:visible group-hover:opacity-100">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      <Link
                        to="/courses/all"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900"
                        role="menuitem"
                      >
                        All Courses
                      </Link>
                      <Link
                        to="/courses/my-courses"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900"
                        role="menuitem"
                      >
                        My Courses
                      </Link>
                      <Link
                        to="/courses/popular"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900"
                        role="menuitem"
                      >
                        Popular Courses
                      </Link>
                    </div>
                  </div>
                </div>
                <Link
                  to="/about"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 transition-all duration-200 ease-in-out hover:bg-indigo-700 hover:text-white"
                >
                  About
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <input
                type="text"
                placeholder="Search..."
                className="w-40 rounded-full bg-indigo-800 px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 lg:w-64"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
            </div>
            <Link
              to="/cart"
              className="relative hidden text-gray-300 hover:text-white lg:block"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              {cartItems.length > 0 && (
                <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <Link
              to="/login"
              className="hidden rounded-full bg-gradient-to-r from-[#8529ff] to-[#5e17eb] px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 ease-in-out hover:from-[#7020d9] hover:to-[#4c11c2] hover:shadow-lg lg:inline-block lg:px-6"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="hidden rounded-full bg-gradient-to-r from-[#ffd700] to-[#ffa500] px-4 py-2 text-sm font-medium text-indigo-900 shadow-md transition-all duration-200 ease-in-out hover:from-[#ffcc00] hover:to-[#ff9500] hover:shadow-lg lg:inline-block lg:px-6"
            >
              Signup
            </Link>
            <button className="hidden text-gray-300 hover:text-white lg:block">
              <FaUserCircle className="h-8 w-8" />
            </button>
          </div>
          <div className="flex items-center lg:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-indigo-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span className="sr-only">Open main menu</span>
              <FaBars className="block h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            <Link
              to="/"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-indigo-700 hover:text-white"
            >
              Home
            </Link>
            <Link
              to="/courses/all"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-indigo-700 hover:text-white"
            >
              All Courses
            </Link>
            <Link
              to="/courses/my-courses"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-indigo-700 hover:text-white"
            >
              My Courses
            </Link>
            <Link
              to="/courses/popular"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-indigo-700 hover:text-white"
            >
              Popular Courses
            </Link>
            <Link
              to="/about"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-indigo-700 hover:text-white"
            >
              About
            </Link>
          </div>
          <div className="border-t border-indigo-700 pb-3 pt-4">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <FaUserCircle className="h-10 w-10 text-gray-300" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium leading-none text-white">
                  User Name
                </div>
                <div className="text-sm font-medium leading-none text-gray-400">
                  user@example.com
                </div>
              </div>
              <button className="ml-auto flex-shrink-0 rounded-full bg-indigo-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="sr-only">View notifications</span>
                <FaBell className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-3 space-y-1 px-2">
              <Link
                to="/profile"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-indigo-700 hover:text-white"
              >
                Your Profile
              </Link>
              <Link
                to="/settings"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-indigo-700 hover:text-white"
              >
                Settings
              </Link>
              <Link
                to="/logout"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-indigo-700 hover:text-white"
              >
                Sign out
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
