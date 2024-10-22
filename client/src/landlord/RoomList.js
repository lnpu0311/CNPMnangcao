import React, { useState } from "react";
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
} from "@chakra-ui/react";

import {
  FaArrowLeft,
  FaPlusCircle,
  FaEdit,
  FaPlus,
  FaTrash,
  FaFileInvoiceDollar,
} from "react-icons/fa";
// Giả sử đây là dữ liệu phòng mẫu
const rooms = [
  { id: 1, name: "Phòng 101", facilityId: 1, status: "empty" },
  { id: 1, name: "Phòng 101", facilityId: 1, status: "empty" },
  { id: 1, name: "Phòng 101", facilityId: 1, status: "empty" },
  {
    id: 1,
    name: "Phòng 101",
    facilityId: 1,
    status: "occupied",
    paymentStatus: "paid",
  },
  {
    id: 2,
    name: "Phòng 102",
    facilityId: 1,
    status: "occupied",
    paymentStatus: "unpaid",
  },
  { id: 5, name: "Phòng 101", facilityId: 1, status: "empty" },
  {
    id: 8,
    name: "Phòng 102",
    facilityId: 1,
    status: "occupied",
    paymentStatus: "paid",
  },
  { id: 3, name: "Phòng 201", facilityId: 2, status: "empty" },
  { id: 4, name: "Phòng 202", facilityId: 2, status: "empty" },
  { id: 5, name: "Phòng 301", facilityId: 3, status: "empty" },
];

const RoomList = () => {
  const { facilityId } = useParams();
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
    title: "",
    name: "",
    area: "",
    price: "",
    description: "",
    hostel: "",
    coc: "",
    phone: "",
    image: "",
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

  const handleCreateRoom = () => {
    console.log("Creating Room:", newRoom);
    // Here you can add logic to save the new room to the database
    setNewRoom({ name: "", area: "", price: "", description: "" });
    onCloseRoom();
  };
  // Lọc danh sách phòng theo facilityId
  const filteredRooms = rooms.filter(
    (room) => room.facilityId === parseInt(facilityId)
  );

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
        <Button onClick={onOpenRoom} colorScheme="blue" rightIcon={<FaPlus />}>
          Thêm phòng mới
        </Button>
      </Flex>

      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Danh sách phòng cho cơ sở ID: {facilityId}
      </Text>

      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
        {filteredRooms.map((room) => (
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
              src="https://images.unsplash.com/photo-1530053969600-caed2596d242?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNlYXxlbnwwfHwwfHx8MA%3D%3D" // Replace with actual image URL
              alt={room.name}
              mb={3}
              borderRadius="md"
              objectFit="cover"
            />
            <Text fontWeight="bold" mb={1} textAlign="center">
              {room.name}
            </Text>
            {room.status === "occupied" && (
              <Badge
                colorScheme={room.paymentStatus === "paid" ? "green" : "red"}
              >
                {room.paymentStatus === "paid"
                  ? "Đã thanh toán"
                  : "Chưa thanh toán"}
              </Badge>
            )}
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
              {room.status !== "occupied" && (
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
                  Tạo HĐ
                </Button>
              )}
            </Flex>
          </Box>
        ))}
      </SimpleGrid>
      {/* Modal for Adding New Room */}
      <Modal isOpen={isOpenRoom} onClose={onCloseRoom}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thêm phòng mới</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Tiêu đề bài đăng </FormLabel>
              <Input
                name="title"
                value={newRoom.title}
                onChange={handleInputChange}
                placeholder="Nhập tiêu đề bài đăng"
              />
            </FormControl>
            <Text> Tên chi nhánh: {facilityId}</Text>
            <FormControl mb={3}>
              <FormLabel>Tên phòng</FormLabel>
              <Input
                name="name"
                value={newRoom.name}
                onChange={handleInputChange}
                placeholder="Nhập tên phòng"
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Diện tích (m²)</FormLabel>
              <Input
                type="number"
                name="area"
                value={newRoom.area}
                onChange={handleInputChange}
                placeholder="Nhập diện tích phòng"
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Số tiền cọc (VND)</FormLabel>
              <Input
                type="number"
                name="coc"
                value={newRoom.coc}
                onChange={handleInputChange}
                placeholder="Nhập giá tiền cọc"
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Giá phòng (VND)</FormLabel>
              <Input
                type="number"
                name="price"
                value={newRoom.price}
                onChange={handleInputChange}
                placeholder="Nhập giá phòng"
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Số điện thoại liên hệ:</FormLabel>
              <Input
                type="number"
                name="phone"
                value={newRoom.phone}
                onChange={handleInputChange}
                placeholder="Nhập số"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Mô tả chi tiết</FormLabel>
              <Input
                name="description"
                value={newRoom.description}
                onChange={handleInputChange}
                placeholder="Nhập mô tả phòng"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Thêm hình ảnh</FormLabel>
              <Input
                type="file"
                name="image"
                value={newRoom.image}
                onChange={handleInputChange}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleCreateRoom}>
              Tạo phòng
            </Button>
            <Button variant="ghost" onClick={onCloseRoom}>
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
