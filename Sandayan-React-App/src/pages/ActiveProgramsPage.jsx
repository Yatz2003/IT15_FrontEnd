import CrudTablePage from '../components/common/CrudTablePage';

const columns = [
  { key: 'code', label: 'Program Code' },
  { key: 'name', label: 'Program Name' },
  { key: 'coordinator', label: 'Coordinator' },
  { key: 'enrolled', label: 'Enrolled' },
  { key: 'term', label: 'Current Term' },
];

const initialRows = [
  { id: 1, code: 'BSIT', name: 'BS Information Technology', coordinator: 'Prof. De Guzman', enrolled: '421', term: 'SY 2025-2026' },
  { id: 2, code: 'BSCS', name: 'BS Computer Science', coordinator: 'Prof. Tan', enrolled: '318', term: 'SY 2025-2026' },
  { id: 3, code: 'BSBA', name: 'BS Business Administration', coordinator: 'Prof. Rivera', enrolled: '270', term: 'SY 2025-2026' },
  { id: 4, code: 'BSED', name: 'BS Education', coordinator: 'Prof. Macalinao', enrolled: '184', term: 'SY 2025-2026' },
  { id: 5, code: 'BSHM', name: 'BS Hospitality Management', coordinator: 'Prof. Lacuesta', enrolled: '162', term: 'SY 2025-2026' },
  { id: 6, code: 'BSCrim', name: 'BS Criminology', coordinator: 'Prof. Ramos', enrolled: '239', term: 'SY 2025-2026' },
  { id: 7, code: 'BEED', name: 'Bachelor of Elementary Education', coordinator: 'Prof. Paras', enrolled: '207', term: 'SY 2025-2026' },
  { id: 8, code: 'BSA', name: 'BS Accountancy', coordinator: 'Prof. Uy', enrolled: '125', term: 'SY 2025-2026' },
];

function ActiveProgramsPage() {
  return (
    <CrudTablePage
      title="Active Programs"
      description="Monitor currently running academic programs and quickly update operational records."
      entityLabel="Active Program"
      columns={columns}
      initialRows={initialRows}
    />
  );
}

export default ActiveProgramsPage;
