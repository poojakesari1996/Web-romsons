import React, { useState, useEffect } from "react";
import { API_END_POINT } from '../utils/api';


const ActivityReportScreen = () => {

    const [activityList, setActivityList] = useState([]);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");


    useEffect(() => {
        if (fromDate && toDate) {
            ActivityReportData();
        }
    }, [fromDate, toDate]);

    const filteredData = activityList.filter((emp) =>
        emp.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.emp_id?.toString().includes(searchQuery) ||
        emp.emp_code?.toString().includes(searchQuery)
    );

    const ActivityReportData = () => {
        setIsLoading(true);
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        fetch(API_END_POINT.ActivityReportAPI(fromDate, toDate), requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log(result, 'poojgfgg');

                if (result.error == false) {
                    setActivityList(result.data)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setIsLoading(false));
    }

    const downloadCSV = () => {
        if (filteredData.length === 0) {
            alert("No data available to download");
            return;
        }

        // Create CSV header
        const headers = [
            "USER NAME",
            "ACTIVITY DATE",
            "OUTLET",
            "CUSTOMER",
            "SKU NAME",
            "REMARKS",
            "LAT-LONG",
            "FOLLOW-UP",
            "CALL TYPE",
            "JOINED PERSON NAME"
        ];

        // Create CSV rows
        const rows = filteredData.map(item => {
            const rowData = [
                item.user_name,
                item.activity_date,
                item.outlet,
                item.customer,
                item.sku_name,
                item.remarks,
                item.lat_long,
                item.follow_up,
                item.call_type,
                item.joined_person_name
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
        link.setAttribute("download", `activity_report_${fromDate}_${toDate}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-red-900 text-3xl text-center mb-6">Activity Report</h2>
            <div className="flex justify-between items-center max-w-4xl mx-auto mb-6">

                <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex justify-between items-center border border-gray-200 w-full mr-4">

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
                <div className="flex items-center gap-3">
                    <button
                        onClick={downloadCSV}
                        className="bg-teal-700 text-white px-4 py-2 rounded-md shadow-sm hover:bg-teal-800 text-sm"
                    >
                        Excel Report
                    </button>
                </div>

            </div>
            {isLoading && (
                <div className="flex justify-center items-center mb-4">
                    <div className="animate-spin h-6 w-6 border-4 border-teal-700 border-t-transparent rounded-full mr-2"></div>
                    <span className="text-teal-700 text-sm font-medium">Loading...</span>
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
                    <thead className="bg-teal-700 text-white text-sm">
                        <tr>
                            <th className="px-4 py-2 text-left whitespace-nowrap">USER NAME</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap">ACTIVITY DATE</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap">OUTLET</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap">CUSTOMER</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap">SKU NAME</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap">REMARKS</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap">LAT-LONG</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap">FOLLOW-UP</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap">CALL TYPE</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap">JOINED PERSON NAME</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700">
                        {filteredData.map((res, ind) => (
                            <tr key={ind} className="border-t border-gray-200">
                                <td className="px-4 py-2 whitespace-nowrap">
                                    {res.user_name?.replace(/\s+/g, ' ').trim()}
                                </td>
                                <td className="px-4 py-2">{res.activity_date}</td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    {res.outlet?.replace(/\s+/g, ' ').trim()}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    {res.customer?.replace(/\s+/g, ' ').trim()}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    {res.sku_name?.replace(/\s+/g, ' ').trim()}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    {res.remarks?.replace(/\s+/g, ' ').trim()}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    {res.lat_long ? res.lat_long.trim() : ''}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    {res.follow_up}
                                </td>
                                <td className="px-4 py-2">{res.call_type}</td>
                                <td className="px-4 py-2">{res.joined_person_name}</td>
                            </tr>
                        ))}


                    </tbody>
                </table>
            </div>
        </div>
    )
};

export default ActivityReportScreen;