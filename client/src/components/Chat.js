import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Avatar,
  IconButton,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter
} from '@chakra-ui/react';
import { ChatIcon, CloseIcon, DeleteIcon } from '@chakra-ui/icons';
import io from 'socket.io-client';
import axios from 'axios';

const Chat = ({ currentUserId, recipientId, recipientName }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const toast = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.emit('login', currentUserId);

    newSocket.on('receive_message', (message) => {
      console.log('Received message:', message);
      if (message.recipientId === currentUserId) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      }
    });

    newSocket.on('message_sent', (response) => {
      console.log('Message sent response:', response);
      if (!response.success) {
        toast({
          title: "Lỗi gửi tin nhắn",
          description: response.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    });

    return () => newSocket.close();
  }, [currentUserId, recipientId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!recipientId || typeof recipientId === 'object') {
        console.error('Invalid recipientId:', recipientId);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/messages/history/${recipientId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setMessages(response.data.data);
        scrollToBottom();
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (isOpen && recipientId) {
      fetchMessages();
    }
  }, [recipientId, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !socket || !currentUserId || !recipientId) {
      console.log('Missing data:', {
        message: newMessage,
        socket: !!socket,
        currentUserId,
        recipientId
      });
      return;
    }

    try {
      // Chuẩn bị dữ liệu tin nhắn
      const messageData = {
        senderId: currentUserId,
        recipientId: recipientId,
        content: newMessage.trim()
      };

      console.log('Sending message:', messageData);

      // Gửi tin nhắn qua socket
      socket.emit('send_message', messageData);

      // Thêm tin nhắn vào UI ngay lập tức
      const tempMessage = {
        ...messageData,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, tempMessage]);
      
      // Xóa nội dung tin nhắn
      setNewMessage('');
      scrollToBottom();

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Lỗi",
        description: "Không thể gửi tin nhắn",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API}/messages/delete-conversation`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          data: {
            recipientId: recipientId
          }
        }
      );

      if (response.data.success) {
        setMessages([]);
        toast({
          title: "Thành công",
          description: "Đã xóa tin nhắn",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setIsOpen(false);
        onModalClose();
      }
    } catch (error) {
      console.error('Error deleting messages:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa tin nhắn",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteClick = () => {
    onModalOpen();
  };

  if (!isOpen) return null;

  return (
    <>
      <Box
        position="fixed"
        bottom="20px"
        right="20px"
        width="300px"
        height="400px"
        bg="white"
        borderRadius="lg"
        boxShadow="xl"
        zIndex={1000}
      >
        <HStack p={3} bg="blue.500" color="white" justify="space-between">
          <Text fontWeight="bold">{recipientName}</Text>
          <HStack>
            <IconButton
              icon={<DeleteIcon />}
              size="sm"
              variant="ghost" 
              color="white"
              onClick={handleDeleteClick}
              title="Xóa cuộc trò chuyện"
            />
            <IconButton
              icon={<CloseIcon />}
              size="sm"
              variant="ghost"
              color="white"
              onClick={() => setIsOpen(false)}
            />
          </HStack>
        </HStack>

        <VStack height="300px" overflowY="auto" p={4} spacing={4}>
          {messages.map((msg, index) => (
            <HStack
              key={index}
              w="100%"
              justify={msg.senderId === currentUserId ? 'flex-end' : 'flex-start'}
            >
              {msg.senderId !== currentUserId && (
                <Avatar size="sm" name={recipientName} />
              )}
              <Box
                maxW="70%"
                bg={msg.senderId === currentUserId ? 'blue.500' : 'gray.100'}
                color={msg.senderId === currentUserId ? 'white' : 'black'}
                p={2}
                borderRadius="lg"
              >
                <Text>{msg.content}</Text>
                <Text fontSize="xs" opacity={0.8}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </Text>
              </Box>
            </HStack>
          ))}
          <div ref={messagesEndRef} />
        </VStack>

        <HStack p={3} bg="gray.50">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button colorScheme="blue" onClick={sendMessage}>
            Gửi
          </Button>
        </HStack>
      </Box>

      <Modal isOpen={isModalOpen} onClose={onModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Xác nhận xóa</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Bạn có chắc chắn muốn xóa toàn bộ tin nhắn với {recipientName}?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDeleteConfirm}>
              Xóa
            </Button>
            <Button variant="ghost" onClick={onModalClose}>
              Hủy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Chat;