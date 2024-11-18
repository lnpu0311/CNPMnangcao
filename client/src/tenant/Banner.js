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
    <Box maxH={{ base: "auto", lg: "640px" }} mb={{ base: 8, xl: 24 }} position={{ base: "relative", lg: "static" }}>
    <Flex 
      direction={{ base: 'column', lg: 'row' }}
      gap={{ base: 8, lg: 0 }}
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
        bgColor='none'
        order={{ base: 2, lg: 0 }}
        position={{ base: "relative", lg: "static" }}
        zIndex={{ base: 2, lg: "auto" }}
      >
        <Heading 
          fontSize={{ base: '3xl', md: '4xl', lg: '65px' }}
          fontWeight="semibold"
          mb={6}
          lineHeight="none"
          transition="all 0.5s"
          _hover={{ 
            transform: "translateY(-8px)",
          }}
        >
          <Text as="span" color="blue" 
          
          >Hostel Community</Text>, ngôi nhà trong mơ của bạn
        </Heading>
        <Text 
          maxW="480px" 
          mb={8}
          fontSize={{ base: 'lg', xl: 'xl' }}
          fontWeight="medium"
          textAlign="justify" 
          lineHeight="tall" 
          letterSpacing="wide" 
          transition="all 0.5s"
          _hover={{ 
            transform: "translateY(-8px)",
          }}
          sx={{
            textJustify: "inter-word"
          }}
        >
          Khám phá hàng nghìn phòng trọ chất lượng với đầy đủ tiện nghi. 
          Chúng tôi cam kết mang đến cho bạn trải nghiệm tìm kiếm và thuê phòng 
          an toàn, tiện lợi với giá cả hợp lý nhất.
        </Text>
      </Flex>

      {/* Image Slider */}
      <Box 
        display="flex"
        flex="1"
        position={{ base: "absolute", lg: "relative" }}
        overflow="hidden"
        h={{ base: "100%", md: "400px", lg: "auto" }}
        order={{ base: 1, lg: 1 }}
        top={{ base: 0, lg: "auto" }}
        left={{ base: 0, lg: "auto" }}
        right={{ base: 0, lg: "auto" }}
        bottom={{ base: 0, lg: "auto" }}
        zIndex={{ base: 1, lg: "auto" }}
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
              borderRadius={{ base: "lg", lg: "none" }}
              opacity={{ base: "0.6", lg: "1" }}
            />
          </motion.div>
        </AnimatePresence>
      </Box>
    </Flex>
  </Box>
  );
};

export default Banner;