import { useEffect, useMemo, useState } from 'react';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import DeleteConfirmDashboard from '../components/common/DeleteConfirmDashboard';
import subjectApi from '../services/subjectApi';
import archiveService from '../services/archiveService';

const extractError = (error, fallback) => error?.response?.data?.message || error?.message || fallback;
const PAGE_SIZE = 10;

const dedupeByCode = (rows = []) => {
  const seen = new Set();

  return rows.filter((item) => {
    const code = String(item.code || '').trim().toUpperCase();
    if (!code || seen.has(code)) {
      return false;
    }

    seen.add(code);
    return true;
  });
};

function SubjectsPage() {
  const [restoredSubjects] = useState(() => archiveService.consumeRestoredItems('Subjects'));
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, subject: null });
  const [form, setForm] = useState({
    code: '',
    name: '',
    program: '',
    units: '',
    semester: '',
  });

  const resetForm = () => {
    setForm({ code: '', name: '', program: '', units: '', semester: '' });
    setFormError('');
    setSelectedSubjectId(null);
  };

  const openAddModal = () => {
    setModalMode('create');
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (subject) => {
    setModalMode('edit');
    setSelectedSubjectId(subject.id);
    setFormError('');
    setForm({
      code: String(subject.code || ''),
      name: String(subject.name || ''),
      program: String(subject.program || ''),
      units: String(subject.units || ''),
      semester: String(subject.semester || ''),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting) {
      return;
    }

    setIsModalOpen(false);
    resetForm();
  };

  const openDeleteModal = (subject) => {
    setDeleteModal({ open: true, subject });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, subject: null });
  };

  const confirmDeleteSubject = () => {
    if (!deleteModal.subject) {
      return;
    }

    const subjectToDelete = deleteModal.subject;

    archiveService.addArchivedItem({
      entityType: 'Subjects',
      label: `${subjectToDelete.code} - ${subjectToDelete.name}`,
      data: subjectToDelete,
    });

    setSubjects((prev) => prev.filter((item) => item.id !== subjectToDelete.id));
    closeDeleteModal();
  };

  const validateForm = () => {
    if (!form.code.trim() || !form.name.trim() || !form.program.trim() || !form.units.trim() || !form.semester.trim()) {
      return 'All subject fields are required.';
    }

    if (Number.isNaN(Number(form.units)) || Number(form.units) <= 0) {
      return 'Units must be a valid positive number.';
    }

    return '';
  };

  const handleSubmitSubject = async () => {
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    const payload = {
      subject_code: form.code.trim(),
      subject_name: form.name.trim(),
      program: form.program.trim(),
      units: Number(form.units),
      semester: form.semester.trim(),
    };

    try {
      if (modalMode === 'create') {
        const created = await subjectApi.createSubject(payload);
        const nextRow = created || {
          id: Date.now(),
          code: payload.subject_code,
          name: payload.subject_name,
          program: payload.program,
          units: payload.units,
          semester: payload.semester,
        };
        setSubjects((prev) => dedupeByCode([nextRow, ...prev]));
      } else {
        const updated = await subjectApi.updateSubject(selectedSubjectId, payload);
        const nextRow = updated || {
          id: selectedSubjectId,
          code: payload.subject_code,
          name: payload.subject_name,
          program: payload.program,
          units: payload.units,
          semester: payload.semester,
        };

        setSubjects((prev) => dedupeByCode(prev.map((item) => (item.id === selectedSubjectId ? { ...item, ...nextRow } : item))));
      }

      closeModal();
    } catch (requestError) {
      setFormError(extractError(requestError, `Unable to ${modalMode === 'create' ? 'add' : 'update'} subject.`));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadSubjects = async () => {
      setIsLoading(true);
      setError('');

      try {
        const rows = await subjectApi.getSubjects();
        if (mounted) {
          setSubjects(dedupeByCode([...restoredSubjects, ...rows]));
        }
      } catch (requestError) {
        if (mounted) {
          setError(extractError(requestError, 'Unable to load subjects.'));
          setSubjects(dedupeByCode(restoredSubjects));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadSubjects();

    return () => {
      mounted = false;
    };
  }, [restoredSubjects]);

  const filteredSubjects = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return subjects;
    }

    return subjects.filter((item) => {
      const code = String(item.code || '').toLowerCase();
      const name = String(item.name || '').toLowerCase();
      const program = String(item.program || '').toLowerCase();
      return code.includes(term) || name.includes(term) || program.includes(term);
    });
  }, [subjects, search]);

  const programOptions = useMemo(() => {
    const fromSubjects = subjects
      .map((item) => String(item.program || '').trim())
      .filter(Boolean);

    const unique = Array.from(new Set(fromSubjects)).sort();

    if (form.program && !unique.includes(form.program)) {
      return [form.program, ...unique];
    }

    return unique;
  }, [subjects, form.program]);

  const subjectNameOptions = useMemo(() => {
    const fromSubjects = subjects
      .map((item) => String(item.name || '').trim())
      .filter(Boolean);

    const unique = Array.from(new Set(fromSubjects)).sort();

    if (form.name && !unique.includes(form.name)) {
      return [form.name, ...unique];
    }

    return unique;
  }, [subjects, form.name]);

  const totalPages = Math.max(1, Math.ceil(filteredSubjects.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedSubjects = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;
    return filteredSubjects.slice(start, start + PAGE_SIZE);
  }, [filteredSubjects, safeCurrentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <section className="mx-auto max-w-[1400px] space-y-4">
      <div className="glass-panel p-5 sm:p-6">
        <h1 className="text-3xl font-bold text-cyan-50">Course Catalog</h1>
        <p className="mt-2 text-sm text-slate-300">Browse and manage subject code, name, program, units, and semester details.</p>
      </div>

      <div className="glass-panel p-4 sm:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="input-glow w-full rounded-xl border border-cyan-200/25 bg-slate-900/35 px-3 py-2 text-sm text-white outline-none sm:max-w-sm"
            placeholder="Search by subject code, name, or program..."
          />
          <button
            type="button"
            className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:brightness-110"
            onClick={openAddModal}
          >
            Add Subject
          </button>
        </div>

        {isLoading ? (
          <LoadingSkeleton height={340} />
        ) : error ? (
          <div className="rounded-xl border border-rose-300/25 bg-rose-500/10 p-4 text-sm text-rose-100" role="alert">{error}</div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-cyan-200/18">
              <table className="w-full min-w-[760px] text-left text-sm text-slate-200">
                <thead className="bg-cyan-500/10 text-xs uppercase tracking-[0.2em] text-cyan-100">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Subject Code</th>
                    <th className="px-4 py-3 font-semibold">Subject Name</th>
                    <th className="px-4 py-3 font-semibold">Program</th>
                    <th className="px-4 py-3 font-semibold">Units</th>
                    <th className="px-4 py-3 font-semibold">Semester</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-100/10 bg-slate-950/20">
                  {paginatedSubjects.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-slate-300">
                        {subjects.length === 0 ? 'No subjects found from the API.' : 'No subjects match your search.'}
                      </td>
                    </tr>
                  ) : (
                    paginatedSubjects.map((subject) => (
                      <tr key={subject.id} className="transition hover:bg-cyan-400/6">
                        <td className="px-4 py-3 font-semibold text-cyan-100">{subject.code}</td>
                        <td className="px-4 py-3">{subject.name}</td>
                        <td className="px-4 py-3">{subject.program}</td>
                        <td className="px-4 py-3">{subject.units}</td>
                        <td className="px-4 py-3">{subject.semester}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="rounded-lg border border-cyan-200/30 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-400/15"
                              onClick={() => openEditModal(subject)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="rounded-lg border border-rose-300/35 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-100 transition hover:bg-rose-500/20"
                              onClick={() => openDeleteModal(subject)}
                            >
                              Delete
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
                Showing {(safeCurrentPage - 1) * PAGE_SIZE + (paginatedSubjects.length ? 1 : 0)}-
                {(safeCurrentPage - 1) * PAGE_SIZE + paginatedSubjects.length} of {filteredSubjects.length} subjects
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

      {isModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/75 px-4 py-4">
          <div className="glass-panel max-h-[90vh] w-full max-w-lg overflow-y-auto p-5">
            <h2 className="text-lg font-semibold text-cyan-100">{modalMode === 'create' ? 'Add Subject' : 'Edit Subject'}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-xs text-slate-300">
                Subject Code
                <input
                  value={form.code}
                  onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value }))}
                  className="input-glow mt-1 w-full rounded-lg border border-cyan-200/25 bg-slate-900/35 px-3 py-2 text-sm text-white outline-none"
                />
              </label>
              <label className="text-xs text-slate-300">
                Subject Name
                <select
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="input-glow mt-1 w-full rounded-lg border border-cyan-200/25 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="" className="bg-slate-900 text-slate-100">Select subject name</option>
                  {subjectNameOptions.map((subjectName) => (
                    <option key={subjectName} value={subjectName} className="bg-slate-900 text-slate-100">{subjectName}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs text-slate-300">
                Program
                <select
                  value={form.program}
                  onChange={(event) => setForm((prev) => ({ ...prev, program: event.target.value }))}
                  className="input-glow mt-1 w-full rounded-lg border border-cyan-200/25 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="" className="bg-slate-900 text-slate-100">Select program</option>
                  {programOptions.map((program) => (
                    <option key={program} value={program} className="bg-slate-900 text-slate-100">{program}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs text-slate-300">
                Units
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={form.units}
                  onChange={(event) => setForm((prev) => ({ ...prev, units: event.target.value }))}
                  className="input-glow mt-1 w-full rounded-lg border border-cyan-200/25 bg-slate-900/35 px-3 py-2 text-sm text-white outline-none"
                />
              </label>
              <label className="text-xs text-slate-300 sm:col-span-2">
                Semester
                <select
                  value={form.semester}
                  onChange={(event) => setForm((prev) => ({ ...prev, semester: event.target.value }))}
                  className="input-glow mt-1 w-full rounded-lg border border-cyan-200/25 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="" className="bg-slate-900 text-slate-100">Select semester</option>
                  <option value="First" className="bg-slate-900 text-slate-100">First</option>
                  <option value="Second" className="bg-slate-900 text-slate-100">Second</option>
                </select>
              </label>
            </div>

            {formError && <p className="mt-3 text-xs text-rose-200">{formError}</p>}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-lg border border-slate-300/30 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:bg-slate-600/20 disabled:opacity-60"
                onClick={closeModal}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:brightness-110 disabled:opacity-60"
                onClick={handleSubmitSubject}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModal.open && (
        <DeleteConfirmDashboard
          open={deleteModal.open}
          title="Delete Subject?"
          message="Are you sure you want to delete this subject? It can be restored in the Record Recovery Center."
          entityType="Subjects"
          recordLabel={deleteModal.subject ? `${deleteModal.subject.code} - ${deleteModal.subject.name}` : ''}
          onCancel={closeDeleteModal}
          onConfirm={confirmDeleteSubject}
          confirmText="Yes, Delete"
          cancelText="Cancel"
        />
      )}
    </section>
  );
}

export default SubjectsPage;
