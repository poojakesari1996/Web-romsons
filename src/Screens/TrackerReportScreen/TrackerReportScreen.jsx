import React, { useState,useEffect } from "react";

const TrackerReportScreen = () => {
    const [activeUserList, setActiveUserList] = useState([])

    const UserList = () => {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        fetch("http://localhost:8091/UserList", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.error == false) {
                    setActiveUserList(result.data)
                }
            })
            .catch((error) => console.error(error));
    }

    useEffect(() => {
        UserList();
    }, []);
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-red-900 text-3xl text-center mb-6">Tracker Report</h2>

            <div className="flex justify-between items-center max-w-4xl mx-auto mb-6">
                {/* Filter Panel */}
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex justify-between items-center border border-gray-200 w-full mr-4">
                    {/* Search Input */}
                    <div>
                        <label className="block text-black-600 text-sm mb-1 font-bold">Status</label>
                        <select
                            // value={statusFilter}
                            // onChange={(e) => setStatusFilter(e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700"
                        >
                            <option value="">-- Select User --</option>
                            {activeUserList.map(user=>(
                                <option key={user.emp_id} value={user.emp_id}>
                                {user.user_name} -- {user.emp_id}
                            </option>
                            ))}
                        </select>

                    </div>

                    {/* Date Filters */}
                    <div className="flex gap-3">
                        <div>
                            <label className="block text-black-600 font-bold text-sm mb-1">From</label>
                            <input
                                type="date"
                                // value={fromDate}
                                // onChange={(e) => setFromDate(e.target.value)}
                                className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700"
                            />
                        </div>

                        <div>
                            <label className="block text-black-600 text-sm mb-1 font-bold">To</label>
                            <input
                                type="date"
                                // value={toDate}
                                // onChange={(e) => setToDate(e.target.value)}
                                className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700"
                            />
                        </div>
                    </div>
                </div>

                {/* Excel Button */}


            </div>
        </div>
    )
}

export default TrackerReportScreen