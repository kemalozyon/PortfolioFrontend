// frontend/src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Tarayıcının hafızasından token'ı kontrol et
  const token = localStorage.getItem('adminToken');

  // Eğer token yoksa (kullanıcı giriş yapmamışsa), onu Login sayfasına yönlendir.
  // 'replace' özelliği, tarayıcının geri tuşuna basıldığında tekrar bu sayfaya dönmesini engeller.
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Eğer token varsa, gitmek istediği sayfayı (children) ekrana çiz.
  return children;
};

export default ProtectedRoute;