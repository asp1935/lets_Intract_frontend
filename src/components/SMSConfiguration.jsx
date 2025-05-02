import React, { useEffect, useState } from 'react'
import { showToast } from '../redux/slice/ToastSlice';
import { useDispatch } from 'react-redux';
import { useSmsApi, useUpsertSmsApi } from '../hooks/useSmsApi';

function SMSConfiguration() {
    const [smsAPI, setSmsAPI] = useState({ apiUrl: "", apiKey: "", senderId: "", dcs: "", channel: "" });




    const dispatch = useDispatch();

    const { data: smsApiData } = useSmsApi();
    const upsertSmsAPI = useUpsertSmsApi()

    useEffect(() => {
        if (smsApiData?.data?.length > 0) {
            setSmsAPI({ apiUrl: smsApiData.data[0].apiUrl, apiKey: smsApiData.data[0].apiKey, senderId: smsApiData.data[0].senderId, dcs: smsApiData.data[0].dcs, channel: smsApiData.data[0].channel })
        }
        else {
            setSmsAPI({
                apiUrl: "", apiKey: "", senderId: "", dcs: "", channel: ""
            })
        }
    }, [smsApiData])






    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSmsAPI((prev) => ({ ...prev, [name]: value }))
    };


    const handleSave = () => {
        if (smsAPI.apiUrl.trim() === '' || smsAPI.apiKey.trim() === '' || smsAPI.senderId.trim() === '' || smsAPI.channel.trim() === '' || smsAPI.dcs.trim() === '') {
            dispatch(showToast({ message: "All Field are Required", type: 'warn' }))
            return
        }

        upsertSmsAPI.mutate(smsAPI, {
            onSuccess: () => {
                dispatch(showToast({ message: "SMS Configuration Updated Successfully" }))
            },
            onError: (error) => dispatch(showToast({ message: error, type: 'error' })),

        })
    };

    return (
        <div className="Form mt-8 p-6 max-w-3xl mx-auto shadow-md rounded-lg bg-white">
            <h1 className="text-3xl font-bold text-[#640D5F] text-center mb-4" style={{ textShadow: "3px 3px 10px rgba(100, 13, 95, 0.7)" }}>SMS API Configuration</h1>
            <div>
                <label className="block font-semibold">SMS API URL</label>
                <input
                    type="text"
                    name='apiUrl'
                    value={smsAPI.apiUrl}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg mb-4"
                />
                <label className="block font-semibold">SMS API Key</label>
                <input
                    type="text"
                    name="apiKey"
                    value={smsAPI.apiKey}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg mb-4"
                />

                <label className="block font-semibold">Sender ID</label>
                <input
                    type="text"
                    name="senderId"
                    value={smsAPI.senderId}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg mb-4"
                />

                <label className="block font-semibold">Channel</label>
                <input
                    type="text"
                    value={smsAPI.channel}
                    name="channel"
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg mb-4"
                />

                <label className="block font-semibold">DCS</label>
                <input
                    type="text"
                    name="dcs"
                    value={smsAPI.dcs}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                />
                {/* Save Button */}
                <div className="flex justify-center w-full mt-6">
                    <button
                        onClick={handleSave}
                        className="w-fit   bg-[#98188f] text-white p-3 rounded-lg font-bold hover:bg-[#4e0c4a] transition duration-200"
                    >
                        Assign SMS API
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SMSConfiguration
