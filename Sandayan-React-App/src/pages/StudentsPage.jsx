import { useEffect, useMemo, useState } from 'react';
import CrudTablePage from '../components/common/CrudTablePage';
import { dashboardApi } from '../services/api';

const baseColumns = [
  { key: 'studentNo', label: 'Student No.' },
  { key: 'name', label: 'Full Name' },
  {
    key: 'program',
    label: 'Program',
    inputType: 'select',
    options: [],
  },
  {
    key: 'yearLevel',
    label: 'Year Level',
    inputType: 'select',
    options: ['1', '2', '3', '4'],
  },
  {
    key: 'status',
    label: 'Status',
    inputType: 'select',
    options: ['Enrolled', 'Irregular', 'Probationary', 'Graduating', 'Dropped'],
  },
];

const initialRows = [
  { id: 1, studentNo: '2026-001', name: 'Aira Dela Cruz', program: 'BSIT', yearLevel: '2', status: 'Enrolled' },
  { id: 2, studentNo: '2026-002', name: 'Noel Pascual', program: 'BSCS', yearLevel: '4', status: 'Enrolled' },
  { id: 3, studentNo: '2026-003', name: 'Mina Santos', program: 'BSBA', yearLevel: '3', status: 'Probationary' },
  { id: 4, studentNo: '2026-004', name: 'Rico Flores', program: 'BSED', yearLevel: '1', status: 'Enrolled' },
  { id: 5, studentNo: '2026-005', name: 'Janelle Mateo', program: 'BSIT', yearLevel: '2', status: 'Irregular' },
  { id: 6, studentNo: '2026-006', name: 'Kian Ortega', program: 'BSHM', yearLevel: '3', status: 'Enrolled' },
  { id: 7, studentNo: '2026-007', name: 'Cara Lim', program: 'BSCS', yearLevel: '1', status: 'Enrolled' },
  { id: 8, studentNo: '2026-008', name: 'Andre Villanueva', program: 'BSBA', yearLevel: '4', status: 'Graduating' },
];

function StudentsPage() {
  const [programOptions, setProgramOptions] = useState(['BSIT', 'BSCS', 'BSBA', 'BSED', 'BSHM']);

  useEffect(() => {
    let mounted = true;

    const loadProgramOptions = async () => {
      try {
        const programs = await dashboardApi.getProgramDistribution();

        if (!mounted || !Array.isArray(programs)) {
          return;
        }

        const normalizedPrograms = programs
          .map((entry) => String(entry.program || '').trim())
          .filter(Boolean);

        if (!normalizedPrograms.length) {
          return;
        }

        setProgramOptions((prev) => Array.from(new Set([...prev, ...normalizedPrograms])).sort());
      } catch {
        // Keep existing options when the program source is unavailable.
      }
    };

    loadProgramOptions();

    return () => {
      mounted = false;
    };
  }, []);

  const columns = useMemo(
    () => baseColumns.map((column) => (column.key === 'program' ? { ...column, options: programOptions } : column)),
    [programOptions]
  );

  return (
    <CrudTablePage
      title="Student Directory"
      description="View and update student records, program assignment, year level, and enrollment status."
      entityLabel="Student"
      archiveType="Students"
      columns={columns}
      initialRows={initialRows}
    />
  );
}

export default StudentsPage;
