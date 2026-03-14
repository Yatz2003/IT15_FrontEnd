import CrudTablePage from '../components/common/CrudTablePage';

const columns = [
  { key: 'studentNo', label: 'Student No.' },
  { key: 'name', label: 'Full Name' },
  { key: 'program', label: 'Program' },
  { key: 'yearLevel', label: 'Year Level' },
  { key: 'status', label: 'Status' },
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
  return (
    <CrudTablePage
      title="Students"
      description="Track student records, profile details, and academic status through a streamlined CRUD interface."
      entityLabel="Student"
      columns={columns}
      initialRows={initialRows}
    />
  );
}

export default StudentsPage;
