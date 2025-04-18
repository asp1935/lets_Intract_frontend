/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Home, ChevronDown, ChevronRight, Users, Briefcase, Bell, FilePlus, Settings, File, UserPlus, User, User2Icon, SquareUser } from "lucide-react";
import { FaQuestionCircle } from "react-icons/fa";
import "./application.css";
import { NavLink } from 'react-router';
import { useSelector } from "react-redux";
import { user } from "../redux/slice/UserSlice";
const Sidebar = ({ onMenuClick }) => {
  const [isPoliticianOpen, setIsPoliticianOpen] = useState(false);
  const [isBusinessOpen, setIsBusinessOpen] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const [isStaffOpen, setIsStaffOpen] = useState(false);
  const [isAssociateOpen, setIsAssociateOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAssociateDetailsOpen, setIsAssociateDetailsOpen] = useState(false);
  const [isStaffDetailsOpen, setIsStaffDetailsOpen] = useState(false);

  const dropdownVariants = {
    hidden: { opacity: 0, height: 0, overflow: "hidden" },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
  };

  const currentUser = useSelector(user);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);


  const hasPermission = (perm) => {
    if (currentUser.role === "superadmin") {
      return true
    }
    return currentUser?.permissions?.includes(perm);
  }

  useEffect(() => {
    if (currentUser && currentUser.role === 'superadmin') {
      setIsSuperAdmin(true)
    }
    else {
      setIsSuperAdmin(false);
    }
  }, [currentUser])

  return (
    <div className="w-[21vw] sidebar-container min-h-screen bg-gray-100 p-4 shadow-lg fixed top-0 left-0 z-[999]  h-full overflow-y-auto">
      <h2 className="text-2xl sidebar_title font-bold mb-6 text-[#640D5F] text-center" style={{ textShadow: "3px 3px 10px rgba(100, 13, 95, 0.7)" }}>
        ADMIN PANEL
      </h2>

      <ul className="space-y-1">
        {/* Home */}
        <NavLink to='/'>
          <li className="flex items-center py-2 px-3 text-lg font-semibold cursor-pointer hover:bg-[#ebace8] rounded-md" >
            <Home className="w-5 h-5 mr-2 text-blue-600" />
            Home
          </li>
        </NavLink>
        {/* Business Dropdown */}
        {hasPermission('business') && (<li>
          <button className="flex items-center justify-between w-full px-3 hover:bg-[#ebace8] rounded-md transition-all" onClick={() => setIsBusinessOpen(!isBusinessOpen)}>
            <span className="flex py-2 text-lg font-semibold items-center">
              <Briefcase className="w-5 h-5 mr-2 text-yellow-600" />
              Business
            </span>
            {isBusinessOpen ? <ChevronDown /> : <ChevronRight />}
          </button>
          <motion.ul className="ml-4 mt-1 bg-[#fdfcfd] shadow-md rounded-lg" initial="hidden" animate={isBusinessOpen ? "visible" : "hidden"} variants={dropdownVariants}>
            <NavLink to='/business/add'><li className="p-2 cursor-pointer hover:bg-[#ebace8] rounded-md" >Add Customer</li></NavLink>
            <NavLink to='/business/plan'><li className="p-2 cursor-pointer hover:bg-[#ebace8] rounded-md" >Select Plan</li></NavLink>
            <NavLink to='/business/member'><li className="p-2 cursor-pointer hover:bg-[#ebace8] rounded-md" >Employee Management</li></NavLink>
            <NavLink to='/business/updation'><li className="p-2 cursor-pointer hover:bg-[#ebace8] rounded-md" >Customer Updation</li></NavLink>
            <NavLink to='/business/message'><li className="p-2 cursor-pointer hover:bg-[#ebace8] rounded-md" >Create Message</li></NavLink>
          </motion.ul>
        </li>)}

        {/* Politician Dropdown */}
        {hasPermission('politician') && (<li>
          <button className="flex items-center justify-between w-full px-3 hover:bg-[#ebace8] rounded-md transition-all" onClick={() => setIsPoliticianOpen(!isPoliticianOpen)}>
            <span className="flex text-lg font-semibold py-2 items-center">
              <Users className="w-5 h-5 mr-2 text-green-600" />
              Politician
            </span>
            {isPoliticianOpen ? <ChevronDown /> : <ChevronRight />}
          </button>
          <motion.ul className="ml-4 mt-1 bg-[#fdfcfd] shadow-md rounded-lg" initial="hidden" animate={isPoliticianOpen ? "visible" : "hidden"} variants={dropdownVariants}>
            <NavLink to='/politician/add'><li className="p-2 cursor-pointer hover:bg-[#ebace8] rounded-md" > Add Politician</li></NavLink>
            <NavLink to='/politician/plan'> <li className="p-2 cursor-pointer hover:bg-[#ebace8] rounded-md" > Select Plan</li></NavLink>
            <NavLink to='/politician/member'>  <li className="p-2 cursor-pointer hover:bg-[#ebace8] rounded-md" > Member Management</li></NavLink>
            <NavLink to='/politician/updation'><li className="p-2 cursor-pointer hover:bg-[#ebace8] rounded-md" > Politician Updation</li></NavLink>
            <NavLink to='/politician/message'><li className="p-2 cursor-pointer hover:bg-[#ebace8] rounded-md"> Create Message</li></NavLink>
          </motion.ul>
        </li>)}

        {/* Customer Portfolio */}
        {hasPermission('portfolio') && (<li>
          <button className="flex items-center justify-between w-full px-3 hover:bg-[#ebace8] rounded-md transition-all" onClick={() => setIsPortfolioOpen(!isPortfolioOpen)}>
            <span className="flex text-lg font-semibold py-2 items-center">
              <SquareUser className="w-5 h-5 mr-2 text-orange-600" />
              Customer Portfolio
            </span>
            {isPortfolioOpen ? <ChevronDown /> : <ChevronRight />}
          </button>
          <motion.ul className="ml-4 mt-1 bg-[#fdfcfd] shadow-md rounded-lg" initial="hidden" animate={isPortfolioOpen ? "visible" : "hidden"} variants={dropdownVariants}>
            <NavLink to='/portfolio/add'><li className="p-2 cursor-pointer hover:bg-[#ebace8] rounded-md" > New Portfolio</li></NavLink>
            <NavLink to='/portfolio/manage'> <li className="p-2 cursor-pointer hover:bg-[#ebace8] rounded-md" > Manage Portfolios</li></NavLink>
          </motion.ul>
        </li>)}

        {/* Staff Management Dropdown */}
        {hasPermission('staff') && (<li>
          <button className="flex items-center justify-between w-full px-3 hover:bg-[#ebace8] rounded-md transition-all" onClick={() => setIsStaffOpen(!isStaffOpen)}>
            <span className="flex text-lg font-semibold py-2 items-center">
              <User className="w-5 h-5 mr-2 text-pink-600" />
              {isSuperAdmin?'Employee Mnagement':'Staff Management'}
            </span>
            {isStaffOpen ? <ChevronDown /> : <ChevronRight />}
          </button>
          <motion.ul className="ml-4 mt-1 bg-[#fdfcfd] shadow-md rounded-lg" initial="hidden" animate={isStaffOpen ? "visible" : "hidden"} variants={dropdownVariants}>
            <NavLink to='/staff/add'><li className="p-2 cursor-pointer hover:bg-[#ebace8] rounded-md" >{isSuperAdmin?'Add Employee':'Add Staff'}</li></NavLink>
            <NavLink to='/staff/updation'><li className="p-2 cursor-pointer hover:bg-[#ebace8] rounded-md" >{isSuperAdmin?'Employee Updation':'Staff Updation'}</li></NavLink>
          </motion.ul>
        </li>)}

        {/* Associate Management Dropdown */}
        {hasPermission('associate') && (<li>
          <button className="flex items-center justify-between w-full px-3 hover:bg-[#ebace8] rounded-md transition-all" onClick={() => setIsAssociateOpen(!isAssociateOpen)}>
            <span className="flex text-lg font-semibold py-2 items-center">
              <UserPlus className="w-5 h-5 mr-2 text-purple-600" />
              Associate Management
            </span>
            {isAssociateOpen ? <ChevronDown /> : <ChevronRight />}
          </button>
          <motion.ul className="ml-4 mt-1 bg-[#fdfcfd] shadow-md rounded-lg" initial="hidden" animate={isAssociateOpen ? "visible" : "hidden"} variants={dropdownVariants}>
            <NavLink to='/associate/add'><li className="p-2 cursor-pointer hover:bg-[#ebace8] rounded-md" >Add Associate</li></NavLink>
            <NavLink to='/associate/updation'><li className="p-2 cursor-pointer hover:bg-[#ebace8] rounded-md" >Associate Updation</li></NavLink>
          </motion.ul>
        </li>)}

        {/* Account Dropdown */}
        {hasPermission('account') && (<li>
          <button className="flex items-center justify-between w-full px-3 hover:bg-[#ebace8] rounded-md transition-all" onClick={() => setIsAccountOpen(!isAccountOpen)}>
            <span className="flex text-lg font-semibold py-2 items-center">
              <User className="w-5 h-5 mr-2 text-[#640D5F]" />
              Account
            </span>
            {isAccountOpen ? <ChevronDown /> : <ChevronRight />}
          </button>
          <motion.ul className="ml-4 mt-1 bg-[#fdfcfd] shadow-md rounded-lg" initial="hidden" animate={isAccountOpen ? "visible" : "hidden"} variants={dropdownVariants}>
            {/* Staff Dropdown under Account */}
            <li>
              <button className="flex items-center justify-between w-full px-3 hover:bg-[#ebace8] rounded-md transition-all" onClick={() => setIsStaffDetailsOpen(!isStaffDetailsOpen)} >
                <span className="flex text-md font-semibold py-2 items-center">
                  <User className="w-4 h-4 mr-2 text-[#640D5F]" />
                  Staff
                </span>
                {isStaffDetailsOpen ? <ChevronDown /> : <ChevronRight />}
              </button>
              <motion.ul className="ml-4 mt-1 bg-[#fdfcfd] shadow-md rounded-lg" initial="hidden" animate={isStaffDetailsOpen ? "visible" : "hidden"} variants={dropdownVariants}>
                <NavLink to='/account/staff-user-details'><li className="p-2 cursor-pointer hover:bg-[#ebace8] rounded-md" >User  Details</li></NavLink>
                <NavLink to='/account/staff-payout'><li className="p-2 cursor-pointer hover:bg-[#ebace8] rounded-md" >Payout</li></NavLink>
                <NavLink to='/account/staff-payout-setting'><li className="p-2 cursor-pointer hover:bg-[#ebace8] rounded-md">Payout Setting</li></NavLink>
                <NavLink to='/account/staff-history'><li className="p-2 cursor-pointer hover:bg-[#ebace8] rounded-md" >History</li></NavLink>
              </motion.ul>
            </li>
            {/* Associate Dropdown under Account */}
            <li>
              <button className="flex items-center justify-between w-full px-3 hover:bg-[#ebace8] rounded-md transition-all" onClick={() => setIsAssociateDetailsOpen(!isAssociateDetailsOpen)}>
                <span className="flex text-md font-semibold py-2 items-center">
                  <User className="w-4 h-4 mr-2 text-[#640D5F]" />
                  Associate
                </span>
                {isAssociateDetailsOpen ? <ChevronDown /> : <ChevronRight />}
              </button>
              <motion.ul className="ml-4 mt-1 bg-[#fdfcfd] shadow-md rounded-lg" initial="hidden" animate={isAssociateDetailsOpen ? "visible" : "hidden"} variants={dropdownVariants}>
                <NavLink to='/account/associate-user-details'><li className="p-2 cursor-pointer hover:bg-[#ebace8] rounded-md" >User  Details</li></NavLink>
                <NavLink to='/account/associate-payout'><li className="p-2 cursor-pointer hover:bg-[#ebace8] rounded-md" >Payout</li></NavLink>
                <NavLink to='/account/associate-payout-setting'><li className="p-2 cursor-pointer hover:bg-[#ebace8] rounded-md" >Payout Setting</li></NavLink>
                <NavLink to='/account/associate-history'><li className="p-2 cursor-pointer hover:bg-[#ebace8] rounded-md">History</li></NavLink>
              </motion.ul>
            </li>
            <NavLink to='/account/reports'><li className="p-2 cursor-pointer hover:bg-[#ebace8] rounded-md"  >Reports</li></NavLink>
          </motion.ul>
        </li>)}

        {/* Notifications */}
        {hasPermission('notification') && (<NavLink to='/notification'>
          <li className="py-2 flex items-center mt-0 px-3 text-lg font-semibold cursor-pointer hover:bg-[#ebace8] rounded-md" >
            <Bell className="w-5 h-5 mr-2 text-red-600" />
            Notifications
          </li>
        </NavLink>)}


        {/* Configuration */}
        {hasPermission('configuration') && (<NavLink to='/configuration'>
          <li className="py-2 flex items-center mt-0 px-3 text-lg font-semibold cursor-pointer hover:bg-[#ebace8] rounded-md" >
            <Settings className="w-5 h-5 mr-2 text-sky-900" />
            Configuration
          </li>
        </NavLink>)}

        {/* Create Plan */}
        {hasPermission('plan') && (<NavLink to='/create-plan'>
          <li className="py-2 flex items-center px-3 text-lg font-semibold cursor-pointer hover:bg-[#ebace8] rounded-md" >
            <FilePlus className="w-5 h-5 mr-2 text-[#640D5F]" />
            Create Plan
          </li>
        </NavLink>)}

        {/* <NavLink to='/report'>
          <li className="py-2 flex items-center px-3 text-lg font-semibold cursor-pointer hover:bg-[#ebace8] rounded-md" >
            <File className="w-5 h-5 mr-2 text-sky-800" />
            Report
          </li>
        </NavLink> */}

        {hasPermission('enquiry') && (<NavLink to='/enquiry'>
          <li className="py-2 flex items-center px-3 text-lg font-semibold cursor-pointer hover:bg-[#ebace8] rounded-md" >
            <FaQuestionCircle className="w-5 h-5 mr-2 text-orange-500" />
            Enquiry
          </li>
        </NavLink>)}



      </ul>
    </div>
  );
};

export default Sidebar;