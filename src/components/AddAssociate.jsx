import React, { useEffect, useState } from "react";
import "./application.css";
import { useAddAssociate, useAssociate } from "../hooks/useAssociate";
import { useDispatch } from "react-redux";
import { showToast } from "../redux/slice/ToastSlice";
import { useSendOtp } from "../hooks/useOtp";
import { useStateData, useDistrict, useTaluka } from "../hooks/useAddress";

const AddAssociate = () => {
  const [associateData, setAssociateData] = useState({
    name: "",
    email: "",
    mobile: '',
    state: "",
    district: "",
    taluka: "",
    otp: ""
  });
  const dispatch = useDispatch();
  const registerAssociate = useAddAssociate();
  const sendOtp = useSendOtp();

  const [errors, setErrors] = useState({});
  const [associateList, setAssociateList] = useState([]);

  const { data } = useAssociate();  // Fetch associates 

  const [districts, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [states, setStates] = useState([]);

  const { data: stateData } = useStateData();
  const { data: districtData } = useDistrict(Array.isArray(states)
    ? states.find(state => state?.statenameenglish === associateData?.state)?.statecode
    : undefined);

  // const { data: talukaData } = useTaluka(districts?.find(dist => dist?.districtnameenglish === associateData?.district)?.districtcode)
  const { data: talukaData } = useTaluka(
    Array.isArray(districts)
      ? districts.find(dist => dist?.districtnameenglish === associateData?.district)?.districtcode
      : undefined
  );
  // Set associateList once data is fetched
  useEffect(() => {
    if (data?.data.length > 0) {
      setAssociateList(data.data);
    }
  }, [data]);

  useEffect(() => {
    if ( stateData?.data?.length > 0) {
      setStates(stateData.data);
    }
  }, [stateData])
  

  useEffect(() => {
    if (districtData?.data?.length > 0) {
      setDistricts(districtData.data);
    }
  }, [districtData])


  useEffect(() => {
    if (talukaData?.data?.length > 0) {
      setTalukas(talukaData.data);
    }
  }, [talukaData])

  const validate = () => {
    let tempErrors = {};

    if (!associateData.name.trim()) {
      tempErrors.name = "Name is required";
    }

    if (!associateData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(associateData.email)) {
      tempErrors.email = "Email is not valid";
    }

    if (!associateData.mobile) {
      tempErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(associateData.mobile)) {
      tempErrors.mobile = "Mobile number must be exactly 10 digits";
    }

    if (!associateData.state) {
      tempErrors.state = "State is required";
    }

    if (!associateData.district) {
      tempErrors.district = "District is required";
    }

    if (!associateData.taluka) {
      tempErrors.taluka = "Taluka is required";
    }

    if (!associateData.otp) {
      tempErrors.otp = "OTP is required";
    } else if (!/^\d{4}$/.test(associateData.otp)) {
      tempErrors.otp = "OTP must be exactly 4 digits";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setAssociateData({ ...associateData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {

      registerAssociate.mutate(associateData, {
        onSuccess: () => {
          dispatch(showToast({ message: "Associate Registered Successfully!" }))
          setAssociateData({ name: "", email: "", mobile: '', state: "", district: "", taluka: "", otp: "" });
          setErrors({});
        },
        onError: (error) => dispatch(showToast({ message: error, type: 'error' })),
      })
      // setAssociateList([...associateList, { 
      //   name: associateData.name, 
      //   email: associateData.email, 
      //   mobile: associateData.mobile 
      // }]);

      // setOtp("");
    }
  };

  const handleGetOtp = () => {
    if (!associateData.mobile) {
      dispatch(showToast({ message: "Mobile number is required", type: 'warn' }));
      return;
    }

    if (!/^\d{10}$/.test(associateData.mobile)) {
      dispatch(showToast({ message: "Mobile number must be exactly 10 digits", type: 'warn' }));
      return;
    }

    sendOtp.mutate(associateData.mobile, {
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
        <h2 className="text-3xl font-bold mb-6 text-center text-[#640D5F]" style={{ textShadow: "3px 3px 10px rgba(100, 13, 95, 0.7)" }}>Add Associate</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Associate Name" value={associateData.name} onChange={handleChange} className="w-full rounded p-2 border border-[#640D5F]" />
          {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}

          <input type="email" name="email" placeholder="Email" value={associateData.email} onChange={handleChange} className="w-full rounded p-2 border border-[#640D5F]" />
          {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}

          <div className="flex space-x-2">
            <input type="text" name="mobile" placeholder="Mobile Number" value={associateData.mobile} onChange={handleChange} className="w-1/2 rounded p-2 border border-[#640D5F]" />
            <button type="button" onClick={handleGetOtp} className="w-1/3 bg-[#e762e1] hover:bg-[#d179cc] font-bold text-white p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed" disabled={sendOtp.isPending}>{sendOtp.isPending ? "Sending OTP" : "Get OTP"}</button>
            <input type="text" name="otp" placeholder="Enter OTP" value={associateData.otp} onChange={handleChange} className="w-1/3 rounded p-2 border border-[#640D5F]" />
          </div>
          {errors.mobile && <p className="text-red-400 text-sm">{errors.mobile}</p>}
          {errors.otp && <p className="text-red-400 text-sm">{errors.otp}</p>}

          <div className="flex space-x-2">
            <select name="state" value={associateData.state} onChange={handleChange}  className="w-1/3 rounded p-2 border border-[#640D5F]">
              <option value="">Select State</option>
              { Array.isArray(states) && states.map((state) => (
                <option key={state.statecode} value={state.statenameenglish}>
                  {state.statenameenglish}
                </option>
              ))}
            </select>
            {errors.state && <p className="text-red-400 text-sm">{errors.state}</p>}

            <select name="district" value={associateData.district} onChange={handleChange} className="w-1/3 rounded p-2 border border-[#640D5F]" disabled={!associateData.state}>
              <option value="">Select District</option>

              {/* {associateData.state && districts?.map((district) => (<option key={district.districtcode} value={district.districtnameenglish}>{district.districtnameenglish}</option>))} */}
              {associateData.state && Array.isArray(districts) && districts.map((district) => (
                <option key={district.districtcode} value={district.districtnameenglish}>
                  {district.districtnameenglish}
                </option>
              ))}
            </select>
            {errors.district && <p className="text-red-400 text-sm">{errors.district}</p>}

            <select name="taluka" value={associateData.taluka} onChange={handleChange} className="w-1/3 rounded p-2 border border-[#640D5F]" disabled={!associateData.district}>
              <option value="">Select Taluka</option>
              {associateData.district && Array.isArray(talukas) && talukas.map((taluka) => (
                <option key={taluka.subdistrictcode} value={taluka.subdistrictnameenglish}>
                  {taluka.subdistrictnameenglish}
                </option>
              ))}
              {/* {associateData.district && talukas?.map((taluka) => (<option key={taluka.subdistrictcode} value={taluka.subdistrictnameenglish}>{taluka.subdistrictnameenglish}</option>))} */}

            </select>
            {errors.taluka && <p className="text-red-400 text-sm">{errors.taluka}</p>}
          </div>

          <div className="flex justify-center w-full">
            <button type="submit" className="w-40 bg-[#aa1ba3] hover:bg-[#640D5F] font-bold text-white p-2 mt-5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed" disabled={registerAssociate.isPending}>{registerAssociate.isPending ? "Adding..." : "Add Associate"}</button>
          </div>
        </form>
      </div>
      <div>
        {/* Associate List Below the Form */}
        {associateList.length > 0 && (
          <div className="mt-10">
            <h3 className="text-2xl font-bold mb-4 text-center">Associate List</h3>
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-[#640D5F] text-white">
                  <th className="border border-gray-300 p-2">Sr. No.</th>
                  <th className="border border-gray-300 p-2">Associate Name</th>
                  <th className="border border-gray-300 p-2">Email</th>
                  <th className="border border-gray-300 p-2">Mobile No.</th>
                </tr>
              </thead>
              <tbody>
                {associateList.map((associate, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                    <td className="border border-gray-300 p-2">{associate.name}</td>
                    <td className="border border-gray-300 p-2">{associate.email}</td>
                    <td className="border border-gray-300 p-2">{associate.mobile}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AddAssociate;