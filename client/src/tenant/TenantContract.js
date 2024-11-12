import React from "react";
import {
  Box,
  Text,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tag,
  Divider,
} from "@chakra-ui/react";

// Dữ liệu giả cho hợp đồng thuê
const mockContracts = [
  {
    id: "CNT123456",
    roomId: "P001",
    roomName: "Phòng 1",
    tenantName: "Nguyễn Văn A",
    startDate: "01/01/2023",
    endDate: "31/12/2023",
    monthlyRent: 5000000,
    deposit: 5000000,
    area: "25m²",
    status: "Đang hiệu lực",
    address: "123 Đường ABC, Quận 1, TP.HCM",
  },
  {
    id: "CNT123457",
    roomId: "P002",
    roomName: "Phòng 2",
    tenantName: "Nguyễn Văn A",
    startDate: "01/03/2023",
    endDate: "01/03/2024",
    monthlyRent: 6000000,
    deposit: 6000000,
    area: "30m²",
    status: "Sắp hết hạn",
    address: "456 Đường XYZ, Quận 2, TP.HCM",
  },
];

function TenantContract() {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Đang hiệu lực":
        return "green";
      case "Sắp hết hạn":
        return "yellow";
      case "Hết hạn":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <VStack spacing={4} align="stretch" w="100%" p={4}>
      <Text fontSize="2xl" fontWeight="bold">
        Thông tin hợp đồng thuê phòng
      </Text>

      <Box borderWidth={1} borderRadius="lg" p={4}>
        <Text>Người thuê: Nguyễn Văn A</Text>
        <Text>Số điện thoại: 0123456789</Text>
      </Box>

      <Table variant="simple" borderWidth={1} borderRadius="lg">
        <Thead bg="cyan.100">
          <Tr>
            <Th borderRightWidth={1}>Mã HĐ</Th>
            <Th borderRightWidth={1}>Phòng</Th>
            <Th borderRightWidth={1}>Địa chỉ</Th>
            
            <Th borderRightWidth={1}>Giá thuê</Th>
            <Th borderRightWidth={1}>Tiền cọc</Th>
            <Th borderRightWidth={1}>Ngày bắt đầu</Th>
            <Th borderRightWidth={1}>Ngày kết thúc</Th>
            <Th>Trạng thái</Th>
          </Tr>
        </Thead>
        <Tbody textColor="black">
          {mockContracts.map((contract, index) => (
            <React.Fragment key={contract.id}>
              {index > 0 && (
                <Tr>
                  <Td colSpan={9}>
                    <Divider borderColor="black" borderWidth="1px" />
                  </Td>
                </Tr>
              )}
              <Tr _hover={{ bg: "gray.50" }}>
                <Td borderRightWidth={1}>{contract.id}</Td>
                <Td borderRightWidth={1}>{contract.roomName}</Td>
                <Td borderRightWidth={1}>{contract.address}</Td>
              
                <Td borderRightWidth={1}>{formatCurrency(contract.monthlyRent)}</Td>
                <Td borderRightWidth={1}>{formatCurrency(contract.deposit)}</Td>
                <Td borderRightWidth={1}>{contract.startDate}</Td>
                <Td borderRightWidth={1}>{contract.endDate}</Td>
                <Td>
                  <Tag colorScheme={getStatusColor(contract.status)}>
                    {contract.status}
                  </Tag>
                </Td>
              </Tr>
            </React.Fragment>
          ))}
        </Tbody>
      </Table>
    </VStack>
  );
}

export default TenantContract;