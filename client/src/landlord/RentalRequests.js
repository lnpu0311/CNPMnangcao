import { useState, useEffect, useCallback } from "react";
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
  Spinner,
  useToast
} from "@chakra-ui/react";
import axios from "axios";

const RentalRequest = () => {
  const toast = useToast();
  const [rentalRequests, setRentalRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenInfoRoom, setIsOpenInfoRoom] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Wrap fetchRentalRequests trong useCallback
  const fetchRentalRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/rental-request/landlord`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setRentalRequests(response.data.data);
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách yêu cầu thuê",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]); // Thêm toast vào dependencies của useCallback

  // Thêm fetchRentalRequests vào dependency array của useEffect
  useEffect(() => {
    fetchRentalRequests();
  }, [fetchRentalRequests]);

  const openRoomInfoModal = (request) => {
    setSelectedRoom(request);
    setIsOpenInfoRoom(true);
  };

  const closeRoomInfoModal = () => {
    setIsOpenInfoRoom(false);
    setSelectedRoom(null);
  };

  const handleAccept = async (request) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/rental-request/${request._id}/status`,
        { status: 'accepted' },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        toast({
          title: "Thành công",
          description: "Đã chấp nhận yêu cầu thuê phòng",
          status: "success",
          duration: 3000,
          isClosable: true
        });
        // Refresh danh sách
        fetchRentalRequests();
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể chấp nhận yêu cầu",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    }
  };

  const handleReject = async (request) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/rental-request/${request._id}/status`,
        { 
          status: 'rejected',
          rejectReason: "Không đáp ứng yêu cầu" // Có thể thêm modal để nhập lý do
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        toast({
          title: "Thành công",
          description: "Đã từ chối yêu cầu thuê phòng",
          status: "success",
          duration: 3000,
          isClosable: true
        });
        // Refresh danh sách
        fetchRentalRequests();
      }
    } catch (error) {
      toast({
        title: "Lỗi", 
        description: error.response?.data?.message || "Không thể từ chối yêu cầu",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    }
  };

  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

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

      {rentalRequests.length === 0 ? (
        <Text textAlign="center" fontSize="lg" color="gray.500">
          Chưa có yêu cầu thuê phòng nào
        </Text>
      ) : (
        <Stack spacing={4}>
          {rentalRequests.map((request) => (
            <Flex
              flexDirection={{ base: "column", md: "row" }}
              key={request._id}
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
                <Avatar name={request.tenantId.name} src="https://bit.ly/broken-link" />
                <Text fontWeight="bold" ml={4}>
                  {request.tenantId.name}
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
                  {request.tenantId.phone}
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
                <Text fontWeight="bold">{request.roomId.hostelId.name}</Text>
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
                <Text fontWeight="bold">{request.roomId.roomName}</Text>
              </Flex>

              <Flex flex="1" justify="flex-end" gap={2}>
                <Button onClick={() => handleAccept(request)} colorScheme="green">
                  Chấp nhận
                </Button>
                <Button onClick={() => handleReject(request)} colorScheme="red">
                  Từ chối
                </Button>
              </Flex>
            </Flex>
          ))}
        </Stack>
      )}

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
