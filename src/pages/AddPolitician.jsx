import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSendOtp } from "../hooks/useOtp";
import { useAdmin } from "../hooks/useAdmin";
import { useAssociate } from "../hooks/useAssociate";
import { useAddUser, useUser } from "../hooks/useUser";
import { showToast } from "../redux/slice/ToastSlice";

const AddPolitician = () => {
  const [politicianData, setPoliticianData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    district: "",
    taluka: "",
    state: "",
    otp: "",
    type: "political"
  });

  const [errors, setErrors] = useState({});
  const [politicians, setPoliticians] = useState([]);
  const [referencedBy, setReferencedBy] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [selectedReferral, setSelectedRefferal] = useState(null);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [filteredAssociate, setFilteredAssociate] = useState([]);


  const dispatch = useDispatch();
  const sendOtp = useSendOtp();
  const addPolitician = useAddUser();
  const { data } = useUser(null, "user", "political");

  const { data: staffData } = useAdmin(null, 'user');  // Fetch staff 
  const { data: associateData } = useAssociate(); // Fetch associates 


  const states = ["State1", "State2", "State3"];
  const districts = { State1: ["District1", "District2"], State2: ["District3"], State3: ["District4", "District5"] };
  const talukas = { District1: ["Taluka1", "Taluka2"], District2: ["Taluka3"], District3: ["Taluka4"], District4: ["Taluka5"] };



  useEffect(() => {
    console.log(data);
    
    if (data) {
      setPoliticians(data.data)
    }
  }, [data])

  useEffect(() => {
    if (!searchInput) {
      setFilteredStaff(staffData?.data || []);
      return;
    }

    const result = staffData.data.length>0? staffData?.data?.filter(staffMember =>
      staffMember.name?.toLowerCase().includes(searchInput.toLowerCase()) ||
      staffMember.mobile?.includes(searchInput)
    ):[];

    setFilteredStaff(result);
  }, [staffData, searchInput]);

  useEffect(() => {
    if (associateData?.data.length>0) {
      const result = associateData.data.filter(associate =>
        associate.name?.toLowerCase().includes(searchInput.toLowerCase()) ||
        associate.mobile?.includes(searchInput)
      );
      setFilteredAssociate(result);
    }
  }, [associateData, searchInput]);



  // // Sample associates data
  // const associates = [
  //   { id: 1, name: "John Doe", mobile: "1234567890" },
  //   { id: 2, name: "Jane Smith", mobile: "0987654321" },
  //   { id: 3, name: "Alice Johnson", mobile: "1122334455" },
  // ];

  // // Sample staff data
  // const staff = [
  //   { id: 1, name: "Michael Brown", mobile: "2233445566" },
  //   { id: 2, name: "Emily Davis", mobile: "3344556677" },
  //   { id: 3, name: "David Wilson", mobile: "4455667788" },
  // ];

  const validate = () => {
    let tempErrors = {};

    // Name validation
    if (!politicianData.name.trim()) {
      tempErrors.name = "Name is required";
    }

    // Email validation
    if (!politicianData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(politicianData.email)) {
      tempErrors.email = "Email is not valid";
    }

    // mobile validation
    if (!politicianData.mobile) {
      tempErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(politicianData.mobile)) {
      tempErrors.mobile = "Mobile number must be exactly 10 digits";
    }

    // OTP validation
    if (!politicianData.otp) {
      tempErrors.otp = "OTP is required";
    } else if (!/^\d{4}$/.test(politicianData.otp)) {
      tempErrors.otp = "OTP must be exactly 6 digits";
    }

    // Password validation
    if (!politicianData.password) {
      tempErrors.password = "Password is required";
    } else if (politicianData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    // State validation
    if (!politicianData.state) {
      tempErrors.state = "State is required";
    }

    // District validation
    if (!politicianData.district) {
      tempErrors.district = "District is required";
    }

    // Taluka validation
    if (!politicianData.taluka) {
      tempErrors.taluka = "Taluka is required";
    }
    if(!selectedReferral){
      dispatch(showToast({message:"Select Referance",type:'warn'}))
      return 
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setPoliticianData({ ...politicianData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      addPolitician.mutate({ userData: politicianData, referBy: referencedBy, referId: selectedReferral._id }, {
        onSuccess: () => {
          dispatch(showToast({ message: " Registered Successfully!" }))
          setPoliticianData({ name: "", email: "", mobile: "", password: "", district: "", taluka: "", state: "",otp:"",type:'political' });
          setErrors({});
          setReferencedBy("");
          setSearchInput("");
          setSelectedRefferal(null);
        },
        onError: (error) => dispatch(showToast({ message: error, type: 'error' })),
      })

    }
  };

  const handleReferencedByChange = (e) => {
    setReferencedBy(e.target.value);
    if (e.target.value === "") {
      setSearchInput("");
      setSelectedRefferal(null);


    }
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  // const filteredAssociates = associates.filter(associate =>
  //   associate.name.toLowerCase().includes(searchInput.toLowerCase()) ||
  //   associate.mobile.includes(searchInput)
  // );

  // const filteredStaff = staff.filter(staffMember =>
  //   staffMember.name.toLowerCase().includes(searchInput.toLowerCase()) ||
  //   staffMember.mobile.includes(searchInput)
  // );

  const handleSelectReferral = (referral) => {
    setSelectedRefferal(referral);
    setSearchInput(""); // Clear search input after selection
  };

  // const handleSelectAssociate = (associate) => {
  //   setSelectedAssociate(associate);
  //   setSearchInput(""); // Clear search input after selection
  // };

  // const handleSelectStaff = (staffMember) => {
  //   setSelectedStaff(staffMember);
  //   setSearchInput(""); // Clear search input after selection
  // };

  const handleGetOtp = () => {
    // Logic to send OTP to the mobile number
    if (!politicianData.mobile) {
      dispatch(showToast({ message: "Mobile number is required", type: 'warn' }));
      return;
    }

    if (!/^\d{10}$/.test(politicianData.mobile)) {
      dispatch(showToast({ message: "Mobile number must be 10 digits", type: 'warn' }));
      return;
    }

    sendOtp.mutate(politicianData.mobile, {
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
        <h2 className="text-3xl font-bold mb-6 text-center text-[#640D5F]" style={{ textShadow: "3px 3px 10px rgba(100, 13, 95, 0.7)" }}>Add Politician</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Politician Name" value={politicianData.name} onChange={handleChange} className="w-full rounded p-2 border border-[#640D5F]" />
          {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}

          <input type="email" name="email" placeholder="Email" value={politicianData.email} onChange={handleChange} className="w-full rounded p-2 border border-[#640D5F]" />
          {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}

          <div className="flex items-center space-x-2">
            <input type="tel" name="mobile" placeholder="Mobile Number" value={politicianData.mobile} onChange={handleChange} className="flex-1/2 rounded p-2 border border-[#640D5F]" />
            <button type="button" onClick={handleGetOtp} className="w-1/3 bg-[#e762e1] text-white cursor-pointer p-2 rounded-md">Get OTP</button>
            <input type="text" name='otp' placeholder="Enter OTP" value={politicianData.otp} onChange={handleChange} className="w-1/3 rounded p-2 border border-[#640D5F]" />
          </div>
          {errors.mobile && <p className="text-red-400 text-sm">{errors.mobile}</p>}
          {errors.otp && <p className="text-red-400 text-sm">{errors.otp}</p>} {/* OTP error message */}

          <input type="password" name="password" placeholder="Password" value={politicianData.password} onChange={handleChange} className="w-full rounded p-2 border border-[#640D5F]" />
          {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}

          <div className="flex space-x-2">
            <select name="state" value={politicianData.state} onChange={handleChange} className="w-1/3 rounded p-2 border border-[#640D5F]">
              <option value="">State</option>
              {states.map((state) => (<option key={state} value={state}>{state}</option>))}
            </select>
            {errors.state && <p className="text-red-400 text-sm">{errors.state}</p>}
            <select name="district" value={politicianData.district} onChange={handleChange} className="w-1/3 rounded p-2 border border-[#640D5F]" disabled={!politicianData.state}>
              <option value="">District</option>
              {politicianData.state && districts[politicianData.state]?.map((district) => (<option key={district} value={district}>{district}</option>))}
            </select>
            {errors.district && <p className="text-red-400 text-sm">{errors.district}</p>}
            <select name="taluka" value={politicianData.taluka} onChange={handleChange} className="w-1/3 p-2 rounded border border-[#640D5F]" disabled={!politicianData.district}>
              <option value="">Taluka</option>
              {politicianData.district && talukas[politicianData.district]?.map((taluka) => (<option key={taluka} value={taluka}>{taluka}</option>))}
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
                      placeholder="Search by Name or Mobile No."
                      value={searchInput}
                      onChange={handleSearchChange}
                      className="w-full rounded p-2 border border-[#640D5F]"
                    />
                    {searchInput && filteredAssociate.length > 0 && (
                      <ul className="mt-2 border border-[#640D5F] rounded">
                        {filteredAssociate.map(associate => (
                          <li
                            key={associate.id}
                            onClick={() => handleSelectReferral(associate)}
                            className="p-2 cursor-pointer hover:bg-[#ebace8]"
                          >
                            {associate.name} (Mobile: {associate.mobile})
                          </li>
                        ))}
                      </ul>
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
                    {searchInput && filteredStaff.length > 0 && (
                      <ul className="mt-2 border border-[#640D5F] rounded">
                        {filteredStaff.map(staffMember => (
                          <li
                            key={staffMember.id}
                            onClick={() => handleSelectReferral(staffMember)}
                            className="p-2 cursor-pointer hover:bg-[#ebace8]"
                          >
                            {staffMember.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              <div className="w-1/2 pl-2">
                {selectedReferral && (
                  <p className="mt-2">{selectedReferral.name}</p>
                )}

                {errors.referencedBy && <p className="text-red-400 text-sm">{errors.referencedBy}</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-center w-full">
            <button type="submit" className="w-40 bg-[#aa1ba3] hover:bg-[#640D5F] font-bold text-white p-2 mt-5 rounded-md">Add Politician</button>
          </div>
        </form>
      </div>

      <div>
        {politicians.length > 0 && (
          <table className="mt-6 w-full border-collapse border border-[#aa1ba3] rounded">
            <thead>
              <tr className="bg-[#ebace8]">
                <th className="border border-[#aa1ba3] p-2">Sr. No.</th>
                <th className="border border-[#aa1ba3] p-2">Name</th>
                <th className="border border-[#aa1ba3] p-2">Email</th>
                <th className="border border-[#aa1ba3] p-2">mobile</th>
              </tr>
            </thead>
            <tbody>
              {politicians.map((politician, index) => (
                <tr key={index}>
                  <td className="border border-[#aa1ba3] p-2">{index + 1}</td>
                  <td className="border border-[#aa1ba3] p-2">{politician.name}</td>
                  <td className="border border-[#aa1ba3] p-2">{politician.email}</td>
                  <td className="border border-[#aa1ba3] p-2">{politician.mobile}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default AddPolitician;