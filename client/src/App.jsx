import { Box, ChakraProvider, useColorModeValue } from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import theme from "./theme";
import AuthForm from "./pages/AuthForm";
import LandlordHome from "./landlord/Home";
import HomeDashboard from "./landlord/HomeDashboard";
import HostelManagement from "./landlord/HostelManagement";
import RoomList from "./landlord/RoomList";
import ProfilePage from "./landlord/Profile";
import EmployeeManagement from "./landlord/EmployeeManagement";
import RentalRequest from "./landlord/RentalRequests";
import TenantRoomList from "./tenant/TenantRoomList";
import TenantContract from "./tenant/TenantContract";
import TenantPayments from "./tenant/TenantPayments";
import TenantDashboard from "./tenant/TenantDashboard";
import TenantHome from "./tenant/TenantHome";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import Receipt from "./landlord/Receipt";
import TenantList from "./landlord/TenantList";
import RevenueStats from "./landlord/RevenueStats";
import AdminDashboard from "./admin/AdminDashboard";
import SearchResults from './pages/SearchResults';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box minH={"100vh"}>
        {/* Auth routes */}
        <Routes>
          <Route path="/register" element={<AuthForm isRegister={true} />} />
          <Route path="/login" element={<AuthForm isRegister={false} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to="/login" replace />} />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute rolesRequired={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          ></Route>
          {/* Landlord and Manager routes */}
          <Route
            path="/landlord"
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
            <Route path="revenue-stats" element={<RevenueStats />} />
            <Route path="payment-list" element={<Receipt />} />
            <Route path="tenant-list" element={<TenantList />} />
            <Route path="room-list/:facilityId" element={<RoomList />} />
            <Route path="profile-page" element={<ProfilePage />} />
          </Route>

          {/* Tenant routes */}
          <Route
            path="/tenant"
            element={
              <ProtectedRoute rolesRequired={["tenant"]}>
                <TenantHome />
              </ProtectedRoute>
            }
          >
            <Route index element={<TenantDashboard />} />
            <Route path="room-list" element={<TenantRoomList />} />
            <Route path="contract" element={<TenantContract />} />
            <Route path="payments" element={<TenantPayments />} />
            <Route path="profile-page" element={<ProfilePage />} />
          </Route>

          <Route path="/search-results" element={<SearchResults />} />
        </Routes>
      </Box>
    </ChakraProvider>
  );
}

export default App;
