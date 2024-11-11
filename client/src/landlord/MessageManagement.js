import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Divider,
  useToast,
  Flex,
} from "@chakra-ui/react";
import axios from "axios";
import Chat from "../components/Chat";
import { jwtDecode } from 'jwt-decode';

const MessageManagement = () => {
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const toast = useToast();

  // Set token and current user from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      const decodedUser = jwtDecode(storedToken);
      setCurrentUser({
        id: decodedUser.id,
        name: decodedUser.name
      });
    }
  }, []);

  // Fetch unread messages
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        if (!token) return;
        
        const response = await axios.get(
          `${process.env.REACT_APP_API}/messages/unread`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUnreadMessages(response.data.data);
      } catch (error) {
        console.error("Error fetching unread messages:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải tin nhắn. Vui lòng thử lại sau.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    if (currentUser) {
      fetchUnreadMessages();
    }
  }, [currentUser, token, toast]);

  const handleSelectTenant = (tenant) => {
    if (!currentUser) {
      toast({
        title: "Lỗi",
        description: "Vui lòng đăng nhập lại",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setSelectedTenant(tenant);
    setShowChat(true);
  };

  return (
    <Flex h="100vh" p={4}>
      {/* Danh sách tin nhắn */}
      <Box w="300px" borderRight="1px" borderColor="gray.200" pr={4}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Tin nhắn chưa đọc
        </Text>
        <VStack spacing={3} align="stretch">
          {unreadMessages.map((message) => (
            <Box
              key={message._id}
              p={3}
              bg="gray.50"
              borderRadius="md"
              cursor="pointer"
              _hover={{ bg: "gray.100" }}
              onClick={() =>
                handleSelectTenant({
                  id: message.senderId._id,
                  name: message.senderId.name,
                })
              }
            >
              <HStack spacing={3}>
                <Avatar size="sm" name={message.senderId.name} />
                <Box flex={1}>
                  <Text fontWeight="bold">{message.senderId.name}</Text>
                  <Text noOfLines={1} fontSize="sm">
                    {message.content}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {new Date(message.timestamp).toLocaleString()}
                  </Text>
                </Box>
              </HStack>
            </Box>
          ))}
        </VStack>
      </Box>

      {/* Chat area */}
      <Box flex={1} pl={4}>
        {showChat && currentUser && selectedTenant && (
          <Chat
            currentUserId={currentUser.id}
            recipientId={selectedTenant.id}
            recipientName={selectedTenant.name}
            onClose={() => setShowChat(false)}
          />
        )}
      </Box>
    </Flex>
  );
};

export default MessageManagement;
