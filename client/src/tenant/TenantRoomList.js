import React, { useState, useEffect } from "react";
import axios from 'axios';
import {
  Box,
  SimpleGrid,
  Image,
  Text,
  Tag,
  VStack,
  Heading,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  List,
  ListItem,
  ListIcon,
  Center,
  Spinner
} from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";

const TenantRoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/user/rooms`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success && Array.isArray(response.data.data)) {
          const formattedRooms = response.data.data.map(room => ({
            id: room._id,
            roomTitle: room.roomTitle || 'Không có tiêu đề',
            roomName: room.roomName || 'Không có tên',
            image: room.images && room.images.length > 0 
              ? room.images[0]
              : 'https://via.placeholder.com/200',
            address: room.hostelId 
              ? `${room.hostelId.address || ''}, ${room.hostelId.ward || ''}, ${room.hostelId.district || ''}, ${room.hostelId.city || ''}` 
              : 'Địa chỉ không có sẵn',
            status: room.status === 'available' ? 'Còn trống' : 'Đã thuê',
            price: room.price || 0,
            area: room.area || 0,
            description: room.description || 'Không có mô tả',
            deposit: room.deposit || 0,
            amenities: [
              "Wifi miễn phí",
              "Bảo vệ 24/7",
              "Chỗ để xe",
              "Tự do giờ giấc"
            ]
          }));
          setRooms(formattedRooms);
        } else {
          setRooms([]);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setRooms([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setIsOpenDetail(true);
  };

  return (
    <Box p={4}>
      <Center mb={4}>
        <Heading fontSize="2xl" fontWeight="bold">
          Danh sách phòng trọ
        </Heading>
      </Center>

      {isLoading ? (
        <Center>
          <Spinner size="xl" />
        </Center>
      ) : rooms.length === 0 ? (
        <Center>
          <Text>Không có phòng nào</Text>
        </Center>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
          {rooms.map((room) => (
            <Box
              key={room.id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="md"
              bg="white"
              onClick={() => handleRoomClick(room)}
              cursor="pointer"
              _hover={{ transform: 'scale(1.02)', transition: 'all 0.2s' }}
            >
              <Image
                src={room.image}
                alt={room.roomName}
                w="100%"
                h="200px"
                objectFit="cover"
                fallbackSrc="https://via.placeholder.com/200"
              />
              <VStack p={4} align="stretch" spacing={2}>
                <Text fontWeight="bold" fontSize="lg">
                  {room.roomTitle}
                </Text>
                <Flex alignItems="flex-start">
                  <Text fontWeight="bold" width="70px" flexShrink={0}>
                    Địa chỉ:
                  </Text>
                  <Text color="gray.600" fontSize="sm">
                    {room.address}
                  </Text>
                </Flex>
                <Flex justifyContent="space-between" alignItems="center">
                  <Text fontWeight="bold">Tình trạng:</Text>
                  <Tag colorScheme={room.status === "Còn trống" ? "green" : "red"}>
                    {room.status}
                  </Tag>
                </Flex>
                <Flex justifyContent="space-between">
                  <Text fontWeight="bold">Giá:</Text>
                  <Text>
                    {new Intl.NumberFormat('vi-VN', { 
                      style: 'currency', 
                      currency: 'VND' 
                    }).format(room.price)}
                  </Text>
                </Flex>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      )}

      <Modal isOpen={isOpenDetail} onClose={() => setIsOpenDetail(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chi tiết phòng</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedRoom && (
              <Flex direction={{ base: "column", md: "row" }} gap={6}>
                <Image
                  src={selectedRoom.image}
                  alt={selectedRoom.roomName}
                  w={{ base: "100%", md: "50%" }}
                  h="300px"
                  objectFit="cover"
                  borderRadius="md"
                />
                <VStack align="stretch" spacing={4} w={{ base: "100%", md: "50%" }}>
                  <Box>
                    <Text fontWeight="bold">Địa chỉ:</Text>
                    <Text color="gray.600">{selectedRoom.address}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Diện tích:</Text>
                    <Text color="gray.600">{selectedRoom.area} m²</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Giá thuê:</Text>
                    <Text color="gray.600">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(selectedRoom.price)}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Đặt cọc:</Text>
                    <Text color="gray.600">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(selectedRoom.deposit)}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Tiện ích:</Text>
                    <List spacing={2}>
                      {selectedRoom.amenities.map((amenity, index) => (
                        <ListItem key={index} color="gray.600">
                          <ListIcon as={MdCheckCircle} color="green.500" />
                          {amenity}
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </VStack>
              </Flex>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => setIsOpenDetail(false)}>
              Đóng
            </Button>
            <Button colorScheme="teal">Liên hệ chủ trọ</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TenantRoomList;
