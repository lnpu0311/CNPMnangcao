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
  Tag,
} from "@chakra-ui/react";

import {
  FaArrowLeft,
  FaEdit,
  FaPlus,
  FaTrash,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import axios from "axios";
// Giả sử đây là dữ liệu phòng mẫu
const RoomList = () => {
  const [hostel, setHostel] = useState();
  const [rooms, setRooms] = useState([]);
  const { facilityId } = useParams();
  useEffect(() => {
    console.log(facilityId);
    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/landlord/hostel/${facilityId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Dữ liệu hostel:", response.data.data);
        setHostel(response.data.data); // Gán dữ liệu hostel vào state
        setRooms(response.data.data.rooms); // Gán dữ liệu phòng vào state
      } catch (error) {
        console.log("Lỗi khi lấy dữ liệu:", error);
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
    isOpen: isOpenRoom,
    onOpen: onOpenRoom,
    onClose: onCloseRoom,
  } = useDisclosure();
  const {
    isOpen: isOpenContract,
    onOpen: onOpenContract,
    onClose: onCloseContract,
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
  const [selectedRoom, setSelectedRoom] = useState(null);
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
    onOpenRoom();
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoom((prevRoom) => ({
      ...prevRoom,
      [name]: value,
    }));
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
  const handleCreateContract = () => {
    console.log("Creating Contract:", contractDetails);
    // Add logic to save the contract to the database here
    setContractDetails({
      startDate: "",
      endDate: "",
      deposit: "",
      rent: "",
      electricityBill: "",
      waterBill: "",
      tenantName: "",
      landlordName: "",
    });
    onCloseContract();
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
        `http://localhost:5000/api/landlord/room/${facilityId}/create`,
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
        onCloseRoom();
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
        <Button onClick={onOpenRoom} colorScheme="green" rightIcon={<FaPlus />}>
          Thêm phòng mới
        </Button>
      </Flex>

      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Danh sách phòng của cơ sở: {hostel?.name || "Đang tải..."}
      </Text>

      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
        {rooms.map((room) => (
          <Box
            border="2px solid"
            key={room.id}
            borderRadius="lg"
            overflow="hidden"
            boxShadow="xl"
            bg={room.status === "occupied" ? "brand.200" : "white"}
            position="relative"
            p={3}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            onClick={() => handleRoomClick(room)}
            cursor="pointer"
            borderColor="brand.2"
          >
            <Image
              boxSize="200px"
              src={room.images[0]}
              alt={room.roomName}
              mb={3}
              borderRadius="md"
              objectFit="cover"
            />
            <Text fontWeight="bold" mb={1} textAlign="center">
              {room.roomName}
            </Text>
            <Flex mt={3} gap={2} justifyContent="center" wrap="wrap">
              <Button
                leftIcon={<FaEdit />}
                size="sm"
                colorScheme="teal"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditRoom(room);
                }}
              >
                Chỉnh sửa
              </Button>
              {/* Only show the Add button if the room is not occupied */}
              {room.is_available !== true && (
                <Button
                  leftIcon={<FaPlus />}
                  size="sm"
                  colorScheme="blue"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenContract();
                    handleAddRoom(room);
                  }}
                >
                  Thêm hợp đồng
                </Button>
              )}
              <Button
                leftIcon={<FaTrash />}
                size="sm"
                colorScheme="red"
                onClick={(e) => {
                  e.stopPropagation();

                  handleDeleteRoom(room);
                }}
              >
                Xóa phòng
              </Button>
              {room.status === "occupied" && (
                <Button
                  leftIcon={<FaFileInvoiceDollar />}
                  size="sm"
                  colorScheme="purple"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateBill(room);
                  }}
                >
                  Tạo hóa đơn
                </Button>
              )}
            </Flex>
          </Box>
        ))}
      </SimpleGrid>
      {/* Modal for Adding New Room */}
      <Modal isCentered isOpen={isOpenRoom} onClose={onCloseRoom}>
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
            <Button colorScheme="red" onClick={onCloseRoom}>
              Hủy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal for Creating Contract */}
      <Modal isOpen={isOpenContract} onClose={onCloseContract}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Hợp đồng mới</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <FormControl>
                <FormLabel>Ngày tạo*</FormLabel>
                <Input
                  name="startDate"
                  type="date"
                  value={contractDetails.startDate}
                  onChange={handleAddTenant}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Ngày hết hạn*</FormLabel>
                <Input
                  name="endDate"
                  type="date"
                  value={contractDetails.endDate}
                  onChange={handleAddTenant}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Tiền cọc*</FormLabel>
                <Input
                  name="deposit"
                  type="number"
                  value={contractDetails.deposit}
                  onChange={handleAddTenant}
                  placeholder="Nhập tiền cọc"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Tiền thuê phòng*</FormLabel>
                <Input
                  name="rent"
                  type="number"
                  value={contractDetails.rent}
                  onChange={handleAddTenant}
                  placeholder="Nhập tiền thuê phòng"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Số tiền điện*</FormLabel>
                <Input
                  name="electricityBill"
                  type="number"
                  value={contractDetails.electricityBill}
                  onChange={handleAddTenant}
                  placeholder="Nhập tiền điện"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Số tiền nước*</FormLabel>
                <Input
                  name="waterBill"
                  type="number"
                  value={contractDetails.waterBill}
                  onChange={handleAddTenant}
                  placeholder="Nhập tiền nước"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Tên bên thuê*</FormLabel>
                <Input
                  name="tenantName"
                  value={contractDetails.tenantName}
                  onChange={handleAddTenant}
                  placeholder="Nhập tên bên thuê"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Tên bên cho thuê *</FormLabel>
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
            <Button colorScheme="teal" mr={3} onClick={handleCreateContract}>
              Tạo hợp đồng
            </Button>
            <Button variant="ghost" onClick={onCloseContract}>
              Hủy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default RoomList;
