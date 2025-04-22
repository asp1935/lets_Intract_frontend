import React, { useState, useEffect } from "react";
import { FaDownload, FaCalendarAlt, FaSync, FaSearch, FaArrowLeft } from "react-icons/fa";
import { useAssociateRef } from "../hooks/useAssociate";
import { useStaffRef } from "../hooks/useStaffRef";
import { useUser } from "../hooks/useUser";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useDispatch } from "react-redux";
import { showToast } from "../redux/slice/ToastSlice";
import { useQuery } from "@tanstack/react-query";
import { getMonthlyReport } from "../api/historyApi";

const AccountReport = () => {
    const [selectedReport, setSelectedReport] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [commissionType, setCommissionType] = useState("with");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [associates, setAssociates] = useState([]);
    const [staffs, setStaffs] = useState([])

    const dispatch = useDispatch();
    const { data: associateData } = useAssociateRef();
    const { data: staffData } = useStaffRef();
    const { data: customerData } = useUser(null, 'user', null)
    const [customers, setCustomers] = useState([]);

    const { data, isLoading, error } = useQuery({
        queryKey: ["monthlyReport", selectedMonth],
        queryFn: () => getMonthlyReport(selectedMonth),
        enabled: !!selectedMonth, // Only run query if selectedMonth is set
    });

    useEffect(() => {
        if (associateData?.data.length > 0) {
            setAssociates(associateData.data)
        }

    }, [associateData])

    useEffect(() => {
        if (staffData?.data.length > 0) {
            setStaffs(staffData.data)
        }
    }, [staffData])

    useEffect(() => {
        if (customerData?.data.length > 0) {
            setCustomers(customerData.data)
        }
    }, [customerData])

    // Sample data for associates
    // Filter associates based on search term
    const filteredAssociates = associates.length > 0 ? associates?.filter((associate) =>
        associate?.rname?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const filteredStaffs = staffs.length > 0 ? staffs?.filter((staff) =>
        staff?.rname?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];


    // Initialize filteredMembers with all customers/politicians when the report is selected
    useEffect(() => {
        if (selectedReport === "Customer/Politician Report") {
            setFilteredMembers(customers);
        }
    }, [selectedReport]);

    // Handle search functionality
    const handleSearch = (term) => {
        setSearchTerm(term);
        if (term === "") {
            setFilteredMembers(customers);
        } else {
            const filtered = customers.filter((person) =>
                person.name.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredMembers(filtered);
        }
    };

    // Handle search box focus
    const handleSearchFocus = () => {
        setIsSearchDropdownOpen(true);
        setFilteredMembers(customers);
    };

    // Handle search box blur
    const handleSearchBlur = () => {
        setTimeout(() => setIsSearchDropdownOpen(false), 200);
    };

    // Handle selection of a person from the dropdown
    const handlePersonSelect = (person) => {
        setSelectedCustomer(person);
        setSearchTerm(person.name);
        setIsSearchDropdownOpen(false);
    };

    // Handle report selection
    const handleReportSelect = (reportType) => {
        setSelectedReport(reportType);
        setSelectedMonth("");
        setSearchTerm("");
        setSelectedCustomer("");
    };

    // Handle refresh
    const handleRefresh = () => {
        setSelectedReport("");
        setSelectedMonth("");
        setSearchTerm("");
        setSelectedCustomer("");
    };

    // Handle download all reports
    const handleDownloadAll = () => {
        const customer = selectedReport === 'Associate Report' ? associates : staffs;

        if (customer.length <= 0) {
            dispatch(showToast({ message: "No Record Available", type: "warn" }))
            return;
        }

        const doc = new jsPDF();
        // Get page width and calculate center position
        const pageWidth = doc.internal.pageSize.width;
        const title = selectedReport === 'Associate Report' ? "Associate List" : "Staff List";
        const titleX = (pageWidth - doc.getTextWidth(title)) / 2; // Center alignment
        // Set font to bold
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16); // Increase font size for better visibility
        doc.text(title, titleX, 10);

        //refcount,commission

        const tableColumn = selectedReport === "Associate Report"
            ? ["#", "Name", "Mobile", "Email", "Total Members", "Commission"]
            : ["#", "Name", "Email", "Total Members", "Incentive"];

        const tableRows = customer.map((entry, index) => {
            return selectedReport === "Associate Report"
                ? [
                    index + 1,
                    entry.rname || "N/A",
                    entry.rmobile || "N/A",
                    entry.remail || "N/A",
                    entry.totalReferralCount || 0,
                    entry.commission || "N/A",
                ]
                : [
                    index + 1,
                    entry.rname || "N/A",
                    entry.remail || "N/A",
                    entry.totalReferralCount || 0,
                    entry.incentive || "N/A",
                ];
        });


        // Corrected autoTable function call
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20, // Start table after the title
            styles: { fontSize: 10 },
            headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" }, // Blue header
            alternateRowStyles: { fillColor: [240, 240, 240] }, // Light gray alternating rows
            margin: { top: 10 },
        });

        doc.save(`all_${selectedReport === 'Associate Report' ? 'associate' : 'staff'}.pdf`);
    };

    // Handle download individual associate report
    const handleDownloadAssociateReport = (associate) => {

        const doc = new jsPDF();

        // Set title font to Times Bold and center it
        doc.setFont("times", "bold");
        doc.setFontSize(16);
        doc.setTextColor(41, 128, 185); // Blue title
        const title = "Associate Details";
        const pageWidth = doc.internal.pageSize.width;
        const titleX = (pageWidth - doc.getTextWidth(title)) / 2; // Center alignment
        doc.text(title, titleX, 22); // Title position

        // Draw title border
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.rect(10, 15, pageWidth - 20, 12); // Border around title

        // Set normal font for details
        doc.setFont("times", "normal");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); // Black text

        // **Display Associate Details Horizontally**
        let y = 40; // Starting Y position
        doc.setFont("times", "bold");
        doc.text("Name:", 30, y);
        doc.setFont("times", "normal");
        doc.text(associate.rname, 60, y);

        doc.setFont("times", "bold");
        doc.text("Mobile:", 110, y);
        doc.setFont("times", "normal");
        doc.text(associate.rmobile, 140, y);

        y += 8;
        doc.setFont("times", "bold");
        doc.text("Email:", 30, y);
        doc.setFont("times", "normal");
        doc.text(associate.remail, 60, y);

        doc.setFont("times", "bold");
        doc.text("Total Referral:", 110, y);
        doc.setFont("times", "normal");
        doc.text(associate.totalReferralCount.toString(), 140, y);

        y += 8;
        doc.setFont("times", "bold");
        doc.text("Commission:", 30, y);
        doc.setFont("times", "normal");
        doc.text(`${associate.commission}`, 60, y);

        // **Table for Referred Users**
        // if (associate.referredUsers && associate.referredUsers.name) {
        if (Array.isArray(associate.referredUsers) && associate.referredUsers.length > 0) {
            y += 15;
            const tableColumn = ["#", "Name", "Email", "Mobile", "Type", "Plan"];
            const tableRows = associate.referredUsers.map((user, index) => [
                index + 1,
                user.name,
                user.email,
                user.mobile,
                user.type ? user.type === "political" ? "Politician" : "Businessman" : '',
                user.plan.type ? `${user.plan.type ? user.plan.type === "basic" ? "Basic" : "Advance" : 'NA'} + ${user.plan.name || 'NA'}` : 'N/A',
            ]);

            autoTable(doc, {
                startY: y,
                head: [tableColumn],
                body: tableRows,
                styles: { fontSize: 10 },
                headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
                alternateRowStyles: { fillColor: [240, 240, 240] },
                margin: { top: 10 },
            });

        }
        // Save the PDF with a properly formatted filename
        doc.save(`Associate_Report_${associate.rname.replace(/\s+/g, "_")}.pdf`);
    };


    // Handle download individual staff report
    const handleDownloadStaffReport = (staff) => {

        const doc = new jsPDF();

        // Set title font to Times Bold and center it
        doc.setFont("times", "bold");
        doc.setFontSize(16);
        doc.setTextColor(41, 128, 185); // Blue title
        const title = "Staff Details";
        const pageWidth = doc.internal.pageSize.width;
        const titleX = (pageWidth - doc.getTextWidth(title)) / 2; // Center alignment
        doc.text(title, titleX, 22); // Title position

        // Draw title border
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.rect(10, 15, pageWidth - 20, 12); // Border around title

        // Set normal font for details
        doc.setFont("times", "normal");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); // Black text

        // **Display Associate Details Horizontally**
        let y = 40; // Starting Y position
        doc.setFont("times", "bold");
        doc.text("Name:", 30, y);
        doc.setFont("times", "normal");
        doc.text(staff.rname, 60, y);

        doc.setFont("times", "bold");
        doc.text("Mobile:", 110, y);
        doc.setFont("times", "normal");
        doc.text(staff.remail, 140, y);

        y += 8;
        doc.setFont("times", "bold");
        doc.text("Total Referral:", 110, y);
        doc.setFont("times", "normal");
        doc.text(staff.totalReferralCount.toString(), 140, y);

        doc.setFont("times", "bold");
        doc.text("Commission:", 30, y);
        doc.setFont("times", "normal");
        doc.text(`${staff.incentive}`, 60, y);

        // **Table for Referred Users**
        if (Array.isArray(staff.referredUsers) && staff.referredUsers.length > 0) {
            y += 15;
            const tableColumn = ["#", "Name", "Email", "Type", "Plan"];
            const tableRows = staff.referredUsers.map((user, index) => [
                index + 1,
                user.name,
                user.email,
                user.type ? user.type === "political" ? "Politician" : "Businessman" : '',
                user.type ? `${user.plan.type === "basic" ? "Basic" : "Advance"} + ${user.plan.name}` : '',
            ]);

            autoTable(doc, {
                startY: y,
                head: [tableColumn],
                body: tableRows,
                styles: { fontSize: 10 },
                headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
                alternateRowStyles: { fillColor: [240, 240, 240] },
                margin: { top: 10 },
            });

        }
        // Save the PDF with a properly formatted filename
        doc.save(`Staff_Report_${staff.rname.replace(/\s+/g, "_")}.pdf`);
    };

    // Handle download member addition report
    const handleDownloadMemberReport = (customer) => {

        const doc = new jsPDF();

        // Set title font to Times Bold and center it
        doc.setFont("times", "bold");
        doc.setFontSize(16);
        doc.setTextColor(41, 128, 185); // Blue title
        const title = "Customer Details";
        const pageWidth = doc.internal.pageSize.width;
        const titleX = (pageWidth - doc.getTextWidth(title)) / 2; // Center alignment
        doc.text(title, titleX, 22); // Title position

        // Draw title border
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.rect(10, 15, pageWidth - 20, 12); // Border around title

        // Set normal font for details
        doc.setFont("times", "normal");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); // Black text

        // **Display Associate Details Horizontally**
        let y = 40; // Starting Y position
        doc.setFont("times", "bold");
        doc.text("Name:", 30, y);
        doc.setFont("times", "normal");
        doc.text(customer.name, 60, y);

        doc.setFont("times", "bold");
        doc.text("Mobile:", 110, y);
        doc.setFont("times", "normal");
        doc.text(customer.mobile, 140, y);

        y += 8;
        doc.setFont("times", "bold");
        doc.text("Email:", 30, y);
        doc.setFont("times", "normal");
        doc.text(customer.email, 60, y);

        doc.setFont("times", "bold");
        doc.text(`${customer.type === 'business' ? 'Employee Count : ' : 'Member Cnt : '}`, 110, y);
        doc.setFont("times", "normal");
        doc.text(customer.memberCount.toString(), 145, y);

        y += 8;
        doc.setFont("times", "bold");
        doc.text("Type:", 30, y);
        doc.setFont("times", "normal");
        doc.text(`${customer.type === 'business' ? 'Business' : 'Political'}`, 60, y);

        // **Table for Referred Users**
        // if (customer.referredUsers && customer.referredUsers.name) {
        if (Array.isArray(customer.members) && customer.members.length > 0) {
            y += 15;
            const tableColumn = ["#", "Name", "Mobile", "Role"];
            const tableRows = customer.members.map((user, index) => [
                index + 1,
                user.name,
                user.mobile,
                user.role ? customer.type === "business" ? "Employee" : "Member" : '',
            ]);

            autoTable(doc, {
                startY: y,
                head: [tableColumn],
                body: tableRows,
                styles: { fontSize: 10 },
                headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
                alternateRowStyles: { fillColor: [240, 240, 240] },
                margin: { top: 10 },
            });

        }
        // Save the PDF with a properly formatted filename
        doc.save(`Customer_Report_${customer.name.replace(/\s+/g, "_")}.pdf`);
    };


    // Handle download monthly profit report
    const handleDownloadMonthlyProfitReport = () => {
        if (!selectedMonth) {
            dispatch(showToast({ message: "Please select a month.", type: "error" }));
            return;
        }

        if (isLoading) {
            dispatch(showToast({ message: "Fetching report. Please wait...", type: "info" }));
            return;
        }

        if (error) {
            dispatch(showToast({ message: error, type: "error" }));
            return;
        }

        if (!data.data || Object.values(data.data).length === 0) {
            dispatch(showToast({ message: "No Record Available", type: "warn" }));
            return;
        }

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const title = `Monthly Report - ${selectedMonth} (${commissionType === 'with' ? 'With Commission/Incentive' : 'Without Commission/Incentive'})`;
        const titleX = (pageWidth - doc.getTextWidth(title)) / 2;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text(title, titleX, 10);

        const tableColumn = commissionType === 'with'
            ? ["#", "Name", "Mobile", "Plan", "Refer By", "Commission", "Price"]
            : ["#", "Name", "Mobile", "Plan", "Refer By", "Price"];

        let totalPrice = 0;
        let totalCommission = 0;

        const tableRows = data.data.map((entry, index) => {
            const price = entry.planPrice || 0;
            const commission = entry.commission || 0;

            totalPrice += price;
            if (commissionType === 'with') {
                totalCommission += commission;
            }

            return commissionType === 'with'
                ? [
                    index + 1,
                    entry.name || "N/A",
                    entry.mobile || "N/A",
                    `${entry.planType === "basic" ? "Basic" : "Advance"}+ ${entry.planName}`,
                    entry.referredBy || "N/A",
                    commission.toFixed(2),
                    price.toFixed(2),
                ]
                : [
                    index + 1,
                    entry.name || "N/A",
                    entry.mobile || "N/A",
                    `${entry.planType === "basic" ? "Basic" : "Advance"}+ ${entry.planName}`,
                    entry.referredBy || "N/A",
                    price.toFixed(2),
                ];
        });

        // Calculate Net Profit
        const netProfit = totalPrice - totalCommission;

        // Add Total Row with Background Color
        const totalRow = [
            { content: "Total", colSpan: commissionType === 'with' ? 5 : 5, styles: { fontStyle: "bold", halign: "right", fillColor: [200, 200, 200] } },
            ...(commissionType === 'with' ? [{ content: totalCommission.toFixed(2), styles: { fontStyle: "bold", fillColor: [200, 200, 200] } }] : []),
            { content: totalPrice.toFixed(2), styles: { fontStyle: "bold", fillColor: [200, 200, 200] } },
        ];
        tableRows.push(totalRow);

        // Add Net Profit Row with Different Background Color
        const netProfitRow = [
            { content: "Net Profit", colSpan: commissionType === 'with' ? 5 : 5, styles: { fontStyle: "bold", halign: "right", fillColor: [100, 200, 100] } },
            ...(commissionType === 'with' ? [{ content: "", styles: { fillColor: [100, 200, 100] } }] : []),
            { content: netProfit.toFixed(2), styles: { fontStyle: "bold", fillColor: [100, 200, 100] } },
        ];
        tableRows.push(netProfitRow);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
            alternateRowStyles: { fillColor: [240, 240, 240] },
            margin: { top: 10 },
        });

        doc.save(`monthly_report.pdf`);
    };

    // Handle download all customers/politicians report
    const handleDownloadAllCustomersPoliticians = () => {
        if (!filteredMembers || filteredMembers.length === 0) {
            dispatch(showToast({ message: "No Data Available", type: 'warn' }))
            return;
        }

        const doc = new jsPDF();
        // Get page width and calculate center position
        const pageWidth = doc.internal.pageSize.width;
        const title = `${selectedCategory === 'all' ? 'All Customer Report' : selectedCategory === 'politician' ? 'Political Cutomer Report' : 'Business Customer Report'}`;
        const titleX = (pageWidth - doc.getTextWidth(title)) / 2; // Center alignment
        // Set font to bold
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16); // Increase font size for better visibility
        doc.text(title, titleX, 10);

        //refcount,commission

        const filterData = filteredMembers
            .filter((person) => {
                const matchesCategory =
                    selectedCategory === "all" ||
                    (selectedCategory === "politician" && person.type === "political") ||
                    (selectedCategory === "businessperson" && person.type === "business");

                const matchesSearchTerm = person.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

                return matchesCategory && matchesSearchTerm;
            })
        const tableColumn = ["#", "Name", "Mobile", "Email", "Refer By", "Member Count", "Type"];
        const tableRows = filterData.map((entry, index) => [
            index + 1,
            entry.name,
            entry.mobile,
            entry.email,
            entry.referralName,
            entry.memberCount,
            entry.type === 'business' ? 'Business' : 'Political',
        ]);

        // Corrected autoTable function call
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20, // Start table after the title
            styles: { fontSize: 10 },
            headStyles: {
                fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold"
            }, // Blue header
            alternateRowStyles: { fillColor: [240, 240, 240] }, // Light gray alternating rows
            margin: { top: 10 },
        });

        doc.save("Customer_Report.pdf");
    };

    // Calculate current month members
    const calculateCurrentMonthMembers = (members) => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const currentMonthMembers = members.filter((member) => {
            const joinDate = new Date(member.createdAt);
            return (
                joinDate.getMonth() === currentMonth &&
                joinDate.getFullYear() === currentYear
            );
        });

        return currentMonthMembers.length;
    };

    // Report types as cards
    const reportTypes = [
        { id: 1, name: "Associate Report", icon: <FaDownload className="text-2xl" /> },
        { id: 2, name: "Staff Report", icon: <FaDownload className="text-2xl" /> },
        { id: 3, name: "Monthly Profit Report", icon: <FaCalendarAlt className="text-2xl" /> },
        { id: 4, name: "Customer/Politician Report", icon: <FaDownload className="text-2xl" /> },
    ];



    // // Sample data for staff members
    // const staffMembers = [
    //     { id: 1, name: "Alice Johnson", mobileNumber: "9098789623", totalMembers: 20 },
    //     { id: 2, name: "Bob Brown", mobileNumber: "9098761234", totalMembers: 15 },
    // ];

    return (
        <div className="Form mt-10 p-6 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg rounded-lg">
            {/* Header with Refresh Button */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-[#640D5F]">Reports</h2>
                <button
                    className="p-2 bg-[#640D5F] text-white rounded-lg hover:bg-[#520a4a] transition-all focus:outline-none focus:ring-2 focus:ring-[#640D5F] focus:ring-offset-2"
                    onClick={handleRefresh}
                >
                    <FaSync className="text-xl" />
                </button>
            </div>

            {/* Report Type Selection as Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {reportTypes.map((report) => (
                    <div
                        key={report.id}
                        className={`p-6 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all ${selectedReport === report.name ? "ring-2 ring-[#640D5F]" : ""
                            }`}
                        onClick={() => handleReportSelect(report.name)}
                    >
                        <div className="flex flex-col items-center justify-center space-y-3">
                            <div className="text-[#640D5F]">{report.icon}</div>
                            <h3 className="text-lg font-semibold text-[#640D5F] text-center">{report.name}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Associate Report Section */}
            {selectedReport === "Associate Report" && (
                <div className="mb-6 mt-9">
                    <h3 className="text-xl font-semibold mb-4 text-[#640D5F]">Associate Report</h3>
                    <div className="space-y-4">
                        {/* Search Field and Download Button */}
                        <div className="flex items-center justify-between">
                            <div className="relative flex-grow mr-4">
                                <input
                                    type="text"
                                    placeholder="Search associates..."
                                    className="w-50 p-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#640D5F] focus:border-transparent"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                            </div>
                            <div className="relative group">
                                <button
                                    className="px-6 py-3 bg-[#640D5F] text-white rounded-lg shadow-md hover:bg-[#520a4a] transition-all focus:outline-none focus:ring-2 focus:ring-[#640D5F] focus:ring-offset-2 flex items-center gap-2"
                                    onClick={handleDownloadAll}
                                >
                                    <FaDownload className="text-xl" /> Download All Associate Report
                                </button>

                            </div>
                        </div>

                        {/* Associate Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                                <thead className="bg-[#d64fcf] text-white">
                                    <tr>
                                        <th className="p-3 text-left">Name</th>
                                        <th className="p-3 text-left">Mobile</th>
                                        <th className="p-3 text-left">Total Members</th>
                                        <th className="p-3 text-left">Current Month Members Added</th>
                                        <th className="p-3 text-left">Commission</th>
                                        <th className="p-3 text-left">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAssociates.map((associate) => (
                                        <tr key={associate._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-3 border-b border-gray-200">{associate.rname}</td>
                                            <td className="p-3 border-b border-gray-200">{associate.rmobile}</td>
                                            <td className="p-3 border-b border-gray-200">{associate.totalReferralCount}</td>
                                            <td className="p-3 border-b border-gray-200">
                                                {calculateCurrentMonthMembers(associate.referredUsers)}
                                            </td>
                                            <td className="p-3 border-b border-gray-200">{associate.commission}</td>
                                            <td className="p-3 border-b border-gray-200">
                                                <button
                                                    className="text-[#640D5F] hover:text-[#8A1C7C] transition-colors"
                                                    onClick={() => handleDownloadAssociateReport(associate)}
                                                >
                                                    <FaDownload className="text-xl" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Staff Report Section */}
            {selectedReport === "Staff Report" && (
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4 text-[#640D5F]">Staff Report</h3>
                    <div className="space-y-4">
                        {/* Search Field and Download Button */}
                        <div className="flex justify-between">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search staff..."
                                    className="w-50 p-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#640D5F] focus:border-transparent"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                            </div>
                            <button
                                className="px-6 py-3 bg-[#640D5F] text-white rounded-lg shadow-md hover:bg-[#520a4a] transition-all focus:outline-none focus:ring-2 focus:ring-[#640D5F] focus:ring-offset-2 flex items-center"
                                onClick={handleDownloadAll}
                            >
                                <FaDownload className="mr-2" />
                                Download All Staff Reports
                            </button>
                        </div>

                        {/* Staff Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                                <thead className="bg-[#d64fcf] text-white">
                                    <tr>
                                        <th className="p-3 text-center">Name</th>
                                        <th className="p-3 text-center">Email</th>
                                        <th className="p-3 text-center">Total Members</th>
                                        <th className="p-3 text-left">Current Month Members Added</th>
                                        <th className="p-3 text-left">Incentive</th>
                                        <th className="p-3 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStaffs.map((staff) => (
                                        <tr key={staff._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-3 text-center border-b border-gray-200">{staff.rname}</td>
                                            <td className="p-3 text-center border-b border-gray-200">{staff.remail}</td>
                                            <td className="p-3 text-center border-b border-gray-200">{staff.totalReferralCount}</td>
                                            <td className="p-3 border-b border-gray-200">
                                                {calculateCurrentMonthMembers(staff.referredUsers)}
                                            </td>
                                            <td className="p-3 border-b border-gray-200">{staff.incentive}</td>

                                            <td className="p-3 text-center border-b border-gray-200">
                                                <button
                                                    className="text-[#640D5F] hover:text-[#8A1C7C] transition-colors"
                                                    onClick={() => handleDownloadStaffReport(staff)}
                                                >
                                                    <FaDownload className="text-xl" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Monthly Profit Report Section */}
            {selectedReport === "Monthly Profit Report" && (
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4 text-[#640D5F]">Monthly Profit Report</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Month</label>
                            <div className="flex flex-wrap justify-between items-center">
                                <input
                                    type="month"
                                    className="w-100 p-3 border border-[#640D5F] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#640D5F] focus:border-transparent"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                />
                                <select
                                    value={commissionType}
                                    onChange={(e) => setCommissionType(e.target.value)}
                                    className="mx-4 p-3 py-4 border border-[#640D5F] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#640D5F] focus:border-transparent"
                                >
                                    <option value="with">With Commission/Incentive</option>
                                    <option value="without">Without Commission/Incentive</option>
                                </select>
                                <button
                                    className="px-6 py-4 bg-[#640D5F] text-white rounded-lg shadow-md hover:bg-[#520a4a] transition-all focus:outline-none focus:ring-2 focus:ring-[#640D5F] focus:ring-offset-2 flex items-center"
                                    onClick={handleDownloadMonthlyProfitReport}
                                >
                                    <FaDownload className="mr-2" />
                                    Download Monthly Profit Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Customer/Politician Report Section */}
            {/* Customer/Politician Report Section */}
            {selectedReport === "Customer/Politician Report" && (
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4 text-[#640D5F]">Customer/Politician Report</h3>
                    <div className="space-y-4">
                        {/* Dropdown for selecting category */}
                        <div className="flex items-center gap-4 mb-4">
                            <select
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    setSelectedCustomer(null);
                                }}
                                className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#640D5F] focus:border-transparent"
                            >
                                <option value="all">All</option>
                                <option value="politician">Politician</option>
                                <option value="businessperson">Customer</option>
                            </select>

                            {/* Search Field with Dropdown */}
                            <div className="relative flex-grow">
                                <input
                                    type="search"
                                    placeholder="Search by name..."
                                    className="w-full p-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#640D5F] focus:border-transparent"
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    onFocus={handleSearchFocus}
                                    onBlur={handleSearchBlur}
                                />
                                <FaSearch className="absolute left-3 top-3 text-gray-400" />

                                {/* Dropdown for Search Results */}
                                {isSearchDropdownOpen && (
                                    <div className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 w-full max-h-60 overflow-y-auto">
                                        {filteredMembers
                                            .filter((person) => {
                                                const matchesCategory =
                                                    selectedCategory === "all" ||
                                                    (selectedCategory === "politician" && person.type === "political") ||
                                                    (selectedCategory === "businessperson" && person.type === "business");

                                                const matchesSearchTerm = person.name
                                                    .toLowerCase()
                                                    .includes(searchTerm.toLowerCase());

                                                return matchesCategory && matchesSearchTerm;
                                            })
                                            .map((person) => (
                                                <div
                                                    key={person.id}
                                                    className="p-2 cursor-pointer hover:bg-gray-100"
                                                    onMouseDown={() => handlePersonSelect(person)} // Use onMouseDown instead of onClick
                                                >
                                                    {person.name}
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Conditional Rendering: Main Table OR Employee List */}
                        {!selectedCustomer ? (
                            // Main Table (Customers/Politicians)
                            <div className="mt-6">
                                <div className="my-6 flex items-center justify-between">
                                    <h4 className="text-lg font-semibold mb-2 text-[#640D5F]">
                                        {selectedCategory === "all"
                                            ? "All Customers/Politicians"
                                            : selectedCategory === "politician"
                                                ? "Politicians"
                                                : "Businesspersons"}
                                    </h4>
                                    <button
                                        className="flex items-center px-4 py-2 bg-[#640D5F] text-white rounded-lg shadow-md hover:bg-[#520a4a] transition-all focus:outline-none focus:ring-2 focus:ring-[#640D5F] focus:ring-offset-2"
                                        onClick={handleDownloadAllCustomersPoliticians}
                                    >
                                        <FaDownload className="mr-2" />
                                        Download All Reports
                                    </button>
                                </div>

                                {/* Customers/Politicians Table */}
                                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                                    <thead className="bg-[#d64fcf] text-white">
                                        <tr>
                                            <th className="p-3 text-center">Sr. No.</th>
                                            <th className="p-3 text-center">Name</th>
                                            <th className="p-3 text-center">Added By</th>
                                            <th className="p-3 text-center">Member Count</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredMembers
                                            .filter((person) => {
                                                const matchesCategory =
                                                    selectedCategory === "all" ||
                                                    (selectedCategory === "politician" && person.type === "political") ||
                                                    (selectedCategory === "businessperson" && person.type === "business");

                                                const matchesSearchTerm = person.name
                                                    .toLowerCase()
                                                    .includes(searchTerm.toLowerCase());

                                                return matchesCategory && matchesSearchTerm;
                                            })
                                            .map((person, index) => (
                                                <tr
                                                    key={person._id}
                                                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                                                    onClick={() => setSelectedCustomer(person)}
                                                >
                                                    <td className="p-3 text-center border-b border-gray-200">{index + 1}</td>
                                                    <td className="p-3 text-center border-b border-gray-200">{person.name}</td>
                                                    <td className="p-3 text-center border-b border-gray-200">{person.referralName || "N/A"}</td>
                                                    <td className="p-3 text-center border-b border-gray-200">{person.members.length}</td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            // Employee List of Selected Customer
                            <div className="mt-6">
                                <div className="my-6 flex items-center justify-between">
                                    <h4 className="text-lg font-semibold mb-2 text-[#640D5F]">
                                        Employees of {selectedCustomer.name}
                                    </h4>
                                    <div className="flex gap-2">
                                        <button
                                            className="flex items-center px-4 py-2 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                                            onClick={() => setSelectedCustomer(null)}
                                        >
                                            <FaArrowLeft className="mr-2" /> Back
                                        </button>
                                        <button
                                            className="flex items-center px-4 py-2 bg-[#640D5F] text-white rounded-lg shadow-md hover:bg-[#520a4a] transition-all focus:outline-none focus:ring-2 focus:ring-[#640D5F] focus:ring-offset-2"
                                            onClick={() => handleDownloadMemberReport(selectedCustomer)}
                                        >
                                            <FaDownload className="mr-2" />
                                            Download Members Report
                                        </button>
                                    </div>
                                </div>

                                {/* Employees Table */}
                                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                                    <thead className="bg-[#d64fcf] text-white">
                                        <tr>
                                            <th className="p-3 text-center">Sr. No.</th>
                                            <th className="p-3 text-center">Employee Name</th>
                                            <th className="p-3 text-center">Mobile No.</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedCustomer.members.map((member, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-3 text-center border-b border-gray-200">{index + 1}</td>
                                                <td className="p-3 text-center border-b border-gray-200">{member.name}</td>
                                                <td className="p-3 text-center border-b border-gray-200">{member.mobile}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountReport;