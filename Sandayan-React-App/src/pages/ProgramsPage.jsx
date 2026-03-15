import CrudTablePage from '../components/common/CrudTablePage';

const columns = [
  { key: 'code', label: 'Program Code' },
  { key: 'name', label: 'Program Name' },
  { key: 'college', label: 'College' },
  { key: 'duration', label: 'Duration' },
  { key: 'status', label: 'Status' },
];

const initialRows = [
  { id: 1, code: 'BSIT', name: 'BS Information Technology', college: 'CCS', duration: '4 Years', status: 'Active' },
  { id: 2, code: 'BSCS', name: 'BS Computer Science', college: 'CCS', duration: '4 Years', status: 'Active' },
  { id: 3, code: 'BSED', name: 'BS Education', college: 'COE', duration: '4 Years', status: 'Active' },
  { id: 4, code: 'BSBA', name: 'BS Business Administration', college: 'CBA', duration: '4 Years', status: 'Active' },
  { id: 5, code: 'BSHM', name: 'BS Hospitality Management', college: 'CTHM', duration: '4 Years', status: 'Review' },
  { id: 6, code: 'BSCrim', name: 'BS Criminology', college: 'CCJE', duration: '4 Years', status: 'Active' },
  { id: 7, code: 'BSA', name: 'BS Accountancy', college: 'CBA', duration: '4 Years', status: 'Limited Slot' },
  { id: 8, code: 'BEED', name: 'Bachelor of Elementary Education', college: 'COE', duration: '4 Years', status: 'Active' },
];

function ProgramsPage() {
  return (
    <CrudTablePage
      title="Academic Programs"
      description="Manage program offerings, colleges, duration, and current program status."
      entityLabel="Program"
      archiveType="Programs"
      columns={columns}
      initialRows={initialRows}
    />
  );
}

export default ProgramsPage;
