export interface DiaryEntry {
  date: string; // YYYY-MM-DD
  content: string;
  mood?: string;
  lastEdited: number;
}

export interface CalendarProps {
  currentDate: Date;
  onDateClick: (date: Date) => void;
  entries: Record<string, DiaryEntry>;
}

export interface DiaryViewProps {
  date: Date;
  entry: DiaryEntry | undefined;
  isLoggedIn: boolean;
  onSave: (content: string) => void;
  onClose: () => void;
}
