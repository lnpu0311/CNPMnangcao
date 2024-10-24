import React, { useEffect, useState } from "react"; // Thêm useEffect và useState
import { useNavigate } from "react-router-dom";
import { Box, Text, VStack, Button, Flex, Image, Modal, ModalOverlay, IconButton, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from "@chakra-ui/react"; // Thêm các thành phần Modal
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons"; 

// Danh sách hình ảnh cho slider
const images = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRbcrj53mGyk-u4JwrIb6z1RBAeCpxR78gfQ&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCGg_GZiPH1hVG2NfTnLS45vs5e47I_VQxkg&s",
  // Thêm các URL hình ảnh khác nếu cần
];

function TenantDashboard() {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false); // Trạng thái modal
  const [selectedImage, setSelectedImage] = useState(""); // Hình ảnh được chọn

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % (images.length)); // Giới hạn chỉ số để không vượt quá số lượng hình ảnh
    }, 3000); // Chuyển đổi hình ảnh sau mỗi 3 giây

    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, []);

  const openModal = (image) => {
    setSelectedImage(image);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <VStack spacing={4} align="stretch" w="100%"  p={4} alignItems="center">
      <Text fontSize="2xl" fontWeight="bold">
        ...gì đó
      </Text>
      <Flex w="100%" position="relative" alignItems="center" justifyContent="center">
        <IconButton
          icon={<ChevronLeftIcon />}
          onClick={prevImage}
          aria-label="Previous image"
          position="absolute"
          left="10"
          zIndex="1"
          bg="rgba(0, 0, 0, 0.5)"
          color="white"
          _hover={{ bg: "rgba(0, 0, 0, 0.7)" }}
        />
        <Box 
          w="85%" 
          position="relative"
          paddingBottom="47.8125%" // 56.25% của 85% để giữ tỷ lệ 16:9
        >
          <Image
            src={images[currentImageIndex]}
            alt={`Slider Image ${currentImageIndex}`}
            position="absolute"
            top="0"
            left="0"
            w="100%"
            h="100%"        
            objectFit="cover"
            borderRadius="lg"
            onClick={() => openModal(images[currentImageIndex])}
            cursor="pointer"
          />
        </Box>
        <IconButton
          icon={<ChevronRightIcon />}
          onClick={nextImage}
          aria-label="Next image"
          position="absolute"
          right="10"
          zIndex="1"
          bg="rgba(0, 0, 0, 0.5)"
          color="white"
          _hover={{ bg: "rgba(0, 0, 0, 0.7)" }}
        />
      </Flex>
      {/* Nút Tìm phòng ngay! */}
      <Button
          colorScheme="yellow"
          variant="solid"
          onClick={() => navigate("/tenant-room-list")}
          position="absolute"
          top="150"
          right="1"          
        >
        Tìm phòng ngay!
      </Button>

      {/* Modal để hiển thị hình ảnh lớn */}
      <Modal isOpen={isOpen} onClose={closeModal} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chi tiết hình ảnh</ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex" justifyContent="center" alignItems="center" > {/* Bỏ padding để hình ảnh chiếm toàn bộ không gian */}
          <Image 
            src={selectedImage} 
            alt="Selected Image" 
            borderRadius="lg" 
            boxSize="70%" // Đảm bảo hình ảnh chiếm toàn bộ chiều rộng
            objectFit="contain" // Đảm bảo hình ảnh không bị méo
          />
        </ModalBody>
      </ModalContent>
    </Modal>
    </VStack>
  );
}

export default TenantDashboard;
