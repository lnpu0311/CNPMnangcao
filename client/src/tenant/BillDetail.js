import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  VStack, 
  Heading, 
  Text, 
  Button, 
  Container,
  Badge,
  Divider,
  HStack,
  Box,
  useToast
} from '@chakra-ui/react';
import { FaArrowLeft } from 'react-icons/fa';
import { PayPalButtons } from "@paypal/react-paypal-js";

const BillDetail = () => {
  const [bill, setBill] = useState(null);
  const { billId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchBillDetails();
  }, [billId]);

  const fetchBillDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/bills/${billId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      setBill(response.data.data);
    } catch (error) {
      console.error('Error fetching bill:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin hóa đơn",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'orange';
      case 'PAID': return 'green';
      case 'OVERDUE': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Container maxW="container.md" py={5}>
      <Button 
        leftIcon={<FaArrowLeft />} 
        onClick={() => navigate('/tenant/bills')}
        mb={4}
      >
        Quay lại
      </Button>

      <VStack spacing={4} align="stretch" borderWidth={1} borderRadius="lg" p={6}>
        <Heading size="lg">Chi tiết hóa đơn</Heading>
        {bill && (
          <>
            <HStack justify="space-between">
              <Text fontWeight="bold">Phòng:</Text>
              <Text>{bill.roomId.roomName}</Text>
            </HStack>

            <HStack justify="space-between">
              <Text fontWeight="bold">Trạng thái:</Text>
              <Badge colorScheme={getStatusColor(bill.status)}>
                {bill.status === 'PENDING' ? 'Chờ thanh toán' : 
                 bill.status === 'PAID' ? 'Đã thanh toán' : 
                 bill.status === 'OVERDUE' ? 'Quá hạn' : 'Không xác định'}
              </Badge>
            </HStack>

            <Divider />

            <Box>
              <Text fontWeight="bold" mb={2}>Chi tiết thanh toán:</Text>
              <VStack align="stretch" pl={4}>
                <HStack justify="space-between">
                  <Text>Tiền phòng:</Text>
                  <Text>{formatCurrency(bill.rentFee)}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text>Tiền điện:</Text>
                  <Text>{formatCurrency(bill.electricityFee)}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text>Tiền nước:</Text>
                  <Text>{formatCurrency(bill.waterFee)}</Text>
                </HStack>
                {bill.serviceFee > 0 && (
                  <HStack justify="space-between">
                    <Text>Phí dịch vụ:</Text>
                    <Text>{formatCurrency(bill.serviceFee)}</Text>
                  </HStack>
                )}
              </VStack>
            </Box>

            <Divider />

            <HStack justify="space-between" fontWeight="bold">
              <Text>Tổng cộng:</Text>
              <Text>{formatCurrency(bill.totalAmount)}</Text>
            </HStack>

            <HStack justify="space-between">
              <Text>Hạn thanh toán:</Text>
              <Text>{new Date(bill.dueDate).toLocaleDateString('vi-VN')}</Text>
            </HStack>

            {(bill.status === 'PENDING' || bill.status === 'OVERDUE') && (
              <Box width="100%" mt={4}>
                <PayPalButtons
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            value: (bill.totalAmount / 24000).toFixed(2),
                            currency_code: "USD"
                          },
                          description: `Thanh toán hóa đơn #${bill._id}`
                        }
                      ]
                    });
                  }}
                  onApprove={async (data, actions) => {
                    try {
                      // Gọi API để cập nhật DB trước
                      const response = await axios.get(
                        `${process.env.REACT_APP_API}/payment/paypal/success`,
                        {
                          params: {
                            token: data.orderID,
                            billId: bill._id
                          },
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                          }
                        }
                      );

                      if (response.data.success) {
                        // Refresh bill data
                        await fetchBillDetails();
                        
                        toast({
                          title: "Thanh toán thành công",
                          status: "success",
                          duration: 3000,
                          isClosable: true
                        });

                        navigate('/tenant/bills', { replace: true });
                      }
                    } catch (error) {
                      console.error('PayPal payment error:', error);
                      toast({
                        title: "Lỗi xử lý thanh toán",
                        description: error.response?.data?.message || "Vui lòng liên hệ admin",
                        status: "error",
                        duration: 3000,
                        isClosable: true
                      });
                      
                      navigate('/tenant/bills', { 
                        replace: true,
                        state: { payment: 'failed' }
                      });
                    }
                  }}
                  onError={() => {
                    toast({
                      title: "Lỗi thanh toán",
                      description: "Vui lòng thử lại sau",
                      status: "error",
                      duration: 3000,
                      isClosable: true
                    });
                  }}
                />
              </Box>
            )}
          </>
        )}
      </VStack>
    </Container>
  );
};

export default BillDetail; 