export type User = {
  id: string;
  uid: string;
  name: string;
  email: string;
  avatarUrl?: string;
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
  user: Pick<User, 'id' | 'name' | 'avatarUrl'>;
  text: string;
  timestamp: number;
};

export type Event = {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  theme: string;
  host: User;
  guests: Guest[];
  tasks: Task[];
  chat: Message[];
  image: {
    id: string;
    url: string;
    alt: string;
    hint: string;
  }
};
