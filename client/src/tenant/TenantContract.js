// TenantContract.js
import React from "react";
import { Box, Text, VStack } from "@chakra-ui/react";

// Dữ liệu giả cho hợp đồng thuê
const mockContract = {
  id: "CNT123456",
  room: "Phòng 1",
  tenantName: "Nguyễn Văn A",
  startDate: "01/01/2023",
  endDate: "31/12/2023",
  monthlyRent: "5,000,000 VND",
  status: "Đang hiệu lực",
};

function TenantContract() {
  return (
    <VStack spacing={4} align="stretch" w="100%" p={4}>
      <Text fontSize="2xl" fontWeight="bold">
        Thông tin hợp đồng
      </Text>
      <Box p={4} borderWidth={1} borderRadius="lg" bg="gray.100">
        <Text fontWeight="bold">Mã hợp đồng: {mockContract.id}</Text>
        <Text>Phòng: {mockContract.room}</Text>
        <Text>Người thuê: {mockContract.tenantName}</Text>
        <Text>Ngày bắt đầu: {mockContract.startDate}</Text>
        <Text>Ngày kết thúc: {mockContract.endDate}</Text>
        <Text>Giá thuê hàng tháng: {mockContract.monthlyRent}</Text>
        <Text>Trạng thái: {mockContract.status}</Text>
      </Box>
    </VStack>
  );
}

export default TenantContract;
