import { Box, ChakraProvider, useColorModeValue } from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import theme from "./theme";
import AuthForm from "./pages/AuthForm";
import LandlordHome from "./landlord/Home"; // Import HomeLayout if it's a separate component
import HomeDashboard from "./landlord/HomeDashboard"; // Import HomeDashboard if needed
import HostelManagement from "./landlord/HostelManagement"; // Import necessary components
import RoomList from "./landlord/RoomList"; // Import necessary components
import ProfilePage from "./landlord/Profile"; // Import ProfilePage
import EmployeeManagement from "./landlord/EmployeeManagement";
import RentalRequest from "./landlord/RentalRequests";
import TenantRoomList from "./tenant/TenantRoomList";
import TenantContract from "./tenant/TenantContract";
import TenantPayments from "./tenant/TenantPayments";
import TenantDashboard from "./tenant/TenantDashboard";
import TenantHome from "./tenant/TenantHome";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box minH={"100vh"}>
        {/* Landlord routes */}
        <Routes>
          <Route path="/register" element={<AuthForm isRegister={true} />} />
          <Route path="/login" element={<AuthForm isRegister={false} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/"
            element={
              <ProtectedRoute rolesRequired={["landlord", "manager"]}>
                <LandlordHome />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomeDashboard />} />
            <Route
              path="hostel-management"
              element={
                <ProtectedRoute rolesRequired={["landlord"]}>
                  <HostelManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="employee-management"
              element={<EmployeeManagement />}
            />
            <Route path="rental-request" element={<RentalRequest />} />
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

            <Route index element={<HomeDashboard />} />
            <Route
              path="hostel-management"
              element={
                <ProtectedRoute rolesRequired={["landlord"]}>
                  <HostelManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="employee-management"
              element={<EmployeeManagement />}
            />
            <Route path="rental-request" element={<RentalRequest />} />
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
          </Route>

          {/* Tenant routes */}
          <Route
            path="/tenant"
            element={
              <ProtectedRoute rolesRequired={[`tenant`]}>
                <TenantHome />
              </ProtectedRoute>
            }
          >
            <Route index element={<TenantDashboard />} />
            <Route path="tenant-room-list" element={<TenantRoomList />} />
            <Route path="tenant-contract" element={<TenantContract />} />
            <Route path="tenant-payments" element={<TenantPayments />} />
            <Route path="profile-page" element={<ProfilePage />} />
          </Route>
        </Routes>
        {/* <Routes>
          <Route path="/register" element={<AuthForm isRegister={true} />} />
          <Route path="/login" element={<AuthForm isRegister={false} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route path="/" element={<HomeLayout />}>
            <Route index element={<HomeDashboard />} />
            <Route path="hostel-management" element={<HostelManagement />} />
            <Route
              path="employee-management"
              element={<EmployeeManagement />}
            />
            <Route path="rental-request" element={<RentalRequest />} />
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
          </Route>
        </Routes> */}
      </Box>
    </ChakraProvider>
  );
}

export default App;
