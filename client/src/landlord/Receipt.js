import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Select,
  VStack,
  Stack,
  Heading,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";

const paidInvoices = [
  {
    roomName: "Phòng 101",
    amountPaid: "1,500,000 VND",
    invoiceDate: "2024-10-01",
    paymentDate: "2024-11-01", // Thanh toán vào tháng 11
    facility: "Cơ sở A",
  },
  {
    roomName: "Phòng 102",
    amountPaid: "2,000,000 VND",
    invoiceDate: "2024-09-15",
    paymentDate: "2024-09-20",
    facility: "Cơ sở A",
  },
  {
    roomName: "Phòng 103",
    amountPaid: "1,800,000 VND",
    invoiceDate: "2024-10-10",
    paymentDate: "2024-10-20",
    facility: "Cơ sở B",
  },
  {
    roomName: "Phòng 104",
    amountPaid: "2,500,000 VND",
    invoiceDate: "2024-08-20",
    paymentDate: "2024-09-01",
    facility: "Cơ sở C",
  },
  {
    roomName: "Phòng 105",
    amountPaid: "2,000,000 VND",
    invoiceDate: "2023-09-15",
    paymentDate: "2023-09-20",
    facility: "Cơ sở B",
  },
];

const Receipt = () => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedFacility, setSelectedFacility] = useState("");
  const [searchRoomName, setSearchRoomName] = useState("");

  const filteredInvoices = paidInvoices.filter((invoice) => {
    if (!selectedMonth && !selectedYear && !selectedFacility && !searchRoomName)
      return true;

    const invoiceDate = new Date(invoice.invoiceDate);
    const invoiceMonth = invoiceDate.getMonth() + 1;
    const invoiceYear = invoiceDate.getFullYear();

    const monthMatches = selectedMonth
      ? invoiceMonth === parseInt(selectedMonth)
      : true;
    const yearMatches = selectedYear
      ? invoiceYear === parseInt(selectedYear)
      : true;
    const facilityMatches = selectedFacility
      ? invoice.facility === selectedFacility
      : true;
    const roomNameMatches = searchRoomName
      ? invoice.roomName.toLowerCase().includes(searchRoomName.toLowerCase())
      : true;

    return monthMatches && yearMatches && facilityMatches && roomNameMatches;
  });

  const getMonthFromDate = (date) => {
    const invoiceDate = new Date(date);
    return `${invoiceDate.getMonth() + 1}/${invoiceDate.getFullYear()}`;
  };

  return (
    <Box>
      <Heading
        textColor={"blue.500"}
        as="h3"
        size="lg"
        mb={{ base: 4, md: 12 }}
        textAlign={"center"}
      >
        Danh Sách Thanh Toán
      </Heading>

      {/* Bộ lọc */}
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={8}
        align={{ base: "stretch", md: "center" }}
      >
        {/* Tìm kiếm theo tên phòng */}
        <Input
          placeholder="Tìm theo tên phòng"
          value={searchRoomName}
          onChange={(e) => setSearchRoomName(e.target.value)}
          maxWidth="300px"
        />

        <VStack
          spacing={2}
          align="stretch"
          display={{ base: "flex", md: "none" }}
        >
          <Select
            placeholder="Chọn cơ sở"
            value={selectedFacility}
            onChange={(e) => setSelectedFacility(e.target.value)}
          >
            <option value="Cơ sở A">Cơ sở A</option>
            <option value="Cơ sở B">Cơ sở B</option>
            <option value="Cơ sở C">Cơ sở C</option>
          </Select>
          <Select
            placeholder="Chọn tháng"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Tháng {i + 1}
              </option>
            ))}
          </Select>
          <Select
            placeholder="Chọn năm"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </Select>
        </VStack>

        {/* Bộ lọc desktop */}
        <Stack
          direction="row"
          spacing={8}
          align="center"
          display={{ base: "none", md: "flex" }}
        >
          <Select
            placeholder="Chọn cơ sở"
            value={selectedFacility}
            onChange={(e) => setSelectedFacility(e.target.value)}
            maxWidth="200px"
          >
            <option value="Cơ sở A">Cơ sở A</option>
            <option value="Cơ sở B">Cơ sở B</option>
            <option value="Cơ sở C">Cơ sở C</option>
          </Select>
          <Select
            placeholder="Chọn tháng"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            maxWidth="150px"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Tháng {i + 1}
              </option>
            ))}
          </Select>
          <Select
            placeholder="Chọn năm"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            maxWidth="150px"
          >
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </Select>
        </Stack>
      </Stack>

      {/* Hiển thị dữ liệu */}
      {filteredInvoices.length > 0 ? (
        <Table
          variant="striped"
          colorScheme="blue"
          mt={4}
          size={{ base: "sm", md: "md" }}
        >
          <Thead>
            <Tr>
              <Th>Cơ Sở</Th>
              <Th>Tên Phòng</Th>
              <Th>Số Tiền Đã Thanh Toán</Th>
              <Th>Tháng</Th>
              <Th>Ngày Thanh Toán</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredInvoices.map((invoice, index) => (
              <Tr key={index}>
                <Td>{invoice.facility}</Td>
                <Td>{invoice.roomName}</Td>
                <Td>{invoice.amountPaid}</Td>
                <Td>{getMonthFromDate(invoice.invoiceDate)}</Td>
                <Td>{invoice.paymentDate}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Text fontSize="lg" color="gray.500" textAlign="center" w="100%">
          Không có dữ liệu
        </Text>
      )}
    </Box>
  );
};

export default Receipt;
