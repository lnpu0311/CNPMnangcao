import { Box, ChakraProvider, useColorModeValue } from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
<<<<<<< HEAD
import theme from "./theme";
import AuthForm from "./pages/AuthForm";
import LandlordHome from "./landlord/Home";
import TenantHome from "./tenant/TenantHome";
import HomeDashboard from "./landlord/HomeDashboard";
import HostelManagement from "./landlord/HostelManagement";
import RoomList from "./landlord/RoomList";
import ProfilePage from "./landlord/Profile";
import EmployeeManagement from "./landlord/EmployeeManagement";
import TenantRoomList from "./tenant/TenantRoomList";
import TenantContract from "./tenant/TenantContract";
import TenantPayments from "./tenant/TenantPayments";
import TenantDashboard from "./tenant/TenantDashboard";

=======
import Template from "./pages/Layout";
import Home from "./landlord/Home";
import theme from "./theme";
import AuthForm from "./pages/AuthForm";
import HomeLayout from "./landlord/Home"; // Import HomeLayout if it's a separate component
import HomeDashboard from "./landlord/HomeDashboard"; // Import HomeDashboard if needed
import HostelManagement from "./landlord/HostelManagement"; // Import necessary components
import RoomList from "./landlord/RoomList"; // Import necessary components
import ProfilePage from "./landlord/Profile"; // Import ProfilePage
import EmployeeManagement from "./landlord/EmployeeManagement";
>>>>>>> 698399fe2e154b38077843d9b467d196600d7559
function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box minH={"100vh"}>
        <Routes>
          <Route path="/register" element={<AuthForm isRegister={true} />} />
          <Route path="/login" element={<AuthForm isRegister={false} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
<<<<<<< HEAD
          
          {/* Landlord routes */}
          <Route path="/landlord" element={<LandlordHome />}>
            <Route index element={<HomeDashboard />} />
            <Route path="facility-management" element={<HostelManagement />} />
            <Route path="employee-management" element={<EmployeeManagement />} />
            <Route path="request-management" element={<Box>Yêu cầu thuê phòng đang được xử lý.</Box>} />
            <Route path="revenue-stats" element={<Box>Thống kê doanh thu theo các tháng.</Box>} />
            <Route path="payment-list" element={<Box>Danh sách các giao dịch thanh toán.</Box>} />
            <Route path="customer-list" element={<Box>Danh sách khách thuê phòng.</Box>} />
            <Route path="room-list/:facilityId" element={<RoomList />} />
            <Route path="profile-page" element={<ProfilePage />} />
          </Route>
          
          {/* Tenant routes */}
          <Route path="/tenant" element={<TenantHome />}>
            <Route index element={<TenantDashboard />} />
            <Route path="tenant-room-list" element={<TenantRoomList />} />
            <Route path="tenant-contract" element={<TenantContract />} />
            <Route path="tenant-payments" element={<TenantPayments />} />
            <Route path="profile-page" element={<ProfilePage />} />
=======
          <Route path="/" element={<HomeLayout />}>
            <Route index element={<HomeDashboard />} />
            <Route path="facility-management" element={<HostelManagement />} />
            <Route
              path="employee-management"
              element={<EmployeeManagement />}
            />
            <Route
              path="request-management"
              element={<Box>Yêu cầu thuê phòng đang được xử lý.</Box>}
            />
            <Route
              path="revenue-stats"
              element={<Box>Thống kê doanh thu theo các tháng.</Box>}
            />
            <Route
              path="payment-list"
              element={<Box>Danh sách các giao dịch thanh toán.</Box>}
            />
            <Route
              path="customer-list"
              element={<Box>Danh sách khách thuê phòng.</Box>}
            />
            <Route path="/room-list/:facilityId" element={<RoomList />} />
            <Route path="/profile-page" element={<ProfilePage />} />
>>>>>>> 698399fe2e154b38077843d9b467d196600d7559
          </Route>
        </Routes>
      </Box>
    </ChakraProvider>
  );
}

export default App;