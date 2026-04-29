import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Blogs from './pages/Blogs';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ProjectDetail from './pages/ProjectDetail';
import BlogDetail from './pages/BlogDetail';

function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
      {/* Navbar her sayfanın tepesinde kalacak */}
      <Navbar /> 
      
      <Routes>
        {/* Herkese Açık Rotalar */}
        <Route path="/" element={<Home />} /> 
        <Route path="/projects" element={<Projects />} /> 
        <Route path="/blogs" element={<Blogs />} /> 

        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        
        {/* Admin Rotaları */}
        <Route path="/login" element={<Login />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
