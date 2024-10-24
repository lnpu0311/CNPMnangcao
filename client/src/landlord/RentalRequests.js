import {
  Box,
  Flex,
  Stack,
  Text,
  Button,
  Avatar,
  useColorModeValue,
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
      name: "Uyên",
      phone: "1243412354",
      hostel: "nhà trọ quận 5",
      room: "Phòng 4",
    },
    {
      id: 3,
      name: "Bảo",
      phone: "1234123874",
      hostel: "nhà trọ quận 5",
      room: "Phòng 3",
    },
  ];

  const backgroundColor = useColorModeValue("brand.2", "brand.4");
  return (
    <Box>
      <Text fontSize="xx-large" fontWeight="bold" as={"h2"} mb={12}>
        Quản lý yêu cầu thuê phòng
      </Text>

      <Stack spacing={4}>
        {rentalRequests.map((request) => (
          <Flex
            key={request.id}
            bg={backgroundColor}
            borderRadius="md"
            justify="space-between"
            align="center"
            p={4}
          >
            <Flex align="center" flex="2">
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
              <Text fontWeight="bold">{request.hostel}</Text>
              <Text ml={2}>{request.room}</Text>
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
