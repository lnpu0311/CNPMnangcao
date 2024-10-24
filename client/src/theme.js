import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
<<<<<<< HEAD

const activeLabelStyles = {
  transform: "scale(0.85) translateY(-24px)",
};

const colors = {
  brand: {
    0: "#FFFFFF",
    1: "#000000",
    2: "#f7fafc",
    3: "#c0c0c0",
    4: "#708090",
    5: "#2A3439", // medium gray
    100: "#caf0f8",
    200: "#ade8f4",
    300: "#90e0ef",
    400: "#48cae4",
    500: "#00b4d8",
    600: "#0096c7",
    700: "#0077b6",
    800: "#023e8a",
    900: "#03045e",
    accent: "#ff6b6b", // Red accent
    success: "#51cf66", // Green success
    warning: "#ffd43b", // Yellow warning
    muted: "#6c757d", // Muted text
  },
=======
const activeLabelStyles = {
  transform: "scale(0.85) translateY(-24px)",
>>>>>>> 698399fe2e154b38077843d9b467d196600d7559
};
const theme = extendTheme({
  colors: {
    brand: {
      0: "#FFFFFF",
      1: "#000000",
      2: "#f7fafc",
      3: "#c0c0c0",
      4: "#708090",
      5: "#2A3439", // medium gray
      100: "#caf0f8",
      200: "#ade8f4",
      300: "#90e0ef",
      400: "#48cae4",
      500: "#00b4d8",
      600: "#0096c7",
      700: "#0077b6",
      800: "#023e8a",
      900: "#03045e",
      accent: "#ff6b6b", // Red accent
      success: "#51cf66", // Green success
      warning: "#ffd43b", // Yellow warning
      muted: "#6c757d", // Muted text
    },
  },
  config: {
    initialColorMode: "light",
    useSystemColorMode: true,
  },
  styles: {
    global: (props) => ({
      "html, body": {
        background: mode("brand.0", "#18191a")(props),
        color: mode("brand.1", "brand.1")(props),
        transition: "background-color 0.2s ease, color 0.2s ease",
      },
      "input:-webkit-autofill": {
        WebkitBoxShadow: `0 0 0px 1000px white inset`,
        backgroundColor: "white !important",
        transition: "background-color 5000s ease-in-out 0s",
      },
      "&:-webkit-autofill:hover": {
        WebkitBoxShadow: `0 0 0px 1000px white inset`,
        backgroundColor: "white !important",
      },
      "&:-webkit-autofill:focus": {
        WebkitBoxShadow: `0 0 0px 1000px white inset`,
        backgroundColor: "white !important",
      },
      "&:-webkit-autofill:active": {
        WebkitBoxShadow: `0 0 0px 1000px white inset`,
        backgroundColor: "white !important",
      },
    }),
  },
  components: {
    Box: {
      baseStyle: (props) => ({
        bg: mode("brand.0", "brand.800")(props),
        boxShadow: mode("lg", "dark-lg")(props),
        borderColor: mode("brand.3", "brand.600")(props),
        transition: "background-color 0.2s ease, box-shadow 0.2s ease",
      }),
    },
    Button: {
      baseStyle: {
        fontWeight: "bold",
        borderRadius: "md",
      },
      variants: {
        solid: (props) => ({
          color: mode("brand.1", "brand.0")(props),
        }),
<<<<<<< HEAD
=======
        // outline: (props) => ({
        //   borderColor: mode("brand.200", "brand.600")(props),
        //   color: mode("brand.500", "brand.300")(props),
        //   _hover: {
        //     bg: mode("brand.200", "brand.700")(props),
        //     color: "white",
        //   },
        // }),
        // accent: (props) => ({
        //   bg: mode("brand.accent", "brand.accent")(props),
        //   color: "white",
        //   _hover: {
        //     bg: mode("brand.warning", "brand.warning")(props),
        //   },
        // }),
        // success: (props) => ({
        //   bg: mode("brand.success", "brand.success")(props),
        //   color: "white",
        //   _hover: {
        //     bg: mode("green.500", "green.500")(props),
        //   },
        // }),
>>>>>>> 698399fe2e154b38077843d9b467d196600d7559
      },
    },
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles,
              },
            },
            "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label":
              {
                ...activeLabelStyles,
              },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: "absolute",
              backgroundColor: "brand.0",
              pointerEvents: "none",
              mx: 3,
              px: 1,
              my: 2,
              transformOrigin: "left top",
            },
          },
        },
      },
    },
    Input: {
      baseStyle: (props) => ({
        color: mode("brand.0", "brand.1")(props),
        _placeholder: {
          color: mode("brand.4", "brand.5")(props),
        },
      }),
    },
    Text: {
      baseStyle: (props) => ({
        color: mode("brand.1", "brand.0")(props),
      }),
    },
    Link: {
      baseStyle: (props) => ({
        color: mode("brand.500", "brand.300")(props),
        _hover: {
          color: mode("brand.400", "brand.200")(props),
          textDecoration: "underline",
        },
      }),
    },
    Modal: {
      baseStyle: (props) => ({
        dialog: {
          bg: mode("brand.4", "brand.5")(props),
          color: mode("brand.1", "brand.0")(props),
        },
      }),
    },
  },
});

export default theme;