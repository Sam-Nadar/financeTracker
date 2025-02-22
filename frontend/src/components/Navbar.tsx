// frontend/src/components/Navbar.tsx

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  // Define the menu items as a fragment so we can reuse them
  const menuItems = (
    <>
      <NavLink
        to="/transaction"
        className={({ isActive }) =>
          isActive
            ? 'text-white text-xl font-semibold border-b-2 border-white pb-1'
            : 'text-white text-xl hover:font-semibold'
        }
      >
        Transactions
      </NavLink>
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          isActive
            ? 'text-white text-xl font-semibold border-b-2 border-white pb-1'
            : 'text-white text-xl hover:font-semibold'
        }
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/budget"
        className={({ isActive }) =>
          isActive
            ? 'text-white text-xl font-semibold border-b-2 border-white pb-1'
            : 'text-white text-xl hover:font-semibold'
        }
      >
        Budget
      </NavLink>
      <NavLink
        to="/charts"
        className={({ isActive }) =>
          isActive
            ? 'text-white text-xl font-semibold border-b-2 border-white pb-1'
            : 'text-white text-xl hover:font-semibold'
        }
      >
        Charts
      </NavLink>
    </>
  );

  return (
    <nav className="bg-blue-500 px-6 py-4 flex justify-between items-center relative">
      {/* Logo */}
      <div className="text-white text-2xl font-bold">PFT</div>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6">{menuItems}</div>

      {/* Hamburger for Mobile */}
      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-white focus:outline-none">
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-blue-500 flex flex-col items-center space-y-4 py-4 md:hidden">
          {menuItems}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
