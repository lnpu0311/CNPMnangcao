import { Box, useColorModeValue } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import Template from "./pages/Layout";
function App() {
  return (
    <Box minH={"100vh"}>
      <Routes>
        <Route path="/" element={<Template />} />
      </Routes>
    </Box>
  );
}

export default App;
