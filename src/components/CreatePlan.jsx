import React, { useEffect, useState } from "react";
import { useAddPlan, useDeletePlan, usePlan, useUpdatePlan } from "../hooks/usePlan";
import { useDispatch } from "react-redux";
import { showToast } from "../redux/slice/ToastSlice";

const CreatePlan = () => {
  const [planData, setPlanData] = useState({
    name: "",
    price: "",
    validity: "",
    smsAPIService: false,
    whatsappAPIService: false,
    smsCount: "",
    userSMSCount: "",
    addMembers: false,
    type: "basic"
  });

  const [plans, setPlans] = useState([]);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [deletePlanId, setDeletePlanId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState("");


  const dispatch = useDispatch();
  const addPlan = useAddPlan();
  const updatePlan = useUpdatePlan();
  const deletePlan = useDeletePlan();
  const { data } = usePlan(null);

  useEffect(() => {
    if (data) {
      setPlans(data.data)
    }
  }, [data])


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPlanData({
      ...planData,
      [name]: type === "checkbox" || type === "radio" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPlanId !== null) {
      updatePlan.mutate({ planId: editingPlanId, planData: planData }, {
        onSuccess: () => {
          setEditingPlanId(null);
          dispatch(showToast({ message: "Plan Details Updated Successfully" }))
        },
        onError: (error) => dispatch(showToast({ message: error, type: 'error' })),
      })
    } else {
      // Add new plan
      addPlan.mutate(planData, {
        onSuccess: () => {
          dispatch(showToast({ message: 'New Plan Added Successfully' }))
        },
        onError: (error) => dispatch(showToast({ message: error, type: 'error' })),
      })
    }
    // Reset form
    setPlanData({
      name: "",
      price: "",
      validity: "",
      smsAPIService: false,
      whatsappAPIService: false,
      smsCount: "",
      userSMSCount: "",
      addMembers: false,
      type: "basic"
    });
  };

  const handleUpdate = (plan) => {
    setPlanData(plan);
    setEditingPlanId(plan._id);
  };

  // Confirm Delete Modal
  const confirmDelete = (id) => {
    setDeletePlanId(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = () => {
    if (confirmationInput.toLowerCase() !== "confirm") {
      alert("Please enter 'confirm' to delete the record.");
      return;
    }
    deletePlan.mutate(deletePlanId, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        setDeletePlanId(null);
        setConfirmationInput(""); // Reset confirmation input
        dispatch(showToast({ message: "Plan Deleted Successfully" }))
      },
      onError: (error) => dispatch(showToast({ message: error, type: 'error' })),
    })

  };

  return (
    <div className="Form mx-auto mt-10 p-6 rounded-lg shadow-lg max-w-4xl">
      <h2
        className="text-3xl font-bold mb-6 text-center text-[#640D5F]"
        style={{ textShadow: "3px 3px 10px rgba(100, 13, 95, 0.7)" }}
      >
        Create Plan
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-[#4e0c4a] font-semibold">Select User Type</label>
        <select name="type" value={planData.type} onChange={handleChange} className="w-full p-3 border border-[#640D5F] rounded-md focus:outline-none focus:ring-1 focus:ring-[#640D5F] mb-4">
          <option key='basic' value="basic" > Basic</option>
          <option key='advance' value="advance">Advance</option>
        </select>
        <input
          type="text"
          name="name"
          placeholder="Plan Name"
          value={planData.name}
          onChange={handleChange}
          required
          className="w-full p-2 rounded-md border border-[#640D5F]"
        />
        <input
          type="number"
          name="price"
          placeholder="Price ($)"
          value={planData.price}
          onChange={handleChange}
          min="0"
          required
          className="w-full p-2 rounded-md border border-[#640D5F]"
        />
        <input
          type="number"
          name="validity"
          placeholder="Validity (Days)"
          value={planData.validity}
          onChange={handleChange}
          min="0"
          required
          className="w-full p-2 rounded-md border border-[#640D5F]"
        />

        <div className="flex justify-between items-center">
          <label className="text-[#640D5F] font-bold">SMS API Service</label>
          <div className="flex space-x-4">
            <label>
              <input
                type="checkbox"
                name="smsAPIService"
                checked={planData.smsAPIService}
                onChange={handleChange}
                className="accent-[#640D5F]"
              />
              <span className="ml-2">Yes</span>
            </label>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <label className="text-[#640D5F] font-bold">
            WhatsApp API Service
          </label>
          <div className="flex space-x-4">
            <label>
              <input
                type="checkbox"
                name="whatsappAPIService"
                checked={planData.whatsappAPIService}
                onChange={handleChange}
                className="accent-[#640D5F]"
              />
              <span className="ml-2">Yes</span>
            </label>
          </div>
        </div>

        <input
          type="number"
          name="smsCount"
          placeholder="SMS Count"
          value={planData.smsCount}
          onChange={handleChange}
          min="0"
          required
          className="w-full p-2 rounded-md border border-[#640D5F]"
        />
        <input
          type="number"
          name="userSMSCount"
          placeholder="User SMS Count"
          value={planData.userSMSCount}
          onChange={handleChange}
          min="0"
          required
          className="w-full p-2 rounded-md border border-[#640D5F]"
        />

        <div className="flex justify-between items-center">
          <label className="text-[#640D5F] font-bold">Add Member</label>
          <div className="flex space-x-4">
            <label>
              <input
                type="checkbox"
                name="addMembers"
                checked={planData.addMembers}
                onChange={handleChange}
                className="accent-[#640D5F]"
              />
              <span className="ml-2">Yes</span>
            </label>
          </div>
        </div>

        <div className="flex justify-center w-full">
          <button
            type="submit"
            className="bg-[#aa1ba3] hover:bg-[#640D5F] text-white font-bold w-40 p-2 rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={updatePlan.isPending || addPlan.isPending}
          >
            {editingPlanId !== null ? updatePlan.isPending ? "Updating Plan..." : "Update Plan" : addPlan.isPending ? "Adding Plan..." : "Add Plan"}
          </button>
        </div>
      </form>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className="p-6 rounded-xl bg-[#fdf4ff] shadow-lg"
            style={{ boxShadow: "0px 4px 10px rgba(100, 13, 95, 0.5)" }}
          >
            <h3 className="text-xl font-extrabold text-[#640D5F] text-center uppercase">
              {plan.name}
            </h3>
            <h5 className="uppercase text-center text-sm">{plan.type}</h5>
            <p className="text-gray-700 flex justify-between">
              <strong>Price:</strong> <span>${plan.price}</span>
            </p>
            <p className="text-gray-700 flex justify-between">
              <strong>Validity:</strong> <span>{plan.validity} Days</span>
            </p>
            <p className="text-gray-700 flex justify-between">
              <strong>SMS API:</strong>{" "}
              <span>{plan.smsAPIService ? "Yes" : "No"}</span>
            </p>
            <p className="text-gray-700 flex justify-between">
              <strong>WhatsApp API:</strong>{" "}
              <span>{plan.whatsappAPIService ? "Yes" : "No"}</span>
            </p>
            <p className="text-gray-700 flex justify-between">
              <strong>SMS Count:</strong> <span>{plan.smsCount}</span>
            </p>
            <p className="text-gray-700 flex justify-between">
              <strong>User SMS Count:</strong> <span>{plan.userSMSCount}</span>
            </p>
            <p className="text-gray-700 flex justify-between">
              <strong>Add Member:</strong>{" "}
              <span>{plan.addMembers ? "Yes" : "No"}</span>
            </p>

            <div className="flex justify-center space-x-3 mt-4">
              <button
                onClick={() => handleUpdate(plan)}
                className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-1 px-4 rounded transition-all duration-300"
              >
                Update
              </button>
              <button
                onClick={() => confirmDelete(plan._id)}
                className="bg-red-600 hover:bg-red-800 text-white font-bold py-1 px-4 rounded transition-all duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center border border-gray-300">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-2">Enter 'confirm' to delete this customer:</p>
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
    </div>
  );
};

export default CreatePlan;