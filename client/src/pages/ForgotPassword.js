import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
} from "@chakra-ui/react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Mật khẩu mới:", newPassword);
  };

  return (
    <Box
      maxWidth="400px"
      mx="auto"
      mt="100px"
      p={4}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
    >
      <Heading textAlign={"center"} size="md" mb={6} color="blue.600">
        Quên Mật Khẩu
      </Heading>
      <VStack spacing={4} as="form" onSubmit={handleSubmit}>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
          />
        </FormControl>

        <FormControl id="new-password" isRequired>
          <FormLabel>Mật Khẩu Mới</FormLabel>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nhập mật khẩu mới"
          />
        </FormControl>

        <Button
          textColor={"white"}
          bgGradient="linear(to-r, #07c8f9, #0d41e1)"
          _hover={{ bgGradient: "linear(to-l, #07c8f9, #0d41e1)" }}
          width="100%"
          mt={3}
        >
          Xác Nhận
        </Button>
      </VStack>
    </Box>
  );
};

export default ForgotPassword;
