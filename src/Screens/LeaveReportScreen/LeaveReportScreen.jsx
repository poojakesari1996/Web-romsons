import React, { useState, useEffect } from "react";
import { API_END_POINT } from "../utils/api";

const LeaveReportScreen = () => {
  const [leaveReport, setLeaveReport] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = leaveReport.filter((emp) =>
    emp.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.emp_id?.toString().includes(searchQuery) ||
    emp.emp_code?.toString().includes(searchQuery)
  );

  const leaveReportSummary = () => {
    if (!fromDate || !toDate) {
      alert("Please select both From Date and To Date.");
      return;
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({ fromDate, toDate, statusFilter });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(API_END_POINT.leaveReport, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.error === false) {
          setLeaveReport(result.data);
        } else {
          setLeaveReport([]);
        }
      })
      .catch((error) => {
        console.error("Fetch Error:", error);
        setLeaveReport([]);
      });
  };

  const downloadCSV = () => {
    if (filteredData.length === 0) {
        alert("No data available to download");
        return;
    }

    // Create CSV header
    const headers = [
        "STATUS",
        "EMP ID",
        "NAME",
        "LEAVE FROM-TO",
        "DAYS",
        "TYPE",
        "REMARKS",
        "REPORTING TO",
        "HEAD QUARTER",
        "APPROVED BY",
        "APPROVED DATE",
        "AVAILED LEAVE",
        "AVAILABLE LEAVE",
        "ALLOCATED LEAVE"

    ];

    // Create CSV rows
    const rows = filteredData.map(item => {
        const rowData = [
            item.status,
            item.emp_id,
            item.user_name,
            item.leave_from_to,
            item.leave_days,
            item.leave_type,
            item.leave_reason,
            item.reporting_to_name,
            item.head_quater_name,
            item.approved_by,
            item.approved_date,
            item.total_availed_leave,
            item.total_balance_leave,
            item.total_allocated_leave
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
    link.setAttribute("download", `leave_report_${fromDate}_${toDate}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

  useEffect(() => {
    if (fromDate && toDate) {
      leaveReportSummary();
    }
  }, [fromDate, toDate, statusFilter]);



  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-red-900 text-3xl text-center mb-6">Leave Summary Report</h2>

      {/* Compact Filter Box */}
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
          <thead className="bg-teal-700 text-white text-sm">
            <tr>
              <th className="px-4 py-2 text-left whitespace-nowrap">STATUS</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">EMP ID</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">NAME</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">LEAVE FROM-TO</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">DAYS</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">TYPE</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">REMARKS</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">REPORTING TO</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">HEAD QUARTER</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">APPROVED BY</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">APPROVED DATE</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">AVAILED LEAVE</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">AVAILABLE LEAVE</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">ALLOCATED LEAVE</th>
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

                <td className="px-4 py-2">{res.emp_id}</td>
                <td className="px-4 py-2 whitespace-nowrap">{res.user_name}</td>
                <td className="px-4 py-2 whitespace-nowrap">{res.leave_from_to}</td>
                <td className="px-4 py-2">{res.leave_days}</td>
                <td className="px-4 py-2">{res.leave_type}</td>
                <td className="px-4 py-2 whitespace-pre-line">{res.leave_reason}</td>
                <td className="px-4 py-2 whitespace-nowrap">{res.reporting_to_name}</td>
                <td className="px-4 py-2">{res.head_quater_name || "--"}</td>
                <td className="px-4 py-2 whitespace-nowrap">{res.approved_by}</td>
                <td className="px-4 py-2">{res.approved_date}</td>
                <td className="px-4 py-2">{res.total_availed_leave}</td>
                <td className="px-4 py-2">{res.total_balance_leave}</td>
                <td className="px-4 py-2">{res.total_allocated_leave}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default LeaveReportScreen;
