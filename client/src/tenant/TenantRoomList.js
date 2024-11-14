import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Spinner,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Grid,
  GridItem,
  Select,
} from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";
import Chat from "../components/Chat";
import { jwtDecode } from "jwt-decode";
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const TenantRoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const toast = useToast();
  const [isOpenBooking, setIsOpenBooking] = useState(false);
  const navigate = useNavigate();


  const [searchTerm, setSearchTerm] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterAddress, setFilterAddress] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [priceRange, setPriceRange] = useState("");


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCityChange = (e) => {
    setFilterCity(e.target.value);
  };

  const handleDistrictChange = (e) => {
    setFilterDistrict(e.target.value);
  };

  const handleAddressChange = (e) => {
    setFilterAddress(e.target.value);
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  };

  const handlePriceRangeChange = (e) => {
    setPriceRange(e.target.value);
  };

  const filteredRooms = rooms.filter((room) => {
    const price = room.price || 0;
    let minPrice = 0;
    let maxPrice = Infinity;

    switch (priceRange) {
      case "500000-1000000":
        minPrice = 500000;
        maxPrice = 1000000;
        break;
      case "1000000-3000000":
        minPrice = 1000000;
        maxPrice = 3000000;
        break;
      case "3000000-6000000":
        minPrice = 3000000;
        maxPrice = 6000000;
        break;
      case "6000000-9000000":
        minPrice = 6000000;
        maxPrice = 9000000;
        break;
      case "9000000-10000000":
        minPrice = 9000000;
        maxPrice = 10000000;
        break; 
      case "10000000-20000000":
        minPrice = 10000000;
        maxPrice = 20000000;
        break; 
      default:
        break;
    }

    return (
      room.roomTitle.toLowerCase().includes(searchTerm.toLowerCase()) &&
      room.address.includes(filterCity) &&
      room.address.includes(filterDistrict) &&
      room.address.includes(filterAddress) &&
      price >= minPrice &&
      price <= maxPrice
    );
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        console.log("Fetching rooms with token:", token);
        console.log("API URL:", `${process.env.REACT_APP_API}/user/rooms`);

        const response = await axios.get(
          `${process.env.REACT_APP_API}/user/rooms`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API Response:", response.data);

        if (response.data.success && Array.isArray(response.data.data)) {
          const formattedRooms = response.data.data.map((room) => ({
            id: room._id,
            roomTitle: room.roomTitle || "Không có tiêu đề",
            roomName: room.roomName || "Không có tên",
            landlordId:
              room.hostelId?.landlordId?._id || room.hostelId?.landlordId,
            image:
              room.images && room.images.length > 0
                ? room.images[0]
                : "https://via.placeholder.com/200",
            address: room.hostelId
              ? `${room.hostelId.address || ""}, ${room.hostelId.ward || ""}, ${
                  room.hostelId.district || ""
                }, ${room.hostelId.city || ""}`
              : "Địa chỉ không có sẵn",
            status: room.status === "available" ? "Còn trống" : "Đã thuê",
            price: room.price || 0,
            area: room.area || 0,
            description: room.description || "Không có mô tả",
            deposit: room.deposit || 0,
            amenities: [
              "Wifi miễn phí",
              "Bảo vệ 24/7",
              "Chỗ để xe",
              "Tự do giờ giấc",
            ],
          }));
          console.log("Formatted Rooms:", formattedRooms);
          setRooms(formattedRooms);
        } else {
          console.log("No rooms data or invalid format");
          setRooms([]);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error.response || error);
        setRooms([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUser(decoded);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setIsOpenDetail(true);
    
  };

  const BookingModal = ({ isOpen, onClose, room, currentUser }) => {
    const [bookingData, setBookingData] = useState({
      proposedDate: '',
      alternativeDate: '',
      message: ''
    });
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
      try {
        setIsSubmitting(true);
        if (!bookingData.proposedDate) {
          toast({
            title: "Lỗi",
            description: "Vui lòng chọn ngày xem phòng",
            status: "error",
            duration: 3000,
            isClosable: true
          });
          return;
        }

        console.log('Sending booking data:', {
          roomId: room.id,
          landlordId: room.landlordId,
          ...bookingData
        });

        const response = await axios.post(
          `${process.env.REACT_APP_API}/booking/create`,
          {
            roomId: room.id,
            landlordId: room.landlordId,
            proposedDate: bookingData.proposedDate,
            alternativeDate: bookingData.alternativeDate || null,
            message: bookingData.message || ''
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.success) {
          toast({
            title: "Thành công",
            description: (
              <Box>
                <Text>Đã gửi yêu cầu xem phòng</Text>
                <Button
                  onClick={() => navigate('/tenant/bookings')}
                  size="sm"
                  mt={2}
                  colorScheme="blue"
                >
                  Xem lịch sử đặt phòng
                </Button>
              </Box>
            ),
            status: "success",
            duration: 5000,
            isClosable: true
          });
          onClose();
        }
      } catch (error) {
        console.error('Booking error:', error.response?.data || error);
        toast({
          title: "Lỗi",
          description: error.response?.data?.message || "Không thể gửi yêu cầu xem phòng",
          status: "error",
          duration: 3000,
          isClosable: true
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Đặt lịch xem phòng</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mb={4} p={4} borderWidth={1} borderRadius="md">
              <Heading size="sm" mb={2}>Thông tin phòng:</Heading>
              <Text><strong>Tên phòng:</strong> {room.roomName}</Text>
              <Text><strong>Giá thuê:</strong> {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(room.price)}</Text>
              <Text><strong>Diện tích:</strong> {room.area}m²</Text>
            </Box>

            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Ngày xem phòng</FormLabel>
                <Input
                  type="datetime-local"
                  value={bookingData.proposedDate}
                  onChange={(e) => setBookingData({
                    ...bookingData,
                    proposedDate: e.target.value
                  })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Ngày xem thay thế (không bắt buộc)</FormLabel>
                <Input
                  type="datetime-local"
                  value={bookingData.alternativeDate}
                  onChange={(e) => setBookingData({
                    ...bookingData,
                    alternativeDate: e.target.value
                  })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Lời nhắn</FormLabel>
                <Textarea
                  value={bookingData.message}
                  onChange={(e) => setBookingData({
                    ...bookingData,
                    message: e.target.value
                  })}
                  placeholder="Nhập lời nhắn cho chủ trọ..."
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={handleSubmit}
              isLoading={isSubmitting}
              loadingText="Đang gửi..."
            >
              Gửi yêu cầu
            </Button>
            <Button variant="ghost" onClick={onClose}>Hủy</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const onOpenBooking = () => setIsOpenBooking(true);
  const onCloseBooking = () => setIsOpenBooking(false);

  return (
    <Box p={4}>
      <Center mb={4}>
        <Heading fontSize="2xl" fontWeight="bold">
          Danh sách phòng trọ
        </Heading>
      </Center>

      
      <Grid templateColumns={{ base: "1fr", md: "1fr 3fr" }} gap={6}>
        <form>
          <VStack 
            spacing={4}
            mb={4}
            align="stretch"
            position="sticky"
            top="15%"
            h="fit-content"
          >
            <Input
              placeholder="Địa chỉ chi tiết..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Select placeholder="Chọn thành phố" onChange={handleCityChange}>
              {Array.from(new Set(rooms.map(room => room.address.split(', ')[3]))).map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </Select>
            <Select placeholder="Chọn quận" onChange={handleDistrictChange}>
              {Array.from(new Set(rooms.map(room => room.address.split(', ')[2]))).map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </Select>
            <Select placeholder="Chọn khoảng giá" onChange={handlePriceRangeChange}>
              <option value="500000-1000000">500.000 - 1.000.000</option>
              <option value="1000000-3000000">1.000.000 - 3.000.000</option>
              <option value="3000000-6000000">3.000.000 - 6.000.000</option>
              <option value="6000000-9000000">6.000.000 - 9.000.000</option>
              <option value="9000000-12000000">9.000.000 - 12.000.000</option>
              <option value="12000000-20000000">12.000.000 - 20.000.000</option>
            </Select>
          </VStack>
        </form>

        {isLoading ? (
          <Center>
            <Spinner size="xl" />
          </Center>
        ) : filteredRooms.length === 0 ? (
          <Center>
            <Text>Không có phòng nào</Text>
          </Center>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {filteredRooms.map((room) => (
              <Box
                key={room.id}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                boxShadow="md"
                bg="white"
                onClick={() => handleRoomClick(room)}
                cursor="pointer"
                _hover={{ transform: "scale(1.02)", transition: "all 0.2s" }}
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
                    <Tag
                      colorScheme={room.status === "Còn trống" ? "green" : "red"}
                    >
                      {room.status}
                    </Tag>
                  </Flex>
                  <Flex justifyContent="space-between">
                    <Text fontWeight="bold">Giá:</Text>
                    <Text>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(room.price)}
                    </Text>
                  </Flex>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Grid>


      <Modal
        isOpen={isOpenDetail}
        onClose={() => setIsOpenDetail(false)}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chi tiết phòng</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedRoom && (
              <VStack spacing={4}>
                <Image
                  src={selectedRoom.image}
                  alt={selectedRoom.roomName}
                  w="100%"
                  h="300px"
                  objectFit="cover"
                  borderRadius="md"
                />
                <Button
                  colorScheme="yellow"
                  width="100%"
                  onClick={() => {
                    setIsOpenDetail(false);
                    navigate(`/tenant/rooms/${selectedRoom.id}`);
                  }}
                >
                  Xem chi tiết
                </Button>
                <Flex direction={{ base: "column", md: "row" }} gap={6} width="100%">
                  <VStack
                    align="stretch"
                    spacing={4}
                    w={{ base: "100%", md: "100%" }}
                  >
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
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(selectedRoom.price)}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Đặt cọc:</Text>
                      <Text color="gray.600">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
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
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Grid templateColumns="repeat(3, 1fr)" gap={3} width="100%">
              <Button
                colorScheme="red"
                onClick={() => setIsOpenDetail(false)}
              >
                Đóng
              </Button>
              <Button
                colorScheme="teal"
                onClick={() => {
                  if (currentUser) {
                    setShowChat(true);
                    setIsOpenDetail(false);
                  } else {
                    toast({
                      title: "Vui lòng đăng nhập",
                      description: "Bạn cần đăng nhập để chat với chủ trọ",
                      status: "warning",
                      duration: 3000,
                      isClosable: true,
                    });
                  }
                }}
              >
                Liên hệ chủ trọ
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => {
                  if (currentUser) {
                    setIsOpenDetail(false);
                    onOpenBooking(); 
                  } else {
                    toast({
                      title: "Vui lòng đăng nhập",
                      description: "Bạn cần đăng nhập để đặt lịch xem phòng",
                      status: "warning", 
                      duration: 3000,
                      isClosable: true,
                    });
                  }
                }}
              >
                Đặt lịch xem phòng
              </Button>
            </Grid>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {showChat && currentUser && selectedRoom && selectedRoom.landlordId && (
        <Chat
          currentUserId={currentUser.id}
          recipientId={selectedRoom.landlordId.toString()}
          recipientName={selectedRoom.landlordName || "Chủ trọ"}
        />
      )}

      {isOpenBooking && selectedRoom && (
        <BookingModal
          isOpen={isOpenBooking}
          onClose={onCloseBooking}
          room={selectedRoom}
          currentUser={currentUser}
        />
      )}
    </Box>
  );
};

export default TenantRoomList;
