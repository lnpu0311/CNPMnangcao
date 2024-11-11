import { useState } from "react";
import {
  Box,
  Flex,
  Stack,
  Avatar,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  HStack,
  VStack,
  Image,
  Heading,
} from "@chakra-ui/react";

const RentalRequest = () => {
  const rentalRequests = [
    {
      id: 1,
      name: "Hưng",
      phone: "12341234",
      hostel: "nhà trọ quận 5",
      room: "Phòng 1",
    },
    {
      id: 2,
      name: "Lương Ngọc Phương Uyên",
      phone: "1243412354",
      hostel: "nhà trọ quận 5",
      room: "Phòng 4",
    },
    {
      id: 3,
      name: "Bảo xấu quắc",
      phone: "1234123874",
      hostel: "nhà trọ quận 5",
      room: "Phòng 3",
    },
  ];
  const [isOpenInfoRoom, setIsOpenInfoRoom] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const openRoomInfoModal = (request) => {
    setSelectedRoom(request);
    setIsOpenInfoRoom(true);
  };

  const closeRoomInfoModal = () => {
    setIsOpenInfoRoom(false);
    setSelectedRoom(null);
  };
  const handleAccept = (request) => {
    console.log("Accept");
  };
  const handleReject = (request) => {
    console.log("Reject");
  };
  return (
    <Box>
      <Heading
        textColor={"blue.500"}
        as="h3"
        size="lg"
        mb={{ base: 4, md: 12 }}
      >
        Quản Lý Yêu Cầu Thuê Phòng
      </Heading>

      <Stack spacing={4}>
        {rentalRequests.map((request) => (
          <Flex
            flexDirection={{ base: "column", md: "row" }}
            key={request.id}
            bg="gray.100"
            borderRadius="md"
            boxShadow="lg"
            justify="space-between"
            align="center"
            p={4}
          >
            <Flex
              cursor={"pointer"}
              onClick={() => openRoomInfoModal(request)}
              align="center"
              flex="3"
            >
              <Avatar name={request.name} src="https://bit.ly/broken-link" />
              <Text fontWeight="bold" ml={4}>
                {request.name}
              </Text>
            </Flex>

            <Flex
              cursor={"pointer"}
              onClick={() => openRoomInfoModal(request)}
              align="center"
              flex="2"
            >
              <Text color="gray.600" mr={2}>
                Số điện thoại:
              </Text>
              <Text fontWeight="bold" mr={2}>
                {request.phone}
              </Text>
            </Flex>

            <Flex
              cursor={"pointer"}
              onClick={() => openRoomInfoModal(request)}
              align="center"
              flex="2"
            >
              <Text color="gray.600" mr={2}>
                Cơ sở:
              </Text>
              <Text fontWeight="bold">{request.hostel}</Text>
            </Flex>

            <Flex
              cursor={"pointer"}
              onClick={() => openRoomInfoModal(request)}
              align="center"
              flex="2"
            >
              <Text color="gray.600" mr={2}>
                Tên phòng:
              </Text>
              <Text fontWeight="bold">{request.room}</Text>
            </Flex>

            <Flex flex="1" justify="flex-end" gap={2}>
              <Button onClick={handleAccept} colorScheme="green">
                Chấp nhận
              </Button>
              <Button onClick={handleReject} colorScheme="red">
                Từ chối
              </Button>
            </Flex>
          </Flex>
        ))}
      </Stack>

      {/* Modal hiển thị thông tin phòng */}
      <Modal
        isCentered
        isOpen={isOpenInfoRoom}
        onClose={closeRoomInfoModal}
        size="2xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text fontSize="2xl" fontWeight="bold" align="center">
              {selectedRoom?.roomName || "Đang tải..."}
            </Text>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {/* Hình ảnh chính và chi tiết phòng */}
            <HStack align="start" spacing={4}>
              <Image
                src={selectedRoom?.mainImage || "Đang tải..."}
                alt={selectedRoom?.roomName || "Đang tải..."}
                borderRadius="md"
                boxSize="250px"
                objectFit="cover"
              />

              {/* Chi tiết phòng */}
              <VStack align="start" spacing={2} flex="1">
                <Text fontWeight="bold">Số điện:</Text>
                <Text>{selectedRoom?.electricity || "Đang tải..."}</Text>
                <Text fontWeight="bold">Số nước:</Text>
                <Text>{selectedRoom?.water || "Đang tải..."}</Text>
                <Text fontWeight="bold">Giá phòng:</Text>
                <Text>{selectedRoom?.price || "Đang tải..."} VND</Text>
                <Text fontWeight="bold">Diện tích:</Text>
                <Text>{selectedRoom?.area || "Đang tải..."} m²</Text>
                <Text fontWeight="bold">Mô tả:</Text>
                <Text>{selectedRoom?.description || "Đang tải..."}</Text>
              </VStack>
            </HStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="gray" onClick={closeRoomInfoModal}>
              Đóng
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default RentalRequest;
