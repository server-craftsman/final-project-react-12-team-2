import { Link } from 'react-router-dom'
import logo from '../../assets/logo.jpg'
import { FaSearch, FaBell, FaUserCircle, FaBars } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { useCart } from '../../context/CartContext'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cartItems } = useCart()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [isMenuOpen])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-gradient-tone shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 group flex items-center">
              <div className="relative">
                <img className="h-10 w-auto sm:h-12 md:h-14 rounded-full border-2 border-gold transition-all duration-300 group-hover:scale-110 shadow-md" src={logo} alt="Logo" />
                <div className="absolute inset-0 bg-gradient-to-br from-gold to-amber-300 opacity-0 group-hover:opacity-25 rounded-full transition-opacity duration-300"></div>
              </div>
              <span className="ml-3 text-xl sm:text-2xl font-bold text-white tracking-wide">Edu Learn</span>
            </Link>
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            <div className="hidden lg:block">
              <div className="flex items-baseline space-x-4 lg:space-x-6">
                <Link to="/" className="text-gray-300 hover:bg-indigo-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out">Home</Link>
                <div className="relative group">
                  <button className="text-gray-300 hover:bg-indigo-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out">
                    Courses
                  </button>
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <Link to="/courses/all" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900" role="menuitem">All Courses</Link>
                      <Link to="/courses/my-courses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900" role="menuitem">My Courses</Link>
                      <Link to="/courses/popular" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900" role="menuitem">Popular Courses</Link>
                    </div>
                  </div>
                </div>
                <Link to="/about" className="text-gray-300 hover:bg-indigo-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out">About</Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <input type="text" placeholder="Search..." className="bg-indigo-800 text-white placeholder-gray-400 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-40 lg:w-64" />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <Link to="/cart" className="text-gray-300 hover:text-white relative hidden lg:block">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <Link to="/login" className="bg-gradient-to-r from-[#8529ff] to-[#5e17eb] hover:from-[#7020d9] hover:to-[#4c11c2] text-white font-medium py-2 px-4 lg:px-6 rounded-full text-sm transition-all duration-200 ease-in-out shadow-md hover:shadow-lg hidden lg:inline-block">
              Login
            </Link>
            <Link to="/register" className="bg-gradient-to-r from-[#ffd700] to-[#ffa500] hover:from-[#ffcc00] hover:to-[#ff9500] text-indigo-900 font-medium py-2 px-4 lg:px-6 rounded-full text-sm transition-all duration-200 ease-in-out shadow-md hover:shadow-lg hidden lg:inline-block">
              Signup
            </Link>
            <button className="text-gray-300 hover:text-white hidden lg:block">
              <FaUserCircle className="h-8 w-8" />
            </button>
          </div>
          <div className="lg:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              <FaBars className="block h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="text-gray-300 hover:bg-indigo-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</Link>
            <Link to="/courses/all" className="text-gray-300 hover:bg-indigo-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">All Courses</Link>
            <Link to="/courses/my-courses" className="text-gray-300 hover:bg-indigo-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">My Courses</Link>
            <Link to="/courses/popular" className="text-gray-300 hover:bg-indigo-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Popular Courses</Link>
            <Link to="/about" className="text-gray-300 hover:bg-indigo-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">About</Link>
          </div>
          <div className="pt-4 pb-3 border-t border-indigo-700">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <FaUserCircle className="h-10 w-10 text-gray-300" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium leading-none text-white">User Name</div>
                <div className="text-sm font-medium leading-none text-gray-400">user@example.com</div>
              </div>
              <button className="ml-auto bg-indigo-800 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                <span className="sr-only">View notifications</span>
                <FaBell className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-indigo-700">Your Profile</Link>
              <Link to="/settings" className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-indigo-700">Settings</Link>
              <Link to="/logout" className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-indigo-700">Sign out</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
