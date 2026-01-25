import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Feed from './pages/Feed';
import Wall from './pages/Wall';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthProvider from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <PrivateRoute>
                  <Feed />
                </PrivateRoute>
              } />
              
              <Route path="/feed" element={
                <PrivateRoute>
                  <Feed />
                </PrivateRoute>
              } />
              
              <Route path="/wall/:userId" element={
                <PrivateRoute>
                  <Wall />
                </PrivateRoute>
              } />
              
              <Route path="/my-wall" element={
                <PrivateRoute>
                  <Wall isOwnWall={true} />
                </PrivateRoute>
              } />
              
              {/* Redirect unknown routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
    </ErrorBoundary>
  );
}