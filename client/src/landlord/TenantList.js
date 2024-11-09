import { useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Select,
  VStack,
  Heading,
} from "@chakra-ui/react";

function TenantList() {
  const tenantsData = [
    {
      name: "Nguyễn Văn A",
      facility: "Cơ Sở 1",
      room: "Phòng 101",
      startDate: "2024-01-01",
      endDate: "2025-10-01",
    },
    {
      name: "Trần Thị B",
      facility: "Cơ Sở 2",
      room: "Phòng 202",
      startDate: "2024-02-15",
      endDate: "2025-10-01",
    },
    {
      name: "Lê Văn C",
      facility: "Cơ Sở 1",
      room: "Phòng 103",
      startDate: "2024-03-20",
      endDate: "2025-10-01",
    },
    // Thêm các mục khác
  ];

  const [nameFilter, setNameFilter] = useState("");
  const [facilityFilter, setFacilityFilter] = useState("");

  const filteredTenants = tenantsData.filter((tenant) => {
    const nameMatch = tenant.name
      .toLowerCase()
      .includes(nameFilter.toLowerCase());
    const facilityMatch = facilityFilter
      ? tenant.facility === facilityFilter
      : true;
    return nameMatch && facilityMatch;
  });

  // Lấy danh sách các cơ sở để điền vào bộ lọc
  const uniqueFacilities = [
    ...new Set(tenantsData.map((tenant) => tenant.facility)),
  ];

  return (
    <Box>
      <Heading textColor={"blue.500"} as="h3" size="lg" mb={12}>
        Danh Sách Khách Thuê
      </Heading>
      <VStack align="start" spacing={4} mb={4}>
        <Select
          placeholder="Chọn cơ sở"
          value={facilityFilter}
          onChange={(e) => setFacilityFilter(e.target.value)}
        >
          {uniqueFacilities.map((facility) => (
            <option key={facility} value={facility}>
              {facility}
            </option>
          ))}
        </Select>
        <Input
          placeholder="Tìm theo tên khách thuê"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
      </VStack>

      <Table variant="striped" colorScheme="blue">
        <Thead>
          <Tr>
            <Th>Tên Khách Thuê</Th>
            <Th>Tên Cơ Sở</Th>
            <Th>Tên Phòng</Th>
            <Th>Ngày Băt Đầu Hợp Đồng</Th>
            <Th>Ngày Kết Thúc Hợp Đồng</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredTenants.map((tenant, index) => (
            <Tr key={index}>
              <Td>{tenant.name}</Td>
              <Td>{tenant.facility}</Td>
              <Td>{tenant.room}</Td>
              <Td>{tenant.startDate}</Td>
              <Td>{tenant.endDate}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default TenantList;
