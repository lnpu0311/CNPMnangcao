import React, { useState } from "react";
import {
  Box,
  Avatar,
  Text,
  VStack,
  Divider,
  HStack,
  Button,
  Input,
  useToast,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";

function ProfilePage() {
  const toast = useToast();

  // Dữ liệu mẫu
  const [user, setUser] = useState({
    name: "Pukachu",
    email: "pukachu@example.com",
    phone: "0123456789",
    dob: "2000-01-01",
    password: "******",
    avatar: "https://bit.ly/broken-link",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newAvatar, setNewAvatar] = useState(null);

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "dob") {
      const formattedDate = new Date(value).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      setUser((prevUser) => ({ ...prevUser, [name]: formattedDate }));
    } else {
      setUser((prevUser) => ({ ...prevUser, [name]: value }));
    }
  };

  // Cập nhật ảnh đại diện
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setNewAvatar(URL.createObjectURL(file));
  };

  const handleSave = () => {
    if (newAvatar) {
      setUser((prev) => ({ ...prev, avatar: newAvatar }));
    }
    setNewAvatar(null);
    setIsEditing(false);
    toast({
      title: "Thông tin đã được cập nhật!",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box h={"4xl"} maxW="md" mx="auto" p={4} textAlign="center">
      <Avatar
        name={user.name}
        size="2xl"
        src={newAvatar || user.avatar}
        mb={4}
      />
      {isEditing ? (
        <Input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          mb={4}
        />
      ) : null}
      {isEditing ? (
        <Input
          width="70%"
          name="name"
          value={user.name}
          onChange={handleChange}
          fontSize="2xl"
          fontWeight="bold"
          mb={2}
          textAlign="center"
          placeholder="Tên của bạn"
        />
      ) : (
        <Text fontSize="2xl" fontWeight="bold">
          {user.name}
        </Text>
      )}
      <Divider my={4} />
      <VStack spacing={4}>
        <HStack justify="space-between" width="100%">
          <Text fontWeight="medium">Email:</Text>
          {isEditing ? (
            <Input
              width="70%"
              name="email"
              value={user.email}
              onChange={handleChange}
              size="sm"
            />
          ) : (
            <Text>{user.email}</Text>
          )}
        </HStack>
        <HStack justify="space-between" width="100%">
          <Text fontWeight="medium">Số điện thoại:</Text>
          {isEditing ? (
            <Input
              width="70%"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              size="sm"
            />
          ) : (
            <Text>{user.phone}</Text>
          )}
        </HStack>
        <HStack justify="space-between" width="100%">
          <Text fontWeight="medium">Ngày sinh:</Text>
          {isEditing ? (
            <Input
              width="70%"
              name="dob"
              type="date"
              value={user.dob}
              onChange={handleChange}
              size="sm"
            />
          ) : (
            <Text>{user.dob}</Text>
          )}
        </HStack>
        <HStack justify="space-between" width="100%">
          <Text fontWeight="medium">Mật khẩu:</Text>
          {isEditing ? (
            <Input
              name="phone"
              value={user.phone}
              onChange={handleChange}
              width="70%"
            />
          ) : (
            <Text>******</Text>
          )}
        </HStack>
      </VStack>
      <Divider my={4} />
      <Button
        colorScheme="blue"
        mt={4}
        onClick={isEditing ? handleSave : toggleEdit}
      >
        {isEditing ? "Lưu thay đổi" : "Chỉnh sửa thông tin"}
      </Button>
      {isEditing && (
        <Button colorScheme="gray" mt={4} ml={2} onClick={toggleEdit}>
          Hủy
        </Button>
      )}
    </Box>
  );
}

export default ProfilePage;
