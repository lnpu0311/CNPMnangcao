import React, { useState, useEffect } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  Container,
  Text,
  Flex
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BillList = () => {
  const [bills, setBills] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/bills`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      setBills(response.data.data);
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'orange';
      case 'PAID': return 'green';
      case 'OVERDUE': return 'red';
      default: return 'gray';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <Container maxW="container.xl" py={4}>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">Danh sách hóa đơn</Text>
      </Flex>

      <Table variant="simple">
        <Thead bg="cyan.100">
          <Tr>
            <Th>Phòng</Th>
            <Th>Ngày tạo</Th>
            <Th>Tiền phòng</Th>
            <Th>Tiền điện</Th>
            <Th>Tiền nước</Th>
            <Th>Tổng tiền</Th>
            <Th>Trạng thái</Th>
            <Th>Hạn thanh toán</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {bills.map(bill => (
            <Tr key={bill._id}>
              <Td>{bill.roomId.roomName}</Td>
              <Td>{new Date(bill.createdAt).toLocaleDateString('vi-VN')}</Td>
              <Td>{formatCurrency(bill.rentFee)}</Td>
              <Td>{formatCurrency(bill.electricityFee)}</Td>
              <Td>{formatCurrency(bill.waterFee)}</Td>
              <Td>{formatCurrency(bill.totalAmount)}</Td>
              <Td>
                <Badge colorScheme={getStatusColor(bill.status)}>
                  {bill.status === 'PENDING' ? 'Chờ thanh toán' : 
                   bill.status === 'PAID' ? 'Đã thanh toán' : 'Quá hạn'}
                </Badge>
              </Td>
              <Td>{new Date(bill.dueDate).toLocaleDateString('vi-VN')}</Td>
              <Td>
                <Button
                  colorScheme="blue"
                  size="sm"
                  onClick={() => navigate(`/tenant/bills/${bill._id}`)}
                >
                  Chi tiết
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  );
};

export default BillList; 