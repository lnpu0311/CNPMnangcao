import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Stack,
  Text,
  Flex,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [signinIn, setSigninIn] = useState(location.pathname === "/login");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setSigninIn(location.pathname === "/login");

    const savedFormData = JSON.parse(localStorage.getItem("formData"));

    if (savedFormData) {
      setFormData((prevData) => ({
        ...prevData,
        ...savedFormData,
        role:
          savedFormData.role ||
          (location.pathname === "/register" ? "tenant" : ""),
      }));
    } else if (location.pathname === "/register") {
      setFormData((prevData) => ({ ...prevData, role: "tenant" }));
    }
  }, [location.pathname]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    localStorage.setItem("formData", JSON.stringify(updatedData));
  };

  const handleFormToggle = () => {
    if (signinIn) {
      navigate("/register");
    } else {
      navigate("/login");
    }

    setFormData((prevData) => ({
      ...prevData,
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      role:
        prevData.role || (location.pathname === "/register" ? "tenant" : ""),
    }));
    setErrors({});
  };
  const validateForm = () => {
    const newErrors = {};
    if (signinIn) {
      if (!formData.email) newErrors.email = "Vui lòng điền Email!";
      if (!formData.password) newErrors.password = "Vui lòng điền mật khẩu!";
    } else {
      if (!formData.name) newErrors.name = "Vui lòng điền tên!";
      if (!formData.phone) newErrors.phone = "Vui lòng điền số điện thoại!";
      if (!formData.email) newErrors.email = "Vui lòng điền email!";
      if (!formData.password) newErrors.password = "Vui lòng điền mật khẩu!";
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Mật khẩu không khớp.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validateForm()) {
      console.log("Logging in with:", formData);
    }
  };

  const handleRegister = () => {
    if (validateForm()) {
      console.log("Registering with:", formData);
    }
  };

  return (
    <Flex bg="white" height="100vh" align="center" justify="flex-end" p={10}>
      <Box
        position="relative"
        overflow="hidden"
        flex="4" // 4 parts for the left side
        minHeight="550px"
        textAlign="center"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={6}
        mr={6} // Add margin to separate from the forms
      >
        <img src="../eco-house-black.png" alt="Eco Green" width="50%" />
        <Text
          mt={4}
          fontSize="xxx-large"
          fontWeight="bold"
          bgGradient="linear(to-l, #07c8f9, #0d41e1)"
          bgClip="text"
        >
          Hostel Community
        </Text>
      </Box>
      <Box
        borderRadius="10px"
        boxShadow="dark-lg"
        position="relative"
        overflow="hidden"
        width="800px"
        maxWidth="90%"
        minHeight="650px"
      >
        <Flex
          position="absolute"
          top="0"
          left="0"
          right="0"
          width="100%"
          height="100%"
        >
          {/* Sign In Form */}
          <Box
            alignContent={"center"}
            position="absolute"
            left={signinIn ? "50%" : "-100%"}
            right={signinIn ? "0" : "200%"}
            transition="all 0.8s cubic-bezier(0.65, 0.05, 0.36, 1)"
            width="50%"
            height="100%"
            p={10}
            opacity={signinIn ? 1 : 0}
            zIndex={signinIn ? 2 : 1}
          >
            <Heading textAlign={"center"} size="lg" mb={6} color="blue.600">
              Đăng Nhập
            </Heading>
            <>
              <FormControl
                variant="floating"
                isRequired
                isInvalid={!!errors.email}
                mb={4}
              >
                <Input
                  color={"black"}
                  name="email"
                  type="email"
                  placeholder=" "
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <FormLabel textColor={"black"}>Email</FormLabel>
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              <FormControl
                variant="floating"
                isRequired
                isInvalid={!!errors.password}
                mb={4}
              >
                <Input
                  color={"black"}
                  name="password"
                  type="password"
                  placeholder=" "
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <FormLabel textColor={"black"}>Mật khẩu</FormLabel>
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>
            </>
            <Button
              bgGradient="linear(to-r, #07c8f9, #0d41e1)"
              _hover={{ bgGradient: "linear(to-l, #07c8f9, #0d41e1)" }}
              width="100%"
              mt={4}
              onClick={handleLogin}
            >
              Đăng Nhập
            </Button>
          </Box>

          {/* Sign Up Form */}
          <Box
            alignContent={"center"}
            position="absolute"
            left={signinIn ? "100%" : "0"}
            transition="all 0.8s cubic-bezier(0.65, 0.05, 0.36, 1)" // More fluid curve
            width="50%"
            height="100%"
            p={10}
            opacity={!signinIn ? 1 : 0}
            zIndex={!signinIn ? 2 : 1}
          >
            <Heading textAlign={"center"} size="lg" mb={6} color="blue.600">
              Đăng Ký
            </Heading>
            <>
              <FormControl
                variant="floating"
                isRequired
                isInvalid={!!errors.name}
                mb={4}
              >
                <Input
                  name="name"
                  type="text"
                  placeholder=" "
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <FormLabel textColor={"black"}>Tên</FormLabel>
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>

              <FormControl
                variant="floating"
                isRequired
                isInvalid={!!errors.phone}
                mb={4}
              >
                <Input
                  name="phone"
                  type="tel"
                  placeholder=" "
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                <FormLabel textColor={"black"}>Số điện thoại</FormLabel>
                <FormErrorMessage>{errors.phone}</FormErrorMessage>
              </FormControl>

              <FormControl
                variant="floating"
                isRequired
                isInvalid={!!errors.email}
                mb={4}
              >
                <Input
                  name="email"
                  type="email"
                  placeholder=" "
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <FormLabel textColor={"black"}>Email</FormLabel>
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.role} mb={4}>
                <FormLabel textColor={"black"}>Bạn là</FormLabel>
                <RadioGroup
                  name="role"
                  value={formData.role}
                  onChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <Stack textColor={"black"} direction="row">
                    <Radio value="tenant">Khách thuê phòng</Radio>
                    <Radio value="landlord">Chủ nhà</Radio>
                  </Stack>
                </RadioGroup>
                <FormErrorMessage>{errors.role}</FormErrorMessage>
              </FormControl>

              <FormControl
                variant="floating"
                isRequired
                isInvalid={!!errors.password}
                mb={4}
              >
                <Input
                  name="password"
                  type="password"
                  placeholder=" "
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <FormLabel textColor={"black"}>Mật khẩu</FormLabel>
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>

              <FormControl
                variant="floating"
                isRequired
                isInvalid={!!errors.confirmPassword}
                mb={4}
              >
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder=" "
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <FormLabel textColor={"black"}>Nhập lại mật khẩu</FormLabel>
                <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
              </FormControl>
            </>
            <Button
              bgGradient="linear(to-r, #07c8f9, #0d41e1)"
              _hover={{ bgGradient: "linear(to-l, #07c8f9, #0d41e1)" }}
              width="100%"
              mt={4}
              onClick={handleRegister}
            >
              Đăng Ký
            </Button>
          </Box>
        </Flex>

        {/* Overlay Panel */}
        <Box
          zIndex={8}
          position="absolute"
          top="0"
          left="50%"
          width="50%"
          height="100%"
          transition="all 0.8s cubic-bezier(0.65, 0.05, 0.36, 1)"
          transform={signinIn ? "translateX(-100%)" : "translateX(0)"}
          bgGradient={"linear(to-r, #0968e5, #091970)"}
          color="white"
          p={8}
          display="flex"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
        >
          <Stack spacing={6}>
            <Heading size="md">
              {signinIn ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
            </Heading>
            <Text>
              {signinIn
                ? "Hãy đăng ký để có thể sử dụng dịch vụ của chúng tôi."
                : "Hãy đăng nhập để sử dụng dịch vụ của chúng tôi."}
            </Text>
            <Button
              variant="outline"
              colorScheme="blue"
              textColor="white"
              _hover={{ textColor: "blue.600", bg: "brand.0" }}
              onClick={handleFormToggle}
            >
              {signinIn ? "Đăng Ký" : "Đăng Nhập"}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Flex>
  );
};

export default AuthForm;
