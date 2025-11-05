import React, { useState, useEffect } from "react";
import { API_END_POINT } from "../utils/api";


const Regularization = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [regularizedData, setRegularizedData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = regularizedData.filter((emp) =>
    emp.emp_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.enter_by?.toString().includes(searchQuery)

  );


  const RegularizedReport = () => {
    const raw = "";

    const requestOptions = {
      method: "GET",

      redirect: "follow"
    };

    fetch(API_END_POINT.RegularizedReportAPI(fromDate, toDate, statusFilter), requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result, 'pohdh');

        if (result.error == false) {
          setRegularizedData(result.data)
        }
      })
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    if (fromDate && toDate) {
      RegularizedReport();
    }
  }, [fromDate, toDate, statusFilter]);

  const downloadCSV = () => {
    if (filteredData.length === 0) {
      alert("No data available to download");
      return;
    }

    // Create CSV header
    const headers = [
      "STATUS",
      "REQUESTED DATE",
      "EMP ID",
      "EMP CODE",
      "NAME",
      "APPROVED DATE",
      "APPROVED BY",
      "REMARKS"
    ];

    // Create CSV rows
    const rows = filteredData.map(item => {
      const rowData = [
        item.status,
        item.requested_date,
        item.enter_by,
        item.emp_code,
        item.emp_name,
        item.approved_date,
        item.approved_by,
        item.Request_Remarks
      ];
      return rowData.join(",");
    });

    // Combine header and rows
    const csvContent = [headers.join(","), ...rows].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `regularization_report_${fromDate}_${toDate}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-red-900 text-3xl text-center mb-6">Regularization Report</h2>
      <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex justify-between items-center max-w-4xl mx-auto border border-gray-200 mb-6">
        {/* Status Filter */}
        <div>
          <label className="block text-black-600 text-sm mb-1 font-bold">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700"
          >
            <option value="">-- Select --</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>

        </div>

        <div>
          <label className="block text-black-600 text-sm mb-1 font-bold">Search</label>
          <input
            type="text"
            placeholder="Search by name or ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700 w-full"
          />
        </div>
        {/* Date Filters */}
        <div className="flex gap-3">
          <div>
            <label className="block text-black-600 font-bold text-sm mb-1">From</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700"
            />
          </div>

          <div>
            <label className="block text-black-600 text-sm mb-1 font-bold">To</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700"
            />
          </div>
        </div>

        <div className="self-end">
          <button
            onClick={downloadCSV}
            className="bg-teal-700 text-white px-4 py-2 rounded-md shadow-sm hover:bg-teal-800 text-sm"
          >
            Excel Report
          </button>
        </div>

      </div>
      <div className="overflow-x-auto max-h-[500px]">
        <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
          <thead className="bg-teal-700 text-white text-sm">
            <tr>
              <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">STATUS</th>
              <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">REQUESTED DATE</th>
              <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">EMP ID</th>
              <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">EMP CODE</th>
              <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">NAME</th>
              <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">APPROVED DATE</th>
              <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">APPROVED BY</th>
              <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">REMARKS</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {filteredData.map((res, ind) => (
              <tr key={ind} className="border-t border-gray-200">
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${res.status === 'Accepted'
                      ? 'bg-green-200 text-green-800'
                      : res.status === 'Pending'
                        ? 'bg-yellow-200 text-yellow-800'
                        : res.status === 'Rejected'
                          ? 'bg-red-200 text-red-800'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                  >
                    {res.status}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">{res.requested_date}</td>
                <td className="px-4 py-2 whitespace-nowrap">{res.enter_by}</td>
                <td className="px-4 py-2 whitespace-nowrap">{res.emp_code}</td>
                <td className="px-4 py-2 whitespace-nowrap">{res.emp_name}</td>
                <td className="px-4 py-2 whitespace-nowrap">{res.approved_date}</td>
                <td className="px-4 py-2 whitespace-nowrap">{res.approved_by}</td>
                <td className="px-4 py-2 whitespace-nowrap">{res.Request_Remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
};
export default Regularization;