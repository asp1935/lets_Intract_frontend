import React, { useEffect, useState } from "react";
import { useAssociateRef } from "../hooks/useAssociate";

const AssociateUserDetails = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("business");
  const [activeTab, setActiveTab] = useState("all");
  const [users, setUsers] = useState([]);

  const { data: userData } = useAssociateRef(selectedCategory)

  useEffect(() => {
    if (userData?.data) {
      setUsers(userData.data)
    }
  }, [userData])


  // Filter users based on active tab
  // const filteredUsers =
  //   activeTab === "all" ? users
  //     : users.filter(user => user.plan.toLowerCase() === activeTab.toLowerCase());

  const filteredUsers =
  activeTab === "all"
    ? users
    : users
        .map(user => ({
          ...user,
          referredUsers: user.referredUsers.filter(refUser =>
            refUser.plan?.type && refUser.plan.type.toLowerCase() === activeTab.toLowerCase()
          )
        }))
        .filter(user => user.referredUsers.length > 0);

      


  return (
    <div className="Form p-6 mt-10 rounded-lg">
      <h2 className="text-3xl text-center font-bold mb-8 text-[#640D5F]" style={{ textShadow: "3px 3px 10px rgba(100, 13, 95, 0.7)" }}>User Details</h2>

      {/* Centered Dropdown for Category Selection */}
      <div className="flex justify-center mb-4">
        <select
          className="w-48 p-2 border-2 border-[#640D5F] rounded-md focus:ring-2 focus:ring-[#640D5F] text-sm text-center"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="business">Business User</option>
          <option value="political">Political User</option>
        </select>
      </div>

      {/* Tabs for All, Basic, Advance */}
      <div className="flex justify-center gap-2 mb-8 mt-10">
        {["all", "basic", "advance"].map(tab => (
          <button
            key={tab}
            className={`w-24 h-10 flex items-center justify-center text-sm font-semibold uppercase transition-all duration-300 rounded-md
              ${activeTab === tab
                ? tab === "all"
                  ? "text-white bg-[#b91bb1] hover:bg-[#fa88f4]" // Active style for "All" tab
                  : tab === "basic"
                    ? "text-white bg-[#b91bb1] hover:bg-[#fa88f4]" // Active style for "Basic" tab
                    : "text-white bg-[#b91bb1] hover:bg-[#fa88f4]" // Active style for "Advance" tab
                : tab === "all"
                  ? "text-[#42093f] bg-[#fddffb] hover:bg-pink-300" // Inactive style for "All" tab
                  : tab === "basic"
                    ? "text-[#42093f] bg-[#fddffb] hover:bg-pink-300" // Inactive style for "Basic" tab
                    : "text-[#42093f] bg-[#fddffb] hover:bg-pink-300" // Inactive style for "Advance" tab
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Search Field */}
      <input
        type="search"
        placeholder="Search User..."
        className="flex justify-center w-50  p-2 border-2 border-[#640D5F] rounded-md mt-11 mb-4 focus:ring-2 focus:ring-[#640D5F] text-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* User List Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg text-sm">
          <thead className="bg-[#c22aba] text-md text-white">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Mobile</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Referred By</th>
              <th className="p-2 border">Plan</th>
              {/* <th className="p-2 border">Paid Amount</th> */}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.flatMap(user =>
                user.referredUsers
                  .filter(refUser =>
                    refUser.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(refUser => (
                    <tr key={refUser._id} className="hover:bg-gray-100 text-center">
                      <td className="p-2 border">{refUser.name}</td>
                      <td className="p-2 border">{refUser.mobile || "N/A"}</td>
                      <td className="p-2 border">{refUser.email || "N/A"}</td>
                      <td className="p-2 border">{user.rname || "N/A"}</td>
                      <td className="p-2 border capitalize" >{refUser.plan?.type || "N/A"}</td>
                      {/* <td className="p-2 border">{refUser.plan?.price || "N/A"}</td> */}
                    </tr>
                  ))
              )
            ) : (
              <tr>
                <td colSpan="6" className="p-2 text-center text-gray-500">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssociateUserDetails;