import React, { useEffect, useState } from 'react'
import { useOtp } from '../hooks/useOtp';
import { RefreshCcwIcon } from 'lucide-react';

function OtpList() {
    const [otpData, setOtpData] = useState([]);

    const { data ,refetch} = useOtp();  

    useEffect(() => {
        if (data?.data.length > 0) {
            setOtpData(data.data)
            console.log(data.data);

        }
    }, [data])
    console.log(otpData);

    return (
        <div
            className='mt-10 '
            style={{
                padding: '20px',
                fontFamily: 'Poppins, sans-serif',
                minHeight: '100vh',
            }}
        >
            <div className='flex justify-between mx-20 items-baseline'>
                <h1 className="text-3xl font-bold text-center text-[#640D5F] mb-6" style={{ textShadow: "3px 3px 10px rgba(100, 13, 95, 0.7)" }}
                >
                    OTP List
                </h1>
                <div className=''>
                    <button
                        className=' w-fit p-1 rounded-2xl shadow-2xl border bg-[#ab19a3] text-white  cursor-pointer hover:bg-[#873483]'
                        onClick={refetch}
                    >
                        <RefreshCcwIcon />
                    </button>
                </div>
            </div>

            <div
                style={{
                    maxWidth: '1000px',
                    margin: '0 auto',
                    background: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                }}
            >
                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                    }}
                >
                    <thead>
                        <tr className='bg-[#ab19a3] text-white'
                        >
                            <th style={{ padding: '16px', textAlign: 'center' }}>Mobile Number</th>
                            <th style={{ padding: '16px', textAlign: 'center' }}>OTP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {otpData.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-4 text-center text-gray-500">
                                    No OTP's available
                                </td>
                            </tr>
                        ) : (

                            otpData?.map((otp) => (
                                <tr
                                    key={otp._id}
                                    style={{
                                        borderBottom: '1px solid #eee',
                                        transition: 'background 0.3s ease',
                                        ':hover': {
                                            backgroundColor: '#f9f9f9',
                                        },
                                    }}
                                >
                                    <td style={{ padding: '16px', color: '#555', textAlign: 'center' }}>{otp.mobile}</td>
                                    <td style={{ padding: '16px', color: '#555', textAlign: 'center' }}>{otp.otp}</td>

                                </tr>
                            )))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default OtpList
