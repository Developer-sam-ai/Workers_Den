import { useState } from "react";
import logoimg from "./images.png";

function Navbar({ onSignupClick, onLoginClick }) {
  const [hovered, setHovered] = useState(null);

  return (
    <nav className="flex items-center justify-between bg-slate-900 px-6 py-4">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <img src={logoimg} alt="WorkersDen Logo" className="h-8 w-auto object-contain" />
        <span className="text-xl font-bold text-white tracking-wide">WorkersDen</span>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-8 text-white">
        <div className="cursor-pointer transition-colors hover:text-gray-300">
          why WorkersDen?
        </div>
        <div className="cursor-pointer transition-colors hover:text-gray-300">
          explore
        </div>
        <div className="cursor-pointer transition-colors hover:text-gray-300">
          Categories
        </div>
      </div>

      <div className="button-group">
    <button
      type="button"
      onMouseEnter={() => setHovered('signup')}
      onMouseLeave={() => setHovered(null)}
      className={`taskbar-btn ${hovered === 'signup' ? 'hovered' : ''}`}
    >
      signup
    </button>
    
    <button
      type="button"
      onMouseEnter={() => setHovered('login')}
      onMouseLeave={() => setHovered(null)}
      className={`taskbar-btn ${hovered === 'login' ? 'hovered' : ''}`}
    >
      LogIn
    </button>
  </div>
    </nav>
  );
}

export default Navbar;