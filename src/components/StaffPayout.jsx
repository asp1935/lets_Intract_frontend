import React, { useState } from "react";
import { useStaffPayment, useStaffPayout } from "../hooks/usePayout";
import { useDispatch } from "react-redux";
import { showToast } from "../redux/slice/ToastSlice";

const StaffPayout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [users, setUsers] = useState([]);
  const [payment, setPayment] = useState({
    utr: '',
    paymentMode: ''
  });

  const dispatch = useDispatch();
  const { data: staffData, refetch } = useStaffPayout();

  const staffPayment = useStaffPayment();



  // useEffect(() => {
  //   if (staffData?.data.length > 0) {

  //     setUsers(staffData.data)
  //   }
  // }, [staffData])

  // const filteredUsers = users.length > 0 ? users?.filter(
  //   (user) =>
  //     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     user.email.toLowerCase().includes(searchTerm.toLowerCase())
  // ) : [];

  const filteredUsers = staffData?.data.length > 0 ? staffData?.data?.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayment((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  const handleCancelPayout = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setPayment({
      utr: '',
      paymentMode: ''
    })
  }

  const handlePayoutClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleConfirmPayout = () => {
    // Validation
    if (!selectedUser || !selectedUser._id) {
      dispatch(showToast({ message: "Select Valid Staff", type: 'error' }))
      return
    }
    if (!payment.paymentMode || !payment.utr) {
      dispatch(showToast({ message: "Payment Mode and UTR Required", type: 'error' }))
      return
    }
    staffPayment.mutate(({ staffId: selectedUser._id, paymentData: payment }), {
      onSuccess: () => {
        refetch();

        setIsModalOpen(false);
        setSelectedUser(null);
        setPayment({
          utr: '',
          paymentMode: ''
        })

        dispatch(showToast({ message: "Payment Successfully Done" }))
      },
      onError: (error) => dispatch(showToast({ message: error, type: 'error' })),
    })
  };

  return (
    <div className="Form mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl text-center font-bold mb-4 text-[#640D5F]" style={{ textShadow: "3px 3px 10px rgba(100, 13, 95, 0.7)" }}>Payout Management</h2>

      {/* Search Field */}
      <input
        type="text"
        placeholder="Search User..."
        className="w-full p-2 border-2 border-[#640D5F] rounded-md mb-4 focus:ring-2 focus:ring-[#640D5F]"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* User List Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
          <thead className="bg-[#ce31c6] text-white">
            <tr>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Incentive</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-100 text-center">
                  <td className="p-3 border">{user.name}</td>
                  <td className="p-3 border">{user.email}</td>
                  <td className="p-3 border">{user.amount}</td>

                  <td className="p-3 border">
                    <button
                      className="px-4 py-2 bg-[#cc21c3] text-white rounded-md hover:bg-[#a1199a] transition-all"
                      onClick={() => handlePayoutClick(user)}
                    >
                      Pay Out
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Popup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
          <div className="p-5 mt-10">
            <div className="bg-white p-6 rounded-lg w-[500px] max-h-[80vh] flex flex-col" style={{ fontSize: "16px", boxShadow: "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset" }}>
              {/* Modal Header */}
              <div className="flex-shrink-0">
                <h3 className="text-xl font-bold mb-4 text-[#640D5F]">Payout Details</h3>
                <p className="mb-2 flex justify-between mx-1">
                  <strong>Staff Name:</strong> {selectedUser?.name}
                </p>
                {/* <p className="mb-2 flex justify-between mx-1">
                  <strong>Mobile No.:</strong> {selectedUser?.mobile}
                </p> */}
                <p className="mb-2 flex justify-between mx-1">
                  <strong>Member Count:</strong> {selectedUser?.refCount}
                </p>
                <p className="mb-2 flex justify-between mx-1">
                  <strong>Incentive Rate:</strong> {selectedUser?.incentive}
                </p>
                <p className="mb-2 flex justify-between mx-1">
                  <strong>Total Incentive:</strong> {selectedUser?.amount}
                </p>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto pr-2">
                {/* Payment Mode Selection */}
                <div className="mb-4">
                  <strong className="block mt-2">Payment Mode:</strong>
                  <select className="w-full p-2 border" name="paymentMode" value={payment.paymentMode} onChange={handleChange}>
                    <option value="">Select Payment Mode</option>
                    <option value="Google Pay">Google Pay</option>
                    <option value="Phone Pay">Phone Pay</option>
                  </select>
                </div>

                {/* Payout Amount Input */}
                <div className="mb-4 mx-1">
                  <label className="block font-bold">Payout Amount</label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#640D5F] "
                    value={selectedUser.amount}
                    readOnly
                  // onChange={(e) => setPayoutAmount(e.target.value)}
                  />
                </div>

                {/* UTR Input */}
                <div className="mb-4 mx-1">
                  <strong className="block font-bold">UTR</strong>
                  <input
                    type="text"
                    placeholder="Enter UTR"
                    name="utr"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#640D5F]"
                    value={payment.utr}
                    onChange={handleChange}
                  />

                </div>
              </div>

              {/* Modal Footer (Action Buttons) */}
              <div className="flex-shrink-0 flex justify-end gap-2 mt-4">
                <button
                  className="px-4 py-2 bg-gray-400 text-gray-100 rounded-md hover:bg-gray-400 transition-all"
                  onClick={handleCancelPayout}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-[#d01dc7] text-white rounded-md hover:bg-[#a917a2] transition-all"
                  onClick={handleConfirmPayout}
                >
                  Pay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPayout;