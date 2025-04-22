import React, { useEffect, useState } from "react";
import "./application.css";
import { useDispatch } from "react-redux";
import { useAddUser, useUser } from "../hooks/useUser";
import { useSendOtp } from "../hooks/useOtp";
import { showToast } from "../redux/slice/ToastSlice";
import { useAdmin } from "../hooks/useAdmin";
import { useAssociate } from "../hooks/useAssociate";
import { useDistrict, useTaluka } from "../hooks/useAddress";

const AddCustomer = () => {
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    district: "",
    taluka: "",
    state: "",
    otp: "",
    type: 'business'
  });

  const [errors, setErrors] = useState({});
  const [customers, setCustomers] = useState([]);
  const [referencedBy, setReferencedBy] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedReferral, setSelectedRefferal] = useState(null);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [filteredAssociate, setFilteredAssociate] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const states = ["Maharastra"];
  const { data: districtData } = useDistrict();
  const { data: talukaData } = useTaluka(districts?.find(dist => dist?.districtnameenglish === customerData?.district)?.districtcode)

  useEffect(() => {
    if (districtData?.length > 0) {
      setDistricts(districtData);
    }
  }, [districtData])


  useEffect(() => {
    if (talukaData?.length > 0) {
      setTalukas(talukaData);
    }
  }, [talukaData])

  const dispatch = useDispatch();
  const sendOtp = useSendOtp();

  const addUser = useAddUser();
  const { data } = useUser(null, "user", "business");
  const { data: staffData } = useAdmin(null, 'user');  // Fetch staff 
  const { data: associateData } = useAssociate(); // Fetch associates 


  useEffect(() => {
    if (data?.data.length > 0) {
      setCustomers(data.data)
    }
  }, [data])


  useEffect(() => {
    if (!searchInput) {
      setFilteredStaff(staffData?.data || []);
      return;
    }

    const result = staffData?.data.length > 0 ? staffData?.data?.filter(staffMember =>
      staffMember.role==='user' && (
      staffMember.name?.toLowerCase().includes(searchInput.toLowerCase()) ||
      staffMember.mobile?.includes(searchInput))
    ) : [];

    setFilteredStaff(result);
  }, [staffData, searchInput]);

  useEffect(() => {
    if (associateData?.data.length > 0) {
      const result = associateData.data.filter(associate =>
        associate.name?.toLowerCase().includes(searchInput.toLowerCase()) ||
        associate.mobile?.includes(searchInput)
      );
      setFilteredAssociate(result);
    }
  }, [associateData, searchInput]);





  const validate = () => {
    let tempErrors = {};

    // Name validation
    if (!customerData.name.trim()) {
      tempErrors.name = "Name is required";
    }

    // Email validation
    if (!customerData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(customerData.email)) {
      tempErrors.email = "Email is not valid";
    }

    // mobile validation
    if (!customerData.mobile) {
      tempErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(customerData.mobile)) {
      tempErrors.mobile = "Mobile number must be exactly 10 digits";
    }

    // Password validation
    if (!customerData.password) {
      tempErrors.password = "Password is required";
    } else if (customerData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    // State validation
    if (!customerData.state) {
      tempErrors.state = "State is required";
    }

    // District validation
    if (!customerData.district) {
      tempErrors.district = "District is required";
    }

    // Taluka validation
    if (!customerData.taluka) {
      tempErrors.taluka = "Taluka is required";
    }

    // OTP validation
    if (!customerData.otp) {
      tempErrors.otp = "OTP is required";
    } else if (!/^\d{4}$/.test(customerData.otp)) {
      tempErrors.otp = "OTP must be exactly 4 digits";
    }


    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  const handleChange = (e) => {
    setCustomerData({ ...customerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      addUser.mutate({ userData: customerData, referBy: referencedBy, referId: selectedReferral._id }, {
        onSuccess: () => {
          dispatch(showToast({ message: " Registered Successfully!" }))
          setCustomerData({ name: "", email: "", mobile: "", password: "", district: "", taluka: "", state: "", otp: "", type: 'business' });
          setErrors({});
          setReferencedBy("");
          setSearchInput("");
          setSelectedRefferal(null);
        },
        onError: (error) => dispatch(showToast({ message: error, type: 'error' })),

      })


      // setSelectedStaff(null);
    }
  };

  const handleReferencedByChange = (e) => {
    setReferencedBy(e.target.value);
    if (e.target.value === "") {
      setSearchInput("");
      setSelectedRefferal(null);
      // setSelectedStaff(null);
    }
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  // const filteredAssociates = associates.filter(associate =>
  //   associate.name.toLowerCase().includes(searchInput.toLowerCase()) ||
  //   associate.mobile.includes(searchInput)
  // );

  // const filteredStaff = staffData?.data?.filter(staffMember =>
  //   staffMember.name.toLowerCase().includes(searchInput.toLowerCase()) ||
  //   staffMember.mobile.includes(searchInput)
  // );

  const handleSelectReferral = (referral) => {
    setSelectedRefferal(referral);
    setSearchInput(""); // Clear search input after selection
  };

  // const handleSelectStaff = (staffMember) => {
  //   setSelectedStaff(staffMember);
  //   setSearchInput(""); // Clear search input after selection
  // };

  const handleGetOtp = () => {
    if (!customerData.mobile) {
      dispatch(showToast({ message: "Mobile number is required", type: 'warn' }));
      return;
    }

    if (!/^\d{10}$/.test(customerData.mobile)) {
      dispatch(showToast({ message: "Mobile number must be 10 digits", type: 'warn' }));
      return;
    }

    sendOtp.mutate(customerData.mobile, {
      onSuccess: () => {
        dispatch(showToast({ message: "OTP Sent to Mobile No", type: 'success' }));
      },
      onError: (error) => {
        dispatch(showToast({ message: error, type: 'error' }));
      },
    });
  };

  return (
    <>
      <div className="Form max-w-xl mx-auto mt-10 p-6 rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#640D5F]" style={{ textShadow: "3px 3px 10px rgba(100, 13, 95, 0.7)" }}>Add Customer</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Customer Name" value={customerData.name} onChange={handleChange} className="w-full rounded p-2 border border-[#640D5F]" />
          {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}

          <input type="email" name="email" placeholder="Email" value={customerData.email} onChange={handleChange} className="w-full rounded p-2 border  border-[#640D5F]" />
          {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}

          <div className="flex items-center space-x-2">
            <input type="tel" name="mobile" placeholder="Mobile Number" value={customerData.mobile} onChange={handleChange} className="flex-1/2 rounded p-2 border border-[#640D5F]" />
            <button type="button" onClick={handleGetOtp} className="w-1/3 bg-[#e762e1] text-white cursor-pointer p-2 rounded-md">Get OTP</button>
            <input type="text" name='otp' placeholder="Enter OTP" value={customerData.otp} onChange={handleChange} className="w-1/3 rounded p-2 border border-[#640D5F]" />
          </div>
          {errors.mobile && <p className="text-red-400 text-sm">{errors.mobile}</p>}
          {errors.otp && <p className="text-red-400 text-sm">{errors.otp}</p>} {/* OTP error message */}

          <input type="password" name="password" placeholder="Password" value={customerData.password} onChange={handleChange} className="w-full rounded p-2 border border-[#640D5F]" />
          {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}

          <div className="flex space-x-2">
            <select name="state" value={customerData.state} onChange={handleChange} className="w-1/3 rounded p-2 border border-[#640D5F]">
              <option value="">State</option>
              {states.map((state) => (<option key={state} value={state}>{state}</option>))}
            </select>
            {errors.state && <p className="text-red-400 text-sm">{errors.state}</p>}
            <select name="district" value={customerData.district} onChange={handleChange} className="w-1/3 rounded p-2 border border-[#640D5F]" disabled={!customerData.state}>
              <option value="">District</option>
              {customerData.state && districts?.map((district) => (<option key={district.districtcode} value={district.districtnameenglish}>{district.districtnameenglish}</option>))}
            </select>
            {errors.district && <p className="text-red-400 text-sm">{errors.district}</p>}
            <select name="taluka" value={customerData.taluka} onChange={handleChange} className="w-1/3 p-2 rounded border border-[#640D5F]" disabled={!customerData.district}>
              <option value="">Taluka</option>
              {customerData.district && talukas?.map((taluka) => (<option key={taluka.subdistrictcode} value={taluka.subdistrictnameenglish}>{taluka.subdistrictnameenglish}</option>))}
            </select>
            {errors.taluka && <p className="text-red-400 text-sm">{errors.taluka}</p>}
          </div>

          <div className="mt-4">
            <h3 className="font-bold">Referenced By</h3>
            <div className="flex space-x-4">
              <label>
                <input type="radio" value="associates" checked={referencedBy === "associates"} onChange={handleReferencedByChange} />
                Associates
              </label>
              <label>
                <input type="radio" value="staff" checked={referencedBy === "staff"} onChange={handleReferencedByChange} />
                Staff
              </label>
            </div>

            <div className="flex mt-2">
              <div className="w-1/2 pr-2">
                {referencedBy === "associates" && (
                  <div>
                    <input
                      type="text"
                      placeholder="Search by Name or Mobile"
                      value={searchInput}
                      onChange={handleSearchChange}
                      className="w-full rounded p-2 border border-[#640D5F]"
                    />
                    {searchInput && filteredAssociate.length > 0 && (
                      <ul className="mt-2 border border-[#640D5F] rounded">
                        {filteredAssociate.map(associate => (
                          <li
                            key={associate._id} // Assuming MongoDB _id, adjust if needed
                            onClick={() => handleSelectReferral(associate)}
                            className="p-2 cursor-pointer hover:bg-[#ebace8]"
                          >
                            {associate.name} (Mobile: {associate.mobile})
                          </li>
                        ))}
                      </ul>
                    )}
                    {searchInput && filteredAssociate.length === 0 && (
                      <p className="text-red-500 mt-2">No matching associates found.</p>
                    )}
                  </div>
                )}

                {referencedBy === "staff" && (
                  <div>
                    <input
                      type="text"
                      placeholder="Search by Name or Mobile No."
                      value={searchInput}
                      onChange={handleSearchChange}
                      className="w-full rounded p-2 border border-[#640D5F]"
                    />

                    {searchInput && (filteredStaff?.length > 0 ? (
                      <ul className="mt-2 border border-[#640D5F] rounded">
                        {filteredStaff.map(staffMember => (
                          <li
                            key={staffMember._id}
                            onClick={() => handleSelectReferral(staffMember)}
                            className="p-2 cursor-pointer hover:bg-[#ebace8]"
                          >
                            {staffMember.name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-red-500 mt-2">No matching staff found.</p>
                    ))}
                  </div>
                )}

              </div>

              <div className="w-1/2 pl-2">
                {selectedReferral && (
                  <p className="mt-2">{selectedReferral.name} </p>
                )}
                {errors.referencedBy && <p className="text-red-400 text-sm">{errors.referencedBy}</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-center w-full">
            <button type="submit" className="w-40 bg-[#aa1ba3] hover:bg-[#640D5F] font-bold text-white p-2 mt-5 rounded-md">Add Customer</button>
          </div>
        </form>
      </div>

      <div>
        {customers.length > 0 && (
          <table className="mt-6 w-full border-collapse border border-[#aa1ba3] rounded">
            <thead>
              <tr className="bg-[#ebace8]">
                <th className="border border-[#aa1ba3] p-2">Sr. No.</th>
                <th className="border border-[#aa1ba3] p-2">Name</th>
                <th className="border border-[#aa1ba3] p-2">Email</th>
                <th className="border border-[#aa1ba3] p-2">Mobile</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr key={index}>
                  <td className="border border-[#aa1ba3] p-2">{index + 1}</td>
                  <td className="border border-[#aa1ba3] p-2">{customer.name}</td>
                  <td className="border border-[#aa1ba3] p-2">{customer.email}</td>
                  <td className="border border-[#aa1ba3] p-2">{customer.mobile}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default AddCustomer;