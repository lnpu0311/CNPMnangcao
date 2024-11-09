
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
  IconButton
 } from "@chakra-ui/react";
import { FaFacebook, FaYoutube, FaInstagram, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


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

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + heroImages.length) % heroImages.length);
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

  const currentContent = contentData[currentContentIndex];

  return (
    <VStack spacing={10} align="center" p={4} w="100%">
      {/* Hero Section */}
      <Box w="100%" h="500px" position="relative" borderRadius="lg" overflow="hidden">
        <Image 
          src={heroImages[currentImageIndex]} 
          alt="Hero Image" 
          boxSize="100%" 
          objectFit="cover" 
          h="100%" 
        />
        <Box p={8} textAlign="center" color="white" bg="rgba(0, 0, 0, 0.5)" position="absolute" top={0} left={0} right={0} bottom={0}>
        <Heading
          bgGradient="linear(to-l, #9fccfa, #0974f1)"
          bgClip="text"
          fontSize="4xl"
          fontWeight="bold"
          _hover={{ transform: "scale(1.05)" }}
              transition="transform 0.2s"
        >
          Welcome to Hostel Community
        </Heading>
          <Text color= "white" fontSize="lg">Luôn đồng hành cùng bạn!</Text>
          {/* <Button mt={4} colorScheme="gray" onClick={() => navigate("/admissions")}>Learn More</Button> */}
        </Box>
        {/* Mũi tên trái */}
        <IconButton 
          icon={<FaChevronLeft />} 
          aria-label="Previous Image" 
          position="absolute" 
          left={4} 
          top="50%" 
          transform="translateY(-50%)" 
          onClick={prevImage} 
          colorScheme="yellow"
          _hover={{ bg: "yellow.300" }}
        />
        {/* Mũi tên phải */}
        <IconButton 
          icon={<FaChevronRight />} 
          aria-label="Next Image" 
          position="absolute" 
          right={4} 
          top="50%" 
          transform="translateY(-50%)" 
          onClick={nextImage} 
          colorScheme="yellow"
          _hover={{ bg: "yellow.300" }}
        />
      </Box>

      {/* About & Values Section */}
      <VStack spacing={8} align="center" p={6} w="100%">       
        <Stack direction={{ base: "column", md: "row" }} spacing={6} align="center" justify="space-between" w="80%">
          <Image 
            src={currentContent.image} 
            boxSize="400px" 
            borderRadius="lg" 
            alt="Môi trường sống" 
            boxShadow="md" // Thêm bóng đổ
            transition="transform 0.2s" // Hiệu ứng chuyển động
            _hover={{ transform: "scale(1.05)" }}
          />
          <Box>
            <Heading fontSize="2xl" mb={4}>{currentContent.title}</Heading>
            <Text fontSize="md">{currentContent.description}</Text>
            <Stack spacing={2} mt={4}>
              {currentContent.values.map((value, index) => (
                <Text key={index}>
                  <Text as="span" fontWeight="bold">{value.title}</Text> 
                  <Text fontSize="sm">{value.description}</Text>
                </Text>
              ))}
            </Stack>
          </Box>
        </Stack>
      </VStack>

      {/* Profile */}
      <Heading fontSize="2xl" textAlign="center">Đội ngũ của chúng tôi</Heading>
      <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={4} w="100%">
        {curriculumPathways.map(({ name, avatar, role, description }) => (
          <Box key={name} p={4} bg="gray.100" borderRadius="lg" textAlign="center" position="relative" onClick={() => handleOpenDetails(name)}>
            <Image
              src={avatar} 
              alt={name}
              borderRadius="lg" // Để ảnh có góc bo tròn
              boxSize="100%" // Chiếm toàn bộ chiều rộng và chiều cao của Box
              objectFit="cover" 
              _hover={{ transform: "scale(1.05)" }}
              transition="transform 0.2s"
            />
            <Box position="absolute" bottom={0} left={0} right={0} p={4} bg="gray.100" borderRadius="lg">
              <Heading fontSize="25px" >{name}</Heading>
              <Text fontSize="md">{role}</Text> {/* Thêm vai trò */}
            </Box>
          </Box>
        ))}
      </Grid>

      {/* Modal để hiển thị thông tin chi tiết */}
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack spacing={4}>
              <Image
                src={selectedMember?.avatar} // Sử dụng avatar từ selectedMember
                alt={selectedMember?.name}
                borderRadius="full"
                boxSize="50px" // Kích thước ảnh đại diện
              />
              <Text>{selectedMember?.name}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight="bold">Role: {selectedMember?.role}</Text>
            <Text mt={2}>{selectedMember?.description}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleClose}>
              Đóng
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Testimonials */}
      <Heading fontSize="2xl" textAlign="center">Cộng đồng của chúng tôi</Heading>
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
      </Stack>

      {/* News & Updates */}
      <Heading fontSize="2xl" textAlign="center">Tin tức & Thành tựu</Heading>
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4} w="100%">
        {images.map((img, idx) => (
          <Box key={idx} w="100%" h="250px" bgImage={`url(${img})`} bgSize="cover" borderRadius="lg" 
          _hover={{ transform: "scale(1.05)" }}
              transition="transform 0.2s" />
        ))}
      </Grid>

      
    </VStack>
  );
}

export default TenantDashboard;
