import React, { useState } from "react";
import {
  Box,
  Heading,
  Button,
  IconButton,
  Flex,
  Stack,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  FormErrorMessage,
  Text,
  Image,
  Avatar,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaEdit, FaTrash, FaSave } from "react-icons/fa";
import { EditIcon, PlusSquareIcon } from "@chakra-ui/icons";

const EmployeeManagement = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    hostel: "",
    password: "",
    confirmPassword: "",
    avatar: "",
    name: "",
  });
  const [errors, setErrors] = useState({});

  // Dummy employee data
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      hostel: "Nhà trọ quận 5",
      phone: "1233457890",
      isEditing: false,
    },
    {
      id: 2,
      name: "Trần Thị B",
      hostel: "Chi nhánh 2",
      phone: "123",
      isEditing: false,
    },
    {
      id: 3,
      name: "Lê Minh C",
      hostel: "Chi nhánh 3",
      phone: "123",
      isEditing: false,
    },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Vui lòng điền email";
    if (!formData.hostel) newErrors.hostel = "Vui lòng điền cơ sở";
    if (!formData.password) newErrors.password = "Vui lòng điền mật khẩu";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddNew = () => {
    setFormData({
      email: "",
      phone: "",
      hostel: "",
      password: "",
      confirmPassword: "",
      avatar: "",
    });
    onOpen();
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setEmployees((prevEmployees) => [
        ...prevEmployees,
        { id: Date.now(), ...formData, isEditing: false },
      ]);
      onClose();
      toast({
        title: "Thêm nhân viên thành công",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const toggleEdit = (id) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee.id === id
          ? { ...employee, isEditing: !employee.isEditing }
          : employee
      )
    );
  };

  const handleHostelChange = (id, newHostel) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee.id === id ? { ...employee, hostel: newHostel } : employee
      )
    );
  };

  const saveHostelChange = (id) => {
    toggleEdit(id);
    toast({
      title: "Cập nhật thành công",
      description: "Cơ sở trực thuộc đã được thay đổi.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const confirmDelete = (employee) => {
    setSelectedEmployee(employee);
    onDeleteModalOpen();
  };

  const handleDelete = () => {
    setEmployees((prevEmployees) =>
      prevEmployees.filter((employee) => employee.id !== selectedEmployee.id)
    );
    onDeleteModalClose();
    toast({
      title: "Nhân viên đã bị xóa",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };
  return (
    <Box>
      <Heading
        textColor={"blue.500"}
        as="h3"
        size="lg"
        mb={{ base: 4, md: 12 }}
      >
        Quản Lý Nhân Viên
      </Heading>

      {/* Add New Employee */}
      <Flex justifyContent={"flex-end"} mb={8}>
        <Button
          colorScheme="green"
          onClick={handleAddNew}
          leftIcon={<PlusSquareIcon />}
        >
          Thêm nhân viên mới
        </Button>

        <Modal isCentered isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textAlign={"center"}>Thêm Nhân Viên Mới</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={4}>
                <FormControl isRequired isInvalid={!!errors.name}>
                  <FormLabel>Tên</FormLabel>
                  <Input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nhập tên"
                  />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={!!errors.email}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Nhập email"
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={!!errors.phone}>
                  <FormLabel>Số điện thoại</FormLabel>
                  <Input
                    name="phone"
                    type="number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Nhập số điện thoại"
                  />
                  <FormErrorMessage>{errors.phone}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={!!errors.hostel}>
                  <FormLabel>Cơ sở trực thuộc</FormLabel>
                  <Input
                    name="hostel"
                    value={formData.hostel}
                    onChange={handleInputChange}
                    placeholder="Chọn cơ sở trực thuộc"
                  />
                  <FormErrorMessage>{errors.hostel}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={!!errors.password}>
                  <FormLabel>Mật khẩu</FormLabel>
                  <Input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Nhập mật khẩu"
                  />
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={!!errors.confirmPassword}>
                  <FormLabel>Nhập lại mật khẩu</FormLabel>
                  <Input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Nhập lại mật khẩu"
                  />
                  <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                </FormControl>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="green" mr={3} onClick={handleSubmit}>
                Lưu
              </Button>
              <Button colorScheme="red" onClick={onClose}>
                Hủy
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>

      {/* Employee Information */}
      <Box borderRadius="md">
        <Stack spacing={4}>
          {employees.map((employee) => (
            <Flex
              boxShadow="lg"
              bg={"brand.2"}
              key={employee.id}
              justify="space-between"
              align="center"
              p={4}
              borderRadius="md"
            >
              <Flex flex="2" align="center">
                <Avatar
                  mr={4}
                  name={employee.name}
                  src="https://bit.ly/broken-link"
                />
                <Text fontWeight="bold" mr={4}>
                  {employee.name}
                </Text>
              </Flex>

              <Flex flex="2" align="center">
                <Text mr={2}>Số điện thoại:</Text>
                <Text fontWeight="bold" mr={4}>
                  {employee.phone}
                </Text>
              </Flex>

              <Flex flex="3" align="center">
                <Text mr={2}>Cơ sở:</Text>
                {employee.isEditing ? (
                  <Input
                    value={employee.hostel}
                    onChange={(e) =>
                      handleHostelChange(employee.id, e.target.value)
                    }
                    placeholder="Sửa cơ sở trực thuộc"
                    textColor={"black"}
                  />
                ) : (
                  <Text fontWeight="bold">{employee.hostel}</Text>
                )}
              </Flex>

              <Flex flex="1" justify="flex-end" gap={2}>
                {employee.isEditing ? (
                  <IconButton
                    aria-label="Lưu"
                    icon={<FaSave />}
                    colorScheme="blue"
                    onClick={() => saveHostelChange(employee.id)}
                  />
                ) : (
                  <IconButton
                    aria-label="Chỉnh Sửa"
                    icon={<FaEdit />}
                    colorScheme="blue"
                    onClick={() => toggleEdit(employee.id)}
                  />
                )}
                <IconButton
                  aria-label="Xóa"
                  icon={<FaTrash />}
                  colorScheme="red"
                  onClick={() => confirmDelete(employee)}
                />
              </Flex>
            </Flex>
          ))}
        </Stack>
      </Box>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Xác nhận xóa</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Bạn có chắc chắn muốn xóa nhân viên{" "}
            <strong>{selectedEmployee?.name}</strong> không?
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDelete}>
              Xóa
            </Button>
            <Button variant="ghost" onClick={onDeleteModalClose}>
              Hủy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default EmployeeManagement;
