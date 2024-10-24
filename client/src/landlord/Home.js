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
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
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
} from "react-icons/fa";
import {
  NavLink,
  Routes,
  Route,
  Outlet,
  BrowserRouter,
  useNavigate,
} from "react-router-dom";
import "../../src/index.css";
import { IoHomeSharp } from "react-icons/io5";
function HomeLayout() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [hasNewNotification, setHasNewNotification] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(true);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "Pukachu xinh dep tuyt voi",
  });
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
  const menuItems = [
    { name: "Trang chủ", path: "/", icon: <IoHomeSharp /> },
    {
      name: "Quản lý cơ sở",
      path: "/hostel-management",
      icon: <FaBuilding />,
    },
    {
      name: "Quản lý nhân viên",
      path: "/employee-management",
      icon: <FaUserTie />,
    },
    {
      name: "Quản lý yêu cầu thuê phòng",
      path: "/rental-request",
      icon: <FaFileInvoiceDollar />,
    },
    {
      name: "Thống kê doanh thu",
      path: "/revenue-stats",
      icon: <FaChartLine />,
    },
    {
      name: "Danh sách thanh toán",
      path: "/payment-list",
      icon: <FaMoneyCheckAlt />,
    },
    {
      name: "Danh sách khách thuê",
      path: "/customer-list",
      icon: <FaPeopleCarry />,
    },
  ];

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
               "main"  `,
        md: `"nav header"
             "nav main"`,
      }}
      gridTemplateRows={{ base: "auto 1fr ", md: "70px 1fr " }}
      gridTemplateColumns={{
        base: "1fr",
        md: isNavOpen ? "200px 1fr" : "50px 1fr",
      }}
      gap={4}
      bg={"brand.2"}
      h="auto"
      color="brand.500"
      fontWeight="bold"
      textAlign="center"
    >
      {/* header */}
      <GridItem
        h="70px"
        as="header"
        p={8}
        bg={"white"}
        color={"black"}
        area="header"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        position="fixed"
        top={0}
        left={{ base: 0, md: isNavOpen ? "300px" : "60px" }}
        right={0}
        zIndex={10}
      >
        <Box ml={{ base: "0", md: "4" }}>
          <Text
            bgGradient="linear(to-l, #07c8f9, #0d41e1)"
            bgClip="text"
            fontSize={{ base: "2xl", md: "2xl", lg: "4xl" }}
            fontWeight="bold"
          >
            Hostel Community
          </Text>
        </Box>

        <Flex
          alignItems="center"
          gap={4}
          pr="4"
          display={{ base: "none", md: "flex" }}
        >
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
                colorScheme="red"
                position="absolute"
                top="-1"
                right="-1"
                borderRadius="full"
                boxSize="10px"
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
        <DrawerContent textColor={"white"}>
          <DrawerCloseButton />
          <DrawerBody bg={"brand.300"}>
            <VStack align="start">
              <Flex alignItems="center" gap={2}>
                <Avatar
                  size="sm"
                  name={userData.name}
                  src="https://bit.ly/broken-link"
                  cursor="pointer"
                />
                <Text textColor={"white"} fontWeight="bold">
                  {userData.name}
                </Text>
                <IconButton
                  aria-label="Notifications"
                  icon={<BellIcon />}
                  variant="ghost"
                  _hover={{ bg: "gray.400" }}
                />
              </Flex>

              {menuItems.map((item) => (
                <NavLink
                  to={item.path}
                  key={item.name}
                  onClick={() => {
                    handleMenuClick(item.name);
                    onClose();
                  }}
                  style={{ width: "100%" }}
                >
                  {({ isActive }) => (
                    <Flex
                      borderRadius={8}
                      align="center"
                      gap={2}
                      padding="6px"
                      height="50px"
                      fontSize="18px"
                      fontWeight="600"
                      marginBlock="10px"
                      backgroundColor={isActive ? "brand.500" : "transparent"}
                      textColor={isActive ? "white" : "white"}
                      transition="background-color 0.2s ease"
                      _hover={{
                        backgroundColor: isActive ? "brand.600" : "#0077b6",
                        textColor: "whitesmoke",
                      }}
                    >
                      <Box as="span">{item.icon}</Box>
                      <Text>{item.name}</Text>
                    </Flex>
                  )}
                </NavLink>
              ))}
              <Divider my={4} />
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
        bg={"brand.800"}
        area="nav"
        display={{ base: "none", md: "block" }}
        w={isNavOpen ? "300px" : "60px"}
        position="fixed"
        h={"100%"}
      >
        <VStack align="start" spacing={4}>
          <Flex justify="space-between" width="100%">
            <Image
              src="../eco-house.png"
              alt="Logo"
              boxSize="150px"
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
              textColor={"white"}
            />
          </Flex>
          <Collapse in={isNavOpen}>
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
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </Collapse>
        </VStack>
      </GridItem>

      {/* content */}
      <GridItem
        as="main"
        area="main"
        ml={{ base: 0, md: isNavOpen ? "100px" : "40px" }}
        mt={{ base: 16, md: 0 }}
        p={1}
      >
        <Box bg={"white"} mr={{ base: "0", md: "20px" }} p={6}>
          <Outlet />
        </Box>
      </GridItem>
    </Grid>
  );
}

export default HomeLayout;
