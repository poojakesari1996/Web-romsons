import React, { useEffect, useState } from "react";
import { API_END_POINT } from "../utils/api";



const PerformanceSummaryReportScreen = () => {

    const [zoneList, setZoneList] = useState([]);
    const [divisionList, setDivisionList] = useState([])
    const [summaryData, setSummaryData] = useState([]);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [zoneId, setZoneId] = useState("");
    const [divisionId, setDivisionId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");


    const filteredSummary = summaryData.filter((item) =>
        item.employee_id_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.employee_id_name?.toString().includes(searchQuery)
    );


    const GetZoneList = () => {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        fetch(API_END_POINT.ZoneListAPI, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.error == false) {
                    setZoneList(result.data)
                }
            })
            .catch((error) => console.error(error));
    }

    const GetDivisionList = () => {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        fetch(API_END_POINT.DivisionListAPI, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.error == false) {
                    setDivisionList(result.data)
                }
            })
            .catch((error) => console.error(error));
    }

    const fetchPerformanceSummary = async () => {
        const url = API_END_POINT.PerformanceSummaryAPI(
          fromDate,
          toDate,
          zoneId,
          divisionId,
          searchQuery
        );
      
        setIsLoading(true);
      
        try {
          const response = await fetch(url);
          const result = await response.json();
      
          if (result.error === false) {
            setSummaryData(result.data || []);
          } else {
            console.error("Error in API response:", result.message || result);
          }
        } catch (error) {
          console.error("Fetch error:", error);
        } finally {
          setIsLoading(false);
        }
      };
    useEffect(() => {
        GetZoneList();
        GetDivisionList()
    }, [])

    useEffect(() => {
        fetchPerformanceSummary();
    }, [fromDate, toDate, zoneId, divisionId]);

    const downloadCSV = () => {
        if (filteredSummary.length === 0) {
            alert("No data available to download");
            return;
        }

        const headers = [
            "MTP DATE",
            "USER NAME",
            "ATTENDANCE",
            "PUNCH IN",
            "PUNCH OUT",
            "ASSIGNED OUTLET",
            "TOTAL COVERED OUTLET CALLS",
            "PENDING OUTLET",
            "ORDER CALLS",
            "QTY",
            "AMT",
            "ACTIVITY CALLS",
            "BEAT NAME",
            "DIVISION NAME",
            "ORDER SELF CALLS",
            "ORDER JOINED CALLS",
            "ACTIVITY SELF CALLS",
            "ACTIVITY JOINED CALLS",
            "TASK COUNT"
        ];
        const rows = filteredSummary.map(item => {
            const rowData = [
                item.mtp_date,
                item.employee_id_name,
                item.attendance_status,
                item.punch_in_time,
                item.punch_out_time,
                item.outlet_count,
                item.total_activity_covered_outlet + item.total_order_covered_outlet,
                item.outlet_count - (item.total_activity_covered_outlet + item.total_order_covered_outlet),
                item.order_count_total,
                item.item_qty,
                item.order_amt,
                item.total_activities_count,
                item.beat_name,
                item.division_name,
                item.self_order_count,
                item.joint_order_count,
                item.self_call_count,
                item.joint_call_count,
                item.task_count
            ];
            return rowData.join(",");
        })

        // Combine header and rows
        const csvContent = [headers.join(","), ...rows].join("\n");

        // Create download link
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `performanceSummary_report_${fromDate}_${toDate}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-red-900 text-3xl text-center mb-6">Performance Summary Report</h2>
            <div className="flex justify-between items-center max-w-4xl mx-auto mb-6">
                {/* Filter Panel */}
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex justify-between items-center border border-gray-200 w-full mr-4">
                    <div className="flex gap-3">
                        {/* From Date */}
                        <div>
                            <label className="block text-black-600 font-bold text-sm mb-1">From</label>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700"
                            />
                        </div>

                        {/* To Date */}
                        <div>
                            <label className="block text-black-600 text-sm mb-1 font-bold">To</label>
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700"
                            />
                        </div>

                        {/* Zone */}
                        <div>
                            <label className="block text-black-600 text-sm mb-1 font-bold">Zone</label>
                            <select
                                value={zoneId}
                                onChange={(e) => setZoneId(e.target.value)}
                                className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700"
                            >
                                <option value="">-- Select Zone --</option>
                                {zoneList.map((zone) => (
                                    <option key={zone.zone_id} value={zone.zone_id}>
                                        {zone.zone_id} -- {zone.zone_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Division */}
                        <div>
                            <label className="block text-black-600 text-sm mb-1 font-bold">Division</label>
                            <select
                                value={divisionId}
                                onChange={(e) => setDivisionId(e.target.value)}
                                className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700"
                            >
                                <option value="">-- Select Division --</option>
                                {divisionList.map((division) => (
                                    <option key={division.division_id} value={division.division_id}>
                                        {division.division_id} -- {division.division_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Search (moved after Division) */}
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
                </div>

                {/* Excel Button */}
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

            <div className="overflow-x-auto max-h-[500px]">
                <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
                    <thead className="bg-teal-700 text-white text-sm">
                        <tr>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">MTP DATE</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">USER NAME</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">ATTENDANCE</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">PUNCH IN</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">PUNCH OUT</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">ASSIGNED OUTLET</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">TOTAL COVERED OUTLET CALLS</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">PENDING OUTLET</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">ORDER CALLS</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">QTY</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">AMT</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">ACTIVITY CALLS</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">BEAT NAME</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">DIVISION NAME</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">SELF ORDER CALLS</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">JOINED ORDER CALLS</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">SELF ACTIVITY CALLS</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">JOINED ACTIVITY CALLS</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap sticky top-0 bg-teal-700 z-10">TASK COUNT</th>
                        </tr>

                    </thead>
                    <tbody className="text-sm text-gray-700">
                        {filteredSummary.length > 0 ? (
                            filteredSummary.map((row, idx) => (
                                <tr key={idx} className="border-t">
                                    <td className="px-4 py-2">
                                        {row.mtp_date ? new Date(row.mtp_date).toLocaleDateString('en-GB') : '-'}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        {row.employee_id_name?.replace(/\s+/g, ' ').trim()}
                                    </td>
                                    <td className="px-4 py-2">{row.attendance_status}</td>
                                    <td className="px-4 py-2">{row.punch_in_time}</td>
                                    <td className="px-4 py-2">{row.punch_out_time}</td>
                                    <td className="px-4 py-2">{row.outlet_count}</td>
                                    <td className="px-4 py-2">{row.total_activity_covered_outlet + row.total_order_covered_outlet}</td>
                                    <td className="px-4 py-2">{row.outlet_count - (row.total_activity_covered_outlet + row.total_order_covered_outlet)}</td>
                                    <td className="px-4 py-2">{row.order_count_total}</td>
                                    <td className="px-4 py-2">{row.item_qty}</td>
                                    <td className="px-4 py-2">{row.order_amt}</td>
                                    <td className="px-4 py-2">{row.total_activities_count}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        {row.beat_name?.replace(/\s+/g, ' ').trim()}
                                    </td>
                                    <td className="px-4 py-2">{row.division_name}</td>
                                    <td className="px-4 py-2">{row.self_order_count}</td>
                                    <td className="px-4 py-2">{row.joint_order_count}</td>
                                    <td className="px-4 py-2">{row.self_call_count}</td>
                                    <td className="px-4 py-2">{row.joint_call_count}</td>
                                    <td className="px-4 py-2">{row.task_count}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="px-4 py-2 text-center" colSpan="16">No data found</td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>
        </div>
    )
}

export default PerformanceSummaryReportScreen