import React, { useState } from "react";
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
const facilitiesData = [
  {
    id: 1,
    name: "Tên cơ sở 1",
    address: "Địa chỉ cơ sở 1",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1670591909028-1ea631e317d7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHNlYXxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 2,
    name: "Tên cơ sở 2",
    address: "Địa chỉ cơ sở 2",
    imageUrl: "https://via.placeholder.com/200",
  },
  {
    id: 3,
    name: "Tên cơ sở 3",
    address: "Địa chỉ cơ sở 3",
    imageUrl: "https://via.placeholder.com/100",
  },
  {
    id: 1,
    name: "Tên cơ sở 1",
    address: "Địa chỉ cơ sở 1",
    imageUrl: "https://via.placeholder.com/100",
  },
  {
    id: 2,
    name: "Tên cơ sở 2",
    address: "Địa chỉ cơ sở 2",
    imageUrl: "https://via.placeholder.com/200",
  },
  {
    id: 3,
    name: "Tên cơ sở 3",
    address: "Địa chỉ cơ sở 3",
    imageUrl: "https://via.placeholder.com/100",
  },
  // Các cơ sở khác...
];

// Component FacilityItem
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
  const [facilities] = useState(facilitiesData);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    branchName: "",
    detailedAddress: "",
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

  const handleSubmit = () => {
    // Add your submit logic here
    console.log("Form Data Submitted:", formData);
    onClose(); // Close modal after submission
  };
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
                    name="branchName"
                    placeholder="Nhập tên chi nhánh"
                    value={formData.branchName}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Địa chỉ chi tiết</FormLabel>
                  <Input
                    type="text"
                    name="detailedAddress"
                    placeholder="Nhập địa chỉ chi tiết"
                    value={formData.detailedAddress}
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
