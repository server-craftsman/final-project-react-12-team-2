import { Link, useNavigate } from "react-router-dom";
import logo1 from "../../assets/logo1.jpg";
import { FaSearch, FaBars } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTER_URL } from "../../const/router.path";
import { UserRoles } from "../../app/enums";
import { Input, AutoComplete } from 'antd';
import { setCartCount } from "../../app/redux/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/redux/store";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getNewCartCount, updateCartItems } = useCart();
  const { userInfo, logout, token } = useAuth();

  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartCount = useSelector((state: RootState) => state.cart.count);

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

  useEffect(() => {
    const updateCartCount = async () => {
      if (!userInfo || !token) return;
      const count = await getNewCartCount();
      dispatch(setCartCount(count));
    };

    updateCartCount();
  }, [getNewCartCount, dispatch, userInfo, token]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getDashboardLink = () => {
    if (!userInfo) {
      return ROUTER_URL.COMMON.HOME;
    }
    switch (userInfo.role) {
      case UserRoles.ADMIN:
        return ROUTER_URL.ADMIN.BASE;
      case UserRoles.INSTRUCTOR:
        return ROUTER_URL.INSTRUCTOR.BASE;
      case UserRoles.STUDENT:
        return ROUTER_URL.STUDENT.BASE;
      case UserRoles.ALL:
        return ROUTER_URL.COMMON.HOME;
      default:
        return ROUTER_URL.COMMON.HOME;
    }
  };

  const getSettingsLink = () => {
    if (!userInfo) {
      return ROUTER_URL.COMMON.HOME;
    }
    switch (userInfo.role) {
      case UserRoles.ADMIN:
        return ROUTER_URL.ADMIN.INFO;
      case UserRoles.INSTRUCTOR:
        return ROUTER_URL.INSTRUCTOR.SETTING;
      case UserRoles.STUDENT:
        return ROUTER_URL.STUDENT.SETTING;
      default:
        return ROUTER_URL.COMMON.HOME;
    }
  };

  const handleDisplayCart = () => {
    updateCartItems();
    navigate("/cart");
  };

  const handleSearchSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();
    navigate(`/courses/search-courses?keyword=${encodeURIComponent(searchKeyword.trim())}`);
  };

  const handleSearchChange = (value: string) => {
    setSearchKeyword(value);
  };

  const onSelect = (option: any) => {
    setSearchKeyword(option.searchValue);
    navigate(`/courses/search-courses?keyword=${encodeURIComponent(option.searchValue)}`);
  };

  return (
    <nav className="bg-gradient-tone fixed left-0 right-0 top-0 z-50 shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="group flex flex-shrink-0 items-center">
              <div className="relative">
                <img src={logo1} alt="Logo" className="h-10 w-auto rounded-full border-2 shadow-md transition-all duration-300 group-hover:scale-110 sm:h-12 md:h-14" />
                <div className="from-gold absolute inset-0 rounded-full bg-gradient-to-br to-amber-300 opacity-0 transition-opacity duration-300 group-hover:opacity-25"></div>
              </div>
              <span className="ml-3 text-xl font-bold tracking-wide text-white sm:text-2xl">Edu Learn</span>
            </Link>
          </div>
          <div className="hidden items-center space-x-4 lg:flex">
            <div className="hidden lg:block">
              <div className="flex items-baseline space-x-4 lg:space-x-6">
                <Link to="/" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 transition-all duration-200 ease-in-out hover:bg-indigo-700 hover:text-white">
                  Home
                </Link>
                <Link to="/courses/all" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 transition-all duration-200 ease-in-out hover:bg-indigo-700 hover:text-white">
                  Courses
                </Link>
                <Link to="/about" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 transition-all duration-200 ease-in-out hover:bg-indigo-700 hover:text-white">
                  About
                </Link>
                <Link to="/blog" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 transition-all duration-200 ease-in-out hover:bg-indigo-700 hover:text-white">
                  Blog
                </Link>
              </div>
            </div>
            <div className="relative text-white hidden lg:block">
              <form onSubmit={handleSearchSubmit}>
                <AutoComplete
                  value={searchKeyword}
                  options={[]}
                  onSelect={onSelect}
                  className="w-40 lg:w-64"
                  optionRender={(option: any) => option.customLabel || option.label}
                >
                  <Input
                    placeholder="Search..."
                    prefix={
                      <button type="button" onClick={() => handleSearchSubmit()}>
                        <FaSearch className="text-white" />
                      </button>
                    }
                    className="rounded-full bg-[#161d66] px-4 py-2 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#161d66] focus:bg-white focus:text-white ::placeholder-white"
                    style={{ 
                      backgroundColor: '#161d66',
                      color: 'white',
                      
                    }}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </AutoComplete>
              </form>
            </div>
            {userInfo && token && (
              <button onClick={handleDisplayCart} className="relative flex items-center justify-center p-2 bg-indigo-600 rounded-full hover:bg-indigo-700 transition duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
            {userInfo ? (
              <div className="group relative">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={userInfo.avatar_url || `https://ui-avatars.com/api/?name=${userInfo.name[0]}`}
                      alt="Avatar"
                      className="h-10 w-10 rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${userInfo.name[0]}`;
                      }}
                    />
                    <div className="from-gold absolute -inset-0.5 rounded-full bg-gradient-to-br to-amber-300 opacity-20"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="hover:text-gold font-medium tracking-wide text-white transition-colors duration-200">{userInfo.name}</span>
                    <span className="text-sm text-gray-300 transition-colors duration-200 hover:text-amber-200">{userInfo.email}</span>
                  </div>
                </div>
                <div className="invisible absolute right-0 mt-2 w-48 rounded-md bg-white opacity-0 shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-in-out group-hover:visible group-hover:opacity-100">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <Link to={getDashboardLink()} className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900" role="menuitem">
                      My Dashboard
                    </Link>
                    <Link to={getSettingsLink()} className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900" role="menuitem">
                      Settings
                    </Link>
                    <button onClick={logout} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900" role="menuitem">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="bg-btn">
                  Login
                </Link>
                <Link to="/register" className="bg-btn">
                  Sign Up
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center lg:hidden">
            <button onClick={toggleMenu} className="from-gold hover:from-gold-dark inline-flex transform items-center justify-center rounded-full bg-gradient-to-r to-amber-500 p-3 text-white shadow-lg transition-all duration-500 ease-in-out hover:scale-110 hover:to-amber-600 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-gray-800">
              <span className="sr-only">Open main menu</span>
              <FaBars className="block h-8 w-8" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            <Link to="/" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-indigo-700 hover:text-white">
              Home
            </Link>
            <Link to="/courses/all" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-indigo-700 hover:text-white">
              Courses
            </Link>
            <Link to="/about" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-indigo-700 hover:text-white">
              About
            </Link>
            {userInfo ? (
              <>
                <Link to="/cart" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-indigo-700 hover:text-white">
                  Cart
                </Link>
                <Link to={getDashboardLink()} className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-indigo-700 hover:text-white">
                  My Dashboard
                </Link>
                <Link to={getSettingsLink()} className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-indigo-700 hover:text-white">
                  Settings
                </Link>
                <button onClick={logout} className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-300 hover:bg-indigo-700 hover:text-white">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-indigo-700 hover:text-white">
                  Login
                </Link>
                <Link to="/register" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-indigo-700 hover:text-white">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
