import {
  Box,
  Flex,
  Stack,
  Text,
  Button,
  Avatar,
  useColorModeValue,
  Heading,
} from "@chakra-ui/react";

const RentalRequest = () => {
  const rentalRequests = [
    {
      id: 1,
      name: "Hưng",
      phone: "12341234",
      hostel: "nhà trọ quận 5",
      room: "Phòng 1",
    },
    {
      id: 2,
      name: "Lương Ngọc Phương Uyên",
      phone: "1243412354",
      hostel: "nhà trọ quận 5",
      room: "Phòng 4",
    },
    {
      id: 3,
      name: "Bảo xấu quắc",
      phone: "1234123874",
      hostel: "nhà trọ quận 5",
      room: "Phòng 3",
    },
  ];

  const backgroundColor = useColorModeValue("brand.2", "brand.4");
  return (
    <Box>
      <Heading
        textColor={"blue.500"}
        as="h3"
        size="lg"
        mb={{ base: 4, md: 12 }}
      >
        Quản Lý Yêu Cầu Thuê Phòng
      </Heading>

      <Stack spacing={4}>
        {rentalRequests.map((request) => (
          <Flex
            key={request.id}
            bg={backgroundColor}
            borderRadius="md"
            boxShadow={"lg"}
            justify="space-between"
            align="center"
            p={4}
          >
            <Flex align="center" flex="3">
              <Avatar name={request.name} src="https://bit.ly/broken-link" />
              <Text fontWeight="bold" ml={4}>
                {request.name}
              </Text>
            </Flex>

            <Flex align="center" flex="2">
              <Text mr={2}>Số điện thoại: </Text>
              <Text fontWeight="bold" mr={2}>
                {request.phone}
              </Text>
            </Flex>

            <Flex align="center" flex="2">
              <Text mr={2}>Cơ sở: </Text>
              <Text fontWeight="bold">{request.hostel}</Text>
            </Flex>
            <Flex align="center" flex="2">
              <Text mr={2}>Tên phòng:</Text>
              <Text fontWeight="bold">{request.room}</Text>
            </Flex>
            <Flex flex="1" justify="flex-end" gap={2}>
              <Button colorScheme="green">Chấp nhận</Button>
              <Button colorScheme="red">Xóa</Button>
            </Flex>
          </Flex>
        ))}
      </Stack>
    </Box>
  );
};

export default RentalRequest;
