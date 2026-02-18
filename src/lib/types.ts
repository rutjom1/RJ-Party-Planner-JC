export type UserProfile = {
  name: string | null;
  email: string | null;
  avatarUrl?: string | null;
  [key: string]: any;
};

export type PartyEvent = {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  theme?: string;
  userId: string;
  imageUrl: string;
  imageHint: string;
  [key: string]: any;
};

export type Guest = {
  id: string;
  name: string;
  email: string;
  status: 'invited' | 'accepted' | 'declined';
  avatarUrl?: string;
};

export type Task = {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
};

export type Message = {
  id:string;
  user: Pick<UserProfile & {id: string}, 'id' | 'name' | 'avatarUrl'>;
  text: string;
  timestamp: number;
};
