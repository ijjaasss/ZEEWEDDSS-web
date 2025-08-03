import  { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Home } from './pages/Home';
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { CreateGallery } from './pages/admin/CreateGallery';
import { ManageGalleries } from './pages/admin/ManageGalleries';
import { GalleryView } from './pages/gallery/GalleryView';
import { NotFound } from './pages/NotFound';

import { useAppDispatch, useAppSelector } from './hooks';
import { getCurrentUser } from './features/authSlice';
import ControlPanel from './pages/admin/ControlPanel';

const AppRoutes = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLogin, loading } = useAppSelector((state) => state.auth);


  useEffect(() => {
    // Check authentication status when route changes
    const checkAuth = async () => {
      await dispatch(getCurrentUser());
    };
    checkAuth();
  }, [dispatch, location.pathname]);

  useEffect(() => {
    if (!loading) {
      const isAdminRoute = location.pathname.startsWith('/admin') ;
      
      if (isAdminRoute && !isLogin) {
        navigate('/login', { state: { from: location.pathname } });
      }
      
      if (location.pathname === '/login' && isLogin) {
        navigate('/admin');
      }
    }
  }, [isLogin, loading, navigate, location.pathname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={isLogin ? <Dashboard /> : null} />
      <Route path="/admin/gallery/create" element={isLogin ? <CreateGallery /> : null} />
      <Route path="/admin/galleries" element={isLogin ? <ManageGalleries /> : null} />
      <Route path='/admin/control-panel' element={isLogin?<ControlPanel />:null}/>
      <Route path="/gallery/:id" element={<GalleryView />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;