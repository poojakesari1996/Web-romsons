import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LeaveReportScreen from './Screens/LeaveReportScreen/LeaveReportScreen';
import AttendanceReportScreen from './Screens/AttendanceReportScreen/AttendanceReportScreen';
import DayWiseAttendanceScreen from './Screens/DayWiseAttendanceScreen/DayWiseAttendanceScreen';
import TrackerReportScreen from './Screens/TrackerReportScreen/TrackerReportScreen'

function App () {
  return (
    <Router>
      <Routes>
        <Route path="/leave-report" element = {<LeaveReportScreen />}/>
        <Route path="/attendance-report" element = {<AttendanceReportScreen/>}/>
        <Route path="/day-wise-attendance" element = {<DayWiseAttendanceScreen/>}/>
        <Route path="/tracker-report" element = {<TrackerReportScreen/>}/>
      </Routes>
    </Router>
  );
}
export default App;