import { DiaryEntry } from '../types';

const STORAGE_KEY = 'my_diary_entries_v1';

export const loadEntries = (): Record<string, DiaryEntry> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error("Failed to load diary entries", e);
    return {};
  }
};

export const saveEntry = (date: string, content: string): Record<string, DiaryEntry> => {
  const entries = loadEntries();
  const newEntry: DiaryEntry = {
    date,
    content,
    lastEdited: Date.now(),
  };
  
  // If content is empty, delete the entry? 
  // For this app, we'll keep it but maybe treat empty string as deletion if needed. 
  // Let's just save it.
  if (!content.trim()) {
    delete entries[date];
  } else {
    entries[date] = newEntry;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  return entries;
};
