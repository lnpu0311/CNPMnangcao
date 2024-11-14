
import { useState, useEffect } from "react"; 
import React from "react";
import { VStack, Box, Image, Heading, Text, Button, Grid, Stack, Link, Icon, HStack,  
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  IconButton,
  Container,
  Flex
 } from "@chakra-ui/react";
import { FaFacebook, FaYoutube, FaInstagram, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Banner from "./Banner";

const categories = [
  { name: "Quận 1", image: "./house1.png" },
  { name: "Quận 2", image: "./house2.png" },
  { name: "Quận 3", image: "./house3.png" },
  // Thêm các quận khác
];

const rooms = [
  {
    category: "Quận 1",
    address: "39 Phan Xích Long, Phường 03, Quận Phú Nhuận, Thành phố Hồ Chí Minh",
    area: "100 m²",
    price: "10.000.000 ₫",
    deposit: "500.000 ₫",
    amenities: ["Wifi miễn phí", "Bảo vệ 24/7", "Chỗ để xe", "Tự do giờ giấc"],
    image: "./house1.png",
  },
  {
    category: "Quận 2",
    address: "39 Phan Xích Long, Phường 03, Quận Phú Nhuận, Thành phố Hồ Chí Minh",
    area: "100 m²",
    price: "10.000.000 ₫",
    deposit: "500.000 ₫",
    amenities: ["Wifi miễn phí", "Bảo vệ 24/7", "Chỗ để xe", "Tự do giờ giấc"],
    image: "./house2.png",
  },
  // Thêm các phòng khác
];


const heroImages = [
  "./house1.png",
  "./house2.png", 
  "./house3.png", 
];
const images = [
  "./house1.png",
  "./house2.png",
  "./house3.png",
  // Add more image URLs as needed
];

const testimonials = [
  {
    quote: "Sống ở đây quả là một trải nghiệm tuyệt vời. Các phòng đều rộng rãi và được bảo trì tốt.",
    author: "Minh",
    avatar: "https://via.placeholder.com/50" 
  },
  {
    quote: "Đội ngũ quản lý luôn tích cực và đáp ứng mọi nhu cầu. Tôi cảm thấy an toàn như ở nhà.",
    author: "Lan",
    avatar: "https://via.placeholder.com/50" 
  },
  {
    quote: "Một địa điểm tuyệt vời! Gần phương tiện giao thông công cộng và tiện ích địa phương. Rất khuyến khích!",
    author: "Hùng",
    avatar: "https://via.placeholder.com/50" 
  },
  {
    quote: "Tôi yêu không khí cộng đồng ở đây.Một nơi tuyệt vời để gặp gỡ những người bạn mới.",
    author: "An",
    avatar: "https://via.placeholder.com/50" 
  },
  
];

// Profile 
const curriculumPathways = [
  { 
    name: "Bảo", 
    avatar: "./profile1.png", 
    role: "BE", 
    description: "Bảo is responsible for overseeing the project and ensuring everything runs smoothly." 
  },
  { 
    name: "Uyên", 
    avatar: "./profile2.png", 
    role: "FE", 
    description: "Uyên leads the development team and is passionate about creating user-friendly applications." 
  },
  { 
    name: "Hưng", 
    avatar: "./profile1.png", 
    role: "FE", 
    description: "Hưng focuses on designing intuitive interfaces and enhancing user experience." 
  },
  { 
    name: "Hào", 
    avatar: "./profile1.png", 
    role: "BE", 
    description: "Hào is in charge of marketing strategies and community engagement." 
  },
];

// About & Values Section
const contentData = [
  {
    image: "./house1.png",
    title: "Sứ Mệnh và Giá Trị Của Chúng Tôi",
    description: (
      <>
        Tại <Link color="blue.500" fontWeight="bold" href="/hostel-community">Hostel Community</Link>, chúng tôi cam kết tạo ra một môi trường sống an toàn và thoải mái cho tất cả cư dân. 
        Sứ mệnh của chúng tôi là cung cấp không gian sống lý tưởng, nơi mọi người có thể phát triển và kết nối. 
        Chúng tôi tin tưởng vào:
      </>
    ),
    values: [
      { title: "1. Sự An Toàn:", description: "Chúng tôi đảm bảo rằng mọi cư dân đều cảm thấy an toàn và được bảo vệ trong không gian sống của mình." },
      { title: "2. Cộng Đồng Gắn Kết:", description: "Chúng tôi khuyến khích sự giao lưu và hỗ trợ lẫn nhau giữa các cư dân, tạo nên một cộng đồng vững mạnh." },
      { title: "3. Phát Triển Bền Vững:", description: "Chúng tôi cam kết cung cấp các dịch vụ và tiện ích bền vững, góp phần vào sự phát triển của cộng đồng." },
    ],
  },

  {
    image: "./house2.png", 
    title: "Giá Trị Cốt Lõi",
    description: (
      <>
        Chúng tôi tin rằng mỗi cư dân đều có giá trị và xứng đáng được tôn trọng. Chúng tôi tạo ra một không gian nơi mọi người có thể tự do thể hiện bản thân và phát triển.
      </>
    ),
    values: [
      { title: "4. Tôn Trọng Đa Dạng:", description: "Chúng tôi chào đón mọi nền văn hóa và phong cách sống khác nhau." },
      { title: "5. Hỗ Trợ Lẫn Nhau:", description: "Chúng tôi khuyến khích sự hỗ trợ và giúp đỡ lẫn nhau giữa các cư dân." },
    ],
  },
  
  {
    image: "house3.png", 
    title: "Cộng Đồng Đoàn Kết",
    description: (
      <>
        Chúng tôi xây dựng một cộng đồng nơi mọi người có thể kết nối và hỗ trợ lẫn nhau, tạo ra một môi trường sống tích cực và thân thiện.
      </>
    ),
    values: [
      { title: "6. Giao Lưu Văn Hóa:", description: "Chúng tôi tổ chức các sự kiện để cư dân có thể giao lưu và học hỏi từ nhau." },
      { title: "7. Hoạt Động Cộng Đồng:", description: "Chúng tôi khuyến khích cư dân tham gia vào các hoạt động cộng đồng để xây dựng mối quan hệ." },
    ],
  },
];




function TenantDashboard() {

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  const filteredRooms = rooms.filter(room => room.category === selectedCategory);

  const [currentIndex, setCurrentIndex] = useState(0);

  // const nextSlide = () => {
  //   setCurrentIndex((prevIndex) => (prevIndex + 1) % rooms.length);
  // };

  // const prevSlide = () => {
  //   setCurrentIndex((prevIndex) => (prevIndex - 1 + rooms.length) % rooms.length);
  // };

    // Hàm mở modal
  const handleOpenDetails = (name) => {
    const member = curriculumPathways.find(member => member.name === name);
    setSelectedMember(member);
    setIsOpen(true);
  };

  // Hàm đóng modal
  const handleClose = () => {
    setIsOpen(false);
  };

  // Phần slide đầu

  // Hàm chuyển đổi hình ảnh
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
  };

  

  // Tự động chuyển đổi hình ảnh sau mỗi 5 giây
  useEffect(() => {
    const interval = setInterval(nextImage, 4000);
    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, []);

  // About & Values Section

  // Hàm chuyển đổi nội dung
   const nextContent = () => {
    setCurrentContentIndex((prevIndex) => (prevIndex + 1) % contentData.length);
  };

  // Tự động chuyển đổi nội dung sau mỗi 5 giây
  useEffect(() => {
    const interval = setInterval(nextContent, 6000);
    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, []);


  return (
    <VStack spacing={10} align="center" p={4} w="100%">
      {/* Banner Section */}
      <Box mb={20}> 
        <Banner/>
      </Box>

      {/* <VStack spacing={10} align="center" p={4} w="100%">
     
      <Flex overflow="hidden" mb={10} w="100%" justifyContent="center" >
        <Flex as={motion.div} whileTap={{ cursor: "grabbing" }} w="100%" overflowX="auto">
          {categories.map((category, index) => (
            <Box key={index} p={4} minW="200px" textAlign="center" onClick={() => handleCategoryClick(category.name)}>
              <Image src={category.image} alt={category.name} boxSize="150px" objectFit="cover" />
              <Text mt={2} fontWeight="bold">{category.name}</Text>
            </Box>
          ))}
        </Flex>
      </Flex>

     
      {selectedCategory && (
        <Box w="100%">
          <Heading size="md" mb={4}>Phòng tại {selectedCategory}</Heading>
          {filteredRooms.map((room, index) => (
            <Box key={index} p={4} mb={4} bg="white" borderRadius="lg" boxShadow="lg">
              <Image src={room.image} alt="Room" w="100%" h="200px" objectFit="cover" borderRadius="md" />
              <Text fontWeight="bold" mt={4}>Địa chỉ:</Text>
              <Text>{room.address}</Text>
              <Text fontWeight="bold" mt={2}>Diện tích:</Text>
              <Text>{room.area}</Text>
              <Text fontWeight="bold" mt={2}>Giá thuê:</Text>
              <Text>{room.price}</Text>
              <Text fontWeight="bold" mt={2}>Đặt cọc:</Text>
              <Text>{room.deposit}</Text>
              <Text fontWeight="bold" mt={2}>Tiện ích:</Text>
              <VStack align="start" spacing={1}>
                {room.amenities.map((amenity, idx) => (
                  <Text key={idx}>- {amenity}</Text>
                ))}
              </VStack>
            </Box>
          ))}
        </Box>
      )}
    </VStack> */}

       {/* RoomList button */}
       <Box 
        display="flex" 
        justifyContent="center" 
        mb={20}
      >
        <Button
          size="lg"
          height="60px"
          width={{ base: "90%", md: "400px" }}
          colorScheme="orange"
          
          onClick={() => navigate('room-list')}
          fontSize="xl"
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'xl',
          }}
          transition="all 0.2s"
        >
          Tìm Phòng Ngay!
        </Button>
      </Box>
      
      {/* Profile Section */}
      <Box 
        py={10} 
        px={{ base: 4, md: 8 }} 
        mt={5} 
      >
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <Heading 
              fontSize={{ base: "3xl", md: "4xl" }} 
              textAlign="center"
              bgGradient="linear(to-r, blue.400, blue.600)"
              bgClip="text"
            >
              Đội ngũ của chúng tôi
            </Heading>
            
            <Grid 
              templateColumns={{ 
                base: "1fr", 
                md: "repeat(2, 1fr)", 
                lg: "repeat(4, 1fr)" 
              }} 
              gap={8} 
              w="100%"
            >
              {curriculumPathways.map(({ name, avatar, role, description }) => (
                <Box 
                  key={name} 
                  bg="white" 
                  borderRadius="xl" 
                  overflow="hidden"
                  boxShadow="lg"
                  transition="all 0.3s"
                  cursor="pointer"
                  onClick={() => handleOpenDetails(name)}
                  _hover={{ 
                    transform: "translateY(-8px)",
                    boxShadow: "xl"
                  }}
                >
                  <Box position="relative" h="280px">
                    <Image
                      src={avatar} 
                      alt={name}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                    />
                    {/* Gradient overlay */}
                    <Box 
                      position="absolute"
                      bottom={0}
                      left={0}
                      right={0}
                      h="50%"
                      bgGradient="linear(to-t, blackAlpha.700, transparent)"
                    />
                    {/* Content overlay */}
                    <VStack 
                      position="absolute"
                      bottom={4}
                      left={0}
                      right={0}
                      spacing={1}
                      color="white"
                    >
                      <Heading fontSize="xl">{name}</Heading>
                      <Text 
                        fontSize="md" 
                        color="whiteAlpha.900"
                        fontWeight="medium"
                      >
                        {role}
                      </Text>
                    </VStack>
                  </Box>
                </Box>
              ))}
            </Grid>
          </VStack>
        </Container>
      </Box>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={handleClose} size="md">
        <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader borderBottomWidth="1px" py={4}>
            <HStack spacing={4} align="center">
              <Image
                src={selectedMember?.avatar}
                alt={selectedMember?.name}
                borderRadius="full"
                boxSize="60px"
                objectFit="cover"
                border="3px solid"
                borderColor="blue.500"
              />
              <VStack align="start" spacing={1}>
                <Heading size="md">{selectedMember?.name}</Heading>
                <Text 
                  color="blue.500" 
                  fontWeight="medium"
                  fontSize="sm"
                >
                  {selectedMember?.role}
                </Text>
              </VStack>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            <Text lineHeight="tall">{selectedMember?.description}</Text>
          </ModalBody>
          <ModalFooter borderTopWidth="1px" py={4}>
            <Button 
              colorScheme="blue" 
              onClick={handleClose}
              size="lg"
              w="full"
            >
              Đóng
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Testimonials */}
      {/* <Heading fontSize="2xl" textAlign="center">Cộng đồng của chúng tôi</Heading>
      <Stack spacing={4} align="center" w="60%">
        {testimonials.map(({ quote, author, avatar }, idx) => (
          <Box key={idx} w="80%" p={6} bg="yellow.100" borderRadius="lg" textAlign="left">
            <HStack spacing={4}>
              <Image
                src={avatar} 
                alt={author}
                borderRadius="full"
                boxSize="50px"
              />
              <Box>
                <Text fontStyle="italic" fontSize="lg">“{quote}”</Text>
                <Text fontWeight="bold" mt={2}>- {author}</Text>
              </Box>
            </HStack>
          </Box>
        ))}
      </Stack> */}

      {/* News & Updates */}
      {/* <Heading fontSize="2xl" textAlign="center">Tin tức & Thành tựu</Heading>
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4} w="100%">
        {images.map((img, idx) => (
          <Box key={idx} w="100%" h="250px" bgImage={`url(${img})`} bgSize="cover" borderRadius="lg" 
          _hover={{ transform: "scale(1.05)" }}
              transition="transform 0.2s" />
        ))}
      </Grid> */}

      
    </VStack>
  );
}

export default TenantDashboard;
