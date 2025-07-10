//for production db 
export const DEV_BASE_URL = 'https://crm.romsons.com:8080';

//local 
// export const DEV_BASE_URL = 'http://localhost:8091';

export const API_END_POINT = {
    
    attendanceReport: (month, year) =>
        `${DEV_BASE_URL}/attendance_monthly?month=${month}&year=${year}`,

    leaveReport: `${DEV_BASE_URL}/leaveReportSummary`,

    DayWiseAttendanceReport: (fromDate, toDate) => `${DEV_BASE_URL}/DayWiseAttendanceReport?fromDate=${fromDate}&toDate=${toDate}`
}


