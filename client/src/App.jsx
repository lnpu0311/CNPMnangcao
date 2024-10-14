import { Box, useColorModeValue } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import SignUp from "./pages/SignUp";
function App() {
  return (
    <Box minH={"100vh"} bg={useColorModeValue("blue.100", "gray.900")}>
      <Navbar />
      <Routes>
        <Route path="/" element={<SignUp />} />
      </Routes>
    </Box>
  );
}

export default App;
