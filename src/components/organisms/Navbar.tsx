import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../molecules/AuthContext";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { User, LogOut } from "lucide-react";

interface NavbarProps {
  onSignUpClick: () => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  navBtn: string;
}

const Navbar: React.FC<NavbarProps> = ({ onSignUpClick, mobileNavOpen, setMobileNavOpen, navBtn }) => {
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="w-full border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-3">
        <div className="flex items-center gap-2">
          <Link to="/" className="font-black text-2xl text-black tracking-tight">Qi.</Link>
        </div>
        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 items-center justify-center gap-8">
          <Link to="/" className="text-black font-medium text-base hover:underline">Home</Link>
          <a href="#" className="text-black font-medium text-base hover:underline">Robo Trade or Invest</a>
          <a href="#" className="text-black font-medium text-base hover:underline">Backtester</a>
          <a href="#" className="text-black font-medium text-base hover:underline">QI Dashboard</a>
          <Link to="/dashboard" className="text-black font-medium text-base hover:underline">My Bots Dashboard</Link>
          <Link to="/contact" className="text-black font-medium text-base hover:underline">Contact</Link>
        </nav>
        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden ml-auto p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label="Open navigation menu"
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="hidden md:block ml-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[#19d94b] text-black text-sm font-semibold">
                      {user?.email ? getInitials(user.email) : <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="flex flex-col items-start p-3">
                  <div className="text-sm font-medium text-gray-900">Welcome!</div>
                  <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button onClick={onSignUpClick} className={navBtn}>
              Sign up or Login
            </button>
          )}
        </div>
      </div>
      {/* Mobile Nav Drawer */}
      {mobileNavOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pb-4">
          <nav className="flex flex-col gap-2 mt-2">
            <Link to="/" className="text-black font-medium text-base py-2 hover:underline">Home</Link>
            <a href="#" className="text-black font-medium text-base py-2 hover:underline">Robo Trade or Invest</a>
            <a href="#" className="text-black font-medium text-base py-2 hover:underline">Backtester</a>
            <a href="#" className="text-black font-medium text-base py-2 hover:underline">QI Dashboard</a>
            <Link to="/dashboard" className="text-black font-medium text-base py-2 hover:underline">My Bots Dashboard</Link>
            <Link to="/contact" className="text-black font-medium text-base py-2 hover:underline">Contact</Link>
            {isAuthenticated ? (
              <div className="mt-2">
                <div className="flex items-center gap-2 p-2 border-b border-gray-200">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-[#19d94b] text-black text-xs font-semibold">
                      {user?.email ? getInitials(user.email) : <User className="h-3 w-3" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900">Welcome!</div>
                    <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                  </div>
                </div>
                <button 
                  onClick={handleLogout} 
                  className={navBtn + " mt-2 w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700"}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={onSignUpClick} className={navBtn + " mt-2 w-full"}>
                Sign up or Login
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar; 