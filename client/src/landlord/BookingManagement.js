import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  useToast,
  Heading,
  Text
} from '@chakra-ui/react';
import axios from 'axios';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/booking/landlord`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setBookings(response.data.data);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách đặt lịch",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/booking/${bookingId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        toast({
          title: "Thành công",
          description: "Đã cập nhật trạng thái đặt lịch",
          status: "success",
          duration: 3000,
          isClosable: true
        });
        // Refresh danh sách booking
        fetchBookings();
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <Box p={5}>
      <Heading size="lg" mb={6}>Quản lý đặt lịch xem phòng</Heading>
      
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Phòng</Th>
            <Th>Người đặt</Th>
            <Th>Ngày xem</Th>
            <Th>Ngày dự phòng</Th>
            <Th>Trạng thái</Th>
            <Th>Thao tác</Th>
          </Tr>
        </Thead>
        <Tbody>
          {bookings.map((booking) => (
            <Tr key={booking._id}>
              <Td>
                <Text fontWeight="bold">{booking.roomId?.roomName || 'N/A'}</Text>
                <Text fontSize="sm" color="gray.600">
                  {booking.roomId?.roomTitle || 'N/A'}
                </Text>
              </Td>
              <Td>
                <Text>{booking.tenantId?.name || 'N/A'}</Text>
                <Text fontSize="sm" color="gray.600">
                  {booking.tenantId?.email || 'N/A'}
                </Text>
              </Td>
              <Td>
                {booking.proposedDate 
                  ? new Date(booking.proposedDate).toLocaleString('vi-VN')
                  : 'N/A'}
              </Td>
              <Td>
                {booking.alternativeDate 
                  ? new Date(booking.alternativeDate).toLocaleString('vi-VN')
                  : 'Không có'}
              </Td>
              <Td>
                <Badge
                  colorScheme={
                    booking.status === 'pending' ? 'yellow' :
                    booking.status === 'accepted' ? 'green' : 'red'
                  }
                >
                  {booking.status === 'pending' ? 'Chờ duyệt' :
                   booking.status === 'accepted' ? 'Đã chấp nhận' : 'Đã từ chối'}
                </Badge>
              </Td>
              <Td>
                {booking.status === 'pending' && (
                  <>
                    <Button
                      colorScheme="green"
                      size="sm"
                      mr={2}
                      onClick={() => handleUpdateStatus(booking._id, 'accepted')}
                    >
                      Chấp nhận
                    </Button>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleUpdateStatus(booking._id, 'rejected')}
                    >
                      Từ chối
                    </Button>
                  </>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      
      {bookings.length === 0 && (
        <Text textAlign="center" mt={4}>
          Chưa có yêu cầu đặt lịch nào
        </Text>
      )}
    </Box>
  );
};

export default BookingManagement; 