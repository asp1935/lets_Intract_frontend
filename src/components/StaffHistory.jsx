/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { FaEye, FaDownload } from "react-icons/fa"; // Icons for view and download
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useHistory } from "../hooks/useHistory";
import { useDispatch } from "react-redux";
import { formatDate } from "../utility/formatDate";

const StaffHistory = () => {
  const [timePeriod, setTimePeriod] = useState("all"); // State to manage the selected time period
  const [history, setHistory] = useState([]);

  const dispatch = useDispatch();
  const { data: historyData } = useHistory('staff')

  useEffect(() => {
    if (historyData?.data.length > 0) {
      setHistory(historyData.data)
    }
  }, [historyData])

  // Function to filter history based on the selected time period
  const filteredHistory = history.length > 0 ? history.filter((entry) => {
    const entryDate = new Date(entry.createdAt); // Assuming each entry has a 'date' field
    const currentDate = new Date();
    const timeDiff = currentDate - entryDate;
    const daysDiff = timeDiff / (1000 * 3600 * 24);

    if (timePeriod === "weekly") {
      return daysDiff <= 7;
    } else if (timePeriod === "monthly") {
      return daysDiff <= 30;
    } else {
      return true; // Show all history
    }
  }) : [];

  // Function to handle the "View" action
  const handleView = (entry) => {
    // Logic to view details of the entry
    alert(`Viewing details for: ${entry.name}\nAmount: $${entry.amount}\nPayment Via: ${entry.paymentMode}\nMessage: ${entry.message}`);
  };

  // Function to handle the "Download" action for a single entry
  const handleDownload = (entry) => {

    const doc = new jsPDF();

    // Set title font to Times Bold and center it
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.setTextColor(41, 128, 185); // Set title color to blue
    const title = `Payout Details`;
    const pageWidth = doc.internal.pageSize.width;
    const titleX = (pageWidth - doc.getTextWidth(title)) / 2; // Center alignment
    doc.text(title, titleX, 22); // Title position

    // Draw title border
    doc.setDrawColor(0); // Black border
    doc.setLineWidth(0.5);
    doc.rect(10, 15, pageWidth - 20, 12); // Border around title

    // Set normal font for details
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Set labels to black

    // Format content with bold labels
    let y = 40;
    const leftMargin = 60; // Align text properly

    const details = [
      ["Date:", formatDate(entry.createdAt)],
      ["Name:", `${entry.name}`],
      ["Referral Count:", entry.refCount],
      ["Commission:", `${entry.commission}`],
      ["Amount:", `${entry.amount}`],
      ["Payment Via:", entry.paymentMode],
    ];

    details.forEach(([label, value]) => {
      doc.setFont("times", "bold");
      doc.text(label, 20, y);
      doc.setFont("times", "normal");
      doc.text(value.toString(), leftMargin, y);
      y += 10; // Move to the next line
    });

    // Save the PDF with a properly formatted filename
    doc.save(`payout_${entry.name.replace(/\s+/g, "_")}.pdf`);
  };

  // Function to handle the "Download All" action
  const handleDownloadAll = () => {
    const doc = new jsPDF();
    // Get page width and calculate center position
    const pageWidth = doc.internal.pageSize.width;
    const title = "Staff Payouts";
    const titleX = (pageWidth - doc.getTextWidth(title)) / 2; // Center alignment
    // Set font to bold
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16); // Increase font size for better visibility
    doc.text(title, titleX, 10);

    //refcount,commission

    const tableColumn = ["#", "Name", "Email", "Payment Date", "Payment Via", "Amount"];
    const tableRows = filteredHistory.map((entry, index) => [
      index + 1,
      entry.name,
      entry.email,
      formatDate(entry.createdAt),
      entry.paymentMode,
      entry.amount,
    ]);

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

    doc.save("all_staff_payouts.pdf");
  };

  return (
    <div className="Form payment_history p-6 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg rounded-lg mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#640D5F]" style={{ textShadow: "3px 3px 10px rgba(100, 13, 95, 0.7)" }}>Staff Payment History</h2>
        <div className="flex items-center space-x-4">
          <label className="text-gray-700 font-medium">Filter by:</label>
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#640D5F] bg-white"
          >
            <option value="all">All</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <button
            onClick={handleDownloadAll}
            className="flex items-center px-2 py-2 bg-[#640D5F] text-white rounded-md hover:bg-[#8A1C7C] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[#e22c2c]"
            disabled={history?.length <= 0}
          >
            <FaDownload className="mr-2" />
            Download All
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-sm">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-[#640D5F] to-[#8A1C7C]">
            <tr>
              <th className="p-4 text-left text-white font-semibold">Name</th>
              <th className="p-4 text-left text-white font-semibold">Email</th>
              <th className="p-4 text-left text-white font-semibold">Payment Date</th>
              <th className="p-4 text-left text-white font-semibold">Payment Via</th>
              <th className="p-4 text-left text-white font-semibold">Amount</th>
              <th className="p-4 text-left text-white font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((entry, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="p-4 border-b border-gray-200">{entry.name}</td>
                  <td className="p-4 border-b border-gray-200">{entry.email}</td>
                  <td className="p-4 border-b border-gray-200">{formatDate(entry.createdAt)}</td>
                  <td className="p-4 border-b border-gray-200">{entry.paymentMode}</td>
                  <td className="p-4 border-b border-gray-200 font-medium text-[#640D5F]">${entry.amount}</td>
                  <td className="p-4 border-b border-gray-200">
                    <div className="flex space-x-4">
                      <button
                        className="text-[#640D5F] hover:text-[#8A1C7C] transition-colors duration-200"
                        onClick={() => handleView(entry)}
                      >
                        <FaEye />
                      </button>
                      <button
                        className="text-[#640D5F] hover:text-[#8A1C7C] transition-colors duration-200"
                        onClick={() => handleDownload(entry)}
                      >
                        <FaDownload />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No payout history found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffHistory;