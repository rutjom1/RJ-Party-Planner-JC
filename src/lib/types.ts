export type Project = {
  id: string;
  name: string;
  startDate: string;
  repoUrl: string;
  description: string;
  techStack?: string;
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
  user: {
      id: string;
      name: string | null;
      avatarUrl?: string | null;
  };
  text: string;
  timestamp: number;
};
