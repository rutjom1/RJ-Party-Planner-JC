import type { User, Event } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const users: User[] = [
  { id: 'user-1', uid: 'user-1', name: 'Jane Doe', email: 'jane@example.com', avatarUrl: PlaceHolderImages.find(img => img.id === 'avatar-1')?.imageUrl },
  { id: 'user-2', uid: 'user-2', name: 'John Smith', email: 'john@example.com', avatarUrl: PlaceHolderImages.find(img => img.id === 'avatar-2')?.imageUrl },
  { id: 'user-3', uid: 'user-3', name: 'Alice Johnson', email: 'alice@example.com', avatarUrl: PlaceHolderImages.find(img => img.id === 'avatar-3')?.imageUrl },
];

export const MOCK_USER = users[0];
