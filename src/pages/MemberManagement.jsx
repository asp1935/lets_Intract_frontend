/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDeleteUser, useResetUserKey, useUpdateVerfication, useUser, useUserPlan } from "../hooks/useUser";
import { showToast } from "../redux/slice/ToastSlice";
import { useDispatch } from "react-redux";
import { useSendOtp } from "../hooks/useOtp";
import { useAddMember, useUpdateMember } from "../hooks/useMember";
import { getUserMembers } from "../api/memberApi";

const MemberManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("");

  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", mobile: "", otp: "", password: "member@123" });
  const [showTable, setShowTable] = useState(true);
  const [editIndex, setEditIndex] = useState(null);
  const [editMember, setEditMember] = useState({ name: "", mobile: "" });
  const [viewedPoliticalPerson, setViewedPoliticalPerson] = useState(null);
  const [showMemberTable, setShowMemberTable] = useState(false);
  const [politicalPersonSearchTerm, setPoliticalPersonSearchTerm] = useState("");
  const [memberSearchTerm, setMemberSearchTerm] = useState("");
  const [confirmationInput, setConfirmationInput] = useState(''); // Added state for confirmation input

  // Confirmation modal states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [actionMember, setActionMember] = useState(null);

  const [errors, setErrors] = useState({});

  const [politicalPersons, setPoliticalPersons] = useState([]);
  const [filteredPoliticalPersons, setFilteredPoliticalPersons] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [memberData, setMemberData] = useState(null);
  const dispatch = useDispatch();
  const sendOtp = useSendOtp();

  const { data: userData } = useUserPlan();

  const addMember = useAddMember();
  const updateMember = useUpdateMember();
  const deleteMember = useDeleteUser();
  const resetMemberKey = useResetUserKey();
  const updateVerification = useUpdateVerfication();


  useEffect(() => {
    if (userData?.data.length > 0) {
      const politicalUsers = userData.data.filter((user) => user.type === "political" && user?.userPlans?.planDetails?.addMembers === true);
      setPoliticalPersons(politicalUsers);
    }
  }, [userData]);

  useEffect(() => {
    if (!politicalPersonSearchTerm) {
      setFilteredPoliticalPersons(politicalPersons || []);
      return;
    }
    const result = politicalPersons.length > 0 ? politicalPersons.filter(person =>
      person.name?.toLowerCase().includes(politicalPersonSearchTerm.toLowerCase()) ||
      person.mobile?.includes(politicalPersonSearchTerm)
    ) : [];

    setFilteredPoliticalPersons(result);
  }, [politicalPersons, politicalPersonSearchTerm]);

  const handleFetchMembers = async (id) => {
    try {
      const response = await getUserMembers(id);

      if (response.data) {
        setMemberData(response.data);

        setShowMemberTable(true);
      } else {
        dispatch(showToast({ message: "No data found for this user." }));
      }
    } catch (error) {
      dispatch(showToast({ message: error.message }));
    }
  };

  useEffect(() => {
    if (!memberSearchTerm) {
      setFilteredMembers(memberData || []);
      return;
    }

    const result = memberData.length > 0 ? memberData.filter((member) =>
      member.name.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
      member.mobile.toLowerCase().includes(memberSearchTerm.toLowerCase())) : []

    setFilteredMembers(result)

  }, [memberData, memberSearchTerm])



  const handleSearch = (e) => setSearchTerm(e.target.value);

  const setEditMembers = (id, userId) => {
    if (editMember.name === '' || !/^\d{10}$/.test(editMember.mobile)) {
      dispatch(showToast({ message: 'All Valid Fields Are Required', type: 'error' }));
      return;
    }

    updateMember.mutate({ memberId: id, memberData: editMember }, {
      onSuccess: () => {
        setEditIndex(null);
        setEditMember({ name: "", mobile: "" });
        dispatch(showToast({ message: 'Member Details Updated' }))
        handleFetchMembers(userId)
      },
      onError: (error) => dispatch(showToast({ message: error, type: 'error' })),

    })

  };

  const selectPerson = (person) => {
    setSelectedPerson(person);

    setSelectedPlan(person.userPlans.planDetails);
    setSearchTerm("");
    setShowAddMember(false);
  };

  const clearSelectedPerson = () => {
    setSelectedPerson(null);
    setSelectedPlan("");
    setShowMemberTable(false);
  };

  const toggleAddMemberForm = () => {
    setShowAddMember(!showAddMember);
  };

  const handleNewMemberChange = (e) => {
    setNewMember({ ...newMember, [e.target.name]: e.target.value });
  };




  const validate = () => {
    let tempErrors = {};

    // Name validation
    if (!newMember.name.trim()) {
      tempErrors.name = "Name is required";
    }

    // mobile validation
    if (!newMember.mobile) {
      tempErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(newMember.mobile)) {
      tempErrors.mobile = "Mobile number must be exactly 10 digits";
    }

    // Password validation
    if (!newMember.password) {
      tempErrors.password = "Password is required";
    } else if (newMember.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }
    // OTP validation
    if (!newMember.otp) {
      tempErrors.otp = "OTP is required";
    } else if (!/^\d{4}$/.test(newMember.otp)) {
      tempErrors.otp = "OTP must be exactly 4 digits";
    }


    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmitNewMember = () => {
    if (validate()) {
      addMember.mutate({ userId: selectedPerson._id, memberData: newMember }, {
        onSuccess: () => {
          setNewMember({ name: "", mobile: "", otp: "", password: "member@123" });
          setShowAddMember(false);

          dispatch(showToast({ message: "New Member Added Successfully" }))
        },
        onError: (error) => dispatch(showToast({ message: error, type: 'error' })),

      })
    }
  };

  const handleEditChange = (e) => {
    setEditMember({ ...editMember, [e.target.name]: e.target.value });
  };

  const handleAction = (action, index, member) => {
    switch (action) {
      case "edit":
        setEditIndex(index);
        setEditMember(member);
        break;
      case "delete":
        setActionMember(member);
        setShowDeleteConfirm(true);
        break;
      case "reset":
        setActionMember(member);
        setShowResetConfirm(true);
        break;

      default:
        break;
    }
  };


  // Handle Toggle Verification
  const handleToggleVerification = (member) => {
    updateVerification.mutate({ userId: member._id, status: !member.verified }, {
      onSuccess: () => {
        handleFetchMembers(member.userId)
        dispatch(showToast({ message: "Member Verifiaction Updated" }))
      },
      onError: (error) => dispatch(showToast({ message: error, type: 'error' }))
    })
  };

  const handleGetOtp = () => {
    if (!newMember.mobile) {
      dispatch(showToast({ message: "Mobile number is required", type: 'warn' }));
      return;
    }

    if (!/^\d{10}$/.test(newMember.mobile)) {
      dispatch(showToast({ message: "Mobile number must be 10 digits", type: 'warn' }));
      return;
    }

    sendOtp.mutate(newMember.mobile, {
      onSuccess: () => {
        dispatch(showToast({ message: "OTP Sent to Mobile No", type: 'success' }));
      },
      onError: (error) => {
        dispatch(showToast({ message: error, type: 'error' }));
      },
    });
  };

  const handleDelete = () => {
    deleteMember.mutate(actionMember._id, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        handleFetchMembers(actionMember.userId)
        setActionMember(null);
        dispatch(showToast({ message: "Member Deleted Successfully" }))
      },
      onError: (error) => dispatch(showToast({ message: error, type: 'error' })),

    })
  };

  const handleResetKey = () => {
    resetMemberKey.mutate(actionMember._id, {
      onSuccess: () => {
        setShowResetConfirm(false);
        handleFetchMembers(actionMember.userId)
        setActionMember(null);
        dispatch(showToast({ message: "Member Key has been reset" }))
      },
      onError: (error) => dispatch(showToast({ message: error, type: 'error' })),
    })

  };

  return (
    <div className="Form  flex flex-col items-center h-screen">
      <div className="flex gap-6 w-full">
        <div className={`p-6 py-10 flex flex-col justify-center items-center rounded-lg ${selectedPerson ? "w-2/3" : "w-full"}`}>
          <h1 className="text-3xl font-bold text-[#640D5F] mb-6">Member Management</h1>

          <div className="relative mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search Politician..."
              className="p-2 border rounded-lg w-150"
            />
            {searchTerm && (
              <div className="absolute bg-white border mt-1 w-150 shadow-lg rounded-lg max-h-60 overflow-y-auto">
                {politicalPersons.length === 0 ? (
                  <div className="p-2 text-gray-500">No users found</div>
                ) : (
                  politicalPersons
                    .filter((person) =>
                      person.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((person, index) => (
                      <div
                        key={index}
                        onClick={() => selectPerson(person)}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                      >
                        {person.name}
                      </div>
                    ))
                )}
              </div>
            )}
          </div>


          {selectedPerson && (
            <div className="flex items-center gap-2 mb-4 ">
              <p className="text-green-600 font-semibold">Selected Politician: {selectedPerson.name}</p>
              <button onClick={clearSelectedPerson} className="text-red-500 hover:text-red-700" style={{ boxShadow: "none" }}>Clear</button>
            </div>
          )}

          <div className="flex space-x-4 mt-10">
            <button
              style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)" }}
              className={`bg-[#aa1ba3] text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-[#640D5F] transition duration-200 ${!selectedPerson ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={toggleAddMemberForm}
              disabled={!selectedPerson} // Disable button if no political person is selected
            >
              ➕ Add Member
            </button>
          </div>

          {showAddMember && (
            <div className="mt-4 p-4 rounded-lg bg-[#faf1f9] w-100" style={{ boxShadow: "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset" }}>
              <h3 className="text-lg font-bold mb-2">Add New Member</h3>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newMember.name}
                onChange={handleNewMemberChange}
                className="w-full p-2 mb-2 border rounded"
              />
              {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}

              <input
                type="mobile"
                name="mobile"
                placeholder="Mobile No."
                value={newMember.mobile}
                onChange={handleNewMemberChange}
                className="w-full p-2 mb-2 border rounded"
              />
              {errors.mobile && <p className="text-red-400 text-sm">{errors.mobile}</p>}

              <div className="flex items-center space-x-2 my-2 mt-2">
                <button
                  className="bg-blue-500 w-1/2 text-white px-4 py-2 rounded hover:bg-blue-600 shadow-md transition-transform transform hover:scale-105"
                  onClick={handleGetOtp}
                >
                  Get OTP
                </button>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={newMember.otp}
                  onChange={handleNewMemberChange}

                  className="w-1/2 p-2 border rounded"
                />
                {errors.otp && <p className="text-red-400 text-sm">{errors.otp}</p>}

              </div>
              <label htmlFor="password">Default Password</label>
              <input
                type="text"
                name="password"
                value={newMember.password}
                onChange={handleNewMemberChange}
                className="w-full p-2 mb-2 border rounded"
              />
              {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}


              <div className="flex justify-center mt-4">
                <button
                  className="bg-[#aa1ba3] text-white px-4 py-2 rounded hover:bg-green-600 shadow-md transition-transform transform hover:scale-105"
                  onClick={handleSubmitNewMember}
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>

        {selectedPerson && (
          <div className="bg-[#bd4fb7] p-6 rounded-lg shadow-md w-1/3 h-64 text-white flex flex-col justify-center items-center">
            <h2 className="text-lg font-bold mb-2">Plan Information</h2>
            {selectedPlan && (
              <>
                <p className="text-2xl font-bold">{selectedPlan.name}</p>
                <p className="text-xl"><span className="text-green-400">{selectedPlan.validity} Days</span> Validity</p>
              </>
            )}

          </div>
        )}
      </div>

      <div className="mt-6 w-full p-4 rounded-lg overflow-x-auto">
        {showMemberTable && viewedPoliticalPerson && (

          <div className="mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Members under {viewedPoliticalPerson.name}</h3>
              <button
                onClick={() => {
                  setShowMemberTable(false);
                  setViewedPoliticalPerson(null);
                }}
                className="text-red-500 hover:text-red-700 p-2 rounded-xl"
                style={{ boxShadow: "none", border: "2px solid red" }}
              >
                ✖ Close
              </button>
            </div>
            <input
              type="text"
              value={memberSearchTerm}
              onChange={(e) => setMemberSearchTerm(e.target.value)}
              placeholder="Search Members..."
              className="p-1 border rounded-lg w-70 mb-4 center mt-2"
            />
            {filteredMembers && filteredMembers.length > 0 ? (
              <table className="w-full border-collapse border border-gray-300 mt-2">
                <thead>
                  <tr className="bg-[#ebace8]">
                    <th className="border px-4 py-2">Name</th>
                    <th className="border px-4 py-2">Mobile Number</th>
                    {/* <th className="border px-4 py-2">Default Password</th> */}
                    <th className="border px-4 py-2">Verified</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member, memberIndex) => {

                    const actualIndex = filteredMembers.findIndex((e) => e._id === member._id);

                    return (
                      <tr key={memberIndex} className="text-center hover:bg-gray-100 h-16">
                        <td className="border px-4 py-2">
                          {editIndex === actualIndex ? (
                            <input
                              type="text"
                              name="name"
                              value={editMember.name}
                              onChange={handleEditChange}
                              className="p-1 border rounded"
                            />
                          ) : (
                            member.name
                          )}
                        </td>
                        <td className="border px-4 py-2">
                          {editIndex === actualIndex ? (
                            <input
                              type="mobile"
                              name="mobile"
                              value={editMember.mobile}
                              onChange={handleEditChange}
                              className="p-1 border rounded"
                            />
                          ) : (
                            member.mobile
                          )}
                        </td>
                        {/* <td className="border px-4 py-2">
                            {editIndex === actualIndex ? (
                              <input
                                type="text"
                                name="defaultPassword"
                                value={editMember.defaultPassword}
                                onChange={handleEditChange}
                                className="p-1 border rounded"
                              />
                            ) : (
                              member.password
                            )}
                          </td> */}
                        <td className="border px-4 py-2">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={member.verified}
                              onChange={() => handleToggleVerification(member)}
                              className="sr-only"
                            />
                            <div className={`w-9 h-4 rounded-full ${member.verified ? "bg-green-500" : "bg-gray-500"} shadow-inner transition-colors duration-200`}>
                              <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${member.verified ? "translate-x-5" : "translate-x-0"}`} />
                            </div>
                          </label>
                        </td>
                        <td className="border px-4 py-2">
                          {editIndex === actualIndex ? (
                            <button
                              className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 shadow-md transition-transform transform hover:scale-105"
                              onClick={() => setEditMembers(member._id, member.userId)}
                            >
                              Save
                            </button>
                          ) : (
                            <>
                              <button
                                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 shadow-md transition-transform transform hover:scale-105"
                                onClick={() => handleAction("edit", actualIndex, member)}
                              >
                                Edit
                              </button>
                              <button
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 shadow-md transition-transform transform hover:scale-105 ml-2"
                                onClick={() => handleAction("delete", actualIndex, member)}
                              >
                                Delete
                              </button>
                              <button
                                className="bg-[#0dcaf0] text-white px-2 py-1 rounded hover:bg-[#0dcaf0d4] shadow-md transition-transform transform hover:scale-105 ml-2"
                                onClick={() => handleAction("reset", actualIndex, member)}
                              >
                                Reset Key
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-500">No Members found for {viewedPoliticalPerson.name}.</p>
            )}
          </div>
        )}

        <div className="mt-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold">Politicians</h2>
          </div>

          {showTable && (
            <>
              <input
                type="text"
                value={politicalPersonSearchTerm}
                onChange={(e) => setPoliticalPersonSearchTerm(e.target.value)}
                placeholder="Search Politician..."
                className="p-1 border rounded-lg w-70 mb-4"
              />
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-[#ebace8]">
                    <th className="border px-4 py-2">Politicians</th>
                    <th className="border px-4 py-2">Member Count</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPoliticalPersons.map((politicalPerson) => (
                    <tr key={politicalPerson._id} className="text-center hover:bg-gray-100 h-16">
                      <td className="border px-4 py-2">{politicalPerson.name}</td>
                      <td className="border px-4 py-2">{politicalPerson.memberCount || 0}</td>
                      <td className="border px-4 py-2">
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 shadow-md transition-transform transform hover:scale-105"
                          onClick={() => {
                            setViewedPoliticalPerson(politicalPerson);
                            handleFetchMembers(politicalPerson._id)

                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center border border-gray-300">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-2">Enter 'confirm' to delete this Member:</p>
            <input
              type="text"
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              className="border rounded p-2 mb-4"
            />
            <div className="flex justify-center mt-4">
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
        </div>
      )}

      {/* Reset Key Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center border border-gray-300">
            <h2 className="text-xl font-bold mb-4">Confirm Reset Key</h2>
            <p className="mb-2">Are you sure you want to reset the Member Key?</p>
            <div className="flex justify-center mt-4">
              <button
                onClick={handleResetKey}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded hover:bg-gray-400 transition ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManagement;