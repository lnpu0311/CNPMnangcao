import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools"; // Utility for handling dark/light modes

const colors = {
  brand: {
    0: "#FFFFFF", // Light background color
    1: "#000000", // Dark text color
    2: "#efefef", // Light gray
    3: "#c0c0c0", // Dark gray
    100: "#caf0f8",
    200: "#ade8f4",
    300: "#90e0ef",
    400: "#48cae4",
    500: "#00b4d8", // Primary color
    600: "#0096c7",
    700: "#0077b6", // Dark background color for dark mode
    800: "#023e8a",
    900: "#03045e",
  },
};

const theme = extendTheme({
  colors,
  config: {
    initialColorMode: "light", // Start with light mode by default
    useSystemColorMode: true, // Automatically switches color mode based on user's system settings
  },
  styles: {
    global: (props) => ({
      "html, body": {
        backgroundColor: mode("brand.2", "brand.900")(props), // Light or dark background
        color: mode("brand.1", "brand.0")(props), // Text color for light/dark mode
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "bold",
      },
      sizes: {
        md: {
          fontSize: "md",
          px: 4,
          py: 2,
        },
      },
      variants: {
        solid: (props) => ({
          bg: mode("brand.500", "brand.700")(props),
          color: "white",
          _hover: {
            bg: mode("brand.700", "brand.500")(props),
          },
        }),
        outline: (props) => ({
          borderColor: mode("brand.100", "brand.400")(props),
          color: mode("brand.600", "brand.100")(props),
          _hover: {
            bg: mode("brand.800", "brand.400")(props),
            borderColor: mode("brand.100", "brand.0")(props),
            color: "white",
          },
        }),
      },
    },
  },
});

export default theme;
