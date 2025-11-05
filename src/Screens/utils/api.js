//for production db 
// export const DEV_BASE_URL = 'https://crm.romsons.com:8080';

//local 
export const DEV_BASE_URL = 'http://localhost:8091';

export const API_END_POINT = {
    
    attendanceReport: (month, year) =>
        `${DEV_BASE_URL}/attendance_monthly?month=${month}&year=${year}`,

    leaveReport: `${DEV_BASE_URL}/leaveReportSummary`,

    DayWiseAttendanceReport: (fromDate, toDate) => `${DEV_BASE_URL}/DayWiseAttendanceReport?fromDate=${fromDate}&toDate=${toDate}`,

    TrackerReportAPI: `${DEV_BASE_URL}/UserList`,

    TrackerOrderActivityReportAPI: (selectedEmpId, fromDate, toDate) => `${DEV_BASE_URL}/outletReport?emp_id=${selectedEmpId}&from=${fromDate}&to=${toDate}`,

    RegularizedReportAPI: (fromDate, toDate, statusFilter) => 
        `${DEV_BASE_URL}/regularizationReport?fromDate=${fromDate}&toDate=${toDate}&status=${statusFilter}`,

    ZoneListAPI: `${DEV_BASE_URL}/Zonelist`,

    DivisionListAPI: `${DEV_BASE_URL}/Divisionlist`,

    PerformanceSummaryAPI: (fromDate, toDate, zoneId, divisionId, searchQuery) => {
        const params = new URLSearchParams();
        if (fromDate) params.append("from_date", fromDate);
        if (toDate) params.append("to_date", toDate);
        if (zoneId) params.append("filter_zone_id", zoneId);
        if (divisionId) params.append("filter_division_id", divisionId);
        if (searchQuery) params.append("search_query", searchQuery);

        return `${DEV_BASE_URL}/PerformanceSummary${params.toString() ? `?${params.toString()}` : ''}`;
    },

    OrderListAPI: (fromDate, toDate) =>
        `${DEV_BASE_URL}/CrmOrderReport?fromDate=${fromDate}&toDate=${toDate}`,

    ActivityReportAPI: (fromDate, toDate) =>
        `${DEV_BASE_URL}/CrmActivityReport?fromDate=${fromDate}&toDate=${toDate}`,

    UserListAPI: `${DEV_BASE_URL}/UserList`,

    DivisionListAPI: `${DEV_BASE_URL}/Divisionlist`
}


