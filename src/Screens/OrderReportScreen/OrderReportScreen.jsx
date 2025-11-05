import React, { useEffect, useState } from "react";
import { API_END_POINT } from "../utils/api";


const OrderReportScreen = () => {

    const [OrderData, setOrderData] = useState([]);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (fromDate && toDate) {
            OrderList();
        }
    }, [fromDate, toDate]);

    const filteredData = OrderData.filter((emp) =>
        emp.UserName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.OrderID?.toString().includes(searchQuery) ||
        emp.skuID?.toString().includes(searchQuery)
    )


    const OrderList = () => {
        setIsLoading(true);
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        fetch(API_END_POINT.OrderListAPI(fromDate, toDate),
            requestOptions)

            .then((response) => response.json())
            .then((result) => {
                console.log(result, 'ordfghjh');
                if (result.error == false) {
                    setOrderData(result.data)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setIsLoading(false));
    };

    const downloadCSV = () => {
        if (filteredData.length === 0) {
            alert("No data available to download");
            return;
        }

        // Create CSV header
        const headers = [
            "ORDER ID",
            "ORDER DATE",
            "ORDER TIME",
            "OUTLET",
            "BEAT",
            "DEALER NAME",
            "ZONE NAME",
            "USER NAME",
            "REPORTING TO",
            "SKU ID",
            "SKU NAME",
            "SKU CODE",
            "TTL QTY",
            "DISCOUNT",
            "SKU PRICE",
            "AMOUNT",
            "GST%",
            "GST AMOUNT",
            "NET AMOUNT",
            "LAT LAG",
            "CALL WITH",
            "JOIN PERSON NAME"
        ];

        // Create CSV rows
        const rows = filteredData.map(item => {
            const rowData = [
                item.OrderID,
                item.OrderDate,
                item.OrderTime,
                item.Outlet,
                item.Beat,
                item.DealerName,
                item.ZoneName,
                item.UserName,
                item.ReportingTo,
                item.skuID,
                item.SkuName,
                item.skucode,
                item.TTLQTY,
                item.Discount,
                item.SkuPrice,
                item.Amount,
                item.GST,
                item.GstAmount,
                item.NetAmount,
                item.Location,
                item.CALLWITH,
                item.JOINPERSONNAME
            ].map(field => `"${field ? field.toString().replace(/"/g, '""') : ''}"`);
            return rowData.join(",");
        });

        // Combine header and rows
        const csvContent = [headers.join(","), ...rows].join("\n");

        // Create download link
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `order_report_${fromDate}_${toDate}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-red-900 text-3xl text-center mb-6">Order Report</h2>

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
                            <th className="px-4 py-2 text-left whitespace-nowrap">ORDER ID</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap">ORDER DATE</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap">ORDER TIME</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap">OUTLET</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap">BEAT</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap">DEALER NAME</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap">ZONE NAME</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap">USER NAME</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap">REPORTING TO</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap">SKU ID</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap">SKU NAME</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap">SKU CODE</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap">TTL QTY</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap">DISCOUNT</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap">SKU PRICE</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap">AMOUNT</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap">GST%</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap">GST AMOUNT</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap">NET AMOUNT</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap">LAT LAG</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap">CALL WITH</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap">JOIN PERSON NAME</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700">
                        {filteredData.map((res, ind) => (
                            <tr key={ind} className="border-t border-gray-200">
                                <td className="px-4 py-2 whitespace-nowrap">
                                    {res.OrderID}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    {res.OrderDate}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    {res.OrderTime}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    {res.Outlet}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    {res.Beat}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    {res.DealerName}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    {res.ZoneName}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">{res.UserName?.replace(/\s+/g, ' ').trim()}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{res.ReportingTo?.replace(/\s+/g, ' ').trim()}</td>
                                <td className="px-4 py-2">{res.skuID}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{res.SkuName?.replace(/\s+/g, ' ').trim()}</td>
                                <td className="px-4 py-2">{res.skucode}</td>
                                <td className="px-4 py-2">{res.TTLQTY}</td>
                                <td className="px-4 py-2">{res.Discount}</td>
                                <td className="px-4 py-2">{res.SkuPrice}</td>
                                <td className="px-4 py-2">{res.Amount}</td>
                                <td className="px-4 py-2">{res.GST}</td>
                                <td className="px-4 py-2">{res.GstAmount}</td>
                                <td>{res.NetAmount}</td>
                                <td>{res.Location ? res.Location.trim() : ''}</td>
                                <td>{res.CALLWITH}</td>
                                <td>{res.JOINPERSONNAME?.replace(/\s+/g, ' ').trim()}</td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default OrderReportScreen;