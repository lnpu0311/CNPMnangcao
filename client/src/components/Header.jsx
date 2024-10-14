import React, { useEffect, useState } from "react";
import { Box, Flex, Button, Input, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { debounce } from "lodash";

const MotionBox = motion(Box);

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const bgColor = useColorModeValue("teal.300", "teal.600");
  const searchBgColor = useColorModeValue("gray.100", "gray.700");
  const inputBgColor = useColorModeValue("white", "gray.600");

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    setIsScrolled(scrollTop > 50);
  };

  useEffect(() => {
    const debouncedHandleScroll = debounce(handleScroll, 20);
    window.addEventListener("scroll", debouncedHandleScroll);
    return () => window.removeEventListener("scroll", debouncedHandleScroll);
  }, []);

  const searchVariants = {
    initial: {
      width: "60%",
      height: "60px",
      position: "absolute",
      top: "100px",
      left: "50%",
      transform: "translateX(-50%)",
    },
    scrolled: {
      width: "500px",
      height: "60px",
      position: "relative",
      top: "0",
      left: "0",
      transform: "translateX(0)",
      transition: {
        type: "spring",
        stiffness: 1000,
        damping: 100,
      },
    },
  };

  return (
    <Box
      position="fixed"
      top="0"
      width="100%"
      bg={bgColor}
      boxShadow={isScrolled ? "md" : "none"}
      zIndex="1000"
      transition="box-shadow 0.8s ease"
    >
      <Flex
        align="center"
        justify="space-between"
        padding={4}
        maxW="1200px"
        margin="0 auto"
        position="relative"
      >
        {/* Logo */}
        <Box fontWeight="bold" fontSize="xl">
          Logo
        </Box>

        {/* Search Bar (always present, moves with animation) */}
        <MotionBox
          variants={searchVariants}
          initial="initial"
          animate={isScrolled ? "scrolled" : "initial"}
          bg={searchBgColor}
          padding={2}
          borderRadius="md"
          boxShadow="sm"
          display="flex"
          alignItems="center"
        >
          <Input
            placeholder="Search for rooms..."
            size="md"
            borderRadius="md"
            bg={inputBgColor}
            mr={2}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Button colorScheme="teal">Search</Button>
        </MotionBox>

        {/* Login and Sign Up Buttons */}
        <Flex align="center" gap={2}>
          <Button variant="ghost">Login</Button>
          <Button colorScheme="teal">Sign Up</Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
