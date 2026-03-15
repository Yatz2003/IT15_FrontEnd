import { useEffect, useMemo, useState } from 'react';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import DeleteConfirmDashboard from '../components/common/DeleteConfirmDashboard';
import enrollmentApi from '../services/enrollmentApi';
import archiveService from '../services/archiveService';

const PAGE_SIZE = 10;
const extractError = (error, fallback) => error?.response?.data?.message || error?.message || fallback;
const STATUS_OPTIONS = ['Enrolled', 'Dropped', 'Pending', 'Waitlisted', 'Completed', 'On Hold'];

const mergeRowsById = (primaryRows = [], secondaryRows = []) => {
  const merged = [];
  const seen = new Set();

  [...primaryRows, ...secondaryRows].forEach((row) => {
    const resolvedId = row?.id;

    if (resolvedId === undefined || resolvedId === null || seen.has(resolvedId)) {
      return;
    }

    seen.add(resolvedId);
    merged.push(row);
  });

  return merged;
};

function EnrollmentManagement() {
  const [restoredEnrollments] = useState(() => archiveService.consumeRestoredItems('Enrollment'));
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState(null);
  const [editForm, setEditForm] = useState({
    student: '',
    subject: '',
    program: '',
    academicYear: '',
    semester: '',
    status: '',
  });
  const [editError, setEditError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, row: null });

  useEffect(() => {
    let mounted = true;

    const loadEnrollments = async () => {
      setIsLoading(true);
      setError('');

      try {
        const payload = await enrollmentApi.getEnrollments();
        if (mounted) {
          setRows(mergeRowsById(restoredEnrollments, payload));
        }
      } catch (requestError) {
        if (mounted) {
          setError(extractError(requestError, 'Unable to load enrollments.'));
          setRows(mergeRowsById(restoredEnrollments, []));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadEnrollments();

    return () => {
      mounted = false;
    };
  }, [restoredEnrollments]);

  const programs = useMemo(() => Array.from(new Set(rows.map((item) => item.program).filter(Boolean))).sort(), [rows]);
  const semesters = useMemo(() => Array.from(new Set(rows.map((item) => item.semester).filter(Boolean))).sort(), [rows]);
  const subjects = useMemo(() => Array.from(new Set(rows.map((item) => item.subject).filter(Boolean))).sort(), [rows]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();

    return rows.filter((row) => {
      const searchMatch = !term || [row.student, row.subject, row.program, row.academicYear, row.semester, row.status]
        .some((value) => String(value || '').toLowerCase().includes(term));
      const programMatch = !programFilter || row.program === programFilter;
      const semesterMatch = !semesterFilter || row.semester === semesterFilter;
      return searchMatch && programMatch && semesterMatch;
    });
  }, [rows, search, programFilter, semesterFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedRows = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [filteredRows, safeCurrentPage]);

  const openEditModal = (row) => {
    setSelectedEnrollmentId(row.id);
    setEditError('');
    setEditForm({
      student: String(row.student || ''),
      subject: String(row.subject || ''),
      program: String(row.program || ''),
      academicYear: String(row.academicYear || ''),
      semester: String(row.semester || ''),
      status: String(row.status || ''),
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEnrollmentId(null);
    setEditError('');
  };

  const validateEditForm = () => {
    if (!editForm.student.trim() || !editForm.subject.trim() || !editForm.program.trim() || !editForm.academicYear.trim() || !editForm.semester.trim()) {
      return 'Please complete all enrollment fields.';
    }

    return '';
  };

  const saveEnrollment = (nextStatus) => {
    const validationMessage = validateEditForm();

    if (validationMessage) {
      setEditError(validationMessage);
      return;
    }

    const resolvedStatus = nextStatus || editForm.status || 'Enrolled';

    setRows((prev) => prev.map((row) => (
      row.id === selectedEnrollmentId
        ? {
          ...row,
          student: editForm.student.trim(),
          subject: editForm.subject.trim(),
          program: editForm.program.trim(),
          academicYear: editForm.academicYear.trim(),
          semester: editForm.semester.trim(),
          status: resolvedStatus,
        }
        : row
    )));

    closeEditModal();
  };

  const openDeleteModal = () => {
    if (!selectedEnrollmentId) {
      return;
    }

    const enrollmentToDelete = rows.find((row) => row.id === selectedEnrollmentId) || null;
    setDeleteModal({ open: true, row: enrollmentToDelete });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, row: null });
  };

  const confirmDeleteEnrollment = () => {
    if (!deleteModal.row || !selectedEnrollmentId) {
      closeDeleteModal();
      return;
    }

    const enrollmentToDelete = deleteModal.row;

    if (enrollmentToDelete) {
      archiveService.addArchivedItem({
        entityType: 'Enrollment',
        label: `${enrollmentToDelete.student} - ${enrollmentToDelete.subject}`,
        data: enrollmentToDelete,
      });
    }

    setRows((prev) => prev.filter((row) => row.id !== selectedEnrollmentId));
    closeDeleteModal();
    closeEditModal();
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, programFilter, semesterFilter]);

  return (
    <section className="mx-auto max-w-[1400px] space-y-4">
      <div className="glass-panel p-5 sm:p-6">
        <h1 className="text-3xl font-bold text-cyan-50">Enrollment Management</h1>
        <p className="mt-2 text-sm text-slate-300">Monitor student enrollments by subject, program, academic year, and semester.</p>
      </div>

      <div className="glass-panel p-4 sm:p-5">
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="input-glow rounded-xl border border-cyan-200/25 bg-slate-900/35 px-3 py-2 text-sm text-white outline-none"
            placeholder="Search enrollments..."
          />
          <select
            value={programFilter}
            onChange={(event) => setProgramFilter(event.target.value)}
            className="input-glow rounded-xl border border-cyan-200/25 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none"
            style={{ colorScheme: 'dark' }}
          >
            <option value="" className="bg-slate-900 text-slate-100">All Programs</option>
            {programs.map((program) => (
              <option key={program} value={program} className="bg-slate-900 text-slate-100">{program}</option>
            ))}
          </select>
          <select
            value={semesterFilter}
            onChange={(event) => setSemesterFilter(event.target.value)}
            className="input-glow rounded-xl border border-cyan-200/25 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none"
            style={{ colorScheme: 'dark' }}
          >
            <option value="" className="bg-slate-900 text-slate-100">All Semesters</option>
            {semesters.map((semester) => (
              <option key={semester} value={semester} className="bg-slate-900 text-slate-100">{semester}</option>
            ))}
          </select>
          <button
            type="button"
            className="rounded-xl border border-cyan-200/30 bg-cyan-500/10 px-3 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
            onClick={() => {
              setSearch('');
              setProgramFilter('');
              setSemesterFilter('');
            }}
          >
            Clear Filters
          </button>
        </div>

        {isLoading ? (
          <LoadingSkeleton height={340} />
        ) : error ? (
          <div className="rounded-xl border border-rose-300/25 bg-rose-500/10 p-4 text-sm text-rose-100" role="alert">{error}</div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-cyan-200/18">
              <table className="w-full min-w-[900px] text-left text-sm text-slate-200">
                <thead className="bg-cyan-500/10 text-xs uppercase tracking-[0.16em] text-cyan-100">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Student</th>
                    <th className="px-4 py-3 font-semibold">Subject</th>
                    <th className="px-4 py-3 font-semibold">Program</th>
                    <th className="px-4 py-3 font-semibold">Academic Year</th>
                    <th className="px-4 py-3 font-semibold">Semester</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Options</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-100/10 bg-slate-950/20">
                  {paginatedRows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-slate-300">No enrollment records found.</td>
                    </tr>
                  ) : (
                    paginatedRows.map((row) => (
                      <tr key={row.id} className="transition hover:bg-cyan-400/6">
                        <td className="px-4 py-3 font-semibold text-cyan-100">{row.student}</td>
                        <td className="px-4 py-3">{row.subject}</td>
                        <td className="px-4 py-3">{row.program}</td>
                        <td className="px-4 py-3">{row.academicYear}</td>
                        <td className="px-4 py-3">{row.semester}</td>
                        <td className="px-4 py-3">{row.status}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="rounded-md border border-cyan-300/35 bg-cyan-500/15 px-2.5 py-1 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-500/25"
                              onClick={() => openEditModal(row)}
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-3 flex flex-col gap-2 text-xs text-slate-300 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Showing {(safeCurrentPage - 1) * PAGE_SIZE + (paginatedRows.length ? 1 : 0)}-
                {(safeCurrentPage - 1) * PAGE_SIZE + paginatedRows.length} of {filteredRows.length} enrollments
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-md border border-cyan-200/30 px-2.5 py-1 transition hover:bg-cyan-400/10 disabled:opacity-50"
                  disabled={safeCurrentPage === 1}
                  onClick={() => setCurrentPage((page) => Math.max(1, Math.min(totalPages, page - 1)))}
                >
                  Prev
                </button>
                <span>Page {safeCurrentPage} / {totalPages}</span>
                <button
                  type="button"
                  className="rounded-md border border-cyan-200/30 px-2.5 py-1 transition hover:bg-cyan-400/10 disabled:opacity-50"
                  disabled={safeCurrentPage === totalPages}
                  onClick={() => setCurrentPage((page) => Math.max(1, Math.min(totalPages, page + 1)))}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/75 p-4">
          <div className="glass-panel max-h-[90vh] w-full max-w-2xl overflow-y-auto p-5">
            <h2 className="text-lg font-semibold text-cyan-100">Edit Enrollment</h2>
            <p className="mt-1 text-xs text-slate-300">Update enrollment details and set status to Enrolled or Dropped.</p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-xs text-slate-300">
                Student
                <input
                  value={editForm.student}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, student: event.target.value }))}
                  className="input-glow mt-1 w-full rounded-lg border border-cyan-200/25 bg-slate-900/35 px-3 py-2 text-sm text-white outline-none"
                />
              </label>

              <label className="text-xs text-slate-300">
                Subject
                <select
                  value={editForm.subject}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, subject: event.target.value }))}
                  className="input-glow mt-1 w-full rounded-lg border border-cyan-200/25 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="" className="bg-slate-900 text-slate-100">Select subject</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject} className="bg-slate-900 text-slate-100">{subject}</option>
                  ))}
                </select>
              </label>

              <label className="text-xs text-slate-300">
                Program
                <select
                  value={editForm.program}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, program: event.target.value }))}
                  className="input-glow mt-1 w-full rounded-lg border border-cyan-200/25 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="" className="bg-slate-900 text-slate-100">Select program</option>
                  {programs.map((program) => (
                    <option key={program} value={program} className="bg-slate-900 text-slate-100">{program}</option>
                  ))}
                </select>
              </label>

              <label className="text-xs text-slate-300">
                Academic Year
                <input
                  value={editForm.academicYear}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, academicYear: event.target.value }))}
                  className="input-glow mt-1 w-full rounded-lg border border-cyan-200/25 bg-slate-900/35 px-3 py-2 text-sm text-white outline-none"
                />
              </label>

              <label className="text-xs text-slate-300">
                Semester
                <select
                  value={editForm.semester}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, semester: event.target.value }))}
                  className="input-glow mt-1 w-full rounded-lg border border-cyan-200/25 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="" className="bg-slate-900 text-slate-100">Select semester</option>
                  {semesters.map((semester) => (
                    <option key={semester} value={semester} className="bg-slate-900 text-slate-100">{semester}</option>
                  ))}
                </select>
              </label>

              <label className="text-xs text-slate-300">
                Status
                <select
                  value={editForm.status}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, status: event.target.value }))}
                  className="input-glow mt-1 w-full rounded-lg border border-cyan-200/25 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="" className="bg-slate-900 text-slate-100">Select status</option>
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status} className="bg-slate-900 text-slate-100">{status}</option>
                  ))}
                </select>
              </label>
            </div>

            {editError && <p className="mt-3 text-xs text-rose-200">{editError}</p>}

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                className="rounded-lg border border-slate-300/30 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:bg-slate-600/20"
                onClick={closeEditModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-lg border border-emerald-300/35 bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-500/25"
                onClick={() => saveEnrollment('Enrolled')}
              >
                Enroll
              </button>
              <button
                type="button"
                className="rounded-lg border border-amber-300/35 bg-amber-500/15 px-3 py-2 text-xs font-semibold text-amber-100 transition hover:bg-amber-500/25"
                onClick={() => saveEnrollment('Dropped')}
              >
                Drop
              </button>
              <button
                type="button"
                className="rounded-lg border border-rose-300/35 bg-rose-500/15 px-3 py-2 text-xs font-semibold text-rose-100 transition hover:bg-rose-500/25"
                onClick={openDeleteModal}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmDashboard
        open={deleteModal.open}
        title="Delete Enrollment?"
        message="Please confirm if you want to delete this enrollment record. You can restore it in the Record Recovery Center."
        entityType="Enrollment"
        recordLabel={deleteModal.row ? `${deleteModal.row.student} - ${deleteModal.row.subject}` : ''}
        onCancel={closeDeleteModal}
        onConfirm={confirmDeleteEnrollment}
        confirmText="Yes, Delete"
        cancelText="Cancel"
      />
    </section>
  );
}

export default EnrollmentManagement;
