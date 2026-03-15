import { useState } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import ErrorBoundary from './components/common/ErrorBoundary';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import StudentsPage from './pages/StudentsPage';
import ProgramsPage from './pages/ProgramsPage';
import SubjectsPage from './pages/SubjectsPage';
import EnrollmentManagement from './pages/EnrollmentManagement';
import Reports from './pages/Reports';
import SettingsPage from './pages/SettingsPage';
import ActiveProgramsPage from './pages/ActiveProgramsPage';
import CalendarPage from './pages/CalendarPage';
import ArchivePage from './pages/ArchivePage';

function AppShell() {
  const location = useLocation();
  const [isDesktopNavVisible, setIsDesktopNavVisible] = useState(true);

  return (
    <div className="relative min-h-screen">
      <div className="grid-atmosphere" aria-hidden="true" />
      <Navbar isDesktopNavVisible={isDesktopNavVisible} onToggleDesktopNav={() => setIsDesktopNavVisible((prev) => !prev)} />
      <main className={`min-h-screen px-3 pb-5 pt-16 transition-all duration-500 ease-in-out lg:pr-8 lg:pt-6 ${isDesktopNavVisible ? 'lg:pl-[19rem]' : 'lg:pl-8'}`}>
        <div key={location.pathname} className="page-stage">
          <Outlet />
        </div>
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
            <Route path="/active-programs" element={<ActiveProgramsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/enrollment" element={<EnrollmentManagement />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/dashboard" element={<Navigate to="/overview" replace />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;