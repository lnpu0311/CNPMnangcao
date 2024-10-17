import { Box, ChakraProvider, useColorModeValue } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import Template from "./pages/Layout";
import Home from "./landlord/Home";
import theme from "./theme";
function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box minH={"100vh"}>
        <Home />
      </Box>
    </ChakraProvider>
  );
}

export default App;
