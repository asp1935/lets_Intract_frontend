/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDeleteUser, useResetUserKey, useUpdateVerfication, useUser, useUserPlan } from "../hooks/useUser";
import { showToast } from "../redux/slice/ToastSlice";
import { useDispatch } from "react-redux";
import { useSendOtp } from "../hooks/useOtp";
import { useAddMember, useUpdateMember } from "../hooks/useMember";
import { getUserMembers } from "../api/memberApi";

const EmployeeManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("");

  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: "", mobile: "", otp: "", password: "member@123" });
  const [showTable, setShowTable] = useState(true);
  const [editIndex, setEditIndex] = useState(null);
  const [editEmployee, setEditEmployee] = useState({ name: "", mobile: "" });
  const [viewedBusinessPerson, setViewedBusinessPerson] = useState(null);
  const [showEmployeeTable, setShowEmployeeTable] = useState(false);
  const [businessPersonSearchTerm, setBusinessPersonSearchTerm] = useState("");
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");
  const [confirmationInput, setConfirmationInput] = useState(''); // Added state for confirmation input

  // Confirmation modal states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [actionEmployee, setActionEmployee] = useState(null);

  const [errors, setErrors] = useState({});

  const [businessPersons, setBusinessPersons] = useState([]);
  const [filteredBusinessPersons, setFilteredBusinessPersons] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [employeeData, setEmployeeData] = useState(null);
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
      const businessUsers = userData.data.filter((user) => user.type === "business" && user?.userPlans?.planDetails?.addMembers === true);
      setBusinessPersons(businessUsers);
    }
  }, [userData]);

  useEffect(() => {
    if (!businessPersonSearchTerm) {
      setFilteredBusinessPersons(businessPersons || []);
      return;
    }
    const result = businessPersons.length > 0 ? businessPersons.filter(person =>
      person.name?.toLowerCase().includes(businessPersonSearchTerm.toLowerCase()) ||
      person.mobile?.includes(businessPersonSearchTerm)
    ) : [];

    setFilteredBusinessPersons(result);
  }, [businessPersons, businessPersonSearchTerm]);

  const handleFetchEmployees = async (id) => {
    try {
      const response = await getUserMembers(id);

      if (response.data) {
        setEmployeeData(response.data);

        setShowEmployeeTable(true);
      } else {
        dispatch(showToast({ message: "No data found for this user." }));
      }
    } catch (error) {
      dispatch(showToast({ message: error.message }));
    }
  };

  useEffect(() => {
    if (!employeeSearchTerm) {
      setFilteredEmployees(employeeData || []);
      return;
    }

    const result = employeeData.length > 0 ? employeeData.filter((employee) =>
      employee.name.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
      employee.mobile.toLowerCase().includes(employeeSearchTerm.toLowerCase())) : []

    setFilteredEmployees(result)

  }, [employeeData, employeeSearchTerm])



  const handleSearch = (e) => setSearchTerm(e.target.value);

  const setEditEmployees = (id, userId) => {
    if (editEmployee.name === '' || !/^\d{10}$/.test(editEmployee.mobile)) {
      dispatch(showToast({ message: 'All Valid Fields Are Required', type: 'error' }));
      return;
    }

    updateMember.mutate({ memberId: id, memberData: editEmployee }, {
      onSuccess: () => {
        setEditIndex(null);
        setEditEmployee({ name: "", mobile: "" });
        dispatch(showToast({ message: 'Employee Details Updated' }))
        handleFetchEmployees(userId)
      },
      onError: (error) => dispatch(showToast({ message: error, type: 'error' })),

    })

  };

  const selectPerson = (person) => {
    setSelectedPerson(person);

    setSelectedPlan(person.userPlans.planDetails);
    setSearchTerm("");
    setShowAddEmployee(false);
  };

  const clearSelectedPerson = () => {
    setSelectedPerson(null);
    setSelectedPlan("");
    setShowEmployeeTable(false);
  };

  const toggleAddEmployeeForm = () => {
    setShowAddEmployee(!showAddEmployee);
  };

  const handleNewEmployeeChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };




  const validate = () => {
    let tempErrors = {};

    // Name validation
    if (!newEmployee.name.trim()) {
      tempErrors.name = "Name is required";
    }

    // mobile validation
    if (!newEmployee.mobile) {
      tempErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(newEmployee.mobile)) {
      tempErrors.mobile = "Mobile number must be exactly 10 digits";
    }

    // Password validation
    if (!newEmployee.password) {
      tempErrors.password = "Password is required";
    } else if (newEmployee.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }
    // OTP validation
    if (!newEmployee.otp) {
      tempErrors.otp = "OTP is required";
    } else if (!/^\d{4}$/.test(newEmployee.otp)) {
      tempErrors.otp = "OTP must be exactly 4 digits";
    }


    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmitNewEmployee = () => {
    if (validate()) {
      addMember.mutate({ userId: selectedPerson._id, memberData: newEmployee }, {
        onSuccess: () => {
          setNewEmployee({ name: "", mobile: "", otp: "", password: "member@123" });
          setShowAddEmployee(false);

          dispatch(showToast({ message: "New Employee Added Successfully" }))
        },
        onError: (error) => dispatch(showToast({ message: error, type: 'error' })),

      })
    }
  };

  const handleEditChange = (e) => {
    setEditEmployee({ ...editEmployee, [e.target.name]: e.target.value });
  };

  const handleAction = (action, index, employee) => {
    switch (action) {
      case "edit":
        setEditIndex(index);
        setEditEmployee(employee);
        break;
      case "delete":
        setActionEmployee(employee);
        setShowDeleteConfirm(true);
        break;
      case "reset":
        setActionEmployee(employee);
        setShowResetConfirm(true);
        break;

      default:
        break;
    }
  };


  // Handle Toggle Verification
  const handleToggleVerification = (employee) => {
    updateVerification.mutate({ userId: employee._id, status: !employee.verified }, {
      onSuccess: () => {
        handleFetchEmployees(employee.userId)
        dispatch(showToast({ message: "Employee Verifiaction Updated" }))
      },
      onError: (error) => dispatch(showToast({ message: error, type: 'error' }))
    })
  };

  const handleGetOtp = () => {
    if (!newEmployee.mobile) {
      dispatch(showToast({ message: "Mobile number is required", type: 'warn' }));
      return;
    }

    if (!/^\d{10}$/.test(newEmployee.mobile)) {
      dispatch(showToast({ message: "Mobile number must be 10 digits", type: 'warn' }));
      return;
    }

    sendOtp.mutate(newEmployee.mobile, {
      onSuccess: () => {
        dispatch(showToast({ message: "OTP Sent to Mobile No", type: 'success' }));
      },
      onError: (error) => {
        dispatch(showToast({ message: error, type: 'error' }));
      },
    });
  };

  const handleDelete = () => {
    deleteMember.mutate(actionEmployee._id, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        handleFetchEmployees(actionEmployee.userId)
        setActionEmployee(null);
        dispatch(showToast({ message: "Employee Deleted Successfully" }))
      },
      onError: (error) => dispatch(showToast({ message: error, type: 'error' })),

    })
  };

  const handleResetKey = () => {
    resetMemberKey.mutate(actionEmployee._id, {
      onSuccess: () => {
        setShowResetConfirm(false);
        handleFetchEmployees(actionEmployee.userId)
        setActionEmployee(null);
        dispatch(showToast({ message: "Employee Key has been reset" }))
      },
      onError: (error) => dispatch(showToast({ message: error, type: 'error' })),
    })

  };

  return (
    <div className="Form mt-10 flex flex-col items-center">
      <div className="flex gap-6 w-full">
        <div className={`p-6 py-10 flex flex-col justify-center items-center rounded-lg ${selectedPerson ? "w-2/3" : "w-full"}`}>
          <h1 className="text-3xl font-bold text-[#640D5F] mb-6">Employee Management</h1>

          <div className="relative mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search customer..."
              className="p-2 border rounded-lg w-150"
            />
            {searchTerm && (
              <div className="absolute bg-white border mt-1 w-150 shadow-lg rounded-lg max-h-60 overflow-y-auto">
                {businessPersons.length === 0 ? (
                  <div className="p-2 text-gray-500">No users found</div>
                ) : (
                  businessPersons
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
              <p className="text-green-600 font-semibold">Selected customer: {selectedPerson.name}</p>
              <button onClick={clearSelectedPerson} className="text-red-500 hover:text-red-700" style={{ boxShadow: "none" }}>Clear</button>
            </div>
          )}

          <div className="flex space-x-4 mt-10">
            <button
              style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)" }}
              className={`bg-[#aa1ba3] text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-[#640D5F] transition duration-200 ${!selectedPerson ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={toggleAddEmployeeForm}
              disabled={!selectedPerson} // Disable button if no business person is selected
            >
              ➕ Add Employee
            </button>
          </div>

          {showAddEmployee && (
            <div className="mt-4 p-4 rounded-lg bg-[#faf1f9] w-100" style={{ boxShadow: "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset" }}>
              <h3 className="text-lg font-bold mb-2">Add New Employee</h3>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newEmployee.name}
                onChange={handleNewEmployeeChange}
                className="w-full p-2 mb-2 border rounded"
              />
              {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}

              <input
                type="mobile"
                name="mobile"
                placeholder="Mobile No."
                value={newEmployee.mobile}
                onChange={handleNewEmployeeChange}
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
                  value={newEmployee.otp}
                  onChange={handleNewEmployeeChange}

                  className="w-1/2 p-2 border rounded"
                />
                {errors.otp && <p className="text-red-400 text-sm">{errors.otp}</p>}

              </div>
              <label htmlFor="password">Default Password</label>
              <input
                type="text"
                name="password"
                value={newEmployee.password}
                onChange={handleNewEmployeeChange}
                className="w-full p-2 mb-2 border rounded"
              />
              {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}


              <div className="flex justify-center mt-4">
                <button
                  className="bg-[#aa1ba3] text-white px-4 py-2 rounded hover:bg-green-600 shadow-md transition-transform transform hover:scale-105"
                  onClick={handleSubmitNewEmployee}
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
        {showEmployeeTable && viewedBusinessPerson && (

          <div className="mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Employees under {viewedBusinessPerson.name}</h3>
              <button
                onClick={() => {
                  setShowEmployeeTable(false);
                  setViewedBusinessPerson(null);
                }}
                className="text-red-500 hover:text-red-700 p-2 rounded-xl"
                style={{ boxShadow: "none", border: "2px solid red" }}
              >
                ✖ Close
              </button>
            </div>
            <input
              type="text"
              value={employeeSearchTerm}
              onChange={(e) => setEmployeeSearchTerm(e.target.value)}
              placeholder="Search employees..."
              className="p-1 border rounded-lg w-70 mb-4 center mt-2"
            />
            {filteredEmployees && filteredEmployees.length > 0 ? (
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
                  {filteredEmployees.map((employee, employeeIndex) => {

                    const actualIndex = filteredEmployees.findIndex((e) => e._id === employee._id);

                    return (
                      <tr key={employeeIndex} className="text-center hover:bg-gray-100 h-16">
                        <td className="border px-4 py-2">
                          {editIndex === actualIndex ? (
                            <input
                              type="text"
                              name="name"
                              value={editEmployee.name}
                              onChange={handleEditChange}
                              className="p-1 border rounded"
                            />
                          ) : (
                            employee.name
                          )}
                        </td>
                        <td className="border px-4 py-2">
                          {editIndex === actualIndex ? (
                            <input
                              type="mobile"
                              name="mobile"
                              value={editEmployee.mobile}
                              onChange={handleEditChange}
                              className="p-1 border rounded"
                            />
                          ) : (
                            employee.mobile
                          )}
                        </td>
                        {/* <td className="border px-4 py-2">
                          {editIndex === actualIndex ? (
                            <input
                              type="text"
                              name="defaultPassword"
                              value={editEmployee.defaultPassword}
                              onChange={handleEditChange}
                              className="p-1 border rounded"
                            />
                          ) : (
                            employee.password
                          )}
                        </td> */}
                        <td className="border px-4 py-2">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={employee.verified}
                              onChange={() => handleToggleVerification(employee)}
                              className="sr-only"
                            />
                            <div className={`w-9 h-4 rounded-full ${employee.verified ? "bg-green-500" : "bg-gray-500"} shadow-inner transition-colors duration-200`}>
                              <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${employee.verified ? "translate-x-5" : "translate-x-0"}`} />
                            </div>
                          </label>
                        </td>
                        <td className="border px-4 py-2">
                          {editIndex === actualIndex ? (
                            <button
                              className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 shadow-md transition-transform transform hover:scale-105"
                              onClick={() => setEditEmployees(employee._id, employee.userId)}
                            >
                              Save
                            </button>
                          ) : (
                            <>
                              <button
                                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 shadow-md transition-transform transform hover:scale-105"
                                onClick={() => handleAction("edit", actualIndex, employee)}
                              >
                                Edit
                              </button>
                              <button
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 shadow-md transition-transform transform hover:scale-105 ml-2"
                                onClick={() => handleAction("delete", actualIndex, employee)}
                              >
                                Delete
                              </button>
                              <button
                                className="bg-[#0dcaf0] text-white px-2 py-1 rounded hover:bg-[#0dcaf0d4] shadow-md transition-transform transform hover:scale-105 ml-2"
                                onClick={() => handleAction("reset", actualIndex, employee)}
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
              <p className="text-center text-gray-500">No employees found for {viewedBusinessPerson.name}.</p>
            )}
          </div>
        )}

        <div className="mt-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold">Customers</h2>
          </div>

          {showTable && (
            <>
              <input
                type="text"
                value={businessPersonSearchTerm}
                onChange={(e) => setBusinessPersonSearchTerm(e.target.value)}
                placeholder="Search customer..."
                className="p-1 border rounded-lg w-70 mb-4"
              />
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-[#ebace8]">
                    <th className="border px-4 py-2">Customers</th>
                    <th className="border px-4 py-2">Employee Count</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBusinessPersons.map((businessPerson) => (
                    <tr key={businessPerson._id} className="text-center hover:bg-gray-100 h-16">
                      <td className="border px-4 py-2">{businessPerson.name}</td>
                      <td className="border px-4 py-2">{businessPerson.memberCount || 0}</td>
                      <td className="border px-4 py-2">
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 shadow-md transition-transform transform hover:scale-105"
                          onClick={() => {
                            setViewedBusinessPerson(businessPerson);
                            handleFetchEmployees(businessPerson._id)

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
            <p className="mb-2">Enter 'confirm' to delete this employee:</p>
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
            <p className="mb-2">Are you sure you want to reset the Employee Key?</p>
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

export default EmployeeManagement;