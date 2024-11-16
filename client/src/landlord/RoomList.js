import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  SimpleGrid,
  Image,
  Text,
  Badge,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useDisclosure,
  Flex,
  Grid,
  VStack,
  HStack,
  Avatar,
  Spinner,
  Center,
  Icon,
  Heading,
  Select,
  Tooltip,
} from "@chakra-ui/react";

import { FaArrowLeft, FaEdit, FaPlus, FaTrash, FaUpload } from "react-icons/fa";
import { IoReceipt } from "react-icons/io5";
import data from "../data/monthyear.json";
import axios from "axios";
import Pagination from '../components/Pagination';
const RoomList = () => {
  const [hostel, setHostel] = useState();
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState({
    roomName: "",
    area: "",
    price: "",
    description: "",
    deposit: "",
    images: [],
  });
  const { facilityId } = useParams();
  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(12);

  //Tính toán số trang 
  const totalPages = Math.ceil(rooms.length/itemPerPage);
  //Lấy dữ liệu cho trang hiện tại 
  const getCurrentPageData=() =>{
    const startIndex = (currentPage-1) * itemPerPage;
    const endIndex = startIndex + itemPerPage;
    return rooms.slice(startIndex,endIndex);
  }

  useEffect(() => {
    // Lấy dữ liệu từ file data.json và cập nhật vào state
    setMonths(data.months);
    setYears(data.years);
  }, []);
  useEffect(() => {
    console.log("facilityId:", facilityId);
    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/landlord/hostel/${facilityId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("API Response:", response.data);
        if (response.data.success && response.data.data) {
          setHostel(response.data.data);
          setRooms(
            Array.isArray(response.data.data.rooms)
              ? response.data.data.rooms
              : []
          );
        } else {
          console.error("Invalid response format:", response.data);
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
  }, [facilityId]);
  // Kiểm tra dữ liệu của hostel khi nó thay đổi
  useEffect(() => {
    if (hostel) {
      console.log("Thông tin hostel sau khi cập nhật:", hostel);
    }
  }, [hostel]);

  const navigate = useNavigate();
  const {
    isOpen: isOpenNewRoom,
    onOpen: onOpenNewRoom,
    onClose: onCloseNewRoom,
  } = useDisclosure();
  const {
    isOpen: isOpenContract,
    onOpen: onOpenContract,
    onClose: onCloseContract,
  } = useDisclosure();
  const {
    isOpen: isOpenInfoRoom,
    onOpen: onOpenInfoRoom,
    onClose: onCloseInfoRoom,
  } = useDisclosure();
  const {
    isOpen: isOpenRoom,
    onOpen: onOpenRoom,
    onClose: onCloseRoom,
  } = useDisclosure();
  const {
    isOpen: isOpenUpdate,
    onOpen: onOpenUpdate,
    onClose: onCloseUpdate,
  } = useDisclosure();
  const [newRoom, setNewRoom] = useState({
    roomTitle: "",
    roomName: "",
    area: "",
    price: "",
    description: "",
    hostelId: "",
    deposit: "",
    images: [],
  });
  const [update, setUpdate] = useState({
    elecIndex: "",
    aquaIndex: "",
  });

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [contractDetails, setContractDetails] = useState({
    startDate: "",
    endDate: "",
    deposit: "",
    rent: "",
    electricityBill: "",
    waterBill: "",
    tenantName: "",
    landlordName: "",
  });
  // Cập nhật hình ảnh mặc định khi chọn phòng thay đổi
  useEffect(() => {
    if (selectedRoom) {
      setSelectedImage(selectedRoom.images[0]);
    }
  }, [selectedRoom]);
  // Tạo trạng thái để lưu trữ hình ảnh được chọn

  const handleEditRoom = (room) => {
    console.log("Editing room:", room);
    // Add your edit room logic here
  };

  const handleAddRoom = (room) => {
    console.log("Adding room:", room);
    // Add your add room logic here
  };

  const handleDeleteRoom = (room) => {
    console.log("Deleting room:", room);
    // Add your delete room logic here
  };

  const handleCreateBill = (room) => {
    console.log("Creating bill for room:", room);
    // Add your create bill logic here
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    onOpenInfoRoom();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewRoom((prevRoom) => ({
      ...prevRoom,
      [name]: value,
    }));
  };
  const handleUpdate = (room) => {
    // Thực hiện hành động cập nhật tại đây
    console.log("Số điện:", update.elecIndex);
    console.log("Số nước:", update.aquaIndex);
    onCloseUpdate();
  };

  // Save changes to database or state
  const handleSaveChanges = () => {
    // Call backend or update state with new room details
    console.log("Saved room details:", selectedRoom);
  };
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("Bạn chỉ có thể tải lên tối đa 5 hình ảnh");
      return;
    }
    setNewRoom((prev) => ({
      ...prev,
      images: files,
    }));
  };
  const handleAddTenant = (e) => {
    const { name, value } = e.target;
    setContractDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
  const handleCreateContract = async () => {
    try {
      const response = await axios.post(
        "https://localhost:5000/api/landlord/contract/create",
        contractDetails,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        alert("Tạo hợp đồng thành công");
        setContractDetails({
          startDate: "",
          endDate: "",
          deposit: "",
          rent: "",
          electricityFee: "",
          waterFee: "",
          tenantName: "",
          landlordName: "",
        });
        onCloseContract();
      }
    } catch (error) {
      console.error("Lỗi khi tạo hợp đồng", error);
      alert("Không thể tạo hợp đồng : " + error.response.data.message);
    }
  };

  const handleCreateRoom = async () => {
    if (
      !newRoom.roomName ||
      !newRoom.area ||
      !newRoom.price ||
      !newRoom.description
    ) {
      alert("Vui lòng điền đầy đủ thông tin phòng.");
      return;
    }

    const data = new FormData();
    data.append("roomTitle", newRoom.roomTitle);
    data.append("roomName", newRoom.roomName);
    data.append("area", newRoom.area);
    data.append("price", newRoom.price);
    data.append("description", newRoom.description);
    data.append("deposit", newRoom.deposit);

    // Gửi từng tệp ảnh vào FormData
    newRoom.images.forEach((image) => {
      data.append("images", image);
    });
    console.log(Array.from(data.entries()));
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/landlord/room/${facilityId}/create`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        alert("Tạo phòng thành công!");
        setNewRoom({
          roomTitle: "",
          roomName: "",
          area: "",
          price: "",
          description: "",
          deposit: "",
          images: [],
        });
        onCloseNewRoom();
      } else {
        alert("Có lỗi xảy ra: " + response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi tạo phòng:", error);
      alert("Không thể tạo phòng. Vui lòng thử lại sau.");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Box>
      <Flex justifyContent="space-between" mb={4}>
        <Button
          onClick={handleGoBack}
          colorScheme="teal"
          leftIcon={<FaArrowLeft />}
        >
          Quay lại
        </Button>
        <Button
          onClick={onOpenNewRoom}
          colorScheme="green"
          rightIcon={<FaPlus />}
        >
          Thêm phòng mới
        </Button>
      </Flex>
      <Heading
        textColor={"blue.500"}
        as="h3"
        size="lg"
        mb={{ base: 4, md: 12 }}
      >
        Danh sách phòng của cơ sở: {hostel?.name || "Đang tải..."}
      </Heading>
      {isLoading ? (
        <Center>
          <Spinner size="xl" />
        </Center>
      ) : !rooms || rooms.length === 0 ? (
        <Center>
          <Text>Không có phòng nào</Text>
        </Center>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
          {getCurrentPageData().map((room) => (
            <Box
              border={"1px solid"}
              borderColor={"gray.200"}
              rounded={"lg"}
              key={room.id}
              borderRadius="lg"
              overflow="hidden"
              boxShadow="xl"
              bg={room.status === "occupied" ? "brand.100" : "brand.2"}
              position="relative"
              p={2}
              cursor="pointer"
              onClick={() => handleRoomClick(room)}
            >
              {/* Image taking full width of the card */}
              <Image
                width="100%"
                height={"200px"}
                src={room.images?.[0]}
                alt={room.roomName}
                borderRadius="md"
                objectFit="cover"
              />
              <Text fontSize={"lg"} fontWeight={"bold"} my={2}>
                {room.roomName}
              </Text>
              {/* Button container positioned below the image */}
              <Flex
                direction="row"
                alignItems="center"
                justifyContent="space-evenly"
                mt={2}
              >
                <Tooltip label="Chỉnh sửa" aria-label="Chỉnh sửa">
                  <IconButton
                    icon={<FaEdit />}
                    size="sm"
                    colorScheme="teal"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenRoom(room);
                    }}
                  />
                </Tooltip>
                {room.status === "available" ? (
                  <>
                    <Tooltip label="Thêm hợp đồng" aria-label="Thêm hợp đồng">
                      <IconButton
                        icon={<FaPlus />}
                        size="sm"
                        colorScheme="blue"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenContract();
                          handleAddRoom(room);
                        }}
                      />
                    </Tooltip>
                    <Tooltip label="Xóa phòng" aria-label="Xóa">
                      <IconButton
                        icon={<FaTrash />}
                        size="sm"
                        colorScheme="red"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRoom(room);
                        }}
                      />
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <Tooltip label="Tạo hóa đơn" aria-label="Tạo hóa đơn">
                      <IconButton
                        icon={<IoReceipt />}
                        size="sm"
                        colorScheme="purple"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCreateBill(room);
                        }}
                      />
                    </Tooltip>
                    <Tooltip label="Cập nhật" aria-label="Cập nhật">
                      <IconButton
                        icon={<FaUpload />}
                        size="sm"
                        colorScheme="green"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenUpdate();
                        }}
                      />
                    </Tooltip>

                    <Badge
                      position="absolute"
                      top={1}
                      left={0}
                      zIndex="1"
                      colorScheme={
                        room.paymentStatus === "paid" ? "green" : "red"
                      }
                      bg={room.paymentStatus === "paid" ? "green.500" : "red"}
                      px={2}
                      py={1}
                    >
                      {room.paymentStatus === "paid"
                        ? "Đã thanh toán"
                        : "Chưa thanh toán"}
                    </Badge>
                  </>
                )}
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      )}
      {/* Modal for Adding New Room */}
      <Modal isCentered isOpen={isOpenNewRoom} onClose={onCloseNewRoom}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>Thêm phòng mới</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <FormControl mb={2} isRequired>
                <FormLabel>Tiêu đề bài đăng</FormLabel>
                <Input
                  name="roomTitle"
                  value={newRoom.roomTitle}
                  onChange={handleInputChange}
                  placeholder="Nhập tiêu đề bài đăng"
                />
              </FormControl>

              <FormControl mb={2} isRequired>
                <FormLabel>Tên phòng</FormLabel>
                <Input
                  name="roomName"
                  value={newRoom.roomName}
                  onChange={handleInputChange}
                  placeholder="Nhập tên phòng"
                />
              </FormControl>

              <FormControl mb={2} isRequired>
                <FormLabel>Diện tích (m²)</FormLabel>
                <Input
                  type="number"
                  name="area"
                  value={newRoom.area}
                  onChange={handleInputChange}
                  placeholder="Nhập diện tích phòng"
                />
              </FormControl>

              <FormControl mb={2} isRequired>
                <FormLabel>Số tiền cọc (VND)</FormLabel>
                <Input
                  type="number"
                  name="deposit"
                  value={newRoom.deposit}
                  onChange={handleInputChange}
                  placeholder="Nhập giá tiền cọc"
                />
              </FormControl>

              <FormControl mb={2} isRequired>
                <FormLabel>Giá phòng (VND)</FormLabel>
                <Input
                  type="number"
                  name="price"
                  value={newRoom.price}
                  onChange={handleInputChange}
                  placeholder="Nhập giá phòng"
                />
              </FormControl>

              <FormControl mb={2} isRequired>
                <FormLabel>Số điện thoại liên hệ</FormLabel>
                <Input
                  type="number"
                  name="phone"
                  value={newRoom.phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                />
              </FormControl>

              <FormControl mb={2} isRequired gridColumn="span 2">
                <FormLabel>Mô tả chi tiết</FormLabel>
                <Textarea
                  name="description"
                  value={newRoom.description}
                  onChange={handleInputChange}
                  placeholder="Nhập mô tả phòng"
                />
              </FormControl>

              <FormControl mb={2} isRequired gridColumn="span 2">
                <FormLabel>Thêm hình ảnh</FormLabel>
                <Input
                  type="file"
                  name="images"
                  onChange={handleImageChange}
                  multiple // Cho phép chọn nhiều tệp
                  accept="image/*" // Giới hạn chỉ chọn hình ảnh
                />
                <Text mt={2}>Bạn có thể tải lên tối đa 5 hình ảnh</Text>
              </FormControl>
            </Grid>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleCreateRoom}>
              Tạo phòng
            </Button>
            <Button colorScheme="red" onClick={onCloseNewRoom}>
              Hủy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Modal for Creating Contract */}
      <Modal isCentered isOpen={isOpenContract} onClose={onCloseContract}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>Hợp đồng mới</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <FormControl isRequired>
                <FormLabel>Ngày tạo</FormLabel>
                <Input
                  name="startDate"
                  type="date"
                  value={contractDetails.startDate}
                  onChange={handleAddTenant}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Ngày hết hạn</FormLabel>
                <Input
                  name="endDate"
                  type="date"
                  value={contractDetails.endDate}
                  onChange={handleAddTenant}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Tiền cọc</FormLabel>
                <Input
                  name="deposit"
                  type="number"
                  value={contractDetails.deposit}
                  onChange={handleAddTenant}
                  placeholder="Nhập tiền cọc"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Tiền thuê phòng</FormLabel>
                <Input
                  name="rent"
                  type="number"
                  value={contractDetails.rent}
                  onChange={handleAddTenant}
                  placeholder="Nhập tiền thuê phòng"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Số tiền điện</FormLabel>
                <Input
                  name="electricityBill"
                  type="number"
                  value={contractDetails.electricityBill}
                  onChange={handleAddTenant}
                  placeholder="Nhập tiền điện"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Số tiền nước</FormLabel>
                <Input
                  name="waterBill"
                  type="number"
                  value={contractDetails.waterBill}
                  onChange={handleAddTenant}
                  placeholder="Nhập tiền nước"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Tên bên thuê</FormLabel>
                <Input
                  name="tenantName"
                  value={contractDetails.tenantName}
                  onChange={handleAddTenant}
                  placeholder="Nhập tên bên thuê"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Tên bên cho thuê </FormLabel>
                <Input
                  name="landlordName"
                  value={contractDetails.landlordName}
                  onChange={handleAddTenant}
                  placeholder="Nhập tên bên cho thuê"
                />
              </FormControl>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleCreateContract}>
              Tạo hợp đồng
            </Button>
            <Button variant="ghost" onClick={onCloseContract}>
              Hủy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Modal for information of room */}
      <Modal
        isCentered
        isOpen={isOpenInfoRoom}
        onClose={onCloseInfoRoom}
        size={"2xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text fontSize="2xl" fontWeight="bold" align={"center"}>
              {selectedRoom?.roomName || "Đang tải..."}
            </Text>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {/* Main Image and Details */}
            <HStack align="start" spacing={4}>
              <Image
                src={selectedImage || "Đang tải..."}
                alt={selectedRoom?.roomName || "Đang tải..."}
                borderRadius="md"
                boxSize="250px"
                objectFit="cover"
              />

              {/* Room Details */}

              <VStack align={"start"} spacing={2} flex="1">
                <Text fontWeight="bold">Số điện:</Text>{" "}
                <Text> {selectedRoom?.electricity || "Đang tải..."}</Text>
                <Text fontWeight="bold">Số nước:</Text>{" "}
                <Text>{selectedRoom?.water || "Đang tải..."}</Text>
                <Text fontWeight="bold">Giá phòng:</Text>{" "}
                <Text>{selectedRoom?.price || "Đang tải..."} VND</Text>
                <Text fontWeight="bold">Diện tích:</Text>{" "}
                <Text>{selectedRoom?.area || "Đang tải..."} m²</Text>
                <Text fontWeight="bold">Mô tả:</Text>{" "}
                <Text>{selectedRoom?.description || "Đang tải..."}</Text>
              </VStack>
            </HStack>

            {/* Thumbnail Images */}
            <HStack mt={4} spacing={2}>
              {selectedRoom?.images.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  boxSize="50px"
                  objectFit="cover"
                  borderRadius="md"
                  cursor="pointer"
                  onClick={() => setSelectedImage(image)} // Cập nhật hình ảnh khi nhấp vào
                />
              )) || "Đang tải"}
            </HStack>

            {/* Tenant Information */}
            <Box mt={6} borderWidth="1px" borderRadius="md" p={4}>
              <Text fontWeight="bold" mb={2}>
                Khách thuê:
              </Text>
              <HStack spacing={3}>
                <Avatar src={newRoom.tenantAvatar} />
                <VStack align="start" spacing={0}>
                  <Text>Tên khách thuê: {newRoom.tenantName}</Text>
                  <Text>Số điện thoại: {newRoom.tenantPhone}</Text>
                </VStack>
              </HStack>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onCloseInfoRoom}>
              Đóng
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Modal for edit information of room*/}
      <Modal isCentered isOpen={isOpenRoom} onClose={onCloseRoom} size={"2xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Input
              w={"80%"}
              value={selectedRoom?.roomName || ""}
              onChange={(e) => handleInputChange("roomName", e.target.value)}
              fontSize="2xl"
              fontWeight="bold"
              align={"center"}
              placeholder="Tên phòng"
            />
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {/* Main Image and Details */}
            <HStack align="start" spacing={4}>
              <Image
                src={selectedRoom?.images || ""}
                alt={selectedRoom?.roomName || "Đang tải..."}
                borderRadius="md"
                boxSize="250px"
                objectFit="cover"
              />
              <VStack align={"start"} spacing={2} flex="1">
                <Text fontWeight="bold">Giá phòng:</Text>
                <Input
                  type="number"
                  value={selectedRoom?.price || ""}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="Giá phòng (VND)"
                />
                <Text fontWeight="bold">Diện tích:</Text>
                <Input
                  type="number"
                  value={selectedRoom?.area || ""}
                  onChange={(e) => handleInputChange("area", e.target.value)}
                  placeholder="Diện tích (m²)"
                />
                <Text fontWeight="bold">Mô tả:</Text>
                <Textarea
                  value={selectedRoom?.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Mô tả phòng"
                />
              </VStack>
            </HStack>

            {/* Thumbnail Images */}
            <HStack mt={4} spacing={2}>
              {selectedRoom?.images?.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  boxSize="50px"
                  objectFit="cover"
                  borderRadius="md"
                  cursor="pointer"
                />
              ))}
            </HStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onCloseRoom}>
              Đóng
            </Button>
            <Button colorScheme="blue" onClick={handleSaveChanges}>
              Lưu thay đổi
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Modal for update */}
      <Modal isCentered isOpen={isOpenUpdate} onClose={onCloseUpdate}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cập nhật số điện và số nước</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="electricity" mb={4}>
              <FormLabel>Số điện</FormLabel>
              <Input
                type="number"
                placeholder="Nhập số điện"
                value={update.elecIndex}
                onChange={handleUpdate}
              />
            </FormControl>
            <FormControl id="water">
              <FormLabel>Số nước</FormLabel>
              <Input
                type="number"
                placeholder="Nhập số nước"
                value={update.aquaIndex}
                onChange={handleUpdate}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Tháng</FormLabel>
              <Select placeholder="Chọn tháng" mb={4}>
                {months.map((month, index) => (
                  <option key={index} value={month}>
                    {month}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Tháng</FormLabel>
              <Select placeholder="Chọn năm">
                {years.map((year, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleUpdate}>
              Cập nhật
            </Button>
            <Button variant="ghost" onClick={onCloseUpdate} ml={3}>
              Hủy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </Box>
  );
};

export default RoomList;
