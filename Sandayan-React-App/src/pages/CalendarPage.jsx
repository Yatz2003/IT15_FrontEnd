import { useEffect, useState } from 'react';
import SchoolDaysSection from '../components/dashboard/SchoolDaysSection';
import schoolDayApi from '../services/schoolDayApi';

const extractError = (error, fallback) => error?.response?.data?.message || error?.message || fallback;

function CalendarPage() {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadCalendar = async () => {
      setIsLoading(true);
      setError('');

      try {
        const payload = await schoolDayApi.getSchoolDays();
        if (mounted) {
          setRows(payload);
        }
      } catch (requestError) {
        if (mounted) {
          setRows([]);
          setError(extractError(requestError, 'Unable to load academic calendar.'));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadCalendar();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="mx-auto max-w-[1400px] space-y-4">
      <div className="glass-panel p-5 sm:p-6">
        <h1 className="text-3xl font-bold text-cyan-50">Academic Calendar</h1>
        <p className="mt-2 text-sm text-slate-300">Track school day schedules, holidays, attendance rates, and upcoming events.</p>
      </div>

      <SchoolDaysSection rows={rows} isLoading={isLoading} error={error} />
    </section>
  );
}

export default CalendarPage;
