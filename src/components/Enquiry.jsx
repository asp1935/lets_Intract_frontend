import React, { useEffect, useState } from 'react';
import { useDeleteEnquiry, useEnquiry, useUpdateEnquiry } from '../hooks/useEnquiry';
import { useDispatch } from 'react-redux';
import { showToast } from "../redux/slice/ToastSlice";


const Enquiry = () => {
  // Dummy data for registered members
  const [enquiry, setEnquiry] = useState([]);
  const updateEnquiry = useUpdateEnquiry();
  const deleteEnquiry = useDeleteEnquiry()
  const [enquiryId, setEnquiryId] = useState(null);
  const dispatch = useDispatch()
  const { data } = useEnquiry();


  useEffect(() => {
    if (data?.data.length > 0) {
      setEnquiry(data.data)
    }
  }, [data])

  // Function to handle the "Done" action
  const handleDone = (id) => {
    setEnquiryId(id);
    updateEnquiry.mutate({ enquiryId: id, status: 'approved' }, {
      onSuccess: () => {
        dispatch(showToast({ message: "Status Updated" }))
      },
      onError: (error) => dispatch(showToast({ message: error, type: 'error' })),

    })
    setEnquiryId(null);

  };
  const handleDelete = (id) => {
    setEnquiryId(id);
    deleteEnquiry.mutate(id, {
      onSuccess: () => {
        dispatch(showToast({ message: "Enquiry Deleted Successfully" }))
      },
      onError: (error) => dispatch(showToast({ message: error, type: 'error' })),

    })
    setEnquiryId(null);
  };

  return (
    <div
      className='mt-10'
      style={{
        padding: '20px',
        fontFamily: 'Poppins, sans-serif',
        minHeight: '100vh',
      }}
    >
      <h1 className="text-3xl font-bold text-center text-[#640D5F] mb-6" style={{ textShadow: "3px 3px 10px rgba(100, 13, 95, 0.7)" }}
      >
        Registered Enquiries
      </h1>
      <div
        style={{
          maxWidth: '1200px',
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
              <th style={{ padding: '16px', textAlign: 'center' }}>Name</th>
              <th style={{ padding: '16px', textAlign: 'center' }}>Mobile Number</th>
              {/* <th style={{ padding: '16px', textAlign: 'center' }}>Email</th> */}
              <th style={{ padding: '16px', textAlign: 'center' }}>Address</th>
              <th style={{ padding: '16px', textAlign: 'center' }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {enquiry.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No enquiry available
                </td>
              </tr>
            ) : (

              enquiry?.map((member) => (
                <tr
                  key={member._id}
                  style={{
                    borderBottom: '1px solid #eee',
                    transition: 'background 0.3s ease',
                    ':hover': {
                      backgroundColor: '#f9f9f9',
                    },
                  }}
                >
                  <td style={{ padding: '16px', color: '#333', textAlign: 'center' }}>{member.name}</td>
                  <td style={{ padding: '16px', color: '#555', textAlign: 'center' }}>{member.mobile}</td>
                  {/* <td style={{ padding: '16px', color: '#555', textAlign: 'center' }}>{member.email}</td> */}
                  <td style={{ padding: '16px', color: '#555', textAlign: 'center' }}>{member.taluka}</td>
                  <td style={{ padding: '16px', color: '#555', textAlign: 'center' }}>{member.status}</td>
                  <td style={{ padding: '16px' }} className='flex items-center justify-center'>
                    {member.status !== 'approved' && (
                      <button
                        onClick={() => handleDone(member._id)}
                        className='ml-8 disabled:opacity-50 disabled:cursor-not-allowed'
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#6c5ce7',
                          color: '#fff',
                          textAlign: 'center',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'background 0.3s ease',
                          ':hover': {
                            backgroundColor: '#5a4dbf',
                          },
                        }}
                        disabled={enquiryId === member._id}
                      >
                        {enquiryId === member._id ? "Updating..." : "Done"}
                      </button>
                    )}
                    {member.status === 'approved' && (
                      <button
                        onClick={() => handleDelete(member._id)}
                        className='ml-8 disabled:opacity-50 disabled:cursor-not-allowed'
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#f0566f',
                          color: '#fff',
                          textAlign: 'center',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'background 0.3s ease',
                          ':hover': {
                            backgroundColor: '#5a4dbf',
                          },
                        }}
                        disabled={enquiryId === member._id}
                      >
                        {enquiryId === member._id ? "Deleting" : "Delete"}
                      </button>
                    )}
                  </td>
                </tr>
              )))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Enquiry;