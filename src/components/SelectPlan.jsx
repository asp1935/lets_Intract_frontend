import React, { useEffect, useState } from "react";
import './application.css';
import { useDispatch } from "react-redux";
import { useUpsertUserPlan, useUser } from "../hooks/useUser";
import { usePlan } from "../hooks/usePlan";
import { showToast } from "../redux/slice/ToastSlice";

const SelectPlan = ({ type }) => {

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Basic");
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUser, setFilteredIUser] = useState([]);



  const dispatch = useDispatch();
  const { data: userData } = useUser(null, "user", type);
  const { data: planData } = usePlan();

  const upsertUserPlan = useUpsertUserPlan();



  useEffect(() => {
    if (userData?.data.length>0) {

      const result = userData.data.filter(associate =>
        associate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        associate.mobile?.includes(searchTerm)
      );
      setFilteredIUser(result);
    }
  }, [userData, searchTerm]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCustomer || !selectedPlanId) {
      alert("Please select a customer and plan duration.");
      return;
    }
    upsertUserPlan.mutate({ planId: selectedPlanId, userId: selectedCustomer._id }, {
      onSuccess: () => {
        setSelectedCustomer(null);
        setSelectedPlanId("");
        dispatch(showToast({ message: "Plan Successfully Purchased" }))
      },
      onError: (error) => dispatch(showToast({ message: error, type: 'error' })),

    })
  };


  return (
    <div className="Form mx-auto p-8 rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-[#640D5F] text-center" style={{ textShadow: "3px 3px 10px rgba(100, 13, 95, 0.7)" }}>
        Select Plan
      </h2>

      {/* Search Bar & User Details Card in a Flexbox */}
      <div className="">  
        {/* Search and Dropdown */}
        <div className="relative w-1/2 mx-auto">
          <input
            type="search"
            placeholder="Search User by Name or Mobile"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 rounded-md text-[#4e0c4a] border border-[#640D5F]"
          />
          {searchTerm && (
            <div className="absolute bg-white border border-gray-300 w-full mt-1 rounded-md shadow-lg max-h-48 overflow-y-auto">
              {filteredUser.map((customer, index) => (
                <div
                  key={index}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setSearchTerm(""); // Hide suggestions after selection
                  }}
                >
                  {customer.name} ({customer.mobile})
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Details Card */}
        {selectedCustomer && (
          <div className="w-1/3 bg-white rounded-xl p-6 mx-auto my-5" style={{ boxShadow: 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px' }}>
            {/* Header */}
            <div className="bg-gradient-to-r from-[#aa1ba3] to-[#640D5F] text-white text-center py-2 rounded-lg">
              <h3 className="text-lg font-semibold">User Details</h3>
            </div>

            {/* User Info - Well-Formatted Table Structure */}
            <div className="p-4 text-gray-700">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-semibold">Name:</span>
                  <span>{selectedCustomer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Email:</span>
                  <span>{selectedCustomer.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Mobile No.:</span>
                  <span>{selectedCustomer.mobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">State:</span>
                  <span>{selectedCustomer.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">District:</span>
                  <span>{selectedCustomer.district}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Taluka:</span>
                  <span>{selectedCustomer.taluka}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Plan Toggle */}
      <div className="flex items-center justify-center bg-[#ebace8] rounded-full p-1 w-full max-w-md mx-auto mt-4">
        {["Basic", "Advanced"].map((category) => (
          <div
            key={category}
            className={`flex-1 text-center py-2 rounded-full cursor-pointer transition-all font-semibold text-lg ${selectedCategory === category ? "bg-[#640D5F] text-white" : "text-black"
              }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </div>
        ))}
      </div>


      {/* Duration Selection Cards */}

      <div className="grid grid-cols-5 gap-4 mt-6">
        {planData?.data
          .filter((plan) => (selectedCategory === 'Advanced' ? plan.type === 'advance' : plan.type === 'basic'))
          .map((plan) => {
            const features = [
              plan.smsAPIService && 'SMS API Service',
              plan.whatsappAPIService && 'Whatsapp API Service',
              plan.smsCount && `Total Message: ${plan.smsCount}`,
              plan.userSMSCount && `${plan.userSMSCount} User SMS`,
              plan.addMembers && `Add Member`,

            ].filter(Boolean); // Remove falsy values

            return (
              <div
                key={plan._id}
                className={`p-6 rounded-lg shadow-md border cursor-pointer transition-all text-center ${selectedPlanId === plan._id ? 'bg-[#f5a9ef]' : 'bg-[#f8e1f6] hover:bg-[#f1c0ee]'
                  }`}
                onClick={() => setSelectedPlanId(plan._id)}
              >
                <h2 className="text-2xl text-red-600 font-bold">{plan.name}</h2>
                <h3 className="text-lg text-blue-800 font-bold">{plan.validity} Days</h3>
                <p className="text-[#4e0c4a] text-lg font-semibold">&#8377;{plan.price}</p>
                <ul className="mt-2 text-sm">
                  {features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            );
          })}
      </div>



      {/* Submit Button */}
      <div className="flex justify-center w-full">
        <button
          onClick={handleSubmit}
          className="w-40 bg-[#aa1ba3] hover:bg-[#640D5F] font-bold text-white p-2 mt-5 rounded-md"
        >
          Confirm Plan
        </button>
      </div>
    </div>
  );
};

export default SelectPlan;