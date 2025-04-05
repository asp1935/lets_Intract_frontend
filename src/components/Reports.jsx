import React, { useState } from "react";
import { jsPDF } from "jspdf";
import DatePicker from "react-datepicker"; // Import the date picker library
import "react-datepicker/dist/react-datepicker.css"; // Import the date picker styles

const Reports = () => {
  const [businessData, setBusinessData] = useState([
    { name: "Business Person 1", plan: "Premium", revenue: "$100,000" },
    { name: "Business Person 2", plan: "Basic", revenue: "$50,000" },
  ]);

  const [politicianData, setPoliticianData] = useState([
    { name: "Politician 1", plan: "Gold", followers: "10,000" },
    { name: "Politician 2", plan: "Silver", followers: "5,000" },
  ]);

  const [selectedReport, setSelectedReport] = useState("business"); // State to track selected report type
  const [startDate, setStartDate] = useState(null); // State for start date (null means no date selected)
  const [endDate, setEndDate] = useState(null); // State for end date (null means no date selected)

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add a title to the PDF
    doc.setFontSize(16);
    doc.text("All Reports", 10, 10);

    // Add Business Report
    doc.setFontSize(14);
    doc.text("Business Report", 10, 20);
    doc.setFontSize(12);
    businessData.forEach((person, index) => {
      doc.text(`${person.name} - ${person.plan} - Revenue: ${person.revenue}`, 10, 30 + index * 10);
    });

    // Add Politician Report
    doc.setFontSize(14);
    doc.text("Politician Report", 10, 70); // Adjust Y position to avoid overlap
    doc.setFontSize(12);
    politicianData.forEach((person, index) => {
      doc.text(`${person.name} - ${person.plan} - Followers: ${person.followers}`, 10, 80 + index * 10);
    });

    // Save the PDF
    if (startDate && endDate) {
      // If date range is selected, include it in the filename
      doc.save(`all_reports_${startDate.toLocaleDateString()}_to_${endDate.toLocaleDateString()}.pdf`);
    } else {
      // If no date range is selected, use a generic filename
      doc.save("all_reports.pdf");
    }
  };

  return (
    <div className="Form mx-auto mt-10 p-6 rounded-lg shadow-lg max-w-4xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#640D5F]"  style={{ textShadow: "3px 3px 10px rgba(100, 13, 95, 0.7)"}}>Report</h2>

      {/* Dropdown to select report type */}
      <div className="mb-3 p-6 pb-3 rounded-lg ">
        <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-2">
          Select Report Type
        </label>
        <select
          id="reportType"
          value={selectedReport}
          onChange={(e) => setSelectedReport(e.target.value)}
          className="w-full p-2 border border-[#640D5F] rounded-md shadow-sm focus:ring-[#640D5F] focus:border-[#640D5F] sm:text-sm"
        >
          <option value="business">Business Report</option>
          <option value="politician">Politician Report</option>
          <option value="all">All Reports</option> {/* New option for all reports */}
        </select>
      </div>

      {/* Date Range Picker */}
      <div className="mb-3 p-6 rounded-lg">
        <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-2">
          Select Date Range (Optional)
        </label>
        <div className="flex gap-6">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            isClearable
            placeholderText="Start Date"
            className="w-full p-2 border border-[#640D5F] rounded-md shadow-sm focus:ring-[#640D5F] focus:border-[#640D5F] sm:text-sm"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            isClearable
            placeholderText="End Date"
            className="w-full p-2 border border-[#640D5F] rounded-md shadow-sm focus:ring-[#640D5F] focus:border-[#640D5F] sm:text-sm"
          />
        </div>
      </div>

      {/* Button to generate PDF */}
      <div className="bg-white p-6 rounded-lg shadow-md flex justify-center">
        <button
          onClick={generatePDF}
          className="w-60 bg-[#aa1ba3] text-white px-4 py-2 rounded-md hover:bg-[#640D5F] transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#640D5F] focus:ring-offset-2"
        >
          Download Report as PDF
        </button>
      </div>
    </div>
  );
};

export default Reports;