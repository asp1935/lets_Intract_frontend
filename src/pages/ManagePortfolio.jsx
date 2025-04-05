import React, { useEffect, useState } from 'react'
import { usePortfolio } from '../hooks/usePortfolio';
import CustomerPortfolio from '../components/CustomerPortfolio/CustomerPortfolio';
import UpdatePortfolio from '../components/CustomerPortfolio/UpdatePortfolio';

function ManagePortfolio() {
  const [portfolios, setportfolios] = useState([]);
  const [portfolioSearchTerm, setPortfolioSearchTerm] = useState("");
  const [filteredPortfolioUsers, setFilteredPortfolioUsers] = useState([]);
  const [updatePortfolioData, setUpdatePortfolioData] = useState(null);
  const [deletePortfolioId, setDeletePortfolioId] = useState(null);

  const { data: portfolioData } = usePortfolio();


  useEffect(() => {
    if (portfolioData?.data.length > 0) {
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



  return (
    <div className='w-full p-8 min-h-[85vh]'>
      <h2 className="text-3xl font-bold mb-6 text-[#640D5F] text-center" style={{ textShadow: "3px 3px 10px rgba(100, 13, 95, 0.7)" }}>
        Manage Portfolio's
      </h2>
      {updatePortfolioData && <UpdatePortfolio portfolioData={updatePortfolioData} setPortfolioData={setUpdatePortfolioData}/>}
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
                        onClick={() => { setDeletePortfolioId(portfolioUser._id) }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  )
}

export default ManagePortfolio
