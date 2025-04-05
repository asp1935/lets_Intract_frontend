import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useDeleteUser, useUpdateUserPassword, useUpdateUser, useUser, useResetUserKey, useUpdateVerfication } from "../hooks/useUser";
import { showToast } from "../redux/slice/ToastSlice";

const PoliticianUpdation = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [politicians, setPoliticians] = useState([]);
  const [filteredPoliticians, setFilteredPoliticians] = useState([]);
  const [editPolitician, setEditPolitician] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    mobile: "",
    state: "",
    district: "",
    taluka: "",
    type: "",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePoliticianId, setDeletePoliticianId] = useState(null);
  const [confirmationInput, setConfirmationInput] = useState("");
  const [showResetSuccess, setShowResetSuccess] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordPoliticianId, setPasswordPoliticianId] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  const resetPassword = "reset@123"; // Default password for reset

  const dispatch = useDispatch();
  const updatePolitician = useUpdateUser();
  const deletePolitician = useDeleteUser();
  const updatePassword = useUpdateUserPassword();
  const resetUserKey = useResetUserKey();
  const updateVerifiaction = useUpdateVerfication();

  const { data } = useUser(null, "user", "political");



  useEffect(() => {

    if (data) {
      setPoliticians(data.data);
      setFilteredPoliticians(data);
    }
  }, [data]);

  useEffect(() => {
    setFilteredPoliticians(politicians);
  }, [politicians]);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredPoliticians(politicians.filter((p) => p.name.toLowerCase().includes(term)));
  };

  const handleEdit = (politician) => {

    setEditPolitician(politician._id);
    setEditForm({ ...politician });
  };

  const handleEditChange = (event) => {
    setEditForm({ ...editForm, [event.target.name]: event.target.value });
  };

  const handleUpdate = () => {
    updatePolitician.mutate({ userId: editPolitician, updatedData: editForm }, {
      onSuccess: () => {
        setEditPolitician(null);
        dispatch(showToast({ message: "Politicin Details Updated" }))
      },
      onError: (error) => dispatch(showToast({ message: error, type: 'error' }))

    })

  };

  const confirmDelete = (id) => {
    setDeletePoliticianId(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = () => {
    if (confirmationInput.toLowerCase() !== "confirm") {
      alert("Please enter 'confirm' to delete the record.");
      return;
    }
    deletePolitician.mutate(deletePoliticianId, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        setDeletePoliticianId(null);
        setConfirmationInput(""); // Reset confirmation input
        dispatch(showToast({ message: "Politician Deleted Successfully" }))
      },
      onError: (error) => dispatch(showToast({ message: error, type: 'error' }))
    })

  };

  const handleResetKey = (id) => {
    resetUserKey.mutate(id, {
      onSuccess: () => {
        dispatch(showToast({ message: 'Politician key has been reset' }))
      }
    })
    // const updatedPoliticians = politicians.map((p) =>
    //   p.id === id ? { ...p, password: resetPassword } : p
    // );
    // setPoliticians(updatedPoliticians);
    // setShowResetSuccess(true); // Show reset success message
    // setTimeout(() => setShowResetSuccess(false), 3000); // Hide message after 3 seconds
  };

  const handleToggleVerification = (id, status) => {
    updateVerifiaction.mutate({ userId: id, status: !status }, {
      onSuccess: () => {
        dispatch(showToast({ message: "Politician Verifiaction Updated" }))
      },
      onError: (error) => dispatch(showToast({ message: error, type: 'error' }))
    })
  };

  // Handle Password Update
  const handleUpdatePassword = () => {
    updatePassword.mutate({ userId: passwordPoliticianId, newPassword }, {
      onSuccess: () => {
        setShowPasswordModal(false);
        setNewPassword(""); // Reset new password input
        setPasswordPoliticianId(null);
        dispatch(showToast({ message: "Password Updated Successfully" }))
      },
      onError: (error) => dispatch(showToast({ message: error, type: 'error' }))

    })

  };

  return (
    <div className="Form p-6 mt-10 mx-auto rounded-lg">
      <h1 className="text-3xl font-bold text-center text-[#640D5F] mb-6" style={{ textShadow: "3px 3px 10px rgba(100, 13, 95, 0.7)" }}>Politician Management</h1>

      <input
        type="search"
        placeholder="Search by Name"
        value={searchTerm}
        onChange={handleSearch}
        className="w-full p-3 border border-[#640D5F] text-black rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#640D5F]"
      />

      {editPolitician && (
        <div className="mb-6 p-4 bg-purple-100 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-[#640D5F] mb-4 text-center">Edit Politician</h2>
          <input type="text" name="name" placeholder="Name" value={editForm.name} onChange={handleEditChange} className="w-full p-3 border rounded-lg mb-2" />
          <input type="email" name="email" placeholder="Email" value={editForm.email} onChange={handleEditChange} className="w-full p-3 border rounded-lg mb-2" />
          <input type="text" name="mobile" placeholder="Mobile" value={editForm.mobile} onChange={handleEditChange} className="w-full p-3 border rounded-lg mb-2" />
          <input type="text" name="state" placeholder="State" value={editForm.state} onChange={handleEditChange} className="w-full p-3 border rounded-lg mb-2" />
          <input type="text" name="district" placeholder="District" value={editForm.district} onChange={handleEditChange} className="w-full p-3 border rounded-lg mb-2" />
          <input type="text" name="taluka" placeholder="Taluka" value={editForm.taluka} onChange={handleEditChange} className="w-full p-3 border rounded-lg mb-2" />
          <select name="type" value={editForm.type} onChange={handleEditChange} className="w-full p-3 rounded border border-[#640D5F]" disabled={!editForm.type}>
            <option key='business' value="business">Business</option>
            <option key='political' value="political">Political</option>
          </select>
          {/* <input type="text" name="referencedBy" placeholder="Referenced By" value={editForm.referencedBy} onChange={handleEditChange} className="w-full p-3 border rounded-lg mb-2" /> */}
          <div className="flex mt-3 justify-center w-full">
            <button onClick={handleUpdate} className="w-60 bg-[#9b1694] text-white p-3 rounded-lg font-bold hover:bg-[#9b1690]">Update</button>
          </div>
        </div>
      )}

      <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-[#b017a8] text-white uppercase text-sm leading-normal">
            <th className="p-3 border border-[#640D5F]">Name</th>
            <th className="p-3 border border-[#640D5F]">Mobile</th>
            <th className="p-3 border border-[#640D5F]">Actions</th>
            <th className="p-3 border border-[#640D5F]">Verified</th>
          </tr>
        </thead>
        <tbody className="text-gray-900 text-sm font-light">
          {filteredPoliticians.length > 0 ? (
            filteredPoliticians.map((politician, index) => (
              <tr
                key={politician.id}
                className={`border border-[#640D5F] ${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-gray-200 transition`}
              >
                <td className="p-3 border border-[#640D5F] text-center">{politician.name}</td>
                <td className="p-3 border border-[#640D5F] text-center">{politician.mobile}</td>
                <td className="p-3 border border-[#640D5F] text-center">
                  <button onClick={() => handleEdit(politician)} className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-800 transition mr-2">
                    Edit
                  </button>
                  <button onClick={() => confirmDelete(politician._id)} className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition mr-2">
                    Delete
                  </button>
                  <button onClick={() => { setPasswordPoliticianId(politician._id); setShowPasswordModal(true); }} className="bg-[#A0C878] text-white px-3 py-1 rounded-lg hover:bg-[#8eb16ae5] transition mr-2">
                    Update Password
                  </button>
                  <button onClick={() => handleResetKey(politician._id)} className="bg-[#54B4D3] text-white px-3 py-1 rounded-lg hover:bg-[#5a8fa1] transition">
                    Reset Key
                  </button>
                </td>
                <td className="p-3 border border-[#640D5F] text-center">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={politician.verified}
                      onChange={() => handleToggleVerification(politician._id, politician.verified)}
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-3 text-center text-gray-500">No politicians found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center border border-gray-300">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-2">Enter 'confirm' to delete this politician:</p>
            <input
              type="text"
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Confirm
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded hover:bg-gray-400 transition ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reset Success Message */}
      {showResetSuccess && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center border border-gray-300">
            <h2 className="text-xl font-bold mb-4">Reset Successful</h2>
            <p className="mb-4">The password has been reset to <strong>{resetPassword}</strong>.</p>
            <button
              onClick={() => setShowResetSuccess(false)}
              className="bg-[#54B4D3] text-white px-4 py-2 rounded hover:bg-[#5c91a3] transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Update Password Modal */}
      {showPasswordModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center border border-gray-300">
            <h2 className="text-xl font-bold mb-4">Update Password</h2>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            <button
              onClick={handleUpdatePassword}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Update Password
            </button>
            <button
              onClick={() => setShowPasswordModal(false)}
              className="bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded hover:bg-gray-400 transition ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoliticianUpdation;