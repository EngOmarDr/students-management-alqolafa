import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/LoginPage';
import { AppContent } from './AppContent';

function AppRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          {/* Spinner with updated size and color for better visibility */}
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-indigo-600"></div>
          <p className="text-gray-600 mt-4 text-xl font-semibold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return user ? <AppContent /> : <LoginPage />;
}

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
