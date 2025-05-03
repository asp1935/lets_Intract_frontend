import React, { useState, useEffect } from 'react';
import { useTemplete, useUpsertTemplete } from '../hooks/useSmsApi';
import { useDispatch } from 'react-redux';
import { showToast } from '../redux/slice/ToastSlice';

function SmsTemplete() {
    const dispatch = useDispatch();

    const { data: templeteData } = useTemplete(null);
    const upsertTemplete = useUpsertTemplete();

    const [selectedType, setSelectedType] = useState('register');
    const [templateText, setTemplateText] = useState(''); // editable content

    useEffect(() => {
        if (templeteData?.data && Array.isArray(templeteData?.data) && templeteData?.data?.length > 0) {
            const foundTemplate = templeteData?.data.find(
                (item) => item.templeteName === selectedType
            );
            setTemplateText(foundTemplate ? foundTemplate.templete : '');
        }
    }, [templeteData, selectedType]);

    const handleChange = (e) => {
        setSelectedType(e.target.value);
    };

    const handleTextChange = (e) => {
        setTemplateText(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();


        const requiredPlaceholders = {
            register: ['${name}', '${price}'],
            welcome: ['${name}'],
            otp: ['${otp}']
        };

        const placeholders = requiredPlaceholders[selectedType] || [];

        const missingPlaceholders = placeholders.filter(ph => !templateText.includes(ph));

        if (missingPlaceholders.length > 0) {
            dispatch(showToast({
                message: `Template must include: ${missingPlaceholders.join(', ')}`,
                type: 'error'
            }));
            return;
        }

        const templeteData = { templeteName: selectedType, templete: templateText }
        upsertTemplete.mutate(templeteData, {
            onSuccess: () => {
                dispatch(showToast({ message: "SMS Templete Added/Updated Successfully" }))
            },
            onError: (error) => dispatch(showToast({ message: error, type: 'error' })),

        })
    };

    return (
        <div className="Form mx-auto mt-10 p-6 rounded-lg shadow-lg max-w-4xl">
            <h2 className="text-3xl font-bold mb-6 text-center text-[#640D5F]"
                style={{ textShadow: "3px 3px 10px rgba(100, 13, 95, 0.7)" }}
            >
                Edit SMS Template
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block text-[#4e0c4a] font-semibold">Select Template Type</label>
                <select
                    name="type"
                    value={selectedType}
                    onChange={handleChange}
                    className="w-full p-3 border border-[#640D5F] rounded-md focus:outline-none focus:ring-1 focus:ring-[#640D5F] mb-4"
                >
                    <option value="otp">OTP</option>
                    <option value="register">Register</option>
                    <option value="welcome">Welcome</option>
                </select>

                <label className="block text-[#4e0c4a] font-semibold">Edit Template</label>
                <textarea
                    value={templateText}
                    onChange={handleTextChange}
                    rows="4"
                    className="w-full p-3 border border-[#640D5F] rounded-md focus:outline-none focus:ring-1 focus:ring-[#640D5F] mb-4"
                />

                <button
                    type="submit"
                    className="bg-[#640D5F] text-white py-2 px-4 rounded hover:bg-[#500a46] transition disabled:opacity-50 disabled:cursor-not-allowed "
                    disabled={upsertTemplete.isPending}
                >
                    {upsertTemplete.isPending ? "Updating Template" : "Update Template"}
                </button>
            </form>
        </div>
    );
}

export default SmsTemplete;
