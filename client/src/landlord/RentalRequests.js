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
  useToast,
  FormControl,
  FormLabel,
  Input,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Tag,
  Link,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  ButtonGroup,
  Td
} from "@chakra-ui/react";
import axios from "axios";

const RentalRequest = () => {
  const toast = useToast();
  const [rentalRequests, setRentalRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenInfoRoom, setIsOpenInfoRoom] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isOpenContract, setIsOpenContract] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [contractDetails, setContractDetails] = useState({
    startDate: "",
    endDate: "",
    depositFee: "",
    rentFee: "",
    electricityFee: "",
    waterFee: "",
    serviceFee: "",
  });
  const [accpetedRequest,setAccpetedRequest] = useState([]);

  //State quản lý tab active 
const [activeTab,setActiveTab] = useState('pending');

  // Thêm state để quản lý loading khi lấy thông tin phòng
  const [isLoadingRoom, setIsLoadingRoom] = useState(false);

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
        // Thêm log để kiểm tra cấu trúc dữ liệu
        console.log('Full rental requests data:', response.data.data);
        
        const pending = response.data.data.filter(req => req.status === 'pending');
        const accepted = response.data.data.filter(req => req.status === 'accepted');
        
        // Log chi tiết về cấu trúc địa chỉ
        console.log('Sample room data:', pending[0]?.roomId);
        console.log('Sample hostel data:', pending[0]?.roomId?.hostelId);

        setRentalRequests(pending);
        setAcceptedRequests(accepted);
      }
    } catch (error) {
      console.error('Error fetching rental requests:', error);
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

  
  const openRoomInfoModal = async (request) => {
    try {
      setIsLoadingRoom(true);
      console.log('Request:', request); // Debug log
      
      const roomId = request.roomId._id;
      console.log('Room ID:', roomId); // Debug log
      
      const response = await axios.get(
        `${process.env.REACT_APP_API}/landlord/hostel/${roomId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log('API Response:', response.data); // Debug log

      if (response.data.success) {
        setSelectedRoom(response.data.data);
        setIsOpenInfoRoom(true);
      }
    } catch (error) {
      console.error('Error fetching room details:', error);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể tải thông tin phòng",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    } finally {
      setIsLoadingRoom(false);
    }
  };

  const closeRoomInfoModal = () => {
    setIsOpenInfoRoom(false);
    setSelectedRoom(null);
  };

  const handleAccept = async (request) => {
    try {
      openContractModal(request);
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

  const openContractModal = (request) => {
    console.log('Request in openContractModal:', request);
    if (!request.landlordId) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy thông tin chủ trọ",
        status: "error",
        duration: 3000,
        isClosable: true
      });
      return;
    }
    setSelectedRequest(request);
    setIsOpenContract(true);
  };

  const closeContractModal = () => {
    setIsOpenContract(false);
    setSelectedRequest(null);
    setContractDetails({
      startDate: "",
      endDate: "",
      depositFee: "",
      rentFee: "",
      electricityFee: "",
      waterFee: "",
      serviceFee: "",
    });
  };

  const handleContractDetailsChange = (e) => {
    const { name, value } = e.target;
    setContractDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateContract = async () => {
    try {
      // Kiểm tra các trường bắt buộc
      if (!contractDetails.startDate || !contractDetails.endDate || 
          !contractDetails.depositFee || !contractDetails.rentFee || 
          !contractDetails.electricityFee || !contractDetails.waterFee || 
          !contractDetails.serviceFee) {
        toast({
          title: "Lỗi",
          description: "Vui lòng điền đầy đủ thông tin hợp đồng",
          status: "error",
          duration: 3000,
          isClosable: true
        });
        return;
      }

      // Log để kiểm tra selectedRequest
      console.log('Selected Request:', selectedRequest);

      // Kiểm tra landlordId
      if (!selectedRequest.landlordId) {
        toast({
          title: "Lỗi",
          description: "Không tìm thấy thông tin chủ trọ",
          status: "error",
          duration: 3000,
          isClosable: true
        });
        return;
      }

      // Tạo hợp đồng
      const contractResponse = await axios.post(
        `${process.env.REACT_APP_API}/landlord/contract/create`,
        {
          roomId: selectedRequest.roomId._id,
          tenantId: selectedRequest.tenantId._id,
          landlordId: selectedRequest.landlordId,
          startDate: new Date(contractDetails.startDate),
          endDate: new Date(contractDetails.endDate),
          depositFee: Number(contractDetails.depositFee),
          rentFee: Number(contractDetails.rentFee),
          electricityFee: Number(contractDetails.electricityFee),
          waterFee: Number(contractDetails.waterFee),
          serviceFee: Number(contractDetails.serviceFee),
          utilities: {
            electricity: {
              unitPrice: Number(contractDetails.electricityFee),
              initialReading: 0,
              currentReading: 0,
              lastUpdated: new Date()
            },
            water: {
              unitPrice: Number(contractDetails.waterFee),
              initialReading: 0,
              currentReading: 0,
              lastUpdated: new Date()
            }
          },
          monthlyFees: []
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (contractResponse.data.success) {
        // Log để kiểm tra response
        console.log('Contract creation response:', contractResponse.data);
        
        // Refresh danh sách để lấy dữ liệu mới
        await fetchRentalRequests();
        
        toast({
          title: "Thành công",
          description: "Đã tạo hợp đồng thành công",
          status: "success",
          duration: 3000,
          isClosable: true
        });
        closeContractModal();
      }
    } catch (error) {
      console.error('Contract creation error:', error);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể tạo hợp đồng",
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

      <Tabs isFitted variant="enclosed" onChange={(index) => setActiveTab(index === 0 ? 'pending' : 'accepted')}>
        <TabList mb="1em">
          <Tab>Yêu cầu chờ duyệt</Tab>
          <Tab>Yêu cầu đã chấp nhận</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {/* Hiển thị danh sách yêu cầu đang chờ */}
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Người thuê</Th>
                  <Th>Thông tin phòng</Th>
                  <Th>Ngày yêu cầu</Th>
                  <Th>Thao tác</Th>
                </Tr>
              </Thead>
              <Tbody>
                {rentalRequests.map((request) => (
                  <Tr key={request._id}>
                    <Td>
                      <VStack align="start">
                        <Text fontWeight="bold">{request.tenantId.name}</Text>
                        <Text fontSize="sm">{request.tenantId.numPhone}</Text>
                        <Text fontSize="sm">{request.tenantId.email}</Text>
                      </VStack>
                    </Td>
                    <Td>
                      <VStack align="start">
                        <Button variant="link" onClick={() => openRoomInfoModal(request)}>
                          {request.roomId.roomName}
                        </Button>
                        <Text fontSize="sm" color="gray.600">
                          Cơ sở: {request.roomId.hostelId?.name || "Chưa có thông tin"}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          Địa chỉ: {request.roomId.hostelId?.address || "Chưa có thông tin"}
                        </Text>
                      </VStack>
                    </Td>
                    <Td>{new Date(request.createdAt).toLocaleDateString('vi-VN')}</Td>
                    <Td>
                      <ButtonGroup>
                        <Button colorScheme="green" onClick={() => handleAccept(request)}>
                          Chấp nhận
                        </Button>
                        <Button colorScheme="red" onClick={() => handleReject(request)}>
                          Từ chối
                        </Button>
                      </ButtonGroup>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TabPanel>

          <TabPanel>
            {/* Hiển thị danh sách yêu cầu đã chấp nhận */}
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Người thuê</Th>
                  <Th>Thông tin phòng</Th>
                  <Th>Ngày chấp nhận</Th>
                  <Th>Mã hợp đồng</Th>
                  <Th>Trạng thái</Th>
                </Tr>
              </Thead>
              <Tbody>
                {acceptedRequests.map((request) => (
                  <Tr key={request._id}>
                    <Td>
                      <VStack align="start">
                        <Text fontWeight="bold">{request.tenantId.name}</Text>
                        <Text fontSize="sm">{request.tenantId.phone}</Text>
                        <Text fontSize="sm">{request.tenantId.email}</Text>
                      </VStack>
                    </Td>
                    <Td>
                      <VStack align="start">
                        <Text fontWeight="bold">{request.roomId.roomName}</Text>
                        <Text fontSize="sm" color="gray.600">
                          Cơ sở: {request.roomId.hostelId?.name || "Chưa có thông tin"}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          Địa chỉ: {request.roomId.hostelId?.address || "Chưa có thông tin"}
                        </Text>
                      </VStack>
                    </Td>
                    <Td>{new Date(request.updatedAt).toLocaleDateString('vi-VN')}</Td>
                    <Td>
                      {request._id ? (
                        <Link color="blue.500" href={`/contracts/${request._id}`}>
                          {request._id.substring(0, 8)}...
                        </Link>
                      ) : (
                        <Text color="gray.500">Chưa có mã hợp đồng</Text>
                      )}
                    </Td>
                    <Td>
                      <Tag colorScheme={request.status === 'accepted' ? 'green' : 'gray'}>
                        {request.status === 'accepted' ? 'Đã chấp nhận' : 'Chưa xác định'}
                      </Tag>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TabPanel>
        </TabPanels>
      </Tabs>

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
            {isLoadingRoom ? (
              <Box textAlign="center" py={10}>
                <Spinner size="xl" />
              </Box>
            ) : (
              <HStack align="start" spacing={4}>
                <Image
                  src={selectedRoom?.images?.[0] || "/default-room.jpg"}
                  alt={selectedRoom?.roomName || "Phòng trọ"}
                  fallbackSrc="/default-room.jpg"
                  borderRadius="md"
                  boxSize="250px"
                  objectFit="cover"
                />

                <VStack align="start" spacing={2} flex="1">
                  <Text fontWeight="bold">Cơ sở:</Text>
                  <Text>{selectedRoom?.hostelId?.name || "Chưa có thông tin"}</Text>
                  <Text fontWeight="bold">Địa chỉ:</Text>
                  <Text>{selectedRoom?.hostelId?.address || "Chưa có thông tin"}</Text>
                  <Text fontWeight="bold">Giá điện:</Text>
                  <Text>{selectedRoom?.electricityUnitPrice?.toLocaleString('vi-VN')} VND/số</Text>
                  <Text fontWeight="bold">Giá nước:</Text>
                  <Text>{selectedRoom?.waterUnitPrice?.toLocaleString('vi-VN')} VND/khối</Text>
                  <Text fontWeight="bold">Giá phòng:</Text>
                  <Text>{selectedRoom?.price?.toLocaleString('vi-VN')} VND</Text>
                  <Text fontWeight="bold">Tiền cọc:</Text>
                  <Text>{selectedRoom?.deposit?.toLocaleString('vi-VN')} VND</Text>
                  <Text fontWeight="bold">Diện tích:</Text>
                  <Text>{selectedRoom?.area || "Chưa có thông tin"} m²</Text>
                  <Text fontWeight="bold">Mô tả:</Text>
                  <Text>{selectedRoom?.description || "Chưa có mô tả"}</Text>
                </VStack>
              </HStack>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="gray" onClick={closeRoomInfoModal}>
              Đóng
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal tạo hợp đồng */}
      <Modal isOpen={isOpenContract} onClose={closeContractModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tạo Hợp Đồng Thuê Phòng</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Ngày bắt đầu</FormLabel>
                <Input
                  type="date"
                  name="startDate"
                  value={contractDetails.startDate}
                  onChange={handleContractDetailsChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Ngày kết thúc</FormLabel>
                <Input
                  type="date"
                  name="endDate"
                  value={contractDetails.endDate}
                  onChange={handleContractDetailsChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Tiền đặt cọc (VNĐ)</FormLabel>
                <Input
                  type="number"
                  name="depositFee"
                  value={contractDetails.depositFee}
                  onChange={handleContractDetailsChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Tiền thuê hàng tháng (VNĐ)</FormLabel>
                <Input
                  type="number"
                  name="rentFee"
                  value={contractDetails.rentFee}
                  onChange={handleContractDetailsChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Giá điện (VNĐ/số)</FormLabel>
                <Input
                  type="number"
                  name="electricityFee"
                  value={contractDetails.electricityFee}
                  onChange={handleContractDetailsChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Giá nước (VNĐ/khối)</FormLabel>
                <Input
                  type="number"
                  name="waterFee"
                  value={contractDetails.waterFee}
                  onChange={handleContractDetailsChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Phí dịch vụ (VNĐ)</FormLabel>
                <Input
                  type="number"
                  name="serviceFee"
                  value={contractDetails.serviceFee}
                  onChange={handleContractDetailsChange}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateContract}>
              Tạo hợp đồng
            </Button>
            <Button onClick={closeContractModal}>Hủy</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default RentalRequest;