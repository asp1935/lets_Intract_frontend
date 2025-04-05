import React, { useState, useEffect } from "react";
import { useAdmin, useDeleteAdmin, useUpdateAdmin } from "../hooks/useAdmin";
import { useDispatch } from "react-redux";
import { showToast } from "../redux/slice/ToastSlice";

const StaffUpdation = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [editStaffId, setEditStaffId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    permissions: [],
    role: "",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteStaffId, setDeleteStaffId] = useState(null);
  const [confirmationInput, setConfirmationInput] = useState("");

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const updateStaff = useUpdateAdmin();
  const deleteStaff = useDeleteAdmin();
  const { data } = useAdmin(null, 'user');  // Fetch staff 



  useEffect(() => {
    if (data) {
      setStaff(data.data);
      setFilteredStaff(data.data);
    }
  }, [data]);

  useEffect(() => {
    setFilteredStaff(staff);
  }, [staff]);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredStaff(staff.filter((s) => s.name.toLowerCase().includes(term)));
  };

  const handleEdit = (staffMember) => {
    setEditStaffId(staffMember._id);
    setEditForm({ ...staffMember });

  };

  const handleEditChange = (event) => {
    setEditForm({ ...editForm, [event.target.name]: event.target.value });
  };

  const togglePermission = (permission) => {
    setEditForm((prevData) => {
      const newPermissions = prevData.permissions.includes(permission)
        ? prevData.permissions.filter((perm) => perm !== permission)
        : [...prevData.permissions, permission];
      return { ...prevData, permissions: newPermissions };
    });
  };

  const validate = () => {
    let tempErrors = {};

    if (!editForm.name.trim()) {
      tempErrors.name = "Name is required";
    }

    if (!editForm.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(editForm.email)) {
      tempErrors.email = "Email is not valid";
    }


    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleUpdate = () => {
    if (validate()) {

      console.log('asd');

      updateStaff.mutate({ adminId: editStaffId, updatedData: editForm }, {
        onSuccess: () => {

          setEditStaffId(null);
          dispatch(showToast({ message: "Associate Details Updated" }))
        },
        onError: (error) => dispatch(showToast({ message: error, type: 'error' }))

      })
    }
  };

  const confirmDelete = (id) => {
    setDeleteStaffId(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = () => {
    if (confirmationInput.toLowerCase() !== "confirm") {
      alert("Please enter 'confirm' to delete the record.");
      return;
    }

    deleteStaff.mutate(deleteStaffId, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        setDeleteStaffId(null);
        setConfirmationInput(""); // Reset confirmation input
        dispatch(showToast({ message: "Staff Successfully Deleted" }))

      },
      onError: (error) => dispatch(showToast({ message: error, type: 'error' }))

    })



  };
  const permissions = {
    home: "Home", business: "Business", politician: "Politician",
    associate: "Associate Management", account: "Account", notification: "Notifications", configuration: "Configuration",
    report: "Report"
  };
  return (
    <div className="Form p-6 mt-10 mx-auto rounded-lg">
      <h1 className="text-3xl font-bold text-center text-[#640D5F] mb-6">Staff Management</h1>

      <input type="search" placeholder="Search by Name" value={searchTerm} onChange={handleSearch} className="w-full p-3 border rounded-lg mb-4" />

      {editStaffId && (
        <div className="mb-6 p-4 bg-purple-100 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-[#640D5F] mb-4 text-center">Edit Staff</h2>
          <input type="text" name="name" placeholder="Name" value={editForm.name} onChange={handleEditChange} className="w-full p-3 border rounded-lg mb-2" />
          {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}

          <input type="email" name="email" placeholder="Email" value={editForm.email} onChange={handleEditChange} className="w-full p-3 border rounded-lg mb-2" />
          {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}

          <div>
            <h3 className="text-lg font-semibold">Permissions:</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {Object.entries(permissions).map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  className={`px-4 py-2 rounded-full border ${editForm.permissions.includes(key) ? "bg-pink-500 text-white" : "border-gray-400 text-gray-100 bg-purple-400"}`}
                  onClick={() => togglePermission(key)}>
                  {value} {editForm.permissions.includes(key) ? "✓" : "+"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex mt-3 justify-center w-full">
            <button onClick={handleUpdate} className="w-60 bg-[#9b1694] text-white p-3 rounded-lg font-bold hover:bg-[#9b1690]">Update</button>
          </div>
        </div>
      )}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-[#b017a8] text-white">
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Permissions</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaff.map((staffMember) => (
            <tr key={staffMember._id} className="border bg-white hover:bg-gray-200">
              <td className="p-3 border text-center">{staffMember.name}</td>
              <td className="p-3 border text-center">{staffMember.email}</td>
              <td className="p-3 border text-center">{staffMember.permissions.map((key) => permissions[key] || key).join(", ")}</td>
              <td className="p-3 border text-center">
                <div className="flex justify-center space-x-2">
                  <button onClick={() => handleEdit(staffMember)} className="bg-blue-600 text-white px-3 py-1 rounded-lg">Edit</button>
                  <button onClick={() => confirmDelete(staffMember._id)} className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDeleteConfirm && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center border border-gray-300">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p>Enter 'confirm' to delete the record:</p>
            <input
              type="text"
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              className="w-full p-2 border rounded-lg mb-4"
            />
            <div className="flex justify-center gap-5">
              <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-lg">Delete</button>
              <button onClick={() => setShowDeleteConfirm(false)} className="bg-gray-300 text-black px-4 py-2 rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffUpdation;