import React, { useEffect, useState } from 'react'
import { useDeletePortfolio, usePortfolio } from '../hooks/usePortfolio';
import UpdatePortfolio from '../components/CustomerPortfolio/UpdatePortfolio';
import { useDispatch } from 'react-redux';
import { showToast } from '../redux/slice/ToastSlice';
import { ExternalLink } from 'lucide-react';

function ManagePortfolio() {
  const [portfolios, setportfolios] = useState([]);
  const [portfolioSearchTerm, setPortfolioSearchTerm] = useState("");
  const [filteredPortfolioUsers, setFilteredPortfolioUsers] = useState([]);
  const [updatePortfolioData, setUpdatePortfolioData] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePortfolioId, setDeletePortfolioId] = useState(null)
  const [confirmationInput, setConfirmationInput] = useState("");

  const dispatch = useDispatch();
  const { data: portfolioData } = usePortfolio();
  const deletePortfolio = useDeletePortfolio();


  useEffect(() => {
    if (portfolioData?.data && portfolioData?.data.length > 0) {
      setportfolios(portfolioData.data)
    }
  }, [portfolioData])


  useEffect(() => {
    if (!portfolioSearchTerm) {
      setFilteredPortfolioUsers(portfolios || []);
      return;
    }
    const result = portfolios.filter(portfolio =>
      portfolio.ownerName?.toLowerCase().includes(portfolioSearchTerm.toLowerCase())
    );

    setFilteredPortfolioUsers(result);
  }, [portfolios, portfolioSearchTerm]);

  // Confirm Delete Modal
  const confirmDelete = (id) => {
    setDeletePortfolioId(id);
    setShowDeleteConfirm(true);
  };

  const handlePortfolioDelete = () => {
    if (confirmationInput.toLowerCase() !== "confirm") {
      alert("Please enter 'confirm' to delete the record.");
      return;
    }
    deletePortfolio.mutate(deletePortfolioId, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        setDeletePortfolioId(null);
        setConfirmationInput(""); // Reset confirmation input
        dispatch(showToast({ message: "Portfolio Deleted Successfully" }))
      },
      onError: (error) => dispatch(showToast({ message: error, type: 'error' }))

    })
  }
  const handleViewClick = (userName) => {
    window.open(`/portfolio/${userName}`, '_blank')
  }

  return (
    <div className='w-full p-8 min-h-[85vh]'>
      <h2 className="text-3xl font-bold mb-6 text-[#640D5F] text-center" style={{ textShadow: "3px 3px 10px rgba(100, 13, 95, 0.7)" }}>
        Manage Portfolio's
      </h2>
      {updatePortfolioData && <UpdatePortfolio portfolioData={updatePortfolioData} setPortfolioData={setUpdatePortfolioData} />}
      <div className='w-full mt-6'>
        <div>
          <div className='flex justify-end'>
            <input
              type="text"
              value={portfolioSearchTerm}
              onChange={(e) => setPortfolioSearchTerm(e.target.value)}
              placeholder="Search customer..."
              className="p-1 border rounded-lg w-56  mb-4"
            />
          </div>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#ebace8]">
                <th className="border  py-2">Customers</th>
                <th className="border  py-2">Organization</th>
                <th className="border  py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPortfolioUsers.map((portfolioUser) => (
                <tr key={portfolioUser._id} className="text-center hover:bg-gray-100 h-16">
                  <td className="border  py-2">{portfolioUser.ownerName}</td>
                  <td className="border  py-2">{portfolioUser.name || 0}</td>
                  <td className="border  py-2">
                    <div className='flex gap-2 justify-center'>

                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 shadow-md transition-transform transform hover:scale-105"
                        onClick={() => { setUpdatePortfolioData(portfolioUser) }}
                      >
                        Update
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 shadow-md transition-transform transform hover:scale-105"
                        onClick={() => { confirmDelete(portfolioUser._id) }}
                      >
                        Delete
                      </button>

                      <button className='bg-white px-2 py-1 rounded shadow-md transition-transform transform hover:scale-105 border'
                        onClick={() => { handleViewClick(portfolioUser.userName) }}>
                        View <ExternalLink className='inline-block' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center border border-gray-300">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-2">Enter 'confirm' to delete this customer:</p>
            <input
              type="text"
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            <button
              onClick={handlePortfolioDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Confirm
            </button>
            <button
              onClick={() => { setShowDeleteConfirm(false); setConfirmationInput(''); setDeletePortfolioId(null) }}
              className="bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded hover:bg-gray-400 transition ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManagePortfolio
