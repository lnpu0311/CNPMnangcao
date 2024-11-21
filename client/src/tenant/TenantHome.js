import React, { useState, useEffect } from "react";
import {
  Grid,
  GridItem,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  Box,
  Badge,
  Image,
  Text,
  Collapse,
  Button,
  Container,
  useColorMode,
  Divider,
  Input,
  Icon,
  Stack,
  HStack,
  MenuDivider,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { debounce } from "lodash";
import {
  HamburgerIcon,
  BellIcon,
  StarIcon,
  ArrowForwardIcon,
  EditIcon,
  MoonIcon,
  SunIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import {
  FaBuilding,
  FaUserTie,
  FaFileInvoiceDollar,
  FaChartLine,
  FaMoneyCheckAlt,
  FaChevronRight,
  FaChevronLeft,
  FaPeopleArrows,
  FaPeopleCarry,
  FaCog,
  FaFacebook,
  FaYoutube,
  FaInstagram,
  FaCalendarAlt,
  FaCalendarCheck,
  FaEnvelope,
} from "react-icons/fa";
import {
  NavLink,
  Routes,
  Route,
  Outlet,
  BrowserRouter,
  useNavigate,
  Link,
} from "react-router-dom";
import BillList from "./BillList";

import "../../src/index.css";
import { Link as RouterLink } from "react-router-dom";
import { IoHomeSharp } from "react-icons/io5";
import NotificationBell from "../components/NotificationBell";
import { Link as ChakraLink } from "@chakra-ui/react";

const MotionBox = motion.create(Box);

function TenantHome() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(true);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "Tenant", // Thông tin người dùng
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleEditProfile = () => {
    navigate(`/tenant/profile-page`);
    onClose();
  };

  const [isScrolled, setIsScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    setIsScrolled(scrollTop > 50);
  };

  useEffect(() => {
    const debouncedHandleScroll = debounce(handleScroll, 20);
    window.addEventListener("scroll", debouncedHandleScroll);
    return () => window.removeEventListener("scroll", debouncedHandleScroll);
  }, []);

  // Cập nhật menu items cho Tenant
  const menuItems = [
    // { name: "Trang chủ", path: "/tenant", icon: <IoHomeSharp /> },
    // {
    //   name: "Danh sách phòng",
    //   path: "room-list",
    //   icon: <FaBuilding />,
    // },
    {
      name: "Thông tin hợp đồng",
      path: "contract",
      icon: <FaFileInvoiceDollar />,
    },
    {
      name: "Lịch sử đặt phòng",
      path: "bookings",
      icon: <FaCalendarCheck />,
    },
    {
      name: "Tin nhắn",
      path: "messages",
      icon: <FaEnvelope />,
    },

    {
      name: "Lịch sử thanh toán",
      path: "payments",
      icon: <FaMoneyCheckAlt />,
    },
    {
      name: "Danh sách hóa đơn",
      path: "bills",
      icon: <FaFileInvoiceDollar />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate(`/login`);
  };

  return (
    <Grid
      templateAreas={{
        base: `"header"
              "main"
              "footer"`,
      }}
      gridTemplateRows={{ base: "70px 1fr auto" }}
      gridTemplateColumns="1fr"
      minH="100vh"
    >
      {/* header */}
      <GridItem
        h="100px"
        as="header"
        p={4}
        bg={"gray.200"}
        color={"black"}
        area="header"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        position="fixed"
        top={0}
        left={0}
        right={0}
        w="100%"
        zIndex={1}
      >
        {/* Logo */}
        <Box ml={{ base: "0", md: "4" }}>
          <RouterLink to="/tenant">
            <Text
              bgGradient="linear(to-l, #07c8f9, #0d41e1)"
              bgClip="text"
              fontSize={{ base: "2xl", md: "2xl", lg: "4xl" }}
              fontWeight="bold"
            >
              Hostel Community
            </Text>
          </RouterLink>
        </Box>

        <Flex alignItems="center" gap={8}>
          <NotificationBell />

          {/* User Menu */}
          <Menu>
            <MenuButton>
              <Avatar size="sm" name={userData.name} cursor="pointer" />
            </MenuButton>
            <MenuList>
              {/* Menu items chỉ hiển thị ở desktop */}
              <Box display={{ base: "none", md: "block" }}>
                {menuItems.map((item) => (
                  <MenuItem
                    key={item.name}
                    icon={item.icon}
                    as={RouterLink}
                    to={item.path}
                  >
                    {item.name}
                  </MenuItem>
                ))}

                <MenuDivider borderColor="black" borderWidth="1px" />
              </Box>

              <MenuItem icon={<EditIcon />} onClick={handleEditProfile}>
                Chỉnh sửa thông tin cá nhân
              </MenuItem>

              <Box display={{ base: "none", md: "block" }}>
                <MenuItem icon={<ArrowForwardIcon />} onClick={handleLogout}>
                  Đăng xuất
                </MenuItem>
              </Box>
            </MenuList>
          </Menu>
        </Flex>

        {/* Mobile Menu Button */}
        <IconButton
          aria-label="Open Menu"
          icon={<HamburgerIcon />}
          display={{ base: "flex", md: "none" }}
          onClick={onOpen}
          ml={2}
        />

        {/* Mobile Drawer */}
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerBody pt={10}>
              <VStack spacing={4} align="stretch">
                {/* Mobile Menu Items */}
                {menuItems.map((item) => (
                  <NavLink
                    to={item.path}
                    key={item.name}
                    onClick={onClose}
                    style={({ isActive }) => ({
                      color: isActive ? "#0974f1" : "inherit",
                      textDecoration: "none",
                    })}
                  >
                    <Button
                      leftIcon={item.icon}
                      variant="ghost"
                      w="100%"
                      justifyContent="flex-start"
                    >
                      {item.name}
                    </Button>
                  </NavLink>
                ))}

                <Divider borderColor="black" borderWidth="1px" />

                {/* Mobile Logout */}
                <Button
                  leftIcon={<ArrowForwardIcon />}
                  variant="ghost"
                  w="100%"
                  justifyContent="flex-start"
                  onClick={() => {
                    handleLogout();
                    onClose();
                  }}
                >
                  Đăng xuất
                </Button>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </GridItem>

      {/* Main */}
      <GridItem as="main" area="main" mt="4" p={8}>
        <Outlet />
      </GridItem>

      {/* Footer */}
      <GridItem
        as="footer"
        area="footer"
        w="100%"
        bg="gray.500"
        color="white"
        mt="auto"
      >
        <Box maxW="1200px" mx="auto" py={10} px={{ base: 4, md: 6 }}>
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={8}>
            {/* Thông tin liên hệ */}
            <VStack align="start" spacing={3}>
              <Text fontSize="xl" fontWeight="bold" mb={2}>
                Liên hệ với chúng tôi
              </Text>
              <Text textColor={"white"}>Hotline: 0123456789</Text>
              <Text textColor={"white"}>Email: info@hostel.com</Text>
              <Text textColor={"white"}>
                Địa chỉ: 69/68 Đặng Thùy Trâm, P.13, Q. Bình Thạnh, TP. HCM
              </Text>
            </VStack>

            {/* Links */}
            <VStack align="start" spacing={3} textColor={"white"}>
              <Text fontSize="xl" fontWeight="bold" mb={2}>
                Khám phá
              </Text>
              <Link href="/ve-chung-toi" _hover={{ color: "blue.300" }}>
                Về chúng tôi
              </Link>
              <Link href="/dich-vu" _hover={{ color: "blue.300" }}>
                Dịch vụ
              </Link>
              <Link href="/lien-he" _hover={{ color: "blue.300" }}>
                Liên hệ
              </Link>
            </VStack>

            {/* Social Media */}
            <VStack align="start" spacing={3}>
              <Text fontSize="xl" fontWeight="bold" mb={2}>
                Kết nối với chúng tôi
              </Text>
              <HStack spacing={4}>
                <ChakraLink href="https://facebook.com" isExternal>
                  <Icon
                    as={FaFacebook}
                    boxSize={6}
                    _hover={{ color: "blue.400", transform: "scale(1.1)" }}
                    transition="all 0.3s"
                  />
                </ChakraLink>
                <ChakraLink href="https://youtube.com" isExternal>
                  <Icon
                    as={FaYoutube}
                    boxSize={6}
                    _hover={{ color: "red.400", transform: "scale(1.1)" }}
                    transition="all 0.3s"
                  />
                </ChakraLink>
                <ChakraLink href="https://instagram.com" isExternal>
                  <Icon
                    as={FaInstagram}
                    boxSize={6}
                    _hover={{ color: "pink.400", transform: "scale(1.1)" }}
                    transition="all 0.3s"
                  />
                </ChakraLink>
              </HStack>
            </VStack>
          </Grid>

          {/* Divider */}
          <Divider my={6} borderColor="gray.600" />

          {/* Copyright */}
          <Text fontSize="sm" color="gray.400" textAlign="center">
            © 2024 Hostel Community.
          </Text>
        </Box>
      </GridItem>
    </Grid>
  );
}

export default TenantHome;
