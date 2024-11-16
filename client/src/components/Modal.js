import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Grid,
  Select,
  Text,
  HStack,
  Image,
  VStack,
  Box,
  Avatar,
} from "@chakra-ui/react";

// Modal thêm phòng mới
export const NewRoomModal = ({
  isOpen,
  onClose,
  newRoom,
  setNewRoom,
  handleCreateRoom,
  handleImageChange,
  handleInputChange,
}) => (
  <Modal isCentered isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader textAlign="center">Thêm phòng mới</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <FormControl mb={2} isRequired>
            <FormLabel>Tiêu đề bài đăng</FormLabel>
            <Input
              name="roomTitle"
              value={newRoom.roomTitle}
              onChange={(e) => handleInputChange(e, setNewRoom)}
              placeholder="Nhập tiêu đề bài đăng"
            />
          </FormControl>
          <FormControl mb={2} isRequired>
            <FormLabel>Tên phòng</FormLabel>
            <Input
              name="roomName"
              value={newRoom.roomName}
              onChange={(e) => handleInputChange(e, setNewRoom)}
              placeholder="Nhập tên phòng"
            />
          </FormControl>
          <FormControl mb={2} isRequired>
            <FormLabel>Diện tích (m²)</FormLabel>
            <Input
              type="number"
              name="area"
              value={newRoom.area}
              onChange={(e) => handleInputChange(e, setNewRoom)}
              placeholder="Nhập diện tích phòng"
            />
          </FormControl>
          <FormControl mb={2} isRequired>
            <FormLabel>Số tiền cọc (VND)</FormLabel>
            <Input
              type="number"
              name="deposit"
              value={newRoom.deposit}
              onChange={(e) => handleInputChange(e, setNewRoom)}
              placeholder="Nhập giá tiền cọc"
            />
          </FormControl>
          <FormControl mb={2} isRequired>
            <FormLabel>Giá phòng (VND)</FormLabel>
            <Input
              type="number"
              name="price"
              value={newRoom.price}
              onChange={(e) => handleInputChange(e, setNewRoom)}
              placeholder="Nhập giá phòng"
            />
          </FormControl>
          <FormControl mb={2} isRequired gridColumn="span 2">
            <FormLabel>Mô tả chi tiết</FormLabel>
            <Textarea
              name="description"
              value={newRoom.description}
              onChange={(e) => handleInputChange(e, setNewRoom)}
              placeholder="Nhập mô tả phòng"
            />
          </FormControl>
          <FormControl mb={2} isRequired gridColumn="span 2">
            <FormLabel>Thêm hình ảnh</FormLabel>
            <Input
              type="file"
              name="images"
              onChange={handleImageChange}
              multiple
              accept="image/*"
            />
            <Text mt={2}>Bạn có thể tải lên tối đa 5 hình ảnh</Text>
          </FormControl>
        </Grid>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="green" mr={3} onClick={handleCreateRoom}>
          Tạo phòng
        </Button>
        <Button colorScheme="red" onClick={onClose}>
          Hủy
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

// Modal cập nhật thông tin phòng
export const UpdateModal = ({
  isOpen,
  onClose,
  update,
  setUpdate,
  handleUpdate,
  handleInputChange,
}) => (
  <Modal isCentered isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Cập nhật số điện và số nước</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <FormControl mb={4}>
          <FormLabel>Số điện</FormLabel>
          <Input
            type="number"
            placeholder="Nhập số điện"
            name="electricityIndex"
            value={update.electricityIndex}
            onChange={(e) => handleInputChange(e, setUpdate)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Số nước</FormLabel>
          <Input
            type="number"
            placeholder="Nhập số nước"
            name="aquaIndex"
            value={update.aquaIndex}
            onChange={(e) => handleInputChange(e, setUpdate)}
          />
        </FormControl>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="blue" onClick={handleUpdate}>
          Cập nhật
        </Button>
        <Button onClick={onClose} variant="ghost" ml={3}>
          Hủy
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
// Modal tạo hóa đơn
export const BillModal = ({
  isOpen,
  onClose,
  bill,
  setBill,
  handleCreateBill,
  handleInputChange,
}) => (
  <Modal isCentered isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader textAlign="center">Tạo hóa đơn mới</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <FormControl isRequired>
            <FormLabel>Tiền điện</FormLabel>
            <Input
              type="number"
              name="electricityBill"
              value={bill.elecBill}
              onChange={(e) => handleInputChange(e, setBill)}
              placeholder="Nhập tiền điện"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Tiền nước</FormLabel>
            <Input
              type="number"
              name="waterBill"
              value={bill.waterBill}
              onChange={(e) => handleInputChange(e, setBill)}
              placeholder="Nhập tiền nước"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Phí khác</FormLabel>
            <Input
              type="number"
              name="otherFees"
              value={bill.serviceFee}
              onChange={(e) => handleInputChange(e, setBill)}
              placeholder="Nhập phí khác (nếu có)"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Tổng tiền</FormLabel>
            <Input
              type="number"
              name="total"
              value={bill.total}
              onChange={(e) => handleInputChange(e, setBill)}
              placeholder="Nhập tổng tiền"
            />
          </FormControl>
        </Grid>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="green" onClick={handleCreateBill}>
          Tạo hóa đơn
        </Button>
        <Button onClick={onClose} ml={3}>
          Hủy
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
// Modal tạo hợp đồng
export const ContractModal = ({
  isOpen,
  onClose,
  contractDetails,
  setContractDetails,
  handleCreateContract,
  handleInputChange,
}) => (
  <Modal isCentered isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader textAlign={"center"}>Hợp đồng mới</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <FormControl isRequired>
            <FormLabel>Ngày tạo</FormLabel>
            <Input
              name="startDate"
              type="date"
              value={contractDetails.startDate}
              onChange={(e) => handleInputChange(e, setContractDetails)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Ngày hết hạn</FormLabel>
            <Input
              name="endDate"
              type="date"
              value={contractDetails.endDate}
              onChange={(e) => handleInputChange(e, setContractDetails)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Tiền cọc</FormLabel>
            <Input
              name="deposit"
              type="number"
              value={contractDetails.deposit}
              onChange={(e) => handleInputChange(e, setContractDetails)}
              placeholder="Nhập tiền cọc"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Tiền thuê phòng</FormLabel>
            <Input
              name="rent"
              type="number"
              value={contractDetails.rent}
              onChange={(e) => handleInputChange(e, setContractDetails)}
              placeholder="Nhập tiền thuê phòng"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Số tiền điện</FormLabel>
            <Input
              name="electricityBill"
              type="number"
              value={contractDetails.elecBill}
              onChange={(e) => handleInputChange(e, setContractDetails)}
              placeholder="Nhập tiền điện"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Số tiền nước</FormLabel>
            <Input
              name="waterBill"
              type="number"
              value={contractDetails.waterBill}
              onChange={(e) => handleInputChange(e, setContractDetails)}
              placeholder="Nhập tiền nước"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Tên bên thuê</FormLabel>
            <Input
              name="tenantName"
              value={contractDetails.tenantName}
              onChange={(e) => handleInputChange(e, setContractDetails)}
              placeholder="Nhập tên bên thuê"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Tên bên cho thuê </FormLabel>
            <Input
              name="landlordName"
              value={contractDetails.landlordName}
              onChange={(e) => handleInputChange(e, setContractDetails)}
              placeholder="Nhập tên bên cho thuê"
            />
          </FormControl>
        </Grid>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="green" mr={3} onClick={handleCreateContract}>
          Tạo hợp đồng
        </Button>
        <Button onClick={onClose} variant="ghost">
          Hủy
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
// Modal xem thông tin phòng
export const InfoModal = ({
  isOpen,
  onClose,
  selectedRoom,
  selectedImage,
  setSelectedImage,
}) => (
  <Modal isCentered isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>
        <Text fontSize="2xl" fontWeight="bold" align={"center"}>
          {selectedRoom?.roomName || "Đang tải..."}
        </Text>
      </ModalHeader>
      <ModalCloseButton />

      <ModalBody>
        {/* Main Image and Details */}
        <HStack align="start" spacing={4}>
          <Image
            src={selectedImage || "Đang tải..."}
            alt={selectedRoom?.roomName || "Đang tải..."}
            borderRadius="md"
            boxSize="250px"
            objectFit="cover"
          />

          {/* Room Details */}

          <VStack align={"start"} spacing={2} flex="1">
            <Text fontWeight="bold">Số điện:</Text>{" "}
            <Text> {selectedRoom?.electricity || "Đang tải..."}</Text>
            <Text fontWeight="bold">Số nước:</Text>{" "}
            <Text>{selectedRoom?.water || "Đang tải..."}</Text>
            <Text fontWeight="bold">Giá phòng:</Text>{" "}
            <Text>{selectedRoom?.price || "Đang tải..."} VND</Text>
            <Text fontWeight="bold">Diện tích:</Text>{" "}
            <Text>{selectedRoom?.area || "Đang tải..."} m²</Text>
            <Text fontWeight="bold">Mô tả:</Text>{" "}
            <Text>{selectedRoom?.description || "Đang tải..."}</Text>
          </VStack>
        </HStack>

        {/* Thumbnail Images */}
        <HStack mt={4} spacing={2}>
          {selectedRoom?.images.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={`Thumbnail ${index + 1}`}
              boxSize="50px"
              objectFit="cover"
              borderRadius="md"
              cursor="pointer"
              onClick={() => setSelectedImage(image)} // Cập nhật hình ảnh khi nhấp vào
            />
          )) || "Đang tải"}
        </HStack>

        {/* Tenant Information */}
        <Box mt={6} borderWidth="1px" borderRadius="md" p={4}>
          <Text fontWeight="bold" mb={2}>
            Khách thuê:
          </Text>
          <HStack spacing={3}>
            {/* <Avatar src={newRoom.tenantAvatar} /> */}
            <VStack align="start" spacing={0}>
              {/* <Text>Tên khách thuê: {newRoom.tenantName}</Text>
              <Text>Số điện thoại: {newRoom.tenantPhone}</Text> */}
            </VStack>
          </HStack>
        </Box>
      </ModalBody>

      <ModalFooter>
        <Button onClick={onClose} colorScheme="gray" mr={3}>
          Đóng
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
// Modal chỉnh sửa phòng
export const EditModal = ({
  isOpen,
  onClose,
  selectedRoom,
  handleEditRoom,
  handleInputChange,
}) => (
  <Modal isCentered isOpen={isOpen} onClose={onClose} size={"2xl"}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>
        <Input
          w={"80%"}
          value={selectedRoom?.roomName || ""}
          onChange={(e) => handleInputChange("roomName", e.target.value)}
          fontSize="2xl"
          fontWeight="bold"
          align={"center"}
          placeholder="Tên phòng"
        />
      </ModalHeader>
      <ModalCloseButton />

      <ModalBody>
        {/* Main Image and Details */}
        <HStack align="start" spacing={4}>
          <Image
            src={selectedRoom?.images || ""}
            alt={selectedRoom?.roomName || "Đang tải..."}
            borderRadius="md"
            boxSize="250px"
            objectFit="cover"
          />
          <VStack align={"start"} spacing={2} flex="1">
            <Text fontWeight="bold">Giá phòng:</Text>
            <Input
              type="number"
              value={selectedRoom?.price || ""}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="Giá phòng (VND)"
            />
            <Text fontWeight="bold">Diện tích:</Text>
            <Input
              type="number"
              value={selectedRoom?.area || ""}
              onChange={(e) => handleInputChange("area", e.target.value)}
              placeholder="Diện tích (m²)"
            />
            <Text fontWeight="bold">Mô tả:</Text>
            <Textarea
              value={selectedRoom?.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Mô tả phòng"
            />
          </VStack>
        </HStack>

        {/* Thumbnail Images */}
        <HStack mt={4} spacing={2}>
          {selectedRoom?.images?.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={`Thumbnail ${index + 1}`}
              boxSize="50px"
              objectFit="cover"
              borderRadius="md"
              cursor="pointer"
            />
          ))}
        </HStack>
      </ModalBody>

      <ModalFooter>
        <Button colorScheme="blue" onClick={handleEditRoom} mr={3}>
          Lưu thay đổi
        </Button>{" "}
        <Button onClick={onClose} colorScheme="gray">
          Đóng
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
