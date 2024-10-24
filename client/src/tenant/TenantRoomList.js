import React, { useState } from "react";
import {
  Box,
  SimpleGrid,
  Image,
  Text,
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
  Tag,
} from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";

const rooms = [
  {
    id: 1,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRbcrj53mGyk-u4JwrIb6z1RBAeCpxR78gfQ&s",
    address: "123 Nguyễn Huệ, Quận 1, Tp.Hồ Chí Minh",
    status: "Đã thuê",
    price: "2tr/tháng",
    amenities: [
      "Gần trung tâm thương mại",
      "Ban công rộng rãi",
      "Bếp riêng hiện đại",
      "Bảo vệ 24/7",
    ],
  },
  {
    id: 2,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRbcrj53mGyk-u4JwrIb6z1RBAeCpxR78gfQ&s",
    address: "456 Lê Lợi, Quận 3, Tp.Hồ Chí Minh",
    status: "Còn trống",
    price: "4tr/tháng",
    amenities: [
      "Gần công viên",
      "Phòng gym trong tòa nhà",
      "Hồ bơi chung",
      "Wifi tốc độ cao",
    ],
  },
  {
    id: 3,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRbcrj53mGyk-u4JwrIb6z1RBAeCpxR78gfQ&s",
    address: "789 Điện Biên Phủ, Bình Thạnh, Tp.Hồ Chí Minh",
    status: "Còn trống",
    price: "2.8tr/tháng",
    amenities: [
      "Gần trường đại học",
      "Nhiều quán ăn xung quanh",
      "Phòng rộng rãi",
      "Có chỗ để xe máy",
    ],
  },
  {
    id: 4,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRbcrj53mGyk-u4JwrIb6z1RBAeCpxR78gfQ&s",
    address: "101 Võ Văn Tần, Quận 10, Tp.Hồ Chí Minh",
    status: "Còn trống",
    price: "3.2tr/tháng",
    amenities: [
      "Gần bệnh viện",
      "Có máy giặt chung",
      "An ninh cao",
      "Cửa sổ lớn, thoáng mát",
    ],
  },
  {
    id: 5,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRbcrj53mGyk-u4JwrIb6z1RBAeCpxR78gfQ&s",
    address: "222 Nguyễn Văn Cừ, Quận 5, Tp.Hồ Chí Minh",
    status: "Còn trống",
    price: "2.5tr/tháng",
    amenities: [
      "Gần khu ẩm thực",
      "Có ban công riêng",
      "Nội thất cơ bản",
      "Miễn phí gửi xe",
    ],
  },
  {
    id: 6,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRbcrj53mGyk-u4JwrIb6z1RBAeCpxR78gfQ&s",
    address: "333 Cách Mạng Tháng 8, Quận 3, Tp.Hồ Chí Minh",
    status: "Còn trống",
    price: "3.8tr/tháng",
    amenities: [
      "View thành phố đẹp",
      "Bảo vệ 24/7",
      "Có thang máy",
      "Gần trạm xe buýt",
    ],
  },
  {
    id: 7,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRbcrj53mGyk-u4JwrIb6z1RBAeCpxR78gfQ&s",
    address: "444 Lý Thường Kiệt, Quận 10, Tp.Hồ Chí Minh",
    status: "Còn trống",
    price: "3.5tr/tháng",
    amenities: [
      "Gần khu công nghiệp",
      "Có nhà để xe riêng",
      "Cửa khóa vân tay",
      "Miễn phí nước",
    ],
  },
  {
    id: 8,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRbcrj53mGyk-u4JwrIb6z1RBAeCpxR78gfQ&s",
    address: "555 Trần Hưng Đạo, Quận 1, Tp.Hồ Chí Minh",
    status: "Còn trống",
    price: "4.5tr/tháng",
    amenities: [
      "Nội thất cao cấp",
      "Gần trung tâm thành phố",
      "Bảo vệ nghiêm ngặt",
      "Có phòng giặt ủi chung",
    ],
  },
];

const TenantRoomList = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isOpenDetail, setIsOpenDetail] = useState(false);

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setIsOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setIsOpenDetail(false);
  };

  return (
    <Box p={4}>
      <Center mb={4}>
        <Heading fontSize="2xl" fontWeight="bold">
          Thông tin phòng
        </Heading>
      </Center>
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
            display="flex"
            flexDirection="column"
          >
            <Image
              src={room.image}
              alt={`Phòng ${room.id}`}
              w="100%"
              h="200px"
              objectFit="cover"
            />
            <VStack p={4} align="stretch" spacing={2} flex={1}>
              <Box>
                <Flex alignItems="flex-start">
                  <Text
                    fontWeight="bold"
                    color="black"
                    width="70px"
                    flexShrink={0}
                  >
                    Địa chỉ:
                  </Text>
                  <Text color="gray.600" fontSize="sm">
                    {room.address}
                  </Text>
                </Flex>
              </Box>
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontWeight="bold" color="black">
                  Tình trạng:
                </Text>
                <Tag
                  colorScheme={
                    room.status.toLowerCase().includes("còn trống")
                      ? "green"
                      : "orange"
                  }
                  size="md" // Thay đổi từ "sm" thành "md"
                  fontSize="md" // Tăng kích thước chữ
                >
                  {room.status}
                </Tag>
              </Flex>
              <Flex justifyContent="space-between">
                <Text fontWeight="bold" color="black">
                  Giá:
                </Text>
                <Text color="gray.600">{room.price}</Text>
              </Flex>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      {/* Modal hiển thị chi tiết phòng */}
      <Modal isOpen={isOpenDetail} onClose={handleCloseDetail} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thông tin phòng</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedRoom && (
              <Flex direction={{ base: "column", md: "row" }} gap={6}>
                <Image
                  src={selectedRoom.image}
                  alt={`Phòng ${selectedRoom.id}`}
                  w={{ base: "100%", md: "50%" }}
                  h="300px"
                  objectFit="cover"
                  borderRadius="md"
                />
                <VStack
                  align="stretch"
                  spacing={4}
                  w={{ base: "100%", md: "50%" }}
                >
                  <Box>
                    <Text fontWeight="bold" color="black">
                      Địa chỉ:
                    </Text>
                    <Text color="gray.600">{selectedRoom.address}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" color="black">
                      Giá:
                    </Text>
                    <Text color="gray.600">{selectedRoom.price}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" color="black">
                      Tình trạng:
                    </Text>
                    <Tag
                      colorScheme={
                        selectedRoom.status.toLowerCase().includes("còn trống")
                          ? "green"
                          : "orange"
                      }
                      size="md"
                      fontSize="md"
                    >
                      {selectedRoom.status}
                    </Tag>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" color="black">
                      Tiện ích:
                    </Text>
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
            <Button colorScheme="red" mr={3} onClick={handleCloseDetail}>
              Đóng
            </Button>
            <Button colorScheme="teal">Liên hệ</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TenantRoomList;
