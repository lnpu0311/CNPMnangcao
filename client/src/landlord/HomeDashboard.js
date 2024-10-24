import React from "react";
import {
  Box,
  Text,
  IconButton,
  Badge,
  VStack,
  Flex,
  SimpleGrid,
  Button,
} from "@chakra-ui/react";
import {
  BellIcon,
  AddIcon,
  CalendarIcon,
  CheckCircleIcon,
} from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

function HomeDashboard() {
  const navigate = useNavigate();

  // Dummy data for illustration
  const hostel = [
    "Facility 1 - Address",
    "Facility 2 - Address",
    "Facility 3 - Address",
  ];

  const bookingRequests = [
    "John Doe requested - Room 101",
    "Jane Smith requested - Room 202",
    "Alice Johnson requested - Room 303",
  ];

  return (
    <Box p={5}>
      <Text fontSize="2xl" fontWeight="bold">
        Welcome, user!
      </Text>

      <VStack align="start" spacing={4} mb={5}>
        <Text fontSize="lg" fontWeight="bold">
          Quick Actions
        </Text>
        <Flex gap={3}>
          <Button
            leftIcon={<CalendarIcon />}
            colorScheme="green"
            variant="outline"
            onClick={() => navigate("/hostel-management")}
          >
            Quản lý cơ sở
          </Button>
          <Button
            leftIcon={<CheckCircleIcon />}
            colorScheme="teal"
            variant="outline"
            onClick={() => navigate("/rental-request")}
          >
            Danh sách yêu cầu
          </Button>
        </Flex>
      </VStack>

      <Box mb={5}>
        <Text fontSize="lg" fontWeight="bold" mb={3}>
          Danh sách các cơ sở
        </Text>
        <VStack align="start" spacing={2}>
          {hostel.map((hostel, index) => (
            <Flex key={index} align="center" gap={2}>
              <CalendarIcon color="blue.500" />
              <Text fontSize="sm">{hostel}</Text>
            </Flex>
          ))}
        </VStack>
      </Box>

      {/* Booking Requests Section */}
      <Box mb={5}>
        <Text fontSize="lg" fontWeight="bold" mb={3}>
          Danh sách các yêu cầu thuê phòng
        </Text>
        <VStack align="start" spacing={2}>
          {bookingRequests.map((request, index) => (
            <Flex key={index} align="center" gap={2}>
              <CheckCircleIcon color="green.500" />
              <Text fontSize="sm">{request}</Text>
            </Flex>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}

export default HomeDashboard;
