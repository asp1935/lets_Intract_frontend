import React, { useEffect, useState } from "react";
import { FaSync, FaEdit } from "react-icons/fa"; // Import icons
import { useDispatch } from "react-redux";
import { useStaff, useUpdateStaffIncentive } from "../hooks/useStaffRef";
import { showToast } from "../redux/slice/ToastSlice";
import { genrateSaffPayout } from "../api/payoutApi";

const StaffPayoutSetting = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [incentiveRate, setIncentiveRate] = useState("");
  const [defaultIncentive, setDefaultIncentive] = useState("");
  const [showDefaultIncentiveField, setShowDefaultIncentiveField] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState("");
  const [showConfirmBox, setShowConfirmBox] = useState(false);

  const [staffs, setStaffs] = useState([]);

  const dispatch = useDispatch();
  const { data: staffData, refetch } = useStaff();

  const updateStaffIncentive = useUpdateStaffIncentive();


  useEffect(() => {
    if (staffData?.data.length > 0) {
      setStaffs(staffData.data)
    }
  }, [staffData])




  // Filter staffs based on search term
  const filteredStaffs = staffs.length > 0 ? staffs.filter((staff) =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Handle setting a default incentive for all staffs
  const handleSetDefaultIncentive = () => {
    if (isNaN(Number(defaultIncentive)) || defaultIncentive < 0) {
      dispatch(showToast({ message: 'Enter Valid Incentive', type: 'error' }))
      return;
    }
    updateStaffIncentive.mutate({ incentive: Number(defaultIncentive) }, {
      onSuccess: () => {
        setShowDefaultIncentiveField(false);
        setDefaultIncentive(0);
        dispatch(showToast({ message: "All staff' incentive updated" }))
      },
      onError: (error) => dispatch(showToast({ message: error, type: 'error' }))

    })
  };

  // Handle updating individual incentive
  const handleUpdateIncentive = () => {
    if (!selectedStaff) {
      dispatch(showToast({ message: "Please select an Staff", type: "warn" }))
      return;
    }
    if (isNaN(Number(defaultIncentive)) || defaultIncentive < 0) {
      dispatch(showToast({ message: 'Enter Valid Incentive', type: 'error' }))
      return;
    }
    updateStaffIncentive.mutate({ staffId: selectedStaff._id, incentive: Number(incentiveRate) }, {
      onSuccess: () => {
        setIncentiveRate(0);
        setSelectedStaff(null)
        dispatch(showToast({ message: "Staff Incetive updated" }))
      },
      onError: (error) => dispatch(showToast({ message: error, type: 'error' }))

    })
  };

  const handleRefresh = () => {
    setSearchTerm("");
    setSelectedStaff(null);
    setIncentiveRate("");
    setDefaultIncentive("");
    setShowDefaultIncentiveField(false);

    // Reset all staffs' incentives to their initial state (if needed)
    setStaffs((prevStaffs) =>
      prevStaffs.map((staff) => ({ ...staff }))
    );
  };

  const handleGenrate = () => {

    staffs.map(staff => {
      if (staff.incentive <= 0) {
        dispatch(showToast({ message: 'All Staff Incentive Not Set You can update Incentive', type: 'warn' }))
        setShowConfirmBox(true);
      }
    })
    setShowConfirmBox(true)
  } 


  const handleConfirmGenrate = async () => {
    if (confirmationInput.toLowerCase() !== "confirm") {
      alert("Please enter 'confirm' to delete the record.");
      return;
    }
    try {
      const respose = await genrateSaffPayout();
      if (respose.statusCode === 201) {
        setShowConfirmBox(false);
        setConfirmationInput('');
        await refetch()
        dispatch(showToast({ message: 'Payout Genrated Successfully' }))
      }
      else if (respose.statusCode === 200) {
        setShowConfirmBox(false);
        setConfirmationInput('');
        await refetch()
        dispatch(showToast({ message: 'No Records For Payout', type: 'warn' }))
      }
    } catch (error) {
      setShowConfirmBox(false);
      setConfirmationInput('');
      dispatch(showToast({ message: error, type: 'error' }))

    }
  }

  return (
    <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg rounded-lg">
      {/* Header with Buttons */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#640D5F]">Payout Settings</h2>
        <div className="flex space-x-4">
          {/* Set Default Incentive Button */}
          <button
            className="p-2 bg-[#640D5F] text-white rounded-lg hover:bg-[#520a4a] transition-all"
            onClick={() => setShowDefaultIncentiveField(!showDefaultIncentiveField)}
          >
            Set Default Incentive
          </button>

          {/* Refresh Button */}
          <button
            className="p-2 bg-[#640D5F] text-white rounded-lg hover:bg-[#520a4a] transition-all"
            onClick={handleRefresh}
            title="Refresh Data" // Tooltip appears on hover
          >
            <FaSync className="text-xl" />
          </button>
        </div>
      </div>

      {/* Search Field */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search Staff..."
          className="w-100 p-3 border border-gray-600 rounded-lg "
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Default Incentive Input Field */}
      {showDefaultIncentiveField && (
        <div className="flex justify-center">
          <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm w-100 ">
            <label className="block text-sm font-medium text-gray-700 mb-2">Set Incentive for All</label>
            <div className="flex space-x-4">
              <input
                type="number"
                placeholder="Enter default incentive"
                className="w-100 p-2 border border-gray-300 rounded-lg"
                value={defaultIncentive}
                onChange={(e) => setDefaultIncentive(e.target.value)}
              />
              <button
                className="px-4 py-2 bg-[#640D5F] text-white rounded-lg hover:bg-[#520a4a] transition-all"
                onClick={handleSetDefaultIncentive}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing Individual Incentive Update Form (Now Above Table) */}
      {selectedStaff && (
        <div className="flex justify-center">
          <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm w-100">
            <h3 className="text-lg font-semibold mb-2 text-[#640D5F]">Update Incentive</h3>
            <div className="flex flex-col space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Staff Name</label>
                <input type="text" value={selectedStaff.name} className="w-full p-2 border border-gray-300 rounded-lg" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Previous Incentive</label>
                <input type="text" value={selectedStaff.incentive} className="w-full p-2 border border-gray-300 rounded-lg" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Incentive Rate</label>
                <input
                  type="number"
                  placeholder="Enter incentive rate"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={incentiveRate}
                  onChange={(e) => setIncentiveRate(e.target.value)}
                />
              </div>
              <button
                className="px-4 py-2 bg-[#640D5F] text-white rounded-lg hover:bg-[#520a4a] transition-all"
                onClick={handleUpdateIncentive}
              >
                Update Incentive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staffs Table */}
      <div className="mb-8">
        <div className="flex justify-between items-baseline">
          <h3 className="text-xl font-semibold mb-4 text-[#640D5F]">Staffs</h3>
          <button
            className="px-4 py-2 bg-[#e22c2c] text-white font-bold rounded-lg hover:bg-[#c40909] transition-all"
            onClick={handleGenrate}
          >
            Genrate Payout
          </button>
        </div>
        <table className="min-w-full bg-white border border-gray-200 shadow-sm">
          <thead className="bg-[#d64fcf] text-white">
            <tr>
              <th className="p-3 text-center">Name</th>
              <th className="p-3 text-center">Incentive</th>
              <th className="p-3 text-center">Recent Referrals</th>
              <th className="p-3 text-center">Total Referrals</th>
              <th className="p-3 text-center">Update Incentive</th>

            </tr>
          </thead>
          <tbody>
            {filteredStaffs?.length > 0 ? (
              filteredStaffs?.map((staff) => (
                <tr key={staff._id} className="hover:bg-gray-50">
                  <td className="p-3 text-center border-b border-gray-200">{staff.name}</td>
                  <td className="p-3 text-center border-b border-gray-200">{staff.incentive}</td>
                  <td className="p-3 text-center border-b border-gray-200">{staff.referralCount}</td>
                  <td className="p-3 text-center border-b border-gray-200">{staff.totalReferralCount}</td>
                  <td className="p-3 text-center border-b border-gray-200">
                    <button
                      className="text-[#8A1C7C] mx-auto rounded-lg transition-all flex items-center"
                      onClick={() => setSelectedStaff(staff)}
                    >
                      <FaEdit className="ms-10" size={22} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No staffs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showConfirmBox && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center border border-gray-300">
            <h2 className="text-xl font-semibold mb-4">Confirm Payout Genration</h2>
            <p>Enter 'confirm' to Genrate Payout:</p>
            <input
              type="text"
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              className="w-full p-2 border rounded-lg mb-4"
            />
            <div className="flex justify-center gap-5">
              <button onClick={handleConfirmGenrate} className="bg-green-600   text-white px-4 py-2 rounded-lg">Genrate</button>
              <button onClick={() => setShowConfirmBox(false)} className="bg-gray-300 text-black px-4 py-2 rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPayoutSetting;