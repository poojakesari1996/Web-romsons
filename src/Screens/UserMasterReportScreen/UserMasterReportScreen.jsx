import React, { useEffect, useState } from "react";

const UserMaster = () => {
    const [userMasterlist, setUserMasterlist] = useState([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [zoneId, setZoneId] = useState("");
    const [divisionId, setDivisionId] = useState("");
    const [zoneList, setZoneList] = useState([]);
    const [divisionList, setDivisionList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        UserMasterReport();
    }, [statusFilter]);

    const UserMasterReport = () => {
        fetch(`http://localhost:8091/UserMasterReport?status=${statusFilter}`)
            .then((response) => response.json())
            .then((result) => {
                if (result.error === false) {
                    setUserMasterlist(result.data);
                }
            })
            .catch((error) => console.error(error));
    };

    const GetZoneList = () => {
        fetch("http://localhost:8091/Zonelist")
            .then((response) => response.json())
            .then((result) => {
                if (result.error === false) {
                    setZoneList(result.data);
                }
            })
            .catch((error) => console.error(error));
    };

    const GetDivisionList = () => {
        fetch("http://localhost:8091/Divisionlist")
            .then((response) => response.json())
            .then((result) => {
                if (result.error === false) {
                    setDivisionList(result.data);
                }
            })
            .catch((error) => console.error(error));
    };

    useEffect(() => {
        GetZoneList();
        GetDivisionList();
    }, []);

    const filteredList = userMasterlist.filter((user) => {
        const zoneMatch = zoneId === "" || (user.Zone_Name && user.Zone_Name.includes(zoneId));
        const divisionMatch = divisionId === "" || (user.Division && user.Division.includes(divisionId));
        return zoneMatch && divisionMatch;
    });

    // ✅ Group users by their manager (emp_id)
    const groupByManager = () => {
        const managerMap = {};
        const managerDetails = {};

        filteredList.forEach((user) => {
            const manager = user.Reporting_To || "No Manager";

            if (!managerMap[manager]) {
                managerMap[manager] = [];
            }

            managerMap[manager].push(user);

            // ✅ Store manager details separately for rendering
            if (!managerDetails[manager]) {
                const mgrUser = filteredList.find(u => `${u.Name} - ${u.emp_id}` === manager);
                if (mgrUser) {
                    managerDetails[manager] = mgrUser;
                }
            }
        });

        return { managerMap, managerDetails };
    };

    const { managerMap, managerDetails } = groupByManager();

    const managerFilteredList = React.useMemo(() => {
        if (!searchQuery.trim()) {
            return filteredList; // No search → show all
        }

        const searchLower = searchQuery.toLowerCase();

        // Find the searched manager
        const matchingManager = filteredList.find(user =>
            user.Name.toLowerCase().includes(searchLower) || user.emp_id.toString().includes(searchLower)
        );

        if (matchingManager) {
            // ✅ Return only team members (exclude manager)
            return filteredList.filter(user =>
                user.Reporting_To === `${matchingManager.Name} - ${matchingManager.emp_id}`
            );
        }

        return []; // No match
    }, [filteredList, searchQuery]);

    const downloadCSV = () => {
        // Get data based on search mode
        let dataToDownload;

        if (searchQuery.trim()) {
            // In search mode, we only have team members
            dataToDownload = managerFilteredList.map(item => ({
                ...item,
                isManager: "Team" // All are team members in search mode
            }));
        } else {
            // In normal mode, we need to include both managers and their teams
            dataToDownload = [];

            Object.keys(managerMap).forEach(manager => {
                const mgrDetails = managerDetails[manager];

                // Add manager with flag
                if (mgrDetails) {
                    dataToDownload.push({
                        ...mgrDetails,
                        isManager: "Manager"
                    });
                }

                // Add team members with flag
                managerMap[manager]
                    .filter(u => u.emp_id !== mgrDetails?.emp_id)
                    .forEach(member => {
                        dataToDownload.push({
                            ...member,
                            isManager: "Team"
                        });
                    });
            });
        }

        if (dataToDownload.length === 0) {
            alert("No data available to download");
            return;
        }

        // Define CSV Headers - added "Is Manager" column
        const headers = [
            "Is Manager",
            "Status",
            "Emp Id",
            "EMP Code",
            "Name",
            "Head Quater",
            "Division",
            "Zone Name",
            "Email",
            "Phone No",
            "Designation",
            "Role",
            "Department",
            "Reporting To",
            "Dealer",
            "City",
            "City Type",
            "Joining Date",
            "Resignation Date"
        ];

        // Create CSV Rows from data
        const rows = dataToDownload.map(item => {
            return [
                item.isManager || "",
                item.Status || "",
                item.emp_id || "",
                item.EMP_Code || "",
                (item.Name || "").replace(/\s+/g, ' ').trim(),
                item.Head_Quater || "",
                item.Division || "",
                (item.Zone_Name || "").replace(/\s+/g, ' ').trim(),
                item.Email || "",
                item.Phone_No || "",
                (item.Designation || "").replace(/\s+/g, ' ').trim(),
                (item.Role || "").replace(/\s+/g, ' ').trim(),
                item.Department || "",
                (item.Reporting_To || "").replace(/\s+/g, ' ').trim(),
                (item.Dealer || "").replace(/\s+/g, ' ').trim(),
                item.City || "",
                item.City_Type || "",
                item.Joining_Date || "",
                item.Resign_Date || ""
            ];
        });

        // Combine headers + rows into single CSV string
        const csvContent = [headers.join(","), ...rows.map(r => `"${r.join('","')}"`)].join("\n");

        // Create a downloadable CSV file
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `user_master_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };



    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-red-900 text-3xl text-center mb-6">User Master Report</h2>

            {/* Filters */}
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
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>

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
                <div>
                    <label className="block text-black-600 text-sm mb-1 font-bold">Zone</label>
                    <select
                        value={zoneId}
                        onChange={(e) => setZoneId(e.target.value)}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700"
                    >
                        <option value="">--Zone --</option>
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
                        <option value="">-- Division --</option>
                        {divisionList.map((division) => (
                            <option key={division.division_id} value={division.division_id}>
                                {division.division_id} -- {division.division_name}
                            </option>
                        ))}
                    </select>
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


            <div className="max-w-6xl mx-auto mb-4">
                <p className="text-sm text-gray-600">
                    Showing {filteredList.length} of {userMasterlist.length} users
                </p>
            </div>

            {/* ✅ Table */}
            <div className="overflow-x-auto max-h-[500px]">
                <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
                    <thead className="bg-teal-700 text-white text-sm">
                        <tr>
                            <th className="px-4 py-2 text-left sticky top-0 bg-teal-700 z-10">Status</th>
                            <th className="px-4 py-2 text-left sticky top-0 bg-teal-700 z-10">Emp Id</th>
                            <th className="px-4 py-2 text-left sticky top-0 bg-teal-700 z-10">EMP Code</th>
                            <th className="px-4 py-2 text-left sticky top-0 bg-teal-700 z-10">Name</th>
                            <th className="px-4 py-2 text-left sticky top-0 bg-teal-700 z-10">Head Quater</th>
                            <th className="px-4 py-2 text-left sticky top-0 bg-teal-700 z-10">Division</th>
                            <th className="px-4 py-2 text-left sticky top-0 bg-teal-700 z-10">Zone Name</th>
                            <th className="px-4 py-2 text-left sticky top-0 bg-teal-700 z-10">Email</th>
                            <th className="px-4 py-2 text-left sticky top-0 bg-teal-700 z-10">Phone No</th>
                            <th className="px-4 py-2 text-left sticky top-0 bg-teal-700 z-10">Designation</th>
                            <th className="px-4 py-2 text-left sticky top-0 bg-teal-700 z-10">Role</th>
                            <th className="px-4 py-2 text-left sticky top-0 bg-teal-700 z-10">Department</th>
                            <th className="px-4 py-2 text-left sticky top-0 bg-teal-700 z-10">Reporting To</th>
                            <th className="px-4 py-2 text-left sticky top-0 bg-teal-700 z-10">Dealer</th>
                            <th className="px-4 py-2 text-left sticky top-0 bg-teal-700 z-10">City</th>
                            <th className="px-4 py-2 text-left sticky top-0 bg-teal-700 z-10">City Type</th>
                            <th className="px-4 py-2 text-left sticky top-0 bg-teal-700 z-10">Joining Date</th>
                            <th className="px-4 py-2 text-left sticky top-0 bg-teal-700 z-10">Resignation Date</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700">
                        {searchQuery.trim() ? (
                            // ✅ Search Mode → Only team of searched manager
                            managerFilteredList.length > 0 ? (
                                managerFilteredList.map((res, ind) => (
                                    <tr key={`team-${ind}`} className="border-t border-gray-200">
                                        <td className="px-4 py-2">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-semibold ${res.Status === 'ACTIVE' || res.Status === 'Active'
                                                    ? 'bg-green-200 text-green-800'
                                                    : res.Status === 'INACTIVE' || res.Status === 'Inactive'
                                                        ? 'bg-red-200 text-red-800'
                                                        : 'bg-gray-200 text-gray-800'
                                                    }`}
                                            >
                                                {res.Status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">{res.emp_id}</td>
                                        <td className="px-4 py-2">{res.EMP_Code}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {res.Name?.replace(/\s+/g, ' ').trim()}
                                        </td>
                                        <td className="px-4 py-2">{res.Head_Quater}</td>
                                        <td className="px-4 py-2">{res.Division}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {res.Zone_Name?.replace(/\s+/g, ' ').trim()}
                                        </td>
                                        <td className="px-4 py-2">{res.Email}</td>
                                        <td className="px-4 py-2">{res.Phone_No}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {res.Designation?.replace(/\s+/g, ' ').trim()}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {res.Role?.replace(/\s+/g, ' ').trim()}
                                        </td>
                                        <td className="px-4 py-2">{res.Department}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {res.Reporting_To?.replace(/\s+/g, ' ').trim()}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {res.Dealer?.replace(/\s+/g, ' ').trim()}
                                        </td>                                        <td className="px-4 py-2">{res.City}</td>
                                        <td className="px-4 py-2">{res.City_Type}</td>
                                        <td className="px-4 py-2">{res.Joining_Date}</td>
                                        <td className="px-4 py-2">{res.Resign_Date}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="18" className="text-center py-4 text-gray-500">
                                        No matching manager found
                                    </td>
                                </tr>
                            )
                        ) : (
                            // ✅ Normal Mode → Manager + Team grouped
                            Object.keys(managerMap).map(manager => {
                                const mgrDetails = managerDetails[manager];
                                return (
                                    <React.Fragment key={manager}>
                                        {/* ✅ Manager Row */}
                                        {mgrDetails && (
                                            <tr className="bg-yellow-200 font-bold">
                                                <td className="px-4 py-2">{mgrDetails.Status}</td>
                                                <td className="px-4 py-2">{mgrDetails.emp_id}</td>
                                                <td className="px-4 py-2">{mgrDetails.EMP_Code}</td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    {mgrDetails.Name?.replace(/\s+/g, ' ').trim()}
                                                </td>
                                                <td className="px-4 py-2">{mgrDetails.Head_Quater}</td>
                                                <td className="px-4 py-2">{mgrDetails.Division}</td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    {mgrDetails.Zone_Name?.replace(/\s+/g, ' ').trim()}
                                                </td>
                                                <td className="px-4 py-2">{mgrDetails.Email}</td>
                                                <td className="px-4 py-2">{mgrDetails.Phone_No}</td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    {mgrDetails.Designation?.replace(/\s+/g, ' ').trim()}
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    {mgrDetails.Role?.replace(/\s+/g, ' ').trim()}
                                                </td>
                                                <td className="px-4 py-2">{mgrDetails.Department}</td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    {mgrDetails.Reporting_To?.replace(/\s+/g, ' ').trim()}
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    {mgrDetails.Dealer?.replace(/\s+/g, ' ').trim()}
                                                </td>
                                                <td className="px-4 py-2">{mgrDetails.City}</td>
                                                <td className="px-4 py-2">{mgrDetails.City_Type}</td>
                                                <td className="px-4 py-2">{mgrDetails.Joining_Date}</td>
                                                <td className="px-4 py-2">{mgrDetails.Resign_Date}</td>
                                            </tr>
                                        )}

                                        {/* ✅ Team Rows */}
                                        {managerMap[manager]
                                            .filter(u => u.emp_id !== mgrDetails?.emp_id)
                                            .map((res, ind) => (
                                                <tr key={`team-${ind}`} className="border-t border-gray-200">
                                                    <td className="px-4 py-2">
                                                        <span
                                                            className={`px-2 py-1 rounded text-xs font-semibold ${res.Status === 'ACTIVE' || res.Status === 'Active'
                                                                ? 'bg-green-200 text-green-800'
                                                                : res.Status === 'INACTIVE' || res.Status === 'Inactive'
                                                                    ? 'bg-red-200 text-red-800'
                                                                    : 'bg-gray-200 text-gray-800'
                                                                }`}
                                                        >
                                                            {res.Status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2">{res.emp_id}</td>
                                                    <td className="px-4 py-2">{res.EMP_Code}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap">
                                                        {res.Name?.replace(/\s+/g, ' ').trim()}
                                                    </td>
                                                    <td className="px-4 py-2">{res.Head_Quater}</td>
                                                    <td className="px-4 py-2">{res.Division}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap">
                                                        {res.Zone_Name?.replace(/\s+/g, ' ').trim()}
                                                    </td>
                                                    <td className="px-4 py-2">{res.Email}</td>
                                                    <td className="px-4 py-2">{res.Phone_No}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap">
                                                        {res.Designation?.replace(/\s+/g, ' ').trim()}
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap">
                                                        {res.Role?.replace(/\s+/g, ' ').trim()}
                                                    </td>
                                                    <td className="px-4 py-2">{res.Department}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap">
                                                        {res.Reporting_To?.replace(/\s+/g, ' ').trim()}
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap">
                                                        {res.Dealer?.replace(/\s+/g, ' ').trim()}
                                                    </td>
                                                    <td className="px-4 py-2">{res.City}</td>
                                                    <td className="px-4 py-2">{res.City_Type}</td>
                                                    <td className="px-4 py-2">{res.Joining_Date}</td>
                                                    <td className="px-4 py-2">{res.Resign_Date}</td>
                                                </tr>
                                            ))}
                                    </React.Fragment>
                                );
                            })
                        )}
                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default UserMaster;
