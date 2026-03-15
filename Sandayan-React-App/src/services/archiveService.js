const ARCHIVE_STORAGE_KEY = 'sandayan.recycleBin.v1';
const RESTORE_STORAGE_KEY = 'sandayan.restoreQueue.v1';

const safeParse = (rawValue) => {
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const archiveService = {
  getArchivedItems() {
    if (typeof window === 'undefined') {
      return [];
    }

    return safeParse(window.localStorage.getItem(ARCHIVE_STORAGE_KEY));
  },

  addArchivedItem({ entityType, label, data }) {
    if (typeof window === 'undefined') {
      return;
    }

    const nextEntry = {
      id: `archive-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      entityType: String(entityType || 'Record').trim() || 'Record',
      label: String(label || 'Untitled record').trim() || 'Untitled record',
      deletedAt: new Date().toISOString(),
      data: data || {},
    };

    const existing = safeParse(window.localStorage.getItem(ARCHIVE_STORAGE_KEY));
    window.localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify([nextEntry, ...existing]));
  },

  restoreArchivedItem(archiveId) {
    if (typeof window === 'undefined' || !archiveId) {
      return null;
    }

    const existing = safeParse(window.localStorage.getItem(ARCHIVE_STORAGE_KEY));
    const target = existing.find((entry) => entry.id === archiveId) || null;

    if (!target) {
      return null;
    }

    const remaining = existing.filter((entry) => entry.id !== archiveId);
    window.localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(remaining));

    const restoreQueue = safeParse(window.localStorage.getItem(RESTORE_STORAGE_KEY));
    const restoreEntry = {
      id: `restore-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      entityType: target.entityType,
      label: target.label,
      restoredAt: new Date().toISOString(),
      data: target.data || {},
    };

    window.localStorage.setItem(RESTORE_STORAGE_KEY, JSON.stringify([restoreEntry, ...restoreQueue]));
    return restoreEntry;
  },

  restoreLatestArchivedItem() {
    if (typeof window === 'undefined') {
      return null;
    }

    const existing = safeParse(window.localStorage.getItem(ARCHIVE_STORAGE_KEY));

    if (!existing.length) {
      return null;
    }

    return this.restoreArchivedItem(existing[0].id);
  },

  consumeRestoredItems(entityType) {
    if (typeof window === 'undefined') {
      return [];
    }

    const normalizedEntityType = String(entityType || '').trim().toLowerCase();

    if (!normalizedEntityType) {
      return [];
    }

    const restoreQueue = safeParse(window.localStorage.getItem(RESTORE_STORAGE_KEY));
    const matched = restoreQueue.filter((entry) => String(entry.entityType || '').trim().toLowerCase() === normalizedEntityType);

    if (!matched.length) {
      return [];
    }

    const remaining = restoreQueue.filter((entry) => String(entry.entityType || '').trim().toLowerCase() !== normalizedEntityType);
    window.localStorage.setItem(RESTORE_STORAGE_KEY, JSON.stringify(remaining));

    return matched
      .map((entry) => entry.data || null)
      .filter(Boolean);
  },

  clearArchivedItems() {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(ARCHIVE_STORAGE_KEY);
  },
};

export default archiveService;
