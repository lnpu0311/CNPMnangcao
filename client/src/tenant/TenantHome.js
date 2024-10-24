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


const MotionBox = motion(Box);

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
    { name: "Trang chủ", 
      path: "/tenant", 
      icon: <IoHomeSharp /> },
    {
      name: "Danh sách phòng",
      path: "/tenant-room-list",
      icon: <FaBuilding />,
    },
    {
      name: "Thông tin hợp đồng",
      path: "/tenant-contract",
      icon: <FaFileInvoiceDollar />,
    },
    {
      name: "Lịch sử thanh toán",
      path: "/tenant-payments",
      icon: <FaMoneyCheckAlt />,
    },
    
  ];

  const settingsItem = {
    name: "Cài đặt",
    path: "/settings",
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
               `,
        md: `"nav header"
             "nav main"
             `,
      }}
      gridTemplateRows={{ base: "auto 1fr ", md: "70px 1fr " }}
      gridTemplateColumns={{
        base: "1fr",
        md: isNavOpen ? "200px 1fr" : "50px 1fr",
      }}
      bg={"brand.2"}
      h="auto"
      gap={4}
      color="brand.500"
      fontWeight="bold"
      textAlign="center"
    >
      {/* header */}
      <GridItem
        h="70px"
        as="header"
        p={4}
        bg={"brand.0"}
        color={"black"}
        area="header"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        position="fixed"
        top={0}
        left={{ base: 0, md: isNavOpen ? "300px" : "60px" }}
        right={0}
        zIndex={1}
      >
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
        {/* Searchbar */}
        <MotionBox
          variants={searchVariants}
          initial="initial"
          animate={isScrolled ? "scrolled" : "initial"}
          border={1}
          padding={2}          
          boxShadow="sm"
          display="flex"
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
          <Button bg="brand.900" size="sm">Tìm</Button>
        </MotionBox>

        <Flex
          alignItems="center"
          gap={4}
          pr="4"
          display={{ base: "none", md: "flex" }}
        >
          {" "}
          <Button
            onClick={toggleColorMode}
            colorScheme="teal"
            variant="ghost"
            mr={4}
          >
            {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            {colorMode === "light" ? " Dark Mode" : " Light Mode"}
          </Button>
          
          <Box position="relative" mr={4}>
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
              p={0}
              display="flex"
              justifyContent="center"
              alignItems="center"
              />
            )}
          </Box>

          <Menu>
            <MenuButton>
              <Avatar size="sm" name={userData.name} cursor="pointer" />
            </MenuButton>
            <MenuList color="brown">
              <MenuItem onClick={handleEditProfile}>
                Chỉnh sửa thông tin cá nhân
              </MenuItem>
              <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
            </MenuList>
          </Menu>
          <Text>{userData.name}</Text>
        </Flex>
        <IconButton
          aria-label="Open Menu"
          icon={<HamburgerIcon />}
          display={{ base: "flex", md: "none" }}
          onClick={onOpen}
        />
      </GridItem>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody>
            <VStack align="start" spacing={4}>
              <Flex color={"white"} alignItems="center" gap={2}>
                <Avatar
                  size="sm"
                  name={userData.name}
                  src="https://bit.ly/broken-link"
                  cursor="pointer"
                />
                <Text fontWeight="bold">{userData.name}</Text>
                <IconButton
                  aria-label="Notifications"
                  icon={<BellIcon />}
                  variant="ghost"
                  _hover={{ bg: "gray.400" }}
                />
              </Flex>

              {menuItems.map((item) => (
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "navlink active-navlink" : "navlink"
                  }
                  to={item.path}
                  key={item.name}
                  onClick={() => {
                    handleMenuClick(item.name);
                    onClose();
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.classList.add("hover");
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.classList.remove("hover");
                  }}
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}
              <Button
                p={2}
                variant="ghost"
                onClick={handleEditProfile}
                leftIcon={<EditIcon />}
              >
                Chỉnh sửa thông tin cá nhân
              </Button>
              <Button
                p={2}
                variant="ghost"
                onClick={handleLogout}
                leftIcon={<ArrowForwardIcon />}
              >
                Đăng xuất
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* sidebar */}
      <GridItem
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
              {/* <Text
                color={"black"}
                mx="auto"
                fontSize="2xl"
                fontWeight="bold"
                display={isNavOpen ? "block" : "none"}
              >
                Menu
              </Text> */}
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
            </Flex >

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
                      <Text >{item.name}</Text>
                    </Collapse>
                  </Flex>
                </NavLink>
              ))}

            {/* Setting */}
            <Divider borderColor="black" borderWidth="1px"/>
            <Flex justifyContent="center" width="100%" mb={2}> {/* Căn giữa mục cài đặt và thêm marginBottom */}
              <NavLink
                className={({ isActive }) =>
                  isActive ? "navlink active-navlink" : "navlink"
                }
                to={settingsItem.path} 
                key={settingsItem.name}
              >
                <Flex
                  alignItems="center"
                  justifyContent="center" 
                >
                  {settingsItem.icon}
                  <Collapse in={isNavOpen} animateOpacity>
                    <Text>{settingsItem.name}</Text>
                  </Collapse>
                </Flex>
              </NavLink>
            </Flex>
            </VStack>

      </GridItem>

      <GridItem as="main" area="main" mt="4" p={8}>
        <Outlet />
      </GridItem>
    </Grid>
  );
}

export default TenantHome;
