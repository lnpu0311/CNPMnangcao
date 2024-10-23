import { Box, ChakraProvider, useColorModeValue } from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
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
function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box minH={"100vh"}>
        <Routes>
          <Route path="/register" element={<AuthForm isRegister={true} />} />
          <Route path="/login" element={<AuthForm isRegister={false} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
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
          </Route>
        </Routes>
      </Box>
    </ChakraProvider>
  );
}

export default App;
