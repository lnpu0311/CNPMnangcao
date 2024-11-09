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
} from "@chakra-ui/react";

import {
  FaArrowLeft,
  FaEdit,
  FaPlus,
  FaTrash,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import axios from "axios";
const RoomList = () => {
  const [hostel, setHostel] = useState();
  const [rooms, setRooms] = useState([]);
  const { facilityId } = useParams();
  useEffect(() => {
    console.log(facilityId);
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
  const [selectedImage, setSelectedImage] = useState(selectedRoom?.images[0]);

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
  // Update field in selectedRoom object
  const handleInputChange = (field, value) => {
    setSelectedRoom((prevRoom) => ({
      ...prevRoom,
      [field]: value,
    }));
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
    try{
      const response = await axios.post(
        'https://localhost:5000/api/landlord/contract/create',
        contractDetails,
        {
          headers:{
            Authorization:`Bearer ${localStorage.getItem('token')}`,
          }
        }
      );
      if(response.data.success){
        alert("Tạo hợp đồng thành công");
        setContractDetails({
          startDate:"",
          endDate:"",
          deposit:"",
          rent:"",
          electricityFee:"",
          waterFee:"",
          tenantName:"",
          landlordName:"",
        });
        onCloseContract();
      }
    }catch(error){
      console.error("Lỗi khi tạo hợp đồng",error);
      alert("Không thể tạo hợp đồng : "+error.response.data.message);
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

      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Danh sách phòng của cơ sở: {hostel?.name || "Đang tải..."}
      </Text>

      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
        {rooms.map((room) => (
          <Box
            key={room.id}
            borderRadius="lg"
            overflow="hidden"
            boxShadow="xl"
            bg={room.status === "occupied" ? "brand.200" : "brand.0"}
            position="relative"
            p={3}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            onClick={() => handleRoomClick(room)}
            cursor="pointer"
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
                  onOpenRoom(room);
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
            <Button colorScheme="blue">Chi tiết hợp đồng</Button>
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
    </Box>
  );
};

export default RoomList;
