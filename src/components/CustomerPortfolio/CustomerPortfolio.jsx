import React, { useEffect, useState } from 'react'

function CustomerPortfolio({ portfolios }) {
  const [portfolioSearchTerm, setPortfolioSearchTerm] = useState("");
  const [filteredPortfolioUsers, setFilteredPortfolioUsers] = useState([]);



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
    <div className=" mx-auto p-8 rounded-lg">
      <h2 className="text-3xl font-bold mb-1 text-[#640D5F] text-center" >
        Portfolio List
      </h2>



      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          {/* <h2 className="text-lg font-bold">Search</h2> */}
        </div>
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
                <th className="border px-4 py-2">Customers</th>
                <th className="border px-4 py-2">Organization</th>
                {/* <th className="border px-4 py-2">Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {filteredPortfolioUsers.map((portfolioUser) => (
                <tr key={portfolioUser._id} className="text-center hover:bg-gray-100 h-16">
                  <td className="border px-4 py-2">{portfolioUser.ownerName}</td>
                  <td className="border px-4 py-2">{portfolioUser.name || 0}</td>
                  {/* <td className="border px-4 py-2">
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 shadow-md transition-transform transform hover:scale-105"
                      onClick={() => {
                        setViewedBusinessPerson(portfolioUser);
                        handleFetchEmployees(portfolioUser._id)

                      }}
                    >
                      Delete
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  )
}

export default CustomerPortfolio
