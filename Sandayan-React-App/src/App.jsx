import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
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
import ActiveProgramsPage from './pages/ActiveProgramsPage';

function AppShell() {
  const location = useLocation();

  return (
    <div className="relative min-h-screen">
      <div className="grid-atmosphere" aria-hidden="true" />
      <Navbar />
      <main className="min-h-screen px-3 pb-5 pt-16 lg:pl-[19rem] lg:pr-8 lg:pt-6">
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