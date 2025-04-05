import React, { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";
import { useAddSmsTemplete, useAddWhatsappTemplete } from "../hooks/useMessageTemplet";
import { useDispatch } from 'react-redux'
import { showToast } from "../redux/slice/ToastSlice";

const Politician_Msg = () => {


  const [messageType, setMessageType] = useState("Text Message");
  const [whatsappFormData, setWhatsappFormData] = useState({
    templeteName: "",
    message: "",
    whatsappImg: null,
  });
  const [smsFormData, setSmsFormData] = useState({
    templeteName: "",
    message: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPoliticians, setFilteredPoliticians] = useState([]);
  const [selectedPolitician, setSelectedPolitician] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [politicians, setPoliticians] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const dispatch = useDispatch()

  const addSmsTemplete = useAddSmsTemplete();
  const addWhatsappTemplete = useAddWhatsappTemplete();

  const { data: politicianData } = useUser(null, 'user', 'political');

  useEffect(() => {
    if (politicianData?.data) {
      setPoliticians(politicianData.data);
      setFilteredPoliticians(politicianData.data);
    }
  }, [politicianData]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setShowDropdown(true);

    if (!query) {
      setSelectedPolitician(null); // Remove selected customer when search is cleared
    }

    setFilteredPoliticians(
      politicians.filter((politician) => politician.name.toLowerCase().includes(query))
    );
  };

  const handlePoliticianSelect = (politician) => {
    setShowDropdown(false);
    setSelectedPolitician(politician);
    setSearchQuery(politician.name);
  };

  const handleWhatsappChange = (e) => {
    const { name, value, files } = e.target;
    setWhatsappFormData({
      ...whatsappFormData,
      [name]: files ? files[0] : value,
    });
  };
  const handleSmsChange = (e) => {
    const { name, value } = e.target;
    setSmsFormData({
      ...smsFormData,
      [name]: value,
    });
  };

  const handleSubmit = (e, section) => {
    if (section === 'sms') {
      e.preventDefault();
      if (smsFormData.templeteName.trim() === '' || smsFormData.message.trim() === '') {
        dispatch(showToast({ message: "All Fields Are Required", type: 'warn' }))
        return
      }
      addSmsTemplete.mutate({ userId: selectedPolitician._id, templeteData: smsFormData }, {
        onSuccess: () => {
          setSmsFormData({
            templeteName: "",
            message: "",
          })
          dispatch(showToast({ message: "SMS Templete Added" }))
        },
        onError: (error) => dispatch(showToast({ message: error, type: 'error' })),
      })

    }
    if (section === 'whatsapp') {
      e.preventDefault();
      if (whatsappFormData.templeteName.trim() === '' || whatsappFormData.message.trim() === '') {
        dispatch(showToast({ message: "All Fields Are Required Image Optional", type: 'warn' }))
        return
      }
      addWhatsappTemplete.mutate({ userId: selectedPolitician._id, templeteData: whatsappFormData }, {
        onSuccess: () => {
          setWhatsappFormData({
            templeteName: "",
            message: "",
            whatsappImg: null
          })
          dispatch(showToast({ message: "Whatsapp Templete Added" }))
        },
        onError: (error) => dispatch(showToast({ message: error, type: 'error' })),
      })

    }
  };

  const closeDialog = () => setIsDialogOpen(false);

  return (
    <div className="Form mx-auto mt-10 p-6 rounded-lg shadow-lg max-w-4xl">
      <h2 className="text-3xl font-bold mb-6 text-[#640D5F] text-center" style={{ textShadow: "3px 3px 10px rgba(100, 13, 95, 0.7)" }}>
        Create Message
      </h2>

      {/* Search and Select Politician */}
      <div>
        <label className="text-[#640D5F] font-bold">Select Politician:</label>
        <input
          type="text"
          placeholder="Search for a politician..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 rounded-md border border-[#640D5F]"
        />
         {showDropdown && searchQuery && (
          <ul className="mt-2 bg-white border border-[#640D5F] rounded-md shadow-lg max-h-40 overflow-y-auto">
            {filteredPoliticians.map((politician) => (
              <li
                key={politician.id}
                onClick={() => handlePoliticianSelect(politician)}
                className="p-2 hover:bg-[#fdf4ff] cursor-pointer"
              >
                {politician.name} - {politician.phone}
              </li>
            ))}
          </ul>
        )}
        {selectedPolitician && (
          <p className="mt-2 text-sm text-[#640D5F]">
            Selected Politician: <strong>{selectedPolitician.name}</strong>
          </p>
        )}
      </div>

      {/* Toggle Design */}
      <div className="flex items-center justify-center bg-[#ebace8] rounded-full p-1 w-full max-w-md mx-auto mt-4">
        {["Text Message", "WhatsApp Message"].map((type) => (
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

      {messageType === "Text Message" && (

        // {/* Message Form */}
        <form onSubmit={(e) => handleSubmit(e, "sms")} className="space-y-4 mt-6">
          <div>
            <label className="text-[#640D5F] font-bold">Template Name:</label>
            <input
              type="text"
              name="templeteName"
              placeholder="Enter template name..."
              value={smsFormData.templeteName}
              onChange={handleSmsChange}
              required
              className="w-full p-2 rounded-md border border-[#640D5F]"
            />
          </div>

          <div>
            <label className="text-[#640D5F] font-bold">Message:</label>
            <textarea
              name="message"
              placeholder="Enter your message..."
              value={smsFormData.message}
              onChange={handleSmsChange}
              required
              className="w-full p-2 rounded-md border border-[#640D5F]"
              rows="4"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center w-full">
            <button
              type="submit"
              className="bg-[#aa1ba3] hover:bg-[#640D5F] text-white font-bold w-40 p-2 rounded-md transition-all duration-300"
            >
              Create Message
            </button>
          </div>
        </form>
      )}
      {messageType === "WhatsApp Message" && (

      < form onSubmit={(e) => handleSubmit(e, 'whatsapp')} className="space-y-4 mt-6">
        {/* Template Name */}
        <div>
          <label className="text-[#640D5F] font-bold">Template Name:</label>
          <input
            type="text"
            name="templeteName"
            placeholder="Enter template name..."
            value={whatsappFormData.templeteName}
            onChange={handleWhatsappChange}
            required
            className="w-full p-2 rounded-md border border-[#640D5F]"
          />
        </div>

        {/* Message */}
        <div>
          <label className="text-[#640D5F] font-bold">Message:</label>
          <textarea
            name="message"
            placeholder="Enter your message..."
            value={whatsappFormData.message}
            onChange={handleWhatsappChange}
            required
            className="w-full p-2 rounded-md border border-[#640D5F]"
            rows="4"
          />
        </div>

        {/* Image Upload (For WhatsApp Only) */}

        <div>
          <label className="text-[#640D5F] font-bold">Image (for WhatsApp only):</label>
          <input
            type="file"
            name="whatsappImg"
            accept="image/*"
            onChange={handleWhatsappChange}
            className="w-full p-2 rounded-md border border-[#640D5F]"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center w-full">
          <button
            type="submit"
            className="bg-[#aa1ba3] hover:bg-[#640D5F] text-white font-bold w-40 p-2 rounded-md transition-all duration-300"
          >
            Create Message
          </button>
        </div>
      </form>
      )}

      {/* Success Dialog */}

      {
        isDialogOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <p className="text-lg font-bold text-[#640D5F]">
                Your {messageType.toLowerCase()} is created successfully!
              </p>
              <button
                onClick={closeDialog}
                className="mt-4 bg-[#aa1ba3] hover:bg-[#640D5F] text-white font-bold py-1 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default Politician_Msg;
