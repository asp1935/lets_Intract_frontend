import React, { useState, useEffect } from "react";
import { useAssociate, useDeleteAssociate, useUpdateAssociate } from "../hooks/useAssociate";
import { useDispatch } from "react-redux";
import { showToast } from "../redux/slice/ToastSlice";

const AssociateUpdation = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [associates, setAssociates] = useState([]);
  const [filteredAssociates, setFilteredAssociates] = useState([]);
  const [editAssociateId, setEditAssociateId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    mobile: "",
    state: "",
    district: "",
    taluka: "",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteAssociateId, setDeleteAssociateId] = useState(null);
  const [confirmationInput, setConfirmationInput] = useState("");

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const updateAssociate = useUpdateAssociate();
  const deleteAssociate = useDeleteAssociate();
  const { data } = useAssociate();  // Fetch associates

  // Set associateList once data is fetched
  useEffect(() => {
    if (data?.data?.length > 0) {
      setAssociates(data.data);
    }
  }, [data]);



  useEffect(() => {
    setFilteredAssociates(associates);
  }, [associates]);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredAssociates(associates.filter((a) => a.name.toLowerCase().includes(term)));
  };

  const handleEdit = (associate) => {
    setEditAssociateId(associate._id);
    setEditForm({ ...associate });
  };

  const handleEditChange = (event) => {
    setEditForm({ ...editForm, [event.target.name]: event.target.value });
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

    if (!editForm.mobile) {
      tempErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(editForm.mobile)) {
      tempErrors.mobile = "Mobile number must be exactly 10 digits";
    }

    if (!editForm.state) {
      tempErrors.state = "State is required";
    }

    if (!editForm.district) {
      tempErrors.district = "District is required";
    }

    if (!editForm.taluka) {
      tempErrors.taluka = "Taluka is required";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (validate()) {
      updateAssociate.mutate({ associateId: editForm._id, updatedData: editForm }, {
        onSuccess: () => {

          setEditAssociateId(null);
          dispatch(showToast({ message: "Associate Details Updated" }))
        },
        onError: (error) => dispatch(showToast({ message: error, type: 'error' }))

      })
    }


  };

  const confirmDelete = (id) => {
    setDeleteAssociateId(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = () => {
    if (confirmationInput.toLowerCase() !== "confirm") {
      alert("Please enter 'confirm' to delete the record.");
      return;
    }


    deleteAssociate.mutate(deleteAssociateId, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        setDeleteAssociateId(null);
        setConfirmationInput(""); // Reset confirmation input
        dispatch(showToast({ message: "Associate Deleted" }))

      },
      onError: (error) => dispatch(showToast({ message: error, type: 'error' }))
    })


  };

  return (
    <div className="Form p-6 mt-10 mx-auto rounded-lg">
      <h1 className="text-3xl font-bold text-center text-[#640D5F] mb-6" style={{ textShadow: "3px 3px 10px rgba(100, 13, 95, 0.7)" }}>Associate Management</h1>

      <input
        type="search"
        placeholder="Search by Name"
        value={searchTerm}
        onChange={handleSearch}
        className="w-full p-3 border border-[#640D5F] text-black rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#640D5F]"
      />

      {editAssociateId && (
        <div className="mb-6 p-4 bg-purple-100 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-[#640D5F] mb-4 text-center">Edit Associate</h2>
          <input type="text" name="name" placeholder="Name" value={editForm.name} onChange={handleEditChange} className="w-full p-3 border rounded-lg mb-2" />
          {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}

          <input type="email" name="email" placeholder="Email" value={editForm.email} onChange={handleEditChange} className="w-full p-3 border rounded-lg mb-2" />
          {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}

          <input type="text" name="mobile" placeholder="Mobile Number" value={editForm.mobile} onChange={handleEditChange} className="w-full p-3 border rounded-lg mb-2" />
          {errors.mobile && <p className="text-red-400 text-sm">{errors.mobile}</p>}

          <input type="text" name="state" placeholder="State" value={editForm.state} onChange={handleEditChange} className="w-full p-3 border rounded-lg mb-2" />
          {errors.state && <p className="text-red-400 text-sm">{errors.state}</p>}

          <input type="text" name="district" placeholder="District" value={editForm.district} onChange={handleEditChange} className="w-full p-3 border rounded-lg mb-2" />
          {errors.district && <p className="text-red-400 text-sm">{errors.district}</p>}

          <input type="text" name="taluka" placeholder="Taluka" value={editForm.taluka} onChange={handleEditChange} className="w-full p-3 border rounded-lg mb-2" />
          {errors.taluka && <p className="text-red-400 text-sm">{errors.taluka}</p>}

          <div className="flex mt-3 justify-center w-full">
            <button onClick={handleUpdate} className="w-60 bg-[#9b1694] text-white p-3 rounded-lg font-bold hover:bg-[#9b1690] disabled:opacity-50 disabled:cursor-not-allowed" disabled={updateAssociate.isPending}>{updateAssociate.isPending ? "Updating" : "Update"}</button>
          </div>
        </div>
      )}

      <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-[#b017a8] text-white uppercase text-sm leading-normal">
            <th className="p-3 border border-[#640D5F]">Name</th>
            <th className="p-3 border border-[#640D5F]">Email</th>
            <th className="p-3 border border-[#640D5F]">Mobile</th>
            <th className="p-3 border border-[#640D5F]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssociates.map((associate) => (
            <tr key={associate._id} className="border border-[#640D5F] bg-white hover:bg-gray-200 transition">
              <td className="p-3 border border-[#640D5F] text-center">{associate.name}</td>
              <td className="p-3 border border-[#640D5F] text-center">{associate.email}</td>
              <td className="p-3 border border-[#640D5F] text-center">{associate.mobile}</td>
              <td className="p-3 border border-[#640D5F] text-center">
                <button onClick={() => handleEdit(associate)} className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-800 transition mr-2">Edit</button>
                <button onClick={() => confirmDelete(associate._id)} className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center border border-gray-300">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-2">Enter 'confirm' to delete this associate:</p>
            <input
              type="text"
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={deleteAssociate.isPending}
            >
              {deleteAssociate.isPending ? "Deleteing..." : "Confirm"}
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
    </div>
  );
};

export default AssociateUpdation;