import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useUser } from "../hooks/useUser";
import { useAPIUrlConfig, useSmsConfig, useUpsertAPIUrlConfig, useUpsertSmsConfig, useUpsertWhatsappConfig, useWhatsappConfig } from "../hooks/useAPIConfig";
import { showToast } from "../redux/slice/ToastSlice";

const Configuration = () => {
  const [apiKeys, setApiKeys] = useState({
    whatsapp: { key: "", authKey: "", channel: "" },
    sms: { key: "", senderId: "", channel: "", dcs: "" },
    apiUrl: { key: "", spiKey: "" },
  });

  const [whatsappConfig, setWhatsappConfig] = useState({ apiKey: "", apiAuthKey: "", channelNo: "" })
  const [smsConfig, setSmsConfig] = useState({ apiKey: "", senderId: "", dcs: "", channelNo: "" });
  const [apiUrls, setApiUrls] = useState({ whatsappApiUrl: "", smsApiUrl: "" });


  const [searchQuery, setSearchQuery] = useState("");

  const [userType, setUserType] = useState('business');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [messageType, setMessageType] = useState("WhatsApp");
  const [customers, setCustomers] = useState([]);

  const { data: userData } = useUser(null, 'user', userType);



  useEffect(() => {
    if (userData) {
      setCustomers(userData.data);
      setFilteredCustomers(userData.data);
    }
  }, [userData]);


  const dispatch = useDispatch();

  const { data: whatsappConfigData } = useWhatsappConfig(selectedCustomer?._id || '')
  const { data: smsConfigData } = useSmsConfig(selectedCustomer?._id || '')
  const { data: apiUrlData } = useAPIUrlConfig();
  const upsertWhatsappConfig = useUpsertWhatsappConfig();
  const upsertSmsConfig = useUpsertSmsConfig();
  const upsetApiUrls = useUpsertAPIUrlConfig();

  useEffect(() => {
    if (whatsappConfigData?.data.length > 0) {
      setWhatsappConfig(whatsappConfigData.data)
    } else {
      setWhatsappConfig({ apiKey: "", apiAuthKey: "", channelNo: "" })
    }
    if (smsConfigData?.data.length > 0) {
      setSmsConfig(smsConfigData.data)
    } else {
      setSmsConfig({ apiKey: "", senderId: "", dcs: "", channelNo: "" })
    }
    if (apiUrlData?.data.length > 0) {
      setApiUrls(apiUrlData.data)
    }
    else {
      setApiUrls({ whatsappApiUrl: "", smsApiUrl: "" })
    }
  }, [apiUrlData, whatsappConfigData, smsConfigData])


  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setShowDropdown(true);

    if (!query) {
      setSelectedCustomer(null); // Remove selected customer when search is cleared
    }

    setFilteredCustomers(
      customers.filter((customer) => customer.name.toLowerCase().includes(query))
    );
  };

  const selectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setSearchQuery(customer.name);
    setShowDropdown(false);
  };

  const handleInputChange = (e, section, key) => {
    const { value } = e.target;
    if (section === "apiUrl") {
      setApiUrls((prev) => ({ ...prev, [key]: value }));
    }
    if (section === 'whatsapp') {
      setWhatsappConfig((prev) => ({ ...prev, [key]: value }))
    }
    if (section === 'sms') {
      setSmsConfig((prev) => ({ ...prev, [key]: value }))
    }
  };


  const handleSave = (section) => {
    if (!selectedCustomer?._id) {
      dispatch(showToast({ message: "Please Select Customer", type: "warn" }))
      return
    }
    if (section === "apiUrl") {
      if (apiUrls.whatsappApiUrl.trim() === '' || apiUrls.smsApiUrl.trim() === '') {
        dispatch(showToast({ message: "All Field are Required", type: 'warn' }))
        return
      }
      upsetApiUrls.mutate(apiUrls, {
        onSuccess: () => {
          dispatch(showToast({ message: "API URLS Updated Successfully" }))
        },
        onError: (error) => dispatch(showToast({ message: error, type: 'error' })),

      })
    }
    if (section === 'whatsapp') {
      if (whatsappConfig.apiKey.trim() === '' || whatsappConfig.apiAuthKey.trim() === '' || whatsappConfig.channelNo.trim() === '') {
        dispatch(showToast({ message: "All Field are Required", type: 'warn' }))
        return
      }
      upsertWhatsappConfig.mutate({ userId: selectedCustomer._id, whatsappConfig }, {
        onSuccess: () => {
          dispatch(showToast({ message: "Whatsapp Configuration Updated Successfully" }))
        },
        onError: (error) => dispatch(showToast({ message: error, type: 'error' })),

      })
    }
    if (section === 'sms') {
      if (smsConfig.apiKey.trim() === '' || smsConfig.senderId.trim() === '' || smsConfig.channelNo.trim() === '' || smsConfig.dcs.trim() === '') {
        dispatch(showToast({ message: "All Field are Required", type: 'warn' }))
        return
      }
      upsertSmsConfig.mutate({ userId: selectedCustomer._id, smsConfig }, {
        onSuccess: () => {
          dispatch(showToast({ message: "SMS Configuration Updated Successfully" }))
        },
        onError: (error) => dispatch(showToast({ message: error, type: 'error' })),

      })
    }
  };

  return (
    <div className="Form mt-8 p-6 max-w-3xl mx-auto shadow-md rounded-lg bg-white">
      <h1 className="text-3xl font-bold text-[#640D5F] text-center mb-4" style={{ textShadow: "3px 3px 10px rgba(100, 13, 95, 0.7)" }}>Configuration</h1>

      {/* Search for Customer */}
      <div className="mb-4 relative">
        <label className="block text-[#4e0c4a] font-semibold">Select User Type</label>
        <select name="type" value={userType} onChange={(e) => setUserType(e.target.value)} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4">
          <option key='business' value="business" > Business</option>
          <option key='political' value="political">Political</option>
        </select>

        <label className="block text-[#4e0c4a] font-semibold">Search Customer</label>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Type to search..."
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          onFocus={() => setShowDropdown(true)}
        />
        {showDropdown && searchQuery && (
          <ul className="absolute w-full bg-[#ebace8] border mt-1 rounded-lg shadow-lg z-10">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <li
                  key={customer._id}
                  className="p-2 cursor-pointer hover:bg-[#c790c4]"
                  onClick={() => selectCustomer(customer)}
                >
                  {customer.name}
                </li>
              ))
            ) : (
              <li className="p-2">No customers found</li>
            )}
          </ul>
        )}
      </div>

      {/* Selected Customer Info */}
      {selectedCustomer && (
        <div className="mb-4 p-3 border rounded-lg bg-gray-100">
          <p className="font-semibold">Selected Customer:</p>
          <p className="text-blue-600">{selectedCustomer.name}</p>
        </div>
      )}

      {/* Toggle Switch for Message Type */}
      <div className="flex items-center justify-center bg-[#ebace8] rounded-full p-1 w-full max-w-lg mx-auto mb-6">
        {["WhatsApp", "SMS", "API URL"].map((type) => (
          <div
            key={type}
            className={`flex-1 text-center py-2 rounded-full cursor-pointer transition-all font-semibold text-lg ${messageType === type ? "bg-[#640D5F] text-white" : "text-black"
              }`}
            onClick={() => setMessageType(type)}
          >
            {type}
          </div>
        ))}
      </div>

      {/* WhatsApp Section */}
      {messageType === "WhatsApp" && (
        <div>
          <label className="block font-semibold">WhatsApp API Key</label>
          <input
            type="text"
            value={whatsappConfig.apiKey}
            onChange={(e) => handleInputChange(e, "whatsapp", "apiKey")}
            className="w-full p-3 border rounded-lg mb-4"
          />

          <label className="block font-semibold">API Auth Key</label>
          <input
            type="text"
            value={whatsappConfig.apiAuthKey}
            onChange={(e) => handleInputChange(e, "whatsapp", "apiAuthKey")}
            className="w-full p-3 border rounded-lg mb-4"
          />

          <label className="block font-semibold">Channel Number</label>
          <input
            type="text"
            value={whatsappConfig.channelNo}
            onChange={(e) => handleInputChange(e, "whatsapp", "channelNo")}
            className="w-full p-3 border rounded-lg"
          />
          {/* Save Button */}
          <div className="flex justify-center w-full mt-6">
            <button
              onClick={() => handleSave("whatsapp")}
              className="w-fit bg-[#98188f] text-white p-3 rounded-lg font-bold hover:bg-[#4e0c4a] transition duration-200"
            >
              Assign Whatsapp Configuration
            </button>
          </div>
        </div>
      )}

      {/* SMS Section */}
      {messageType === "SMS" && (
        <div>
          <label className="block font-semibold">SMS API Key</label>
          <input
            type="text"
            value={smsConfig.apiKey}
            onChange={(e) => handleInputChange(e, "sms", "apiKey")}
            className="w-full p-3 border rounded-lg mb-4"
          />

          <label className="block font-semibold">Sender ID</label>
          <input
            type="text"
            value={smsConfig.senderId}
            onChange={(e) => handleInputChange(e, "sms", "senderId")}
            className="w-full p-3 border rounded-lg mb-4"
          />

          <label className="block font-semibold">Channel</label>
          <input
            type="text"
            value={smsConfig.dcs}
            onChange={(e) => handleInputChange(e, "sms", "dcs")}
            className="w-full p-3 border rounded-lg mb-4"
          />

          <label className="block font-semibold">DCS</label>
          <input
            type="text"
            value={smsConfig.channelNo}
            onChange={(e) => handleInputChange(e, "sms", "channelNo")}
            className="w-full p-3 border rounded-lg"
          />
          {/* Save Button */}
          <div className="flex justify-center w-full mt-6">
            <button
              onClick={() => handleSave('sms')}
              className="w-fit   bg-[#98188f] text-white p-3 rounded-lg font-bold hover:bg-[#4e0c4a] transition duration-200"
            >
              Assign SMS Configuration
            </button>
          </div>
        </div>
      )}

      {/* API URL Section */}
      {messageType === "API URL" && (
        <div>
          {/* WhatsApp API URL */}
          <label className="block font-semibold">WhatsApp API URL</label>
          <input
            type="text"
            value={apiUrls.whatsappApiUrl}
            onChange={(e) => handleInputChange(e, "apiUrl", "whatsappApiUrl")}
            className="w-full p-3 border rounded-lg mb-4"
          />

          {/* SMS API URL */}
          <label className="block font-semibold">SMS API URL</label>
          <input
            type="text"
            value={apiUrls.smsApiUrl}
            onChange={(e) => handleInputChange(e, "apiUrl", "smsApiUrl")}
            className="w-full p-3 border rounded-lg mb-4"
          />

          {/* Save Button */}
          <div className="flex justify-center w-full mt-6">
            <button
              onClick={() => handleSave("apiUrl")}
              className="w-40 bg-[#98188f] text-white p-3 rounded-lg font-bold hover:bg-[#4e0c4a] transition duration-200"
            >
              Assign API URL's
            </button>
          </div>
        </div>
      )}



    </div>
  );
};

export default Configuration;