import React, { useState, useEffect } from 'react';
import { Box, Flex, Heading, Text, Image, IconButton } from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Banner = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const bannerImages = [
    // './house-banner.png',
    './houses/house1.png',
    './houses/house2.png',
    './houses/house3.png',
    
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      nextImage();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentImageIndex]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % bannerImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  return (
    <Box maxH={{ base: "auto", lg: "640px" }} mb={{ base: 8, xl: 24 }}>
      <Flex 
        direction={{ base: 'column', lg: 'row' }}
        gap={{ base: 8, lg: 0 }} // Thêm khoảng cách giữa text và hình khi ở mobile
      >
        {/* Text Content */}
        <Flex 
          direction="column"
          alignItems={{ base: 'center', lg: 'flex-start' }}
          textAlign={{ base: 'center', lg: 'left' }}
          justifyContent="center"
          flex="1"
          px={{ base: 4, lg: 0 }}
          ml={{ lg: 8, xl: '135px' }}
          order={{ base: 1, lg: 0 }} // Đảm bảo text luôn ở trên trong mobile view
        >
          <Heading 
            fontSize={{ base: '3xl', md: '4xl', lg: '65px' }}
            fontWeight="semibold"
            mb={6}
            lineHeight="none"
          >
            <Text as="span" color="blue">Hostel Community</Text>, ngôi nhà trong mơ của bạn
          </Heading>
          <Text 
            maxW="480px" 
            mb={8}
            fontSize={{ base: 'lg', xl: 'xl' }}
            fontWeight="medium"
            textAlign="justify" 
            lineHeight="tall" 
            letterSpacing="wide" 
            sx={{
              textJustify: "inter-word" // Căn đều khoảng cách giữa các từ
            }}
          >
            Khám phá hàng nghìn phòng trọ chất lượng với đầy đủ tiện nghi. 
            Chúng tôi cam kết mang đến cho bạn trải nghiệm tìm kiếm và thuê phòng 
            an toàn, tiện lợi với giá cả hợp lý nhất.
          </Text>
        </Flex>

        {/* Image Slider */}
        <Box 
          display="flex" // Thay đổi từ none sang flex
          flex="1"
          position="relative"
          overflow="hidden"
          h={{ base: "300px", md: "400px", lg: "auto" }} // Điều chỉnh chiều cao cho responsive
          order={{ base: 2, lg: 1 }} // Đảm bảo hình ảnh luôn ở dưới trong mobile view
        >
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              style={{ width: '100%', height: '100%' }}
            >
              <Image 
                src={bannerImages[currentImageIndex]} 
                alt=''
                w="100%"
                h="100%"
                objectFit="cover"
                borderRadius={{ base: "lg", lg: "none" }} // Thêm bo góc cho mobile
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons và Slide Indicators giữ nguyên */}
        </Box>
      </Flex>
    </Box>
  );
};

export default Banner;