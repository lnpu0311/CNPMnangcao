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
import TenantRoomList from "./TenantRoomList";
import TenantContract from "./TenantContract.js";
import TenantPayments from "./TenantPayments";
import TenantDashboard from "./TenantDashboard";
import "../../src/index.css";
import { Link as RouterLink } from "react-router-dom";
import { IoHomeSharp } from "react-icons/io5";

const MotionBox = motion.create(Box);

function TenantHome() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [hasNewNotification, setHasNewNotification] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(true);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "", // Thông tin người dùng
  });
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleMenuClick = (content) => {
    onClose();
  };

  const handleEditProfile = () => {
    navigate(`/profile-page`);
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

  const searchVariants = {
    initial: {
      width: "30%", // Giảm kích thước xuống
      height: "40px",
      position: "relative", // Thay đổi thành relative
      top: "0",
      left: "0",
      transform: "none",
    },
    // scrolled: {
    //   width: "300px",
    //   height: "40px",
    //   position: "relative",
    //   top: "0",
    //   left: "0",
    //   transform: "translateX(0)",
    //   transition: {
    //     type: "spring",
    //     stiffness: 1000,
    //     damping: 100,
    //   },
    // },
  };

  // Cập nhật menu items cho Tenant
  const menuItems = [
    { name: "Trang chủ", path: "/tenant", icon: <IoHomeSharp /> },
    {
      name: "Danh sách phòng",
      path: "room-list",
      icon: <FaBuilding />,
    },
    {
      name: "Thông tin hợp đồng",
      path: "contract",
      icon: <FaFileInvoiceDollar />,
    },
    {
      name: "Lịch sử thanh toán",
      path: "payments",
      icon: <FaMoneyCheckAlt />,
    },
  ];

  const settingsItem = {
    name: "Cài đặt",
    path: "settings",
    icon: <FaCog />,
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
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
        h="70px"
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
          <RouterLink to="/">
            <Text
              bgGradient="linear(to-l, #9fccfa, #0974f1)"
              bgClip="text"
              fontSize={{ base: "2xl", md: "2xl", lg: "4xl" }}
              fontWeight="bold"
            >
              Hostel Community
            </Text>
          </RouterLink>
        </Box>

        {/* Trang chủ trên header */}
        {/* <HStack 
          spacing={4} 
          display={{ base: "none", md: "flex" }}
          ml={8}
        >
        <NavLink
          to="/tenant"
          style={({ isActive }) => ({
            color: isActive ? "#0974f1" : "inherit",
            textDecoration: "none"
          })}
        >
          <Button
            leftIcon={<IoHomeSharp />}
            variant="ghost"
            _hover={{ bg: "gray.300" }}
          >
            Trang chủ
          </Button>
        </NavLink>
      </HStack> */}

        {/* Searchbar */}
        <MotionBox
          variants={searchVariants}
          initial="initial"
          animate={isScrolled ? "scrolled" : "initial"}
          border={1}
          padding={2}
          boxShadow="sm"
          display={{ base: "none", md: "flex" }}
          alignItems="center"
        >
          <Input
            placeholder="Tìm kiếm phòng..."
            size="sm"
            borderRadius="md"
            bg="white"
            mr={2}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Button bg="brand.500" size="sm">
            Tìm
          </Button>
        </MotionBox>

        {/* Right Section */}
        <Flex alignItems="center" gap={4}>
          <Button
            onClick={toggleColorMode}
            variant="ghost"
            display={{ base: "none", md: "flex" }}
          >
            {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            <Text ml={2}>
              {" "}
              {/* Thêm khoảng cách giữa icon và text */}
              {colorMode === "light" ? "Dark Mode" : "Light Mode"}
            </Text>
          </Button>

          <Box position="relative">
            <IconButton
              color="brand.1"
              aria-label="Notifications"
              icon={<BellIcon />}
              variant="ghost"
              _hover={{ bg: "gray.300" }}
            />
            {hasNewNotification && (
              <Badge
                bg="red"
                color="white"
                position="absolute"
                top="-2px"
                right="-2px"
                borderRadius="full"
                boxSize="12px"
                border="2px solid white"
              />
            )}
          </Box>

          {/* User Menu */}
          <Menu>
            <MenuButton>
              <Avatar size="sm" name={userData.name} cursor="pointer" />
            </MenuButton>
            <MenuList>
              {/* Các chức năng chính */}
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

              <MenuDivider />

              {/* Cài đặt và thông tin cá nhân */}
              <MenuItem icon={<FaCog />} as={RouterLink} to={settingsItem.path}>
                {settingsItem.name}
              </MenuItem>

              <MenuItem icon={<EditIcon />} onClick={handleEditProfile}>
                Chỉnh sửa thông tin cá nhân
              </MenuItem>

              <MenuItem
                icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
              >
                {colorMode === "light" ? "Dark Mode" : "Light Mode"}
              </MenuItem>

              <MenuDivider />

              {/* Đăng xuất */}
              <MenuItem icon={<ArrowForwardIcon />} onClick={handleLogout}>
                Đăng xuất
              </MenuItem>
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
                {/* Mobile Search */}
                <InputGroup>
                  <Input placeholder="Tìm kiếm phòng..." />
                  <InputRightElement>
                    <IconButton icon={<SearchIcon />} variant="ghost" />
                  </InputRightElement>
                </InputGroup>

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

                <Divider />

                {/* Mobile Settings */}
                <Button
                  leftIcon={<FaCog />}
                  variant="ghost"
                  w="100%"
                  justifyContent="flex-start"
                  as={RouterLink}
                  to={settingsItem.path}
                  onClick={onClose}
                >
                  {settingsItem.name}
                </Button>

                {/* Mobile Theme Toggle */}
                <Button
                  leftIcon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                  onClick={toggleColorMode}
                  variant="ghost"
                  w="100%"
                  justifyContent="flex-start"
                >
                  {colorMode === "light" ? "Dark Mode" : "Light Mode"}
                </Button>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </GridItem>

      {/* Sidebar */}
      {/* <GridItem
        as="nav"
        p="2"
        bg="brand.900"
        area="nav"
        display={{ base: "none", md: "block" }}
        w={isNavOpen ? "auto" : "60px"}
        position="fixed"
        h={"100%"}
      >
        <VStack align="start" mt={2} h="100%" justifyContent="space-between">
          <Flex justify="space-between" width="100%">
           
            <Image
              src="../house.png"
              alt="Logo"
              boxSize="100px"
              mx="auto"
              transition="transform 0.2s"
              _hover={{ transform: "scale(1.1)" }}
              display={isNavOpen ? "block" : "none"}
            />
            <IconButton
              aria-label="Toggle Nav"
              icon={isNavOpen ? <FaChevronLeft /> : <FaChevronRight />}
              onClick={toggleNav}
              variant="ghost"
            />
          </Flex>

          {menuItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                isActive ? "navlink active-navlink" : "navlink"
              }
              to={item.path}
              key={item.name}
            >
              <Flex
                alignItems="center"
                justifyContent={isNavOpen ? "start" : "center"}
              >
                {item.icon}
                <Collapse in={isNavOpen} animateOpacity>
                  <Text>{item.name}</Text>
                </Collapse>
              </Flex>
            </NavLink>
          ))}

         
          <Divider borderColor="black" borderWidth="1px" />
          <Flex justifyContent="center" width="100%" mb={2}>
            {" "}
            
            <NavLink
              className={({ isActive }) =>
                isActive ? "navlink active-navlink" : "navlink"
              }
              to={settingsItem.path}
              key={settingsItem.name}
            >
              <Flex alignItems="center" justifyContent="center">
                {settingsItem.icon}
                <Collapse in={isNavOpen} animateOpacity>
                  <Text>{settingsItem.name}</Text>
                </Collapse>
              </Flex>
            </NavLink>
          </Flex>
        </VStack>
      </GridItem> */}

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
        mt="auto" // Đẩy footer xuống dưới cùng
      >
        <Box maxW="1200px" mx="auto" py={10} px={{ base: 4, md: 6 }}>
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={8}>
            {/* Thông tin liên hệ */}
            <VStack align="start" spacing={3}>
              <Text fontSize="xl" fontWeight="bold" mb={2}>
                Liên hệ với chúng tôi
              </Text>
              <Text>Hotline: 0123456789</Text>
              <Text>Email: info@hostel.com</Text>
              <Text>
                Địa chỉ: 69/68 Đặng Thùy Trâm, P.13, Q. Bình Thạnh, TP. HCM
              </Text>
              <Text></Text>
            </VStack>

            {/* Links */}
            <VStack align="start" spacing={3}>
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
                <Link href="https://facebook.com" isExternal>
                  <Icon
                    as={FaFacebook}
                    boxSize={6}
                    _hover={{ color: "blue.400", transform: "scale(1.1)" }}
                    transition="all 0.3s"
                  />
                </Link>
                <Link href="https://youtube.com" isExternal>
                  <Icon
                    as={FaYoutube}
                    boxSize={6}
                    _hover={{ color: "red.400", transform: "scale(1.1)" }}
                    transition="all 0.3s"
                  />
                </Link>
                <Link href="https://instagram.com" isExternal>
                  <Icon
                    as={FaInstagram}
                    boxSize={6}
                    _hover={{ color: "pink.400", transform: "scale(1.1)" }}
                    transition="all 0.3s"
                  />
                </Link>
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
