import React, { useState, useEffect } from "react";
import Select from "react-select";
import { API_END_POINT } from '../utils/api';


const ProductAnalysisScreen = () => {
    const [activeUserList, setActiveUserList] = useState([]);
    const [selectedEmpId, setSelectedEmpId] = useState("");
    const [divisionList, setDivisionList] = useState([])
    const [divisionId, setDivisionId] = useState("");

    useEffect(() => {
        UserList();
        GetDivisionList()
    }, []);
    const userOptions = activeUserList.map(user => ({
        value: user.emp_id,
        label: `${user.user_name} -- ${user.emp_id}`,
    }));

    const UserList = () => {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        fetch(API_END_POINT.UserListAPI, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.error == false) {
                    setActiveUserList(result.data)
                }
            })
            .catch((error) => console.error(error));
    };

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
    
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-red-900 text-3xl text-center mb-6">Product Analysis</h2>
            <div className="flex justify-between items-center max-w-4xl mx-auto mb-6">
                {/* Filter Panel */}
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex justify-between items-center border border-gray-200 w-full mr-4">
                    {/* Search Input */}
                    <div className="w-70">
                        <label className="block text-black-600 text-sm mb-1 font-bold">Select User</label>
                        <Select
                            options={userOptions}
                            value={userOptions.find(opt => opt.value === selectedEmpId) || null}
                            onChange={(selectedOption) => setSelectedEmpId(selectedOption?.value || "")}
                            placeholder="-- Select User --"
                            isClearable
                        />
                    </div>
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

export default ProductAnalysisScreen