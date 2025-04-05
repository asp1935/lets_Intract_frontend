import React, { useState, useEffect } from "react";
import { useUserPlan } from "../hooks/useUser";
import { formatDate } from "../utility/formatDate";

const Notification = () => {
  const [expiringCustomers, setExpiringCustomers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("business");
  const [users, setUsers] = useState([]);

  const { data: customerData } = useUserPlan(null);

  // Load user data
  useEffect(() => {
    if (customerData?.data) {
      setUsers(customerData.data);
    }
  }, [customerData]);

  // Filter and sort users based on category and expiry date
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date

    const upcomingExpirations = users
      .filter((user) => {
        if (user.type !== selectedCategory) return false;

        const expiryDate = user.userPlans?.endDate ? new Date(user.userPlans.endDate) : null;
        return expiryDate && expiryDate >= today;
      })
      .sort((a, b) => new Date(a.userPlans?.endDate) - new Date(b.userPlans?.endDate)); // Sort by expiry date

    setExpiringCustomers(upcomingExpirations);
  }, [selectedCategory, users]);

  // Function to determine expiry date color
  const getExpiryColor = (expiryDate) => {
    if (!expiryDate) return "text-gray-500";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expDate = new Date(expiryDate);
    if (isNaN(expDate)) return "text-gray-500"; // Handle invalid date

    const daysRemaining = Math.floor((expDate - today) / (1000 * 60 * 60 * 24));

    if (daysRemaining <= 7) return "text-red-500 font-bold"; // Urgent (red)
    if (daysRemaining <= 28) return "text-yellow-500 font-semibold"; // Warning (yellow)
    return "text-green-500 font-medium"; // Safe (green)
  };

  return (
    <div className="Form p-6 mx-auto rounded-lg mt-10">
      <h1
        className="text-3xl font-bold text-center text-[#640D5F] mb-4"
        style={{ textShadow: "3px 3px 10px rgba(100, 13, 95, 0.7)" }}
      >
        Expiring Plans
      </h1>

      {/* Dropdown for category selection */}
      <div className="mb-4 text-center">
        <label className="mr-2 font-semibold">Select Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="business">Business</option>
          <option value="political">Politician</option>
        </select>
      </div>

      {expiringCustomers.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#b017a8] text-white uppercase text-sm leading-normal">
              <th className="border p-3 text-left">Name</th>
              <th className="border p-3 text-left">Email</th>
              <th className="border p-3 text-left">Mobile</th>
              <th className="border p-3 text-left">Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {expiringCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-[#f1d5ef]">
                <td className="border p-3">{customer.name}</td>
                <td className="border p-3">{customer.email}</td>
                <td className="border p-3">{customer.mobile}</td>
                <td className={`border p-3 ${getExpiryColor(customer.userPlans?.endDate)}`}>
                  {formatDate(customer.userPlans?.endDate ) || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600 text-center">No expiring plans found.</p>
      )}
    </div>
  );
};

export default Notification;
