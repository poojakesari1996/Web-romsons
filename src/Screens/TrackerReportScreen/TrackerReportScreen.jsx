import React, { useState, useEffect } from "react";
import { API_END_POINT } from "../utils/api";
import Select from "react-select";
const TrackerReportScreen = () => {
    const [activeUserList, setActiveUserList] = useState([]);
    const [selectedEmpId, setSelectedEmpId] = useState("");
    const [outletReport, setOutletReport] = useState([]);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [empAddress, setEmpAddress] = useState("");

    const userOptions = activeUserList.map(user => ({
        value: user.emp_id,
        label: `${user.user_name} -- ${user.emp_id}`,
    }));

    const UserList = () => {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        fetch(API_END_POINT.TrackerReportAPI, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.error == false) {
                    setActiveUserList(result.data)
                }
            })
            .catch((error) => console.error(error));
    }

    const OutletReport = async () => {
        setIsLoading(true);
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        try {
            const response = await fetch(
                API_END_POINT.TrackerOrderActivityReportAPI(selectedEmpId, fromDate, toDate),
                requestOptions
            );
            const result = await response.json();

            if (result.error === false) {
                const updatedData = await Promise.all(
                    result.data.map(async (item) => {
                        const address = await getAddress(item.lat, item.lng);
                        return { ...item, address }; // Append address to each record
                    })
                );

                setOutletReport(updatedData);


                const empAddr =
                    result.emp_address || // top-level
                    result.data?.[0]?.emp_address ||
                    "N/A";

                console.log("📍 emp_address from top-level:", result.emp_address);
                console.log("📍 emp_address from data[0]:", result.data?.[0]?.emp_address);
                console.log("✅ Final empAddress:", empAddr);

                setEmpAddress(empAddr);
            }
        } catch (error) {
            console.error("❌ OutletReport error:", error);
        } finally {
            setIsLoading(false); // Always stop loading
        }
    };


    const getAddress = async (lat, long) => {
        try {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyC4cMHPr8PdH18gyzIJ6YMlTJSHEDGwvNM`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                return data.results[0].formatted_address;
            }
            return "Address not found";
        } catch (error) {
            console.error("Error fetching address:", error);
            return "Error fetching address";
        }
    };


    useEffect(() => {
        UserList();
    }, []);

    useEffect(() => {
        if (selectedEmpId && fromDate && toDate) {
            OutletReport();
        }
    }, [selectedEmpId, fromDate, toDate]);

    const downloadCSV = () => {
        if (outletReport.length === 0) {
          alert("No data available to download");
          return;
        }
      
        const headers = [
          "PUNCH DATE",
          "TIME",
          "OUTLET NAME",
          "OUTLET ID",
          "CITY",
          "JIO LOCATION",
          "TASK NAME",
          "TASK REMARKS",
          "FOLLOW UP DATE",
          "USER NAME"
        ];
      
        const rows = outletReport.map(item => {
          const rowData = [
            item.punch_date,
            item.date,
            item.outlet_name,
            item.outlet_id,
            item.city_name,
            item.address,
            item.task_name,
            item.task_remarks,
            item.follow_up_date,
            item.user_name
          ];
      
          // ✅ Wrap every value in quotes to avoid comma split
          return rowData
            .map(value => `"${String(value).replace(/"/g, '""')}"`)
            .join(",");
        });
      
        const csvContent = [headers.join(","), ...rows].join("\n");
      
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `tracker_report_${fromDate}_${toDate}.csv`);
        link.click();
      };
      
    

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-red-900 text-3xl text-center mb-6">Tracker Report</h2>

            <div className="flex justify-between items-center max-w-4xl mx-auto mb-6">
                {/* Filter Panel */}
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex justify-between items-center border border-gray-200 w-full mr-4">
                    {/* Search Input */}
                    <div className="w-100">
                        <label className="block text-black-600 text-sm mb-1 font-bold">Select User</label>
                        <Select
                            options={userOptions}
                            value={userOptions.find(opt => opt.value === selectedEmpId) || null}
                            onChange={(selectedOption) => setSelectedEmpId(selectedOption?.value || "")}
                            placeholder="-- Select User --"
                            isClearable
                        />
                    </div>


                    {/* Date Filters */}
                    <div className="flex gap-3">
                        <div>
                            <label className="block text-black-600 font-bold text-sm mb-1">From</label>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}  // ✅ Correct state updated
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
                <div className="self-end">
          <button
            onClick={downloadCSV}
            className="bg-teal-700 text-white px-4 py-2 rounded-md shadow-sm hover:bg-teal-800 text-sm"
          >
            Excel Report
          </button>
        </div>

            </div>

            {empAddress && (
                <p className="text-sm text-gray-800 font-medium mb-4">
                    <span className="font-semibold">Employee Address:</span> {empAddress}
                </p>
            )}


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
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">PUNCH DATE</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">TIME</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">OUTLET NAME</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">OUTLET ID</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">CITY</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">JIO LOCATION</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">TASK NAME</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10"> TASK REMARKS</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10"> FOLLOW UP DATE</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">USER NAME</th>

                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700">
                        {outletReport.map((res, ind) => (
                            <tr className="border-t border-gray-200" key={ind}>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    {new Date(res.punch_date).toLocaleDateString('en-GB')}
                                </td>

                                <td className="px-4 py-2 whitespace-nowrap">
                                    {res.date?.replace(/\s+/g, ' ').trim()}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    {res.outlet_name?.replace(/\s+/g, ' ').trim()}
                                </td>

                                <td className="px-4 py-2">{res.outlet_id}</td>
                                <td className="px-4 py-2">{res.city_name}</td>
                                <td className="px-4 py-2">{res.address}</td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    {res.task_name?.replace(/\s+/g, ' ').trim()}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    {res.task_remarks?.replace(/\s+/g, ' ').trim()}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    {res.source === 'NEW TASK' && res.follow_up_date
                                        ? new Date(res.follow_up_date).toLocaleDateString('en-GB')
                                        : '-'}
                                </td>

                                <td className="px-4 py-2 whitespace-nowrap">
                                    {res.user_name?.replace(/\s+/g, ' ').trim()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TrackerReportScreen