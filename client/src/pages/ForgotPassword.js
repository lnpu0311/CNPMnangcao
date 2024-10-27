import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  FormErrorMessage,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Flex,
  HStack,
  PinInput,
  PinInputField,
  ModalCloseButton,
  Alert,
  ModalFooter,
  useDisclosure,
  Text,
  Modal,
  AlertIcon,
} from "@chakra-ui/react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isOtpMessage, setIsOtpMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpValid, setIsOtpValid] = useState(true); // To track if the OTP is valid
  const [canResend, setCanResend] = useState(false);
  const [remainingTime, setRemainingTime] = useState(60);
  const finalRef = React.useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [apiMessage, setApiMessage] = useState("");

  const handleResendOTP = async () => {
    setCanResend(false);
    setIsOtpValid("true");
    // Logic to resend the OTP here
    try {
      const email = email;
      const response = await axios.post(
        "http://localhost:5000/api/user/resendOtp",
        { email: email }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
      setIsOtpMessage("Lỗi gửi mã otp");
    }
  };

  const handleOtpChange = (value) => {
    setOtp(value);
  };

  const handleVerifyOTP = async () => {
    const emailData = email;
    const otpData = otp;
    try {
      const response = await axios.post(
        `http://localhost:5000/api/user/verifyOTP`,
        {
          email: emailData,
          verifyOTP: otpData,
        }
      );
      setIsOtpValid("true");
      setIsOtpMessage("");
      onClose();
      console.log(response.data);
    } catch (error) {
      setIsOtpValid("false");
      setIsOtpMessage(error.response.data.message);
      console.error(error);
    }
  };
  const handleSubmit = async () => {
    if (validateInput()) {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/user/forgotPass`,
          { email: email, password: newPassword }
        );
        onOpen();
        setApiMessage("Thay đổi mật khẩu thành công");
        console.log("Thay đổi mật khẩu thành công");
      } catch (error) {
        console.error(error);
        console.log(error.response.data.message);
      }
    }
  };

  const validateInput = () => {
    const newErrors = {};

    if (!email) newErrors.email = "Vui lòng điền email!";
    if (!newPassword) newErrors.newPassword = "Vui lòng điền mật khẩu!";
    if (newPassword !== confirmNewPassword)
      newErrors.confirmNewPassword = "Mật khẩu không khớp.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <Box
      maxWidth="400px"
      mx="auto"
      mt="100px"
      p={4}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
    >
      <Heading textAlign={"center"} size="md" mb={6} color="blue.600">
        Quên Mật Khẩu
      </Heading>
      <VStack spacing={4} as="form">
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
          />
          <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>

        <FormControl id="new-password" isRequired>
          <FormLabel>Mật Khẩu Mới</FormLabel>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nhập mật khẩu mới"
          />
          <FormErrorMessage>{errors.newPassword}</FormErrorMessage>
        </FormControl>

        <FormControl id="new-password" isRequired>
          <FormLabel>Mật Khẩu Mới</FormLabel>
          <Input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="Nhập mật khẩu mới"
          />
          <FormErrorMessage>{errors.confirmNewPassword}</FormErrorMessage>
        </FormControl>

        <Button
          textColor={"white"}
          bgGradient="linear(to-r, #07c8f9, #0d41e1)"
          _hover={{ bgGradient: "linear(to-l, #07c8f9, #0d41e1)" }}
          width="100%"
          mt={3}
          onClick={handleSubmit}
        >
          Xác Nhận
        </Button>
        {/* OTP */}
        <Modal
          finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={onClose}
          isCentered
          size="lg"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              textColor={"brand.700"}
              textAlign="center"
              fontWeight="bold"
              fontSize="xl"
            >
              Xác thực mã OTP
            </ModalHeader>
            <ModalBody textAlign="center">
              <Text mb={4}>
                Mã OTP đã được gửi tới địa chỉ email của bạn. Vui lòng kiểm tra
                hộp thư và nhập mã để xác thực.
              </Text>

              <Flex justifyContent="center" alignItems="center">
                <HStack>
                  <PinInput
                    otp
                    size="lg"
                    placeholder=""
                    value={otp}
                    onChange={handleOtpChange}
                    isInvalid={!isOtpValid}
                  >
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                  </PinInput>
                </HStack>
                <Button
                  ml={4}
                  size="sm"
                  variant={"outline"}
                  colorScheme="blue"
                  onClick={handleResendOTP}
                  isDisabled={!canResend}
                >
                  {canResend ? "Gửi lại OTP" : ` ${remainingTime}s`}
                </Button>
              </Flex>

              <ModalCloseButton />
              {/* Display API Error Message */}
              {isOtpMessage && (
                <Alert
                  status={isOtpValid ? "error" : "success"}
                  borderRadius={6}
                  mt={6}
                >
                  <AlertIcon />
                  {isOtpMessage}
                </Alert>
              )}
            </ModalBody>
            <ModalFooter justifyContent="space-between">
              <Button colorScheme="red" onClick={onClose}>
                Hủy
              </Button>

              <Button colorScheme="green" onClick={handleVerifyOTP}>
                Xác nhận
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default ForgotPassword;
