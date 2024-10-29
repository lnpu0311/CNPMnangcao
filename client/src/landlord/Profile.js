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
  IconButton,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";

function ProfilePage() {
  const toast = useToast();

  // Sample user data
  const [originalUser, setOriginalUser] = useState({
    name: "Pukachu",
    email: "pukachu@example.com",
    phone: "0123456789",
    dob: "2000-01-01",
    password: "******",
    avatar: "https://bit.ly/broken-link",
  });

  const [user, setUser] = useState(originalUser);
  const [isEditing, setIsEditing] = useState(false);
  const [newAvatar, setNewAvatar] = useState(null);

  const toggleEdit = () => {
    if (isEditing) {
      // If canceling, revert to original user data
      setUser(originalUser);
    } else {
      // Store the original user data when editing starts
      setOriginalUser(user);
    }
    setIsEditing(!isEditing);
  };

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

  // Update avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAvatar(URL.createObjectURL(file));
    }
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
    <Box maxW="md" mx="auto" p={4} textAlign="center">
      <Box position="relative" display="inline-block">
        <Avatar
          name={user.name}
          size="2xl"
          src={newAvatar || user.avatar}
          mb={4}
        />
        {isEditing && (
          <IconButton
            icon={<EditIcon />}
            position="absolute"
            bottom={3}
            left={20}
            onClick={() => document.getElementById("avatar-input").click()}
            aria-label="Chỉnh sửa avatar"
            size="sm"
            bg="rgba(0, 0, 0, 0.5)"
            color="white"
            borderRadius="50%"
            _hover={{ bg: "rgba(0, 0, 0, 0.7)" }}
            _focus={{ outline: "none" }}
          />
        )}
        <input
          id="avatar-input"
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          style={{ display: "none" }}
        />
      </Box>

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
              name="password"
              value={user.password}
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
