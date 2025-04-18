import React, { useState, useEffect, useMemo } from "react";
import { useUserPlan } from "../hooks/useUser";
import { formatDate } from "../utility/formatDate";

const Notification = () => {
  const [selectedCategory, setSelectedCategory] = useState("business");
  const [users, setUsers] = useState([]);

  const { data: customerData, isLoading, error } = useUserPlan(null);

  // Load user data
  useEffect(() => {
    if (customerData?.data) {
      setUsers(customerData.data);
    }
  }, [customerData]);

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  // Customers with active plans that are expiring in future
  const expiringCustomers = useMemo(() => {
    return users
      .filter((user) => {
        if (user.type !== selectedCategory) return false;

        const endDate = user.userPlans?.endDate ? new Date(user.userPlans.endDate) : null;
        return endDate && endDate >= today;
      })
      .sort((a, b) => new Date(a.userPlans?.endDate || 0) - new Date(b.userPlans?.endDate || 0));
  }, [selectedCategory, users, today]);

  // Customers with expired or missing plans
  const expiredCustomers = useMemo(() => {
    return users
      .filter((user) => {
        if (user.type !== selectedCategory || user.role!=='user') return false;

        const endDate = user.userPlans?.endDate ? new Date(user.userPlans.endDate) : null;
        return !endDate || endDate < today;
      })
      .sort((a, b) => new Date(b.userPlans?.endDate || 0) - new Date(a.userPlans?.endDate || 0));
  }, [selectedCategory, users, today]);

  const getExpiryColor = (expiryDate) => {
    if (!expiryDate) return "text-gray-500";

    const expDate = new Date(expiryDate);
    if (isNaN(expDate)) return "text-gray-500";

    const daysRemaining = Math.floor((expDate - today) / (1000 * 60 * 60 * 24));

    if (daysRemaining <= 7) return "text-red-500 font-bold";
    if (daysRemaining <= 28) return "text-yellow-500 font-semibold";
    return "text-green-500 font-medium";
  };

  return (
    <div className="For p-6 mx-auto rounded-lg ">
      <h1
        className="text-3xl font-bold text-center text-[#640D5F] mb-6"
        style={{ textShadow: "3px 3px 10px rgba(100, 13, 95, 0.7)" }}
      >
        Expiring Plans
      </h1>

      {/* Dropdown for category selection */}
      <div className="mb-6 text-center">
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

      {/* Loading / Error */}
      {isLoading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">Failed to load user data.</p>
      ) : (
        <>
          {/* Expiring Customers */}
          <section className="">
            <h2 className="text-2xl font-semibold mb-5 text-[#640D5F] text-center">Expiring Soon</h2>
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
                    <tr key={customer._id} className="hover:bg-[#f1d5ef]">
                      <td className="border p-3">{customer.name}</td>
                      <td className="border p-3">{customer.email}</td>
                      <td className="border p-3">{customer.mobile}</td>
                      <td className={`border p-3 ${getExpiryColor(customer.userPlans?.endDate)}`}>
                        {formatDate(customer.userPlans?.endDate) || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600 text-center">No expiring plans found.</p>
            )}
          </section>

          {/* Expired Customers */}
          <section>
            <h2 className="text-2xl font-semibold mb-5 text-[#640D5F] text-center ">Expired Plans</h2>
            {expiredCustomers.length > 0 ? (
              <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-[#640D5F] text-white uppercase text-sm leading-normal">
                    <th className="border p-3 text-left">Name</th>
                    <th className="border p-3 text-left">Email</th>
                    <th className="border p-3 text-left">Mobile</th>
                    {/* <th className="border p-3 text-left">Last Expiry Date</th> */}
                  </tr>
                </thead>
                <tbody>
                  {expiredCustomers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-[#f8e6f5]">
                      <td className="border p-3">{customer.name}</td>
                      <td className="border p-3">{customer.email}</td>
                      <td className="border p-3">{customer.mobile}</td>
                      {/* <td className="border p-3 text-gray-400 italic">
                        {formatDate(customer.userPlans?.endDate) || "Expired (No Plan)"}
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600 text-center">No expired plans found.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Notification;
