
import { useState, useEffect } from "react"; 
import axios from "axios";
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
  Flex,
  Tag
 } from "@chakra-ui/react";
import { FaFacebook, FaYoutube, FaInstagram, FaChevronLeft, FaChevronRight, FaBuilding } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Banner from "./Banner";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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


  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_API}/user/rooms`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response.data.success && Array.isArray(response.data.data)) {
          const formattedRooms = response.data.data.map((room) => ({
            id: room._id,
            roomTitle: room.roomTitle || "Không có tiêu đề",
            address: room.hostelId
              ? `${room.hostelId.address || ""}, ${room.hostelId.ward || ""}, ${
                  room.hostelId.district || ""
                }, ${room.hostelId.city || ""}`
              : "Địa chỉ không có sẵn",
            status: room.status === "available" ? "Còn trống" : "Đã thuê",
            price: room.price || 0,
            image: room.images && room.images.length > 0
              ? room.images[0]
              : "https://via.placeholder.com/200",
          }));
          setRooms(formattedRooms);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
  
    fetchRooms();
  }, []);

  // Thêm cấu hình slider
const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  arrows: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
      }
    }
  ]
};

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

      <Box my={8} px={4}>
  <Slider {...sliderSettings}>
    {rooms.map((room) => (
      <Box key={room.id} p={2}>
        <Box
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          bg="white"
          boxShadow="sm"
          _hover={{ boxShadow: "md" }}
        >
          <Image
            src={room.image}
            alt={room.roomTitle}
            height="200px"
            width="100%"
            objectFit="cover"
          />
          <Box p={4}>
            <Text fontWeight="bold" fontSize="lg" mb={2}>
              {room.roomTitle}
            </Text>
            <Text fontSize="sm" color="gray.600" mb={2}>
              Địa chỉ: {room.address}
            </Text>
            <Flex justify="space-between" align="center">
              <Tag
                colorScheme={room.status === "Còn trống" ? "green" : "red"}
                size="sm"
              >
                {room.status}
              </Tag>
              <Text fontWeight="bold" color="orange.500">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(room.price)}
              </Text>
            </Flex>
          </Box>
        </Box>
      </Box>
    ))}
  </Slider>
</Box>

       {/* Room List Button */}
       <Box my={20}>
        <Button
          size="lg"
          colorScheme="orange"
        
          onClick={() => navigate('room-list')}
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          }}
          transition="all 0.2s"
        >
          Tìm phòng ngay!
        </Button>
      </Box>

      {/* Profile Section */}
      <Box 
        py={15} 
        px={{ base: 4, md: 8 }} 
        bg="gray.50"
        mt={10} 
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
