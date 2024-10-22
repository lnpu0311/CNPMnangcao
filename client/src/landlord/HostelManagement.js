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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"; // Import navigation hook
import { FaPlusCircle } from "react-icons/fa";

// Dữ liệu cơ sở mẫu

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MGRlYTZkZTk5ZWUxYTRhMzU5YTlmMSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyOTQ5Mzc5NywiZXhwIjoxNzI5NDk3Mzk3fQ.Xcnyg_kNlqKapdASVQcPjCW3efpPTbKCKLU_8aASW2A";
const FacilityItem = ({ facility }) => {
  const navigate = useNavigate(); // Sử dụng hook điều hướng

  const handleEditClick = () => {
    // Chuyển hướng đến trang room-list kèm theo ID cơ sở
    navigate(`/room-list/${facility.id}`);
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
      <Flex alignItems="center">
        <Image
          src={facility.imageUrl}
          alt={facility.name}
          boxSize="100px"
          mr={4}
        />
        <Box textAlign={"left"}>
          <Text fontSize="2xl" fontWeight="bold" color="blue.500">
            {facility.name}
          </Text>
          <Text fontSize="md" color="gray.600">
            {facility.address}
          </Text>
        </Box>
      </Flex>
      <Button onClick={handleEditClick} variant={"solid"} colorScheme="green">
        Chỉnh sửa
      </Button>
    </Flex>
  );
};

// Component HostelManagement
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
    console.log([...data.entries()]);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/hostel",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token vào headers
            "Content-Type": "multipart/form-data", // Đảm bảo gửi đúng content type
          },
        }
      );

      console.log("Cơ sở mới đã được tạo:", response.data);
      setFacilities((prev) => [...prev, response.data.data]); // Cập nhật danh sách cơ sở
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
    }
    onClose(); // Đóng modal sau khi submit
  };
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/hostel", {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào headers
          },
        });
        console.log(response.data);
        setFacilities(response.data.data); // Cập nhật state với dữ liệu từ API
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };
    fetchFacilities();
  }, []);
  return (
    <Box>
      <Flex justifyContent="center" mb={4}>
        <Text fontSize="3xl" fontWeight="bold" as={"h2"}>
          Quản lý nhà trọ
        </Text>
      </Flex>
      <Flex justifyContent="flex-end" mb={6}>
        <Button onClick={onOpen} bg="brand.800" leftIcon={<FaPlusCircle />}>
          Thêm nhà trọ mới
        </Button>
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Biểu mẫu tạo nhà trọ</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Tên chi nhánh</FormLabel>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Nhập tên chi nhánh"
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
              <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                Tạo nhà trọ
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Đóng
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
      {facilities.map((facility) => (
        <FacilityItem key={facility.id} facility={facility} />
      ))}
    </Box>
  );
};

export default HostelManagement;
