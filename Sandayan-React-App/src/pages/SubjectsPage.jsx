import CrudTablePage from '../components/common/CrudTablePage';

const columns = [
  { key: 'code', label: 'Subject Code' },
  { key: 'name', label: 'Subject Name' },
  { key: 'units', label: 'Units' },
  { key: 'program', label: 'Program' },
  { key: 'semester', label: 'Semester' },
];

const initialRows = [
  { id: 1, code: 'IT101', name: 'Introduction to Computing', units: '3', program: 'BSIT', semester: '1st' },
  { id: 2, code: 'IT202', name: 'Web Systems', units: '3', program: 'BSIT', semester: '2nd' },
  { id: 3, code: 'CS301', name: 'Data Structures', units: '3', program: 'BSCS', semester: '1st' },
  { id: 4, code: 'BA102', name: 'Business Finance', units: '3', program: 'BSBA', semester: '2nd' },
  { id: 5, code: 'ED104', name: 'Child and Adolescent Learning', units: '3', program: 'BSED', semester: '1st' },
  { id: 6, code: 'HM200', name: 'Front Office Operations', units: '3', program: 'BSHM', semester: '2nd' },
  { id: 7, code: 'IT315', name: 'Cloud Fundamentals', units: '3', program: 'BSIT', semester: '1st' },
  { id: 8, code: 'CS399', name: 'Machine Learning Basics', units: '3', program: 'BSCS', semester: '2nd' },
];

function SubjectsPage() {
  return (
    <CrudTablePage
      title="Subjects"
      description="Control subject catalog data with searchable records, pagination, and add/edit modal workflow."
      entityLabel="Subject"
      columns={columns}
      initialRows={initialRows}
    />
  );
}

export default SubjectsPage;
