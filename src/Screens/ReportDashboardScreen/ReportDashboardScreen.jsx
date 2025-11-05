import React from "react";
import { Link } from "react-router-dom";

function ReportsDashboard() {
  const reports = [
    { title: "Leave Report", path: "/leave-report" },
    { title: "Attendance Report", path: "/attendance-report" },
    { title: "Day Wise Attendance", path: "/day-wise-attendance" },
    { title: "Tracker Report", path: "/tracker-report" },
    { title: "Performance Report", path: "/performance-report" },
    { title: "Activity Report", path: "/activity-report" },
    { title: "Regularization Report", path: "/regularization-report" },
    { title: "User Master", path: "/user-master" },
    { title: "Product Analysis", path: "/product-analysis" },
    { title: "Order Report", path: "/order-report" }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Reports Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {reports.map((report, index) => (
          <Link
            key={index}
            to={report.path}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 flex items-center justify-center text-lg font-semibold text-gray-700 hover:bg-blue-50 transition transform hover:-translate-y-1"
          >
            {report.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ReportsDashboard;
