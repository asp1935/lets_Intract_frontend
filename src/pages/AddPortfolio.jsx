import React, { useEffect, useState } from 'react'
import { useUser } from '../hooks/useUser';
import BasicDetails from '../components/CustomerPortfolio/BasicDetails';
import { usePortfolio } from '../hooks/usePortfolio';
import CustomerPortfolio from '../components/CustomerPortfolio/CustomerPortfolio';

function AddPortfolio() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [filteredUser, setFilteredUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
    const [portfolios, setportfolios] = useState([]);


    const { data: userData } = useUser(null, "user", null);
    const { data: portfolioData } = usePortfolio();


    useEffect(() => {
        if (userData?.data.length > 0) {
            setUsers(userData.data);

        }
    }, [userData]);

    useEffect(() => {
        if (portfolioData?.data.length > 0) {
            setportfolios(portfolioData.data)
        }
    }, [portfolioData])

    useEffect(() => {
        const result = users.filter((user) => {
            const matchesCategory =
                selectedCategory === "all" ||
                (selectedCategory === "politician" && user.type === "political") ||
                (selectedCategory === "businessperson" && user.type === "business");

            const matchesSearchTerm = user.name?.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesCategory && matchesSearchTerm;
        });


        setFilteredUsers(result);
    }, [users, searchTerm, selectedCategory]);


    const handlePersonSelect = (person) => {
        setSelectedCustomer(person);
        setSearchTerm(person.name);
        setIsSearchDropdownOpen(false);
    };
    const handleClearSearch = () => {
        setSelectedCustomer(null);
        setSearchTerm('');
        setFilteredUsers([])
        setIsSearchDropdownOpen(false);
    }
    return (
        <div className="Form mx-auto p-8 rounded-lg min-h-[85vh]">
            <h2 className="text-3xl font-bold mb-6 text-[#640D5F] text-center" style={{ textShadow: "3px 3px 10px rgba(100, 13, 95, 0.7)" }}>
                Create Customer Portfolio
            </h2>

            {/* Search Bar & User Details Card in a Flexbox */}
            <div className="flex justify-center gap-5">
                <select
                    value={selectedCategory}
                    onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setSelectedCustomer(null);
                    }}
                    className=" p-2 rounded-md text-[#4e0c4a] border border-[#640D5F]"
                >
                    <option value="all">All</option>
                    <option value="politician">Politician</option>
                    <option value="businessperson">Customer</option>
                </select>
                {/* Search and Dropdown */}
                <div className="relative w-1/2 ">
                    <input
                        type="search"
                        placeholder="Search Customer"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setIsSearchDropdownOpen(true); // Ensure dropdown opens on typing

                        }}

                        className="w-full p-2 rounded-md text-[#4e0c4a] border border-[#640D5F]"
                    />
                    {isSearchDropdownOpen && (
                        <div className="absolute bg-white border border-gray-300 w-full mt-1 rounded-md shadow-lg max-h-48 overflow-y-auto">
                            {filteredUser.map((customer, index) => (
                                <div
                                    key={index}
                                    className="p-2 hover:bg-gray-200 cursor-pointer"
                                    onClick={() => {
                                        handlePersonSelect(customer);
                                        setIsSearchDropdownOpen(false)
                                    }}
                                >
                                    {customer.name} ({customer.mobile})
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className='my-auto'>
                    <button type='button' className='bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 shadow-md transition-transform transform hover:scale-105' onClick={handleClearSearch}>Clear</button>
                </div>
            </div>
            {selectedCustomer && (
                <BasicDetails customer={selectedCustomer} setSelectedCategory={setSelectedCustomer} setSelectedCustomer={setSelectedCustomer} />
            )}
            <div className='w-full mt-6'>
                <CustomerPortfolio portfolios={portfolios} />
            </div>
        </div>
    )
}

export default AddPortfolio
