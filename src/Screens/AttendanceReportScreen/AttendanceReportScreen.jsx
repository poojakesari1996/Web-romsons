import React, { useState, useEffect } from "react";
import { API_END_POINT } from '../utils/api'; // adjust path as needed

const AttendanceReportScreen = () => {
    const [attendancereport, setAttendancereport] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [isLoading, setIsLoading] = useState(false);



    const getAttendanceReport = () => {
        setIsLoading(true);

        const myHeaders = new Headers();
        myHeaders.append(
            "authorization",
            JSON.stringify({
                emp_id: 11000102,
                role: 1,
                emp_type: "1",
                api_token: "a7ebTx7uKqEsgCjkb3Y40E32jjhcH0u1RDJ6oP5scpSYQl8PDvQIruhwb6AzHoaIaNbw8y0xQQNcLPZvbIMosxCZ5LBqeiGOEOG2"
            })
        );

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        const url = API_END_POINT.attendanceReport(selectedMonth, selectedYear);

        fetch(url, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.error === false) {
                    setAttendancereport(result.data);
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setIsLoading(false));
    };


    useEffect(() => {
        if (selectedMonth && selectedYear) {
            getAttendanceReport();
        }
    }, [selectedMonth, selectedYear]);

    const filteredData = attendancereport.filter((emp) =>
        emp.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.emp_id?.toString().includes(searchQuery) ||
        emp.emp_code?.toString().includes(searchQuery)
    );

    const downloadCSV = () => {
        if (filteredData.length === 0) {
            alert("No data available to download");
            return;
        }
    
        // Correct headers
        const headers = [
            "EMP CODE",
            "EMP ID",
            "User Name",
            "Designation",
            ...Array.from({ length: 31 }, (_, i) => (i + 1).toString()),
            "Present",
            "Regu",
            "Half Day",
            "WEO",
            "SL",
            "CL",
            "EL",
            "PL",
            "ML",
            "LOP",
            "Holidays",
            "Absent",
            "Total working days",
            "Month Days"
        ];
    
        const rows = filteredData.map(item => {
            return [
                item.emp_code,                     
                item.emp_id,                       
                item.user_name,                    
                item.designation,                  
                ...Array.from({ length: 31 }, (_, i) => item[(i + 1).toString()] || ""),
                item.present_days,                 
                item.regularized_present,          
                item.half_days,                    
                item.weo,                          
                item.leave?.SL || 0,              
                item.leave?.CL || 0,               
                item.leave?.EL || 0,               
                item.pending_leave,
                item.ml_days,
                item.lop_days,               
                item.holiday,                      
                item.absent,                       
                item.total_working_days,           
                item.month_days                    
            ].join(",");
        });
    
        const csvContent = [headers.join(","), ...rows].join("\n");
    
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `attendance_report_${selectedMonth}_${selectedYear}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-red-900 text-3xl text-center mb-6">Attendance Report</h2>
            <div className="flex justify-between items-center max-w-4xl mx-auto mb-6">
                {/* Filter Panel */}
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex justify-between items-center border border-gray-200 w-full mr-4">
                    {/* Month Selection */}
                    <div>
                        <label className="block text-black-600 text-sm mb-1 font-bold">Month</label>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700"
                        >
                            <option value="">-- Select Month --</option>
                            {[...Array(12)].map((_, i) => {
                                const monthNum = String(i + 1).padStart(2, "0");
                                const monthName = new Date(0, i).toLocaleString("default", { month: "long" });
                                return (
                                    <option key={monthNum} value={monthNum}>
                                        {monthName}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {/* Year Selection */}
                    <div>
                        <label className="block text-black-600 text-sm mb-1 font-bold">Year</label>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700"
                        >
                            <option value="">-- Select Year --</option>
                            {[2023, 2024, 2025].map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

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
                </div>

                {/* Excel Download Button */}
                <div>
                    <button
                        onClick={downloadCSV}
                        className="bg-teal-700 text-white px-4 py-2 rounded-md shadow-sm hover:bg-teal-800 text-sm"
                    >
                        Excel Report
                    </button>
                </div>
            </div>

            {/* Spinner added above the table */}
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
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">User Name</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">Designation</th>
                            {[...Array(31)].map((_, i) => (
                                <th key={i} className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">{i + 1}</th>
                            ))}
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">Present</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">Regu</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">Half Day</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">WEO</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">SL</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">CL</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">EL</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">PL</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">ML</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">LOP</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">Holidays</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">Absent</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">Total working days</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">Month Days</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700">
                        {filteredData.map((res, ind) => (
                            <tr key={ind} className="border-t border-gray-200">
                                <td className="px-4 py-2">{res.emp_code}</td>
                                <td className="px-4 py-2">{res.emp_id}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{res.user_name}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{res.designation}</td>
                                {[...Array(31)].map((_, i) => {
                                    const day = (i + 1).toString();
                                    return (
                                        <td key={day} className="px-4 py-2">{res[day] || ""}</td>
                                    );
                                })}
                                <td className="px-4 py-2">{res.present_days}</td>
                                <td className="px-4 py-2">{res.regularized_present}</td>
                                <td className="px-4 py-2">{res.half_days}</td>
                                <td className="px-4 py-2">{res.weo}</td>
                                <td className="px-4 py-2">{res.leave?.SL || 0}</td>
                                <td className="px-4 py-2">{res.leave?.CL || 0}</td>
                                <td className="px-4 py-2">{res.leave?.EL || 0}</td>
                                <td className="px-4 py-2">{res.pending_leave}</td>
                                <td className="px-4 py-2">{res.ml_days}</td>
                                <td className="px-4 py-2">{res.lop_days}</td>
                                <td className="px-4 py-2">{res.holiday}</td>
                                <td className="px-4 py-2">{res.absent}</td>
                                <td className="px-4 py-2">{res.total_working_days}</td>
                                <td className="px-4 py-2">{res.month_days}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceReportScreen;
