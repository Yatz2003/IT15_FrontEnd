import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import ErrorBoundary from './components/common/ErrorBoundary';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import StudentsPage from './pages/StudentsPage';
import ProgramsPage from './pages/ProgramsPage';
import SubjectsPage from './pages/SubjectsPage';
import EnrollmentPage from './pages/EnrollmentPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

function AppShell() {
  return (
    <div className="app-root">
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/overview" element={<Dashboard />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/subjects" element={<SubjectsPage />} />
            <Route path="/enrollment" element={<EnrollmentPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/dashboard" element={<Navigate to="/overview" replace />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;