import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = '@lite_history';
const MAX_HISTORY = 100;

export async function getHistory() {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function addHistoryEntry(url, title) {
  try {
    const history = await getHistory();
    const entry = {
      id: Date.now().toString(),
      url,
      title: title || url,
      timestamp: Date.now(),
      pinned: false,
    };

    // Remove duplicate of same URL if exists (unpinned only)
    const filtered = history.filter(
      (h) => h.pinned || h.url !== url
    );

    filtered.unshift(entry);

    // Enforce limit: keep all pinned + newest unpinned up to MAX
    const pinned = filtered.filter((h) => h.pinned);
    const unpinned = filtered.filter((h) => !h.pinned);
    const trimmed = [...pinned, ...unpinned.slice(0, MAX_HISTORY - pinned.length)];

    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
    return trimmed;
  } catch {
    return [];
  }
}

export async function togglePin(id) {
  try {
    const history = await getHistory();
    const updated = history.map((h) =>
      h.id === id ? { ...h, pinned: !h.pinned } : h
    );
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export async function clearHistory() {
  try {
    const history = await getHistory();
    const pinned = history.filter((h) => h.pinned);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(pinned));
    return pinned;
  } catch {
    return [];
  }
}

export async function deleteHistoryItem(id) {
  try {
    const history = await getHistory();
    const updated = history.filter((h) => h.id !== id);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}
