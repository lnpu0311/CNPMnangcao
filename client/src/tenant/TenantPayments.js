import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  VStack,
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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Image,
  Flex,
  Divider,
  Select,
  Container
} from "@chakra-ui/react";
import {  FaArrowLeft } from "react-icons/fa";
import { Link as RouterLink, useNavigate } from 'react-router-dom';



// Dữ liệu giả cho thanh toán
const mockPayments = [
  {
    id: 1,
    roomId: 1,
    date: "2024-09-20",
    amount: 2000000,
    type: "Tháng",
    method: "Paypal",
    phone: "0123456789",
  },
  {
    id: 2,
    roomId: 2,
    date: "2024-09-25",
    amount: 2000000,
    type: "Tháng",
    method: "Visa",
    phone: "0123456789",
  },
  {
    id: 3,
    roomId: 3,
    date: "2024-10-01",
    amount: 1800000,
    type: "Tháng",
    method: "MasterCard",
    phone: "0987654321",
  },
  {
    id: 4,
    roomId: 4,
    date: "2024-10-05",
    amount: 2200000,
    type: "Tháng",
    method: "Paypal",
    phone: "0987654321",
  },
];


function TenantPayments() {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  const [selectedTimeFrame, setSelectedTimeFrame] = useState("all");
  const [customDate, setCustomDate] = useState("");
  const [filteredPayments, setFilteredPayments] = useState(mockPayments);

  const formatInputDate = (input) => {
    // Loại bỏ các ký tự không phải số
    const numbers = input.replace(/\D/g, "");

    // Định dạng thành dd/mm/yyyy
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4)
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(
      4,
      8
    )}`;
  };

  const handleDateChange = (e) => {
    const formattedDate = formatInputDate(e.target.value);
    setCustomDate(formattedDate);
    setSelectedTimeFrame("custom");
  };

  const isValidDate = (dateString) => {
    // Kiểm tra định dạng dd/mm/yyyy
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(dateString)) return false;

    const [, day, month, year] = dateString.match(regex);
    const date = new Date(year, month - 1, day);
    return date && date.getMonth() === month - 1 && date.getDate() == day;
  };

  useEffect(() => {
    filterPayments();
  }, [selectedTimeFrame]);

  const handleFilter = () => {
    filterPayments();
  };

  const filterPayments = () => {
    let filteredData = mockPayments;
    const currentDate = new Date();

    if (customDate && isValidDate(customDate)) {
      const [day, month, year] = customDate.split("/");
      const searchDate = new Date(year, month - 1, day);
      filteredData = mockPayments.filter((payment) => {
        const paymentDate = new Date(payment.date);
        return paymentDate.toDateString() === searchDate.toDateString();
      });
    } else {
      switch (selectedTimeFrame) {
        case "month":
          filteredData = mockPayments.filter((payment) => {
            const paymentDate = new Date(payment.date);
            return (
              paymentDate.getMonth() === currentDate.getMonth() &&
              paymentDate.getFullYear() === currentDate.getFullYear()
            );
          });
          break;
        case "year":
          filteredData = mockPayments.filter((payment) => {
            const paymentDate = new Date(payment.date);
            return paymentDate.getFullYear() === currentDate.getFullYear();
          });
          break;
        default:
          // "all" - không cần lọc
          break;
      }
    }

    setFilteredPayments(filteredData);
  };

  const handlePaymentClick = (payment) => {
    setSelectedPayment(payment);
    setIsOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setIsOpenDetail(false);
    setSelectedPayment(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    
    <Container maxW="container.xl" py={4}>
      <Flex alignItems="center" justifyContent="space-between" mb={4}>
      <Button
        onClick={handleGoBack}
        colorScheme="teal"
        leftIcon={<FaArrowLeft />}
      >
        Quay lại
      </Button>
      </Flex>

    <Text fontSize="2xl" fontWeight="bold" textAlign="center" flex="1" my={2}>
      Lịch sử thanh toán
    </Text>

    <Box 
      p={2} 
      maxWidth="400px" 
      width="100%" 
      display="flex" 
      justifyContent="center" // Căn giữa theo chiều ngang 
      alignItems="center" // Căn giữa theo chiều dọc
      mx="auto" // Tự động căn giữa trong không gian
    >
      <Text>Member: Nguyễn Văn A</Text>
    </Box>

    <Flex gap={2} alignItems="flex-end" textColor="black" maxWidth="400px" width="100%"> {/* Giảm chiều rộng */}
      <Box flex={1} mb={2}>
        <Text mb={1}>Thời gian</Text>
        <Select
          value={selectedTimeFrame}
          onChange={(e) => {
            setSelectedTimeFrame(e.target.value);
            if (e.target.value !== "custom") {
              setCustomDate("");
              filterPayments();
            }
          }}
          size="sm"
        >
          <option value="all">Tất cả</option>
          <option value="month">Tháng</option>
          <option value="year">Năm</option>
        </Select>
      </Box>
      
      <Box flex={1} mb={2}>
        <Text mb={1}>Ngày cụ thể</Text>
        <Input
          type="text"
          value={customDate}
          onChange={handleDateChange}
          placeholder="DD/MM/YYYY"
          maxLength={10}
          size="sm"
        />
      </Box>
      
      <Button
        colorScheme="teal"
        onClick={handleFilter}
        isDisabled={!isValidDate(customDate)}
        mb={2}
        size="sm"
      >
        Xác nhận
      </Button>
    </Flex>

    <Table variant="simple" borderWidth={1} borderRadius="lg">
      <Thead bg="cyan.100">
        <Tr>
          <Th borderRightWidth={1} textAlign="center">Phòng</Th>
          <Th borderRightWidth={1} textAlign="center">Ngày thanh toán</Th>
          <Th borderRightWidth={1} textAlign="center">Loại</Th>
          <Th borderRightWidth={1} textAlign="center">Số tiền</Th>
          <Th borderRightWidth={1} textAlign="center">Số điện thoại</Th>
          <Th textAlign="center">Trạng thái</Th>
        </Tr>
      </Thead>
      <Tbody textColor="black">
        {filteredPayments.map((payment, index) => (
          <React.Fragment key={payment.id}>
            {index > 0 && (
              <Tr>
                <Td colSpan={7}>
                  <Divider borderColor="black" borderWidth="1px" />
                </Td>
              </Tr>
            )}
            <Tr
              onClick={() => handlePaymentClick(payment)}
              cursor="pointer"
              _hover={{ bg: "gray.50" }}
            >
              <Td textAlign="center">{payment.roomId}</Td>
              <Td textAlign="center">{formatDate(payment.date)}</Td>
              <Td textAlign="center">{payment.type}</Td>
              <Td textAlign="center">{formatCurrency(payment.amount)}</Td>
              <Td textAlign="center">{payment.phone}</Td>
              <Td textAlign="center">Đã thanh toán</Td>
            </Tr>
          </React.Fragment>
        ))}
      </Tbody>
    </Table>

      {/* Modal hiển thị chi tiết thanh toán */}
      <Modal isOpen={isOpenDetail} onClose={handleCloseDetail}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chi tiết thanh toán</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedPayment && (
              <VStack align="stretch" spacing={2}>
                <Text fontWeight="bold">RoomID: {selectedPayment.roomId}</Text>
                <Text>Member: Nguyễn Văn A</Text>
                <Text>Ngày thanh toán: {formatDate(selectedPayment.date)}</Text>
                <Text>Loại: {selectedPayment.type}</Text>
                <Text>Số tiền: {formatCurrency(selectedPayment.amount)}</Text>
                
                <Text>Số điện thoại: {selectedPayment.phone}</Text>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={handleCloseDetail}>
              Đóng
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </Container>
  );
}

export default TenantPayments;
