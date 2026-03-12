import { useEffect, useMemo, useState } from 'react';
import EnrollmentChart from './EnrollmentChart';
import CourseDistributionChart from './CourseDistributionChart';
import AttendanceChart from './AttendanceChart';
import LoadingSkeleton from '../common/LoadingSkeleton';
import dashboardApi from '../../services/dashboardApi';
import WeatherWidget from '../weather/WeatherWidget';

const extractError = (error, fallback) => error.response?.data?.message || error.message || fallback;

function Dashboard() {
  const [enrollment, setEnrollment] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      setIsLoading(true);
      setErrors([]);

      const [enrollmentResult, distributionResult, attendanceResult] = await Promise.allSettled([
        dashboardApi.getEnrollmentTrends(),
        dashboardApi.getCourseDistribution(),
        dashboardApi.getAttendanceData(),
      ]);

      if (!isMounted) {
        return;
      }

      const nextErrors = [];

      if (enrollmentResult.status === 'fulfilled') {
        setEnrollment(Array.isArray(enrollmentResult.value) ? enrollmentResult.value : []);
      } else {
        nextErrors.push(extractError(enrollmentResult.reason, 'Unable to load enrollment trends.'));
      }

      if (distributionResult.status === 'fulfilled') {
        setDistribution(Array.isArray(distributionResult.value) ? distributionResult.value : []);
      } else {
        nextErrors.push(extractError(distributionResult.reason, 'Unable to load course distribution.'));
      }

      if (attendanceResult.status === 'fulfilled') {
        setAttendance(Array.isArray(attendanceResult.value) ? attendanceResult.value : []);
      } else {
        nextErrors.push(extractError(attendanceResult.reason, 'Unable to load attendance patterns.'));
      }

      setErrors(nextErrors);
      setIsLoading(false);
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const summary = useMemo(() => ({
    enrollmentPoints: enrollment.length,
    courseGroups: distribution.length,
    attendanceDays: attendance.length,
  }), [enrollment.length, distribution.length, attendance.length]);

  return (
    <div className="container-fluid py-4 px-3 px-md-4">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-2">
        <div>
          <h1 className="h3 fw-bold mb-1">Academic Dashboard</h1>
          <p className="text-muted mb-0">Live analytics from Laravel REST endpoints.</p>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="alert alert-warning" role="alert">
          <p className="fw-semibold mb-2">Some widgets could not load:</p>
          <ul className="mb-0">
            {errors.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="row g-3 mb-3">
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm h-100 stat-card">
            <div className="card-body">
              <p className="text-muted mb-1">Enrollment Data Points</p>
              <h2 className="h3 mb-0">{summary.enrollmentPoints}</h2>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm h-100 stat-card">
            <div className="card-body">
              <p className="text-muted mb-1">Course Categories</p>
              <h2 className="h3 mb-0">{summary.courseGroups}</h2>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm h-100 stat-card">
            <div className="card-body">
              <p className="text-muted mb-1">Attendance Days</p>
              <h2 className="h3 mb-0">{summary.attendanceDays}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-xl-8">
          <div className="row g-3">
            <div className="col-12">
              {isLoading ? <LoadingSkeleton /> : <EnrollmentChart data={enrollment} />}
            </div>
            <div className="col-12 col-lg-6">
              {isLoading ? <LoadingSkeleton /> : <CourseDistributionChart data={distribution} />}
            </div>
            <div className="col-12 col-lg-6">
              {isLoading ? <LoadingSkeleton /> : <AttendanceChart data={attendance} />}
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <WeatherWidget />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
