import React, { useState, useEffect } from "react";
import { API_END_POINT } from "../utils/api";

const DayWiseAttendanceScreen = () => {
    const [DayWiseAttendancedata, setDayWiseAttendancedata] = useState([]);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (fromDate && toDate) {
            DayWiseAttendance();
        }
    }, [fromDate, toDate]);

    const filteredData = DayWiseAttendancedata.filter((emp) =>
        emp.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.emp_id?.toString().includes(searchQuery) ||
        emp.emp_code?.toString().includes(searchQuery)
    );

    const DayWiseAttendance = () => {
        setIsLoading(true);
        const url = API_END_POINT.DayWiseAttendanceReport(fromDate, toDate);

        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            redirect: "follow"
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.error === false) {
                    setDayWiseAttendancedata(result.data);
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setIsLoading(false));
    };

    // const uniqueActiveEmpCount = new Set(filteredData.map(item => item.emp_id)).size;


    const downloadCSV = () => {
        if (filteredData.length === 0) {
            alert("No data available to download");
            return;
        }

        // Create CSV header
        const headers = [
            "EMP ID",
            "EMP CODE",
            "NAME",
            "PUNCH DATE",
            "PUNCH IN",
            "PUNCH OUT",
            "TOTAL HOUR",
            "ATTENDANCE STATUS",
            "APP VERSION"
        ];

        // Create CSV rows
        const rows = filteredData.map(item => {
            const rowData = [
                item.emp_id,
                item.emp_code,
                item.user_name,
                item.punch_date,
                item.punch_in_time,
                item.punch_out_time,
                item.total_hours,
                item.attendance_status,
                item.app_version
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
        link.setAttribute("download", `day-wise-atgtendance_report_${fromDate}_${toDate}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-red-900 text-3xl text-center mb-6">Day-Wise Attendance Report</h2>

            <div className="flex justify-between items-center max-w-4xl mx-auto mb-6">
                {/* Filter Panel */}
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex justify-between items-center border border-gray-200 w-full mr-4">
                    {/* Search Input */}
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
                </div>

                {/* Excel Button */}
                <div className="flex items-center gap-3">
                    {/* Excel Report Button */}
                    <button
                        onClick={downloadCSV}
                        className="bg-teal-700 text-white px-4 py-2 rounded-md shadow-sm hover:bg-teal-800 text-sm"
                    >
                        Excel Report
                    </button>

                    {/* Punch-Ins Card */}
                    <div className="bg-gradient-to-r from-green-100 to-teal-100 border border-teal-300 rounded-xl px-1 py-1 shadow-md text-center w-25">
                        <p className="text-[11px] font-medium text-teal-800 uppercase tracking-wide">Punch-Ins</p>
                        <p className="text-xl font-bold text-teal-900 mt-1">
                            {filteredData.filter(emp => emp.punch_in_time).length}
                        </p>
                    </div>

                    {/* In/Out Card */}
                    <div className="bg-gradient-to-r from-blue-100 to-indigo-100 border border-indigo-300 rounded-xl px-1 py-1 shadow-md text-center w-25">
                        <p className="text-[11px] font-medium text-indigo-800 uppercase tracking-wide">In/Out</p>
                        <p className="text-xl font-bold text-indigo-900 mt-1">
                            {filteredData.filter(emp => emp.punch_in_time && emp.punch_out_time).length}
                        </p>
                    </div>
                    {/* Active Employees Card */}
                    {/* <div className="bg-gradient-to-r from-purple-100 to-purple-200 border border-purple-300 rounded-xl px-1 py-1 shadow-md text-center w-25">
                        <p className="text-[11px] font-medium text-purple-800 uppercase tracking-wide">Active Employees</p>
                        <p className="text-xl font-bold text-purple-900 mt-1">
                        {uniqueActiveEmpCount}
                        </p>
                    </div> */}

                </div>

            </div>


            {isLoading && (
                <div className="flex justify-center items-center mb-4">
                    <div className="animate-spin h-6 w-6 border-4 border-teal-700 border-t-transparent rounded-full mr-2"></div>
                    <span className="text-teal-700 text-sm font-medium">Loading...</span>
                </div>
            )}

            <div className="overflow-x-auto max-h-[500px]">
                <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
                    <thead className="bg-teal-700 text-white text-sm">
                        <tr>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">EMP ID</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">EMP CODE</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">NAME</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">PUNCH DATE</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">PUNCH IN</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">PUNCH OUT</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">TOTAL HOUR</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">ATTENDANCE STATUS</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">LEAVE TYPE</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">APP VERSION</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700">
                        {filteredData.map((res, ind) => (
                            <tr key={ind} className="border-t border-gray-200">
                                <td className="px-4 py-2">{res.emp_id}</td>
                                <td className="px-4 py-2">{res.emp_code}</td>
                                <td className="px-4 py-2">{res.user_name}</td>
                                <td className="px-4 py-2">{res.punch_date}</td>
                                <td className="px-4 py-2">{res.punch_in_time}</td>
                                <td className="px-4 py-2">{res.punch_out_time}</td>
                                <td className="px-4 py-2">{res.total_hours}</td>
                                <td className="px-4 py-2">{res.attendance_status}</td>
                                <td className="px-4 py-2">{res.leave_type}</td>
                                <td className="px-4 py-2">{res.app_version}</td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default DayWiseAttendanceScreen