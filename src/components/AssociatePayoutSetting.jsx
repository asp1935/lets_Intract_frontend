import React, { useEffect, useState } from "react";
import { FaSync, FaEdit } from "react-icons/fa"; // Import icons
import { useAssociate, useUpdateAssoCommission } from "../hooks/useAssociate";
import { useDispatch } from "react-redux";
import { showToast } from "../redux/slice/ToastSlice";
import { genrateAssociatePayout } from "../api/payoutApi";
import { useQueryClient } from '@tanstack/react-query';


const AssociatePayoutSetting = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssociate, setSelectedAssociate] = useState(null);
  const [commissionRate, setCommissionRate] = useState("");
  const [defaultCommission, setDefaultCommission] = useState(0);
  const [showDefaultCommissionField, setShowDefaultCommissionField] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState("");
  const [showConfirmBox, setShowConfirmBox] = useState(false);

  const [associates, setAssociates] = useState([]);


  const queryClient = useQueryClient();

  const dispatch = useDispatch();
  const { data: associateData, refetch } = useAssociate();

  const updateAssoCommission = useUpdateAssoCommission();

  useEffect(() => {
    if (associateData?.data.length > 0) {
      setAssociates(associateData.data)
    }
  }, [associateData])

  // Filter associates based on search term
  const filteredAssociates = associates.length > 0 ? associates?.filter((associate) =>
    associate.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Handle setting a default commission for all associates
  const handleSetDefaultCommission = () => {
    if (defaultCommission === '' ||
      defaultCommission === null ||
      isNaN(Number(defaultCommission)) ||
      defaultCommission < 0
    ) {
      dispatch(showToast({ message: 'Enter Valid Commission', type: 'error' }))
      return;
    }


    updateAssoCommission.mutate({ commission: Number(defaultCommission) }, {
      onSuccess: () => {
        setShowDefaultCommissionField(false);
        setDefaultCommission(0);
        dispatch(showToast({ message: "All associates' commissions updated" }))
      },
      onError: (error) => dispatch(showToast({ message: error, type: 'error' }))

    })

  };

  // Handle updating individual commission
  const handleUpdateCommission = () => {
    if (!selectedAssociate) {
      dispatch(showToast({ message: "Please select an associate", type: "warn" }))
      return;
    }
    if (commissionRate === '' ||
      commissionRate === null ||
      isNaN(Number(commissionRate)) ||
      commissionRate < 0
    ) {
      dispatch(showToast({ message: 'Enter Valid Commission', type: 'error' }))
      return;
    }
    updateAssoCommission.mutate({ associateId: selectedAssociate._id, commission: Number(commissionRate) }, {
      onSuccess: () => {
        setCommissionRate(0);
        setSelectedAssociate(null)
        dispatch(showToast({ message: "Associate commissions updated" }))
      },
      onError: (error) => dispatch(showToast({ message: error, type: 'error' }))

    })

  };


  const handleRefresh = () => {
    setSearchTerm("");
    setSelectedAssociate(null);
    setCommissionRate("");
    setDefaultCommission("");
    setShowDefaultCommissionField(false);

    // Reset all associates' commissions to their initial state (if needed)
    setAssociates((prevAssociates) =>
      prevAssociates.map((associate) => ({ ...associate }))
    );
  };
  const handleGenrate = () => {

    associates.map(associate => {
      if (associate.commission <= 0) {
        dispatch(showToast({ message: 'All Asscoiate Commission Not Set You can update Commission', type: 'warn' }))
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
      const respose = await genrateAssociatePayout();
      if (respose.statusCode === 201) {
        setShowConfirmBox(false);
        setConfirmationInput('');
        await refetch()
        queryClient.invalidateQueries({ queryKey: ['associatePayout'] });
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
          {/* Set Default Commission Button */}
          <button
            className="p-2 bg-[#640D5F] text-white rounded-lg hover:bg-[#520a4a] transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 "
            onClick={() => setShowDefaultCommissionField(!showDefaultCommissionField)}
            disabled={associates.length <= 0}
          >
            Set Default Commission
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
          placeholder="Search Associate..."
          className="w-100 p-3 border border-gray-600 rounded-lg "
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Default Commission Input Field */}
      {showDefaultCommissionField && (
        <div className="flex justify-center">
          <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm w-100 ">
            <label className="block text-sm font-medium text-gray-700 mb-2">Set Commission for All</label>
            <div className="flex space-x-4">
              <input
                type="number"
                placeholder="Enter default commission"
                className="w-100 p-2 border border-gray-300 rounded-lg"
                value={defaultCommission}
                onChange={(e) => setDefaultCommission(e.target.value)}
              />
              <button
                className="px-4 py-2 bg-[#640D5F] text-white rounded-lg hover:bg-[#520a4a] transition-all"
                onClick={handleSetDefaultCommission}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing Individual Commission Update Form (Now Above Table) */}
      {selectedAssociate && (
        <div className="flex justify-center">
          <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm w-100">
            <h3 className="text-lg font-semibold mb-2 text-[#640D5F]">Update Commission</h3>
            <div className="flex flex-col space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Associate Name</label>
                <input type="text" value={selectedAssociate.name} className="w-full p-2 border border-gray-300 rounded-lg" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Previous Commission</label>
                <input type="text" value={selectedAssociate.commission} className="w-full p-2 border border-gray-300 rounded-lg" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Commission Rate</label>
                <input
                  type="number"
                  placeholder="Enter commission rate"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                />
              </div>
              <button
                className="px-4 py-2 bg-[#640D5F] text-white rounded-lg hover:bg-[#520a4a] transition-all"
                onClick={handleUpdateCommission}
              >
                Update Commission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Associates Table */}
      <div className="mb-8">
        <div className="flex justify-between items-baseline">
          <h3 className="text-xl font-semibold mb-4 text-[#640D5F]">Associates</h3>
          <button
            className="px-4 py-2 bg-[#e22c2c] text-white font-bold rounded-lg hover:bg-[#c40909] transition-all disabled:cursor-not-allowed disabled:opacity-40"
            onClick={handleGenrate}
            disabled={associates.length <= 0}
          >
            Genrate Payout
          </button>
        </div>

        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-[#d64fcf] text-white">
            <tr>
              <th className="p-3 text-center">Name</th>
              <th className="p-3 text-center">Mobile Number</th>
              <th className="p-3 text-center">Commission</th>
              <th className="p-3 text-center">Recent Referrals</th>
              <th className="p-3 text-center">Total Referrals</th>
              <th className="p-3 text-center">Update Commission</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssociates?.length > 0 ? (
              filteredAssociates.map((associate) => (
                <tr key={associate._id} className="hover:bg-gray-50">
                  <td className="p-3 text-center border-b border-gray-200">{associate.name}</td>
                  <td className="p-3 text-center border-b border-gray-200">{associate.mobile}</td>
                  <td className="p-3 text-center border-b border-gray-200">{associate.commission}</td>
                  <td className="p-3 text-center border-b border-gray-200">{associate.referralCount}</td>
                  <td className="p-3 text-center border-b border-gray-200">{associate.totalReferralCount}</td>
                  <td className="p-3 text-center border-b border-gray-200">
                    <button
                      className="text-[#8A1C7C] mx-auto rounded-lg transition-all flex items-center"
                      onClick={() => setSelectedAssociate(associate)}
                    >
                      <FaEdit className="ms-10" size={22} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No associates found.
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

export default AssociatePayoutSetting;