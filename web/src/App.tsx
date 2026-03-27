import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useUserStore } from '@stores/user.store';

import Layout from '@components/layout/Layout';
import Login from '@pages/auth/Login';
import Register from '@pages/auth/Register';
import MaterialList from '@pages/material/MaterialList';
import MaterialDetail from '@pages/material/MaterialDetail';
import ImageGenerate from '@pages/image/ImageGenerate';
import VideoGenerate from '@pages/video/VideoGenerate';
import MyWork from '@pages/work/MyWork';
import MyCollection from '@pages/work/MyCollection';
import Profile from '@pages/auth/Profile';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isLogin } = useUserStore();
  return isLogin ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/material" replace />} />
          <Route path="material" element={<MaterialList />} />
          <Route path="material/:id" element={<MaterialDetail />} />
          <Route path="image/generate" element={<ImageGenerate />} />
          <Route path="video/generate" element={<VideoGenerate />} />
          <Route path="work" element={<MyWork />} />
          <Route path="collection" element={<MyCollection />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
