import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  Flex,
  Text,
  Image,
  Heading,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("token");
const user = jwtDecode(localStorage.getItem("token"));
console.log(user.id);
const FacilityItem = ({ facility, onDelete }) => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate(`/room-list/${facility.id}`);
  };

  const handleDeleteClick = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/hostel/${facility.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onDelete(facility.id); // Gọi hàm onDelete để cập nhật danh sách sau khi xóa
    } catch (error) {
      console.error("Lỗi khi xóa cơ sở:", error);
    }
  };

  return (
    <Flex
      bg="brand.2"
      p={4}
      mb={4}
      alignItems="center"
      justifyContent="space-between"
      borderRadius="md"
      shadow={"lg"}
    >
      <Flex>
        <Image
          borderRadius={8}
          src={facility.imageUrl}
          alt={facility.name}
          boxSize="200px"
          mr={4}
          objectFit={"cover"}
        />
        <Box textAlign="left" display="flex" flexDirection="column">
          <Text fontSize="x-large" fontWeight="bold" color="blue.500">
            {facility.name}
          </Text>
          <Text fontSize="md" color="gray.600">
            Địa chỉ: {facility.address}
          </Text>
        </Box>
      </Flex>
      <Flex>
        <Button onClick={handleEditClick} colorScheme="blue" mr={2}>
          Chỉnh sửa
        </Button>
        {(facility.roomCount === 0 || !facility.roomCount) && (
          <Button onClick={handleDeleteClick} colorScheme="red">
            Xóa cơ sở
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

const HostelManagement = () => {
  const [facilities, setFacilities] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    district: "",
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("address", formData.address);
    data.append("city", formData.city);
    data.append("district", formData.district);
    data.append("image", formData.image);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/landlord/hostel/create",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setFacilities((prev) => [...prev, response.data.data]);
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
    }
    onClose();
  };

  const handleDeleteFacility = (id) => {
    setFacilities((prev) => prev.filter((facility) => facility.id !== id));
  };

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/landlord/hostel",
          {
            params: {
              landlordId: user.id,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setFacilities(response.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };
    if (user && token) {
      fetchFacilities();
    }
  }, [user, token]);

  return (
    <Box>
      <Heading
        textColor={"blue.500"}
        as="h3"
        size="lg"
        mb={{ base: 4, md: 12 }}
      >
        Quản Lý Cơ Sở
      </Heading>

      <Flex justifyContent="flex-end" mb={6}>
        <Button
          onClick={onOpen}
          colorScheme="green"
          leftIcon={<PlusSquareIcon />}
        >
          Thêm cơ sở mới
        </Button>
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader fontSize="x-large" textAlign="center">
              Tạo cơ sở mới
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Tên chi nhánh</FormLabel>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Nhập tên cơ sở"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Địa chỉ chi tiết</FormLabel>
                  <Input
                    type="text"
                    name="address"
                    placeholder="Nhập địa chỉ chi tiết"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Thành phố/Tỉnh</FormLabel>
                  <Input
                    type="text"
                    name="city"
                    placeholder="Nhập thành phố hoặc tỉnh"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Quận/Huyện</FormLabel>
                  <Input
                    type="text"
                    name="district"
                    placeholder="Nhập quận hoặc huyện"
                    value={formData.district}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Hình ảnh</FormLabel>
                  <Input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="green" mr={3} onClick={handleSubmit}>
                Tạo cơ sở
              </Button>
              <Button colorScheme="red" onClick={onClose}>
                Hủy
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
      {facilities.map((facility) => (
        <FacilityItem
          key={facility.id}
          facility={facility}
          onDelete={handleDeleteFacility}
        />
      ))}
    </Box>
  );
};

export default HostelManagement;
