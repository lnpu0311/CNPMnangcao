import { Box, ChakraProvider, useColorModeValue } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import Template from "./pages/Layout";
import Home from "./landlord/Home";
import theme from "./theme";
import TenantHome from "./tenant/TenantHome";
function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box minH={"100vh"}>
        {/* <Home/> */}
        <TenantHome/>
        
      </Box>
    </ChakraProvider>
  );
}

export default App;
