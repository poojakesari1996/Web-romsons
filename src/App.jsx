import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LeaveReportScreen from './Screens/LeaveReportScreen/LeaveReportScreen';
import AttendanceReportScreen from './Screens/AttendanceReportScreen/AttendanceReportScreen';
import DayWiseAttendanceScreen from './Screens/DayWiseAttendanceScreen/DayWiseAttendanceScreen';
import TrackerReportScreen from './Screens/TrackerReportScreen/TrackerReportScreen';
import PerformanceSummaryReportScreen from './Screens/PerformaceSummaryReportScreen/PerformanceSummaryReportScreen'
import ActivityReportScreen from "./Screens/ActivityReportScreen/ActivityReportScreen";
import RegularizationReportScreen from "./Screens/RegularizationReportScreen/RegularizationReportScreen";
import UserMasterReportScreen from "./Screens/UserMasterReportScreen/UserMasterReportScreen";
import ReportDashboardScreen from "./Screens/ReportDashboardScreen/ReportDashboardScreen"
import ProductAnalysisScreen from "./Screens/ProductAnalysisScreen/ProductAnalysisScreen";
import OrderReportScreen from "./Screens/OrderReportScreen/OrderReportScreen";

function App () {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<ReportDashboardScreen />} />
        <Route path="/leave-report" element = {<LeaveReportScreen />}/>
        <Route path="/attendance-report" element = {<AttendanceReportScreen/>}/>
        <Route path="/day-wise-attendance" element = {<DayWiseAttendanceScreen/>}/>
        <Route path="/tracker-report" element = {<TrackerReportScreen/>}/>
        <Route path="/performance-report" element = {<PerformanceSummaryReportScreen/>}/>
        <Route path="/activity-report" element = {<ActivityReportScreen/>}/>
        <Route path="/regularization-report" element = {<RegularizationReportScreen/>}/>
        <Route path="/user-master" element = {<UserMasterReportScreen/>}/>
        <Route path="/product-analysis" element = {<ProductAnalysisScreen/>}/>
        <Route path="/order-report" element = {<OrderReportScreen/>}/>
      </Routes>
    </Router>
  );
}
export default App;