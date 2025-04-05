import React, { useEffect, useState } from "react";
import "./application.css";
import { useDispatch } from "react-redux";
import { useAddAdmin, useAdmin } from "../hooks/useAdmin";
import { showToast } from "../redux/slice/ToastSlice";

const AddStaff = () => {
  const [staffData, setStaffData] = useState({
    name: "",
    email: "",
    password: "",
    role: 'user',
    permissions: [],
  });

  const [errors, setErrors] = useState({});
  const [staffList, setStaffList] = useState([]);

  const dispatch = useDispatch();
  const addStaff = useAddAdmin();
  const { data } = useAdmin(null, 'user');  // Fetch staff 
  // Set staff once data is fetched
  useEffect(() => {
    if (data) {
      setStaffList(data.data);
    }
  }, [data]);
  const validate = () => {
    let tempErrors = {};

    if (!staffData.name.trim()) {
      tempErrors.name = "Name is required";
    }

    if (!staffData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(staffData.email)) {
      tempErrors.email = "Email is not valid";
    }

    if (!staffData.password) {
      tempErrors.password = "Password is required";
    } else if (staffData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setStaffData({ ...staffData, [e.target.name]: e.target.value });
  };

  const togglePermission = (permission) => {
    setStaffData((prevData) => {
      const newPermissions = prevData.permissions.includes(permission)
        ? prevData.permissions.filter((perm) => perm !== permission)
        : [...prevData.permissions, permission];
      return { ...prevData, permissions: newPermissions };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      addStaff.mutate(staffData, {
        onSuccess: () => {

          setStaffData({ name: "", email: "", password: "", permissions: [], role: 'user', });
          setErrors({});
          dispatch(showToast({ message: 'New Staff Member Added.' }))
        },
        onError: (error) => dispatch(showToast({ message: error, type: 'error' })),

      })


    }
  };

  const employmentTypes = {
    home: "Home", business: "Business", politician: "Politician",
    associate: "Associate Management", account: "Account", notification: "Notifications", configuration: "Configuration",
    report: "Report"
  };

  return (
    <>
      <div className="Form max-w-xl mx-auto mt-10 p-6 rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#640D5F]">Add Staff</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Staff Name" value={staffData.name} onChange={handleChange} className="w-full rounded p-2 border" />
          {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}

          <input type="email" name="email" placeholder="Email" value={staffData.email} onChange={handleChange} className="w-full rounded p-2 border" />
          {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}

          <input type="password" name="password" placeholder="Password" value={staffData.password} onChange={handleChange} className="w-full rounded p-2 border" />
          {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}

          <div>
            <h3 className="text-lg font-semibold">Permissions:</h3>
            <div className="permission_button grid grid-cols-2 md:grid-cols-2 gap-2 mt-2">
              {Object.entries(employmentTypes).map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  className={`px-4 py-2 rounded-full border ${staffData.permissions.includes(key)
                    ? "bg-pink-400 text-white border-gray-600"
                    : "border-gray-400 text-gray-500 bg-pink-100"
                    }`}
                  onClick={() => togglePermission(key)}  // Send the key to backend
                >
                  {value} {staffData.permissions.includes(key) ? "✓" : "+"}
                </button>
              ))}
            </div>

          </div>

          <div className="flex justify-center w-full">
            <button type="submit" className="w-40 bg-[#aa1ba3] hover:bg-[#640D5F] font-bold text-white p-2 mt-5 rounded-md">Add Staff</button>
          </div>
        </form>
      </div>

      {staffList.length > 0 && (
        <div className="mt-10">
          <h3 className="text-2xl font-bold mb-4 text-center">Staff List</h3>
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-[#640D5F] text-white">
                <th className="border border-gray-300 p-2">Sr. No.</th>
                <th className="border border-gray-300 p-2">Staff Name</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Permissions</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                  <td className="border border-gray-300 p-2 text-center">{staff.name}</td>
                  <td className="border border-gray-300 p-2 text-center">{staff.email}</td>
                  <td className="border border-gray-300 p-2 text-center">{staff.permissions.map((key) => employmentTypes[key] || key).join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default AddStaff;