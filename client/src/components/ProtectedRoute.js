import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, rolesRequired = [] }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Nếu không có token, chuyển hướng tới trang đăng nhập
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Nếu vai trò người dùng không thuộc danh sách vai trò được phép
  if (rolesRequired.length > 0 && !rolesRequired.includes(role)) {
    return <Navigate to="/unauthorized" />; //! Cần thêm trang xử lý sai role
  }

  // Nếu người dùng có quyền truy cập, render nội dung
  return children;
};

export default ProtectedRoute;
