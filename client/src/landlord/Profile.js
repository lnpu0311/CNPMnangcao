import React from "react";
import {
  Box,
  Avatar,
  Text,
  VStack,
  Divider,
  HStack,
  Button,
} from "@chakra-ui/react";

function ProfilePage() {
  // Dữ liệu mẫu
  const user = {
    name: "Pukachu",
    email: "pukachu@example.com",
    phone: "0123456789",
    password: "******", // Mật khẩu không hiển thị
    avatar: "https://bit.ly/broken-link", // Thay thế bằng đường dẫn tới ảnh đại diện của bạn
  };

  return (
    <Box h={"4xl"} maxW="md" mx="auto" p={4} textAlign="center">
      <Avatar size="2xl" name={user.name} src={user.avatar} mb={4} />
      <Text fontSize="2xl" fontWeight="bold">
        {user.name}
      </Text>
      <Divider my={4} />
      <VStack spacing={4}>
        <HStack justify="space-between" width="100%">
          <Text fontWeight="medium">Email:</Text>
          <Text>{user.email}</Text>
        </HStack>
        <HStack justify="space-between" width="100%">
          <Text fontWeight="medium">Số điện thoại:</Text>
          <Text>{user.phone}</Text>
        </HStack>
        <HStack justify="space-between" width="100%">
          <Text fontWeight="medium">Mật khẩu:</Text>
          <Text>{user.password}</Text>
        </HStack>
      </VStack>
      <Divider my={4} />
      <Button colorScheme="blue" mt={4}>
        Chỉnh sửa thông tin
      </Button>
    </Box>
  );
}

export default ProfilePage;
