import React, { useEffect, useRef, useState } from 'react';
import { useDeletePaymentDetails, useUpsertPaymentDetails } from '../../hooks/usePortfolio';
import { useDispatch } from 'react-redux';
import { showToast } from '../../redux/slice/ToastSlice';

function Payment({ paymentData, uid, pid }) {
    const url = import.meta.env.VITE_IMG_URL;

    const [payment, setPayment] = useState({
        qrcodeImage: '',
        bankName: '',
        accountHolderName: '',
        accountNo: '',
        ifscNo: '',
        gstinNo: '',
        qrFile: null


    });

    const [isEditing, setIsEditing] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        if (paymentData) {
            setPayment({
                qrcodeImage: paymentData.qrcodeImage || '',
                bankName: paymentData.bankName || '',
                accountHolderName: paymentData.accountHolderName || '',
                accountNo: paymentData.accountNo || '',
                ifscNo: paymentData.ifscNo || '',
                gstinNo: paymentData.gstinNo || '',
                qrFile: null
            });
        }
        else {
            setIsEditing(true);
        }
    }, [paymentData]);

    const upsertPaymentDetails = useUpsertPaymentDetails();
    const deletePaymentDetails = useDeletePaymentDetails();
    const fileRef = useRef(null);


    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setPayment((prev) => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleUpdateClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        // Add your API call here to save updated payment details.
        upsertPaymentDetails.mutate({ userId: uid, portfolioId: pid, paymentData: payment }, {
            onSuccess: (data) => {
                setIsEditing(false);
                setPayment({
                    qrcodeImage: data.data.paymentDetails.qrcodeImage || '',
                    bankName: data.data.paymentDetails.bankName || '',
                    accountHolderName: data.data.paymentDetails.accountHolderName || '',
                    accountNo: data.data.paymentDetails.accountNo || '',
                    ifscNo: data.data.paymentDetails.ifscNo || '',
                    gstinNo: data.data.paymentDetails.gstinNo || '',
                    qrFile: null
                });
                fileRef.current.value = null;

                dispatch(showToast({ message: "Payment Details Updated..." }))


            },
            onError: (error) => dispatch(showToast({ message: error, type: 'error' }))

        })

        // After saving, disable editing
        setIsEditing(false);
    };
    const handleDeleteClick = () => {
        deletePaymentDetails.mutate({ portfolioId: pid }, {
            onSuccess: () => {
                setIsEditing(true);
                setPayment({
                    qrcodeImage: '',
                    bankName: '',
                    accountHolderName: '',
                    accountNo: '',
                    ifscNo: '',
                    gstinNo: '',
                    qrFile: null
                });
                fileRef.current.value = null;
                dispatch(showToast({ message: "Payment Details Deleted..." }))

            },
            onError: (error) => dispatch(showToast({ message: error, type: 'error' }))

        })
    }

    return (
        <div className="w-9/12 mx-auto place-items-center p-4 rounded my-5 border bg-white relative">
            <h2 className="text-2xl font-semibold mb-4">Payment Details</h2>

            <div className='flex justify-center items-center gap-2 w-full'>

                <div className='w-1/2'>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className='font-bold'>Bank Name:</label>
                            <input
                                type="text"
                                name="bankName"
                                value={payment.bankName}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="border p-2 w-full disabled:bg-gray-100 rounded"
                            />
                        </div>

                        <div>

                            <label className='font-bold'>Account Holder Name:</label>
                            <input
                                type="text"
                                name="accountHolderName"
                                value={payment.accountHolderName}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="border p-2 w-full disabled:bg-gray-100 rounded"
                            />
                        </div>

                        <div>
                            <label className='font-bold'> Account Number:</label>

                            <input
                                type="text"
                                name="accountNo"
                                value={payment.accountNo}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="border p-2 w-full disabled:bg-gray-100 rounded"
                            />
                        </div>
                        <div>


                            <label className='font-bold'>IFSC Code:</label>

                            <input
                                type="text"
                                name="ifscNo"
                                value={payment.ifscNo}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="border p-2 w-full disabled:bg-gray-100 rounded"
                            />
                        </div>
                        <div>
                            <label className='font-bold'>
                                GSTIN Number:
                            </label>

                            <input
                                type="text"
                                name="gstinNo"
                                value={payment.gstinNo}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="border p-2 w-full disabled:bg-gray-100 rounded"
                            />
                        </div>

                    </div>


                </div>
                <div className='flex flex-col items-center  w-1/2'>
                    {payment.qrcodeImage ? (
                        <>
                            <p className='font-semibold mb-2 text-xl'>QR Code</p>
                            <div className='border w-60 h-60 '>
                                <img src={`${url}${payment.qrcodeImage}`} alt="" className='w-full h-full' />
                            </div>
                        </>
                    ):(
                        <>
                         <p className='font-semibold mb-2 text-xl'>QR Code Unavailable</p>
                        </>
                    )}
                    {isEditing && (
                        <>
                            <h4 className='mt-2 font-bold'>Upload New QR</h4>
                            <div className='mt-1'>
                                <input ref={fileRef} type='file' accept='image/*' name='qrFile' onChange={handleChange} className='border rounded p-1' />
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="mt-4">
                {!isEditing && (
                    <button
                        onClick={handleUpdateClick}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Update
                    </button>
                )}

                {isEditing && (
                    <>
                        <button
                            onClick={handleSaveClick}
                            className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={upsertPaymentDetails.isPending}
                        >
                            {upsertPaymentDetails.isPending ? "Saving..." : "Save"}

                        </button>

                        <button
                            onClick={() => setIsEditing(false)}
                            className="bg-gray-500 text-white px-4 py-2 mx-2 rounded"
                        >
                            Cancle
                        </button>

                    </>
                )}
                {!isEditing && (<button
                    onClick={handleDeleteClick}
                    className="bg-red-500 text-white px-4 py-2 rounded mx-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={deletePaymentDetails.isPending}
                >
                    {deletePaymentDetails.isPending ? "Deleting..." : "Delete"}

                </button>)}
            </div>
        </div>

    );
}

export default Payment;
