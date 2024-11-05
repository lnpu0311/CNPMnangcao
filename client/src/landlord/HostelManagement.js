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
  Select,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { jwtDecode } from "jwt-decode";
import vietnamData from "../data/dvhcvn.json"


const FacilityItem = ({ facility, onDelete }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards,setWards] = useState([]);
  const handleEditClick = () => {
    navigate(`/landlord/room-list/${facility.id}`);
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
        <Box textAlign="left" display="flex" flexDirection="column" gap={2}>
          <Text fontSize="x-large" fontWeight="bold" color="blue.500">
            {facility.name}
          </Text>

          <Box display="flex" alignItems="center">
            <Text fontSize="md" color="gray.600" mr={2}>
              Thành phố:
            </Text>
            <Text fontSize="md" fontWeight={"bold"}>
              {facility.city}
            </Text>
          </Box>

          <Box display="flex" alignItems="center">
            <Text fontSize="md" color="gray.600" mr={2}>
              Quận:
            </Text>
            <Text fontSize="md" fontWeight={"bold"}>
              {facility.district}
            </Text>
          </Box>

          <Box display="flex" alignItems="center">
            <Text fontSize="md" color="gray.600" mr={2}>
              Địa chỉ:
            </Text>
            <Text fontSize="md" fontWeight={"bold"}>
              {facility.address}
            </Text>
          </Box>
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
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    image: null,
  });
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      const decodedUser = jwtDecode(storedToken);
      setUser(decodedUser);
    }
  }, []);

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

  useEffect(() => {
    setProvinces(vietnamData.data);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleProvinceChange = (e) => {
    const provinceName = e.target.value;
    const province = provinces.find(p => p.name === provinceName);
    setDistricts(province ? province.level2s : []);
    setWards([]);
    setFormData({
      ...formData,
      city: provinceName,
      district: '',
      ward: ''
    });
  };

  const handleDistrictChange = (e) => {
    const districtName = e.target.value;
    const district = districts.find(d => d.name === districtName);
    setWards(district ? district.level3s : []);
    setFormData({
      ...formData,
      district: districtName,
      ward: ''
    });
  };

  const handleWardChange = (e) => {
    const wardName = e.target.value;
    setFormData({
      ...formData,
      ward: wardName
    });
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("address", formData.address);
    data.append("city", formData.city);
    data.append("district", formData.district);
    data.append("ward", formData.ward);
    data.append("image", formData.image);
    data.append("landlordId", user.id);

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
      setFormData({
        name: "",
        address: "",
        city: "",
        district: "",
        ward: "",
        image: null,
      });
      onClose();
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
    }
  };

  const handleDeleteFacility = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/hostel/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFacilities((prev) => prev.filter((facility) => facility.id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa cơ sở:", error);
    }
  };

  // Component FacilityItem nested bên trong HostelManagement
  const FacilityItem = ({ facility }) => {
    const navigate = useNavigate();

    const handleEditClick = () => {
      navigate(`/landlord/room-list/${facility.id}`);
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
            <Button
              onClick={() => handleDeleteFacility(facility.id)}
              colorScheme="red"
            >
              Xóa cơ sở
            </Button>
          )}
        </Flex>
      </Flex>
    );
  };

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
        <Modal isCentered isOpen={isOpen} onClose={onClose} size="lg">
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
                  <FormLabel>Thành phố/Tỉnh</FormLabel>
                  <Select
                    name="city"
                    value={formData.city}
                    onChange={handleProvinceChange}
                    placeholder="Chọn thành phố/tỉnh"
                  >
                    {provinces.map((province) => (
                      <option key={province.level1_id} value={province.name}>
                        {province.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Quận/Huyện</FormLabel>
                  <Select
                    name="district"
                    value={formData.district}
                    onChange={handleDistrictChange}
                    placeholder="Chọn quận/huyện"
                    isDisabled={!formData.city}
                  >
                    {districts.map((district) => (
                      <option key={district.level2_id} value={district.name}>
                        {district.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Xã/Phường</FormLabel>
                  <Select
                    name="ward"
                    value={formData.ward}
                    onChange={handleWardChange}
                    placeholder="Chọn xã/phường"
                    isDisabled={!formData.district}
                  >
                    {wards.map((ward) => (
                      <option key={ward.level3_id} value={ward.name}>
                        {ward.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Địa chỉ chi tiết</FormLabel>
                  <Input
                    type="text"
                    name="address"
                    placeholder="Nhập số nhà, tên đường..."
                    value={formData.address}
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
        <FacilityItem key={facility.id} facility={facility} />
      ))}
    </Box>
  );
};

export default HostelManagement;
