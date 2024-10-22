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
function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box minH={"100vh"}>
        <Routes>
          <Route path="/register" element={<AuthForm isRegister={true} />} />
          <Route path="/login" element={<AuthForm isRegister={false} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Box>
    </ChakraProvider>
  );
}

export default App;
