export interface Cover {
  id: string;
  title: string;
  originalArtist: string;
  audioUrl: string;
  videoUrl?: string;
  coverImage: string;
  lyrics: string; // LRC timestamped format, e.g. [00:00.00] Text
  recordedDate: string;
  memory: string;
  mood: 'happy' | 'sad' | 'midnight' | 'love';
}

export interface Profile {
  name: string;
  introTitle: string;
  introBio: string;
  avatar: string;
  favSong: string;
  favArtist: string;
  singingStyle: string;
  currentMood: string;
  myDream: string;
  tiktok: string;
  instagram: string;
  youtube: string;
  email: string;
}
