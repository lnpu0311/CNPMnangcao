import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  SimpleGrid,
  Image,
  Text,
  Badge,
  IconButton,
  Button,
  Flex,
  Spinner,
  Center,
  Heading,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import {
  NewRoomModal,
  UpdateModal,
  BillModal,
  ContractModal,
  InfoModal,
  EditModal,
} from "../components/Modal.js";
import { FaArrowLeft, FaEdit, FaPlus, FaTrash, FaUpload } from "react-icons/fa";
import { IoReceipt } from "react-icons/io5";
import data from "../data/monthyear.json";
import axios from "axios";
import Pagination from "../components/Pagination";
const RoomList = () => {
  const [hostel, setHostel] = useState();
  const [rooms, setRooms] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();
  const { facilityId } = useParams();
  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(12);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  //Tính toán số trang
  const totalPages = Math.ceil(rooms.length / itemPerPage);
  //Lấy dữ liệu cho trang hiện tại
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemPerPage;
    const endIndex = startIndex + itemPerPage;
    return rooms.slice(startIndex, endIndex);
  };

  useEffect(() => {
    // Lấy dữ liệu từ file data.json và cập nhật vào state
    setMonths(data.months);
    setYears(data.years);
  }, []);

  useEffect(
    () => {
      console.log("facilityId:", facilityId);
      const fetchRooms = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API}/landlord/hostel/${facilityId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("API Response:", response.data);
          if (response.data.success && response.data.data) {
            setHostel(response.data.data);
            setRooms(
              Array.isArray(response.data.data.rooms)
                ? response.data.data.rooms
                : []
            );
          } else {
            console.error("Invalid response format:", response.data);
            setRooms([]);
          }
        } catch (error) {
          console.error("Error fetching rooms:", error);
          setRooms([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchRooms();
    },
    [facilityId],
    [rooms]
  );

  // Cập nhật hình ảnh mặc định khi chọn phòng thay đổi
  useEffect(() => {
    if (selectedRoom) {
      setSelectedImage(selectedRoom.images[0]);
    }
  }, [selectedRoom]);

  // Kiểm tra dữ liệu của hostel khi nó thay đổi
  useEffect(() => {
    if (hostel) {
      console.log("Thông tin hostel sau khi cập nhật:", hostel);
    }
  }, [hostel]);

  const [isLoading, setIsLoading] = useState({
    roomName: "",
    area: "",
    price: "",
    description: "",
    deposit: "",
    images: [],
  });
  // quản lý state của các modal
  const [modalState, setModalState] = useState({
    newRoom: false,
    contract: false,
    infoRoom: false,
    editRoom: false,
    update: false,
    bill: false,
  });

  //  bật/tắt modal
  const toggleModal = (modalName, value) => {
    setModalState((prev) => ({ ...prev, [modalName]: value }));
  };

  const [newRoom, setNewRoom] = useState({
    roomTitle: "",
    roomName: "",
    area: "",
    price: "",
    description: "",
    hostelId: "",
    deposit: "",
    images: [],
  });

  const [update, setUpdate] = useState({
    elecIndex: "",
    aquaIndex: "",
  });

  const [contractDetails, setContractDetails] = useState({
    startDate: "",
    endDate: "",
    depositFee: "",
    rentFee: "",
    electricityFee: "",
    waterFee: "",
    tenantEmail: "",
  });

  const [bill, setBill] = useState({
    rent: "",
    elecBill: "",
    waterBill: "",
    otherFees: "",
    otherFeesDescription: "",
    total: "",
    isPaid: false,
    paidAt: "",
    dueDate: "",
    elecIndex: "",
    aquaIndex: "",
  });

  const handleCreateRoom = async () => {
    if (
      !newRoom.roomName ||
      !newRoom.area ||
      !newRoom.price ||
      !newRoom.description
    ) {
      toast({
        title: "Thông tin chưa đầy đủ.",
        description: "Vui lòng điền đầy đủ thông tin phòng.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const data = new FormData();
    data.append("roomTitle", newRoom.roomTitle);
    data.append("roomName", newRoom.roomName);
    data.append("area", newRoom.area);
    data.append("price", newRoom.price);
    data.append("description", newRoom.description);
    data.append("deposit", newRoom.deposit);
    newRoom.images.forEach((image) => {
      data.append("images", image);
    });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/landlord/room/${facilityId}/create`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast({
          title: "Tạo phòng thành công!",
          description: "Phòng mới đã được thêm vào danh sách.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // Reset form về mặc định
        setNewRoom({
          roomTitle: "",
          roomName: "",
          area: "",
          price: "",
          description: "",
          deposit: "",
          images: [],
        });

        // Đóng modal
        toggleModal("newRoom", false);
      } else {
        toast({
          title: "Có lỗi xảy ra.",
          description: response.data.message || "Vui lòng thử lại.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Lỗi khi tạo phòng:", error);
      toast({
        title: "Không thể tạo phòng.",
        description:
          "Đã xảy ra lỗi trong quá trình tạo phòng. Vui lòng thử lại.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditRoom = async (roomId) => {
    if (
      !newRoom.roomName ||
      !newRoom.area ||
      !newRoom.price ||
      !newRoom.description
    ) {
      toast({
        title: "Thông tin chưa đầy đủ.",
        description: "Vui lòng điền đầy đủ thông tin phòng.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const data = new FormData();
    data.append("roomTitle", newRoom.roomTitle);
    data.append("roomName", newRoom.roomName);
    data.append("area", newRoom.area);
    data.append("price", newRoom.price);
    data.append("description", newRoom.description);
    data.append("deposit", newRoom.deposit);
    newRoom.images.forEach((image) => {
      data.append("images", image);
    });

    try {
      // Send PUT request to update room information
      const response = await axios.put(
        `${process.env.REACT_APP_API}/landlord/room/${roomId}/edit`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast({
          title: "Chỉnh sửa phòng thành công!",
          description: "Thông tin phòng đã được cập nhật.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // Update the room list in the state if needed
        setRooms((prevRooms) =>
          prevRooms.map((room) =>
            room._id === roomId ? response.data.room : room
          )
        );

        // Optionally close the edit modal if you have one
        toggleModal("editRoom", false);
      } else {
        toast({
          title: "Có lỗi xảy ra.",
          description: response.data.message || "Vui lòng thử lại.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Lỗi khi chỉnh sửa phòng:", error);
      toast({
        title: "Không thể chỉnh sửa phòng.",
        description:
          "Đã xảy ra lỗi trong quá trình chỉnh sửa phòng. Vui lòng thử lại.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      // Send DELETE request to the API with roomId in the URL
      const response = await axios.delete(
        `${process.env.REACT_APP_API}/landlord/room/${roomId}/delete`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Check if the response indicates a successful deletion
      if (response.data.success) {
        toast({
          title: "Xóa phòng thành công!",
          description: "Phòng đã được xóa khỏi danh sách.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // Update the room list in state by removing the deleted room
        setRooms((prevRooms) =>
          prevRooms.filter((room) => room._id !== roomId)
        );
      } else {
        toast({
          title: "Có lỗi xảy ra.",
          description: response.data.message || "Vui lòng thử lại.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Lỗi khi xóa phòng:", error);
      toast({
        title: "Không thể xóa phòng.",
        description:
          "Đã xảy ra lỗi trong quá trình xóa phòng. Vui lòng thử lại.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCreateBill = async () => {
    if (
      !bill.elecBill ||
      !bill.waterBill ||
      (bill.otherFees && !bill.otherFeesDescription)
    ) {
      toast({
        title: "Thông tin chưa đầy đủ.",
        description: bill.otherFees
          ? "Vui lòng điền nội dung cho phí khác."
          : "Vui lòng điền đầy đủ thông tin.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/landlord/bill/create`,
        bill,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        toast({
          title: "Tạo hóa đơn thành công!",
          description: "Hóa đơn đã được tạo thành công.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // // Reset dữ liệu hóa đơn
        // setBill({

        //   month: "",
        //   year: "",
        //   electricityBill: "",
        //   waterBill: "",
        //   otherFees: "",
        //   total: "",
        // });

        // Đóng modal
        toggleModal("bill", false);
      } else {
        toast({
          title: "Có lỗi xảy ra.",
          description: response.data.message || "Vui lòng thử lại.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Lỗi khi tạo hóa đơn:", error);
      toast({
        title: "Không thể tạo hóa đơn.",
        description:
          "Đã xảy ra lỗi trong quá trình tạo hóa đơn. Vui lòng thử lại.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (event, setStateFunction) => {
    const { name, value } = event.target;
    setStateFunction((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    if (!update.elecIndex || !update.aquaIndex) {
      toast({
        title: "Thông tin chưa đầy đủ.",
        description: "Vui lòng điền đầy đủ số điện và số nước.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    console.log(selectedRoom._id);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/landlord/hostel/${selectedRoom._id}/updateUnit`,
        {
          elecIndex: update.elecIndex,
          aquaIndex: update.aquaIndex,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        toast({
          title: "Cập nhật thành công!",
          description: "Thông tin phòng đã được cập nhật.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // Cập nhật dữ liệu phòng trong danh sách (nếu cần)
        setRooms((prevRooms) =>
          prevRooms.map((room) =>
            room.id === selectedRoom.id ? { ...room, ...update } : room
          )
        );

        // Đóng modal
        toggleModal("update", false);
      } else {
        toast({
          title: "Có lỗi xảy ra.",
          description: response.data.message || "Vui lòng thử lại.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      toast({
        title: "Không thể cập nhật.",
        description:
          "Đã xảy ra lỗi trong quá trình cập nhật. Vui lòng thử lại.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      alert("Bạn chỉ có thể tải lên tối đa 5 hình ảnh");
      e.target.value = ""; // Clear the input to prevent setting the images
      return;
    }

    setNewRoom((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const handleAddTenant = (e) => {
    const { name, value } = e.target;
    setContractDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleCreateContract = async () => {
    try {
      // Kiểm tra các trường bắt buộc
      if (
        !contractDetails.startDate ||
        !contractDetails.endDate ||
        !contractDetails.depositFee ||
        !contractDetails.rentFee ||
        !contractDetails.electricityFee ||
        !contractDetails.waterFee ||
        !contractDetails.tenantEmail
      ) {
        toast({
          title: "Lỗi",
          description: "Vui lòng điền đầy đủ thông tin hợp đồng",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Log để kiểm tra selectedRoom
      console.log("Selected Room:", selectedRoom);

      // Tạo hợp đồng
      const contractResponse = await axios.post(
        `${process.env.REACT_APP_API}/landlord/contract/create`,
        {
          roomId: selectedRoom.roomId._id,
          tenantId: selectedRoom.tenantId._id,
          landlordId: selectedRoom.landlordId,
          startDate: new Date(contractDetails.startDate),
          endDate: new Date(contractDetails.endDate),
          depositFee: Number(contractDetails.depositFee),
          rentFee: Number(contractDetails.rentFee),
          electricityFee: Number(contractDetails.electricityFee),
          waterFee: Number(contractDetails.waterFee),
          tenantEmail: String(contractDetails.tenantEmail),

          utilities: {
            electricity: {
              unitPrice: Number(contractDetails.electricityFee),
              initialReading: 0,
              currentReading: 0,
              lastUpdated: new Date(),
            },
            water: {
              unitPrice: Number(contractDetails.waterFee),
              initialReading: 0,
              currentReading: 0,
              lastUpdated: new Date(),
            },
          },
          monthlyFees: [],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (contractResponse.data.success) {
        // Log để kiểm tra response
        console.log("Contract creation response:", contractResponse.data);

        toast({
          title: "Thành công",
          description: "Đã tạo hợp đồng thành công",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onclose();
      }
    } catch (error) {
      console.error("Contract creation error:", error);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể tạo hợp đồng",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Box>
      <Flex justifyContent="space-between" mb={4}>
        <Button
          onClick={handleGoBack}
          colorScheme="teal"
          leftIcon={<FaArrowLeft />}
        >
          Quay lại
        </Button>
        <Button
          onClick={() => toggleModal("newRoom", true)}
          colorScheme="green"
          rightIcon={<FaPlus />}
        >
          Thêm phòng mới
        </Button>
      </Flex>
      <Heading
        textColor={"blue.500"}
        as="h3"
        size="lg"
        mb={{ base: 4, md: 12 }}
      >
        Danh sách phòng của cơ sở: {hostel?.name || "Đang tải..."}
      </Heading>
      {isLoading ? (
        <Center>
          <Spinner size="xl" />
        </Center>
      ) : !rooms || rooms.length === 0 ? (
        <Center>
          <Text>Không có phòng nào</Text>
        </Center>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
          {getCurrentPageData().map((room) => (
            <Box
              border={"1px solid"}
              borderColor={"gray.200"}
              rounded={"lg"}
              key={room.id}
              borderRadius="lg"
              overflow="hidden"
              boxShadow="xl"
              bg={room.status === "occupied" ? "brand.100" : "brand.2"}
              position="relative"
              p={2}
              cursor="pointer"
              onClick={() => {
                setSelectedRoom(room); // Lưu thông tin phòng được chọn
                toggleModal("infoRoom", true); // Hiển thị modal thông tin phòng
              }}
            >
              <Image
                width="100%"
                height={"200px"}
                src={room.images?.[0]}
                alt={room.roomName}
                borderRadius="md"
                objectFit="cover"
              />
              <Text fontSize={"lg"} fontWeight={"bold"} my={2}>
                {room.roomName}
              </Text>

              <Flex
                direction="row"
                alignItems="center"
                justifyContent="space-evenly"
                mt={2}
              >
                {room.status === "available" ? (
                  <>
                    <Tooltip label="Chỉnh sửa" aria-label="Chỉnh sửa">
                      <IconButton
                        icon={<FaEdit />}
                        size="sm"
                        colorScheme="teal"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleModal("editRoom", true);
                          handleEditRoom(room);
                        }}
                      />
                    </Tooltip>
                    <Tooltip label="Thêm hợp đồng" aria-label="Thêm hợp đồng">
                      <IconButton
                        icon={<FaPlus />}
                        size="sm"
                        colorScheme="blue"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleModal("contract", true);
                        }}
                      />
                    </Tooltip>
                    <Tooltip label="Xóa phòng" aria-label="Xóa">
                      <IconButton
                        icon={<FaTrash />}
                        size="sm"
                        colorScheme="red"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRoom(room.roomId);
                        }}
                      />
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <Tooltip label="Tạo hóa đơn" aria-label="Tạo hóa đơn">
                      <IconButton
                        icon={<IoReceipt />}
                        size="sm"
                        colorScheme="purple"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleModal("bill", true);
                        }}
                      />
                    </Tooltip>
                    <Tooltip label="Cập nhật" aria-label="Cập nhật">
                      <IconButton
                        icon={<FaUpload />}
                        size="sm"
                        colorScheme="green"
                        onClick={(e) => {
                          setSelectedRoom(room);
                          e.stopPropagation();
                          toggleModal("update", true);
                        }}
                      />
                    </Tooltip>

                    <Badge
                      position="absolute"
                      top={1}
                      left={0}
                      zIndex="1"
                      colorScheme={
                        room.paymentStatus === "paid" ? "green" : "red"
                      }
                      bg={room.paymentStatus === "paid" ? "green.500" : "red"}
                      px={2}
                      py={1}
                    >
                      {room.paymentStatus === "paid"
                        ? "Đã thanh toán"
                        : "Chưa thanh toán"}
                    </Badge>
                  </>
                )}
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      )}

      <NewRoomModal
        isOpen={modalState.newRoom}
        onClose={() => toggleModal("newRoom", false)}
        newRoom={newRoom}
        setNewRoom={setNewRoom}
        handleCreateRoom={handleCreateRoom}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
      />
      <UpdateModal
        isOpen={modalState.update}
        onClose={() => toggleModal("update", false)}
        update={update}
        setUpdate={setUpdate}
        handleUpdate={handleUpdate}
        handleInputChange={handleInputChange}
      />
      <BillModal
        isOpen={modalState.bill}
        onClose={() => toggleModal("bill", false)}
        bill={bill}
        setBill={setBill}
        handleCreateBill={handleCreateBill}
        handleInputChange={handleInputChange}
      />
      <ContractModal
        isOpen={modalState.contract}
        onClose={() => toggleModal("contract", false)}
        contractDetails={contractDetails}
        setContractDetails={setContractDetails}
        handleCreateContract={handleCreateContract}
        handleInputChange={handleInputChange}
      />
      <InfoModal
        isOpen={modalState.infoRoom}
        onClose={() => toggleModal("infoRoom", false)}
        selectedImage={selectedImage}
        selectedRoom={selectedRoom}
        setSelectedImage={setSelectedImage}
      />
      <EditModal
        isOpen={modalState.editRoom}
        onClose={() => toggleModal("editRoom", false)}
        selectedRoom={selectedRoom}
        handleInputChange={handleInputChange}
        handleEditRoom={handleEditRoom}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </Box>
  );
};

export default RoomList;
