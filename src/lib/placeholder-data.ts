import type { User, Event } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const users: User[] = [
  { id: 'user-1', name: 'Jane Doe', email: 'jane@example.com', avatarUrl: PlaceHolderImages.find(img => img.id === 'avatar-1')?.imageUrl },
  { id: 'user-2', name: 'John Smith', email: 'john@example.com', avatarUrl: PlaceHolderImages.find(img => img.id === 'avatar-2')?.imageUrl },
  { id: 'user-3', name: 'Alice Johnson', email: 'alice@example.com', avatarUrl: PlaceHolderImages.find(img => img.id === 'avatar-3')?.imageUrl },
];

export const MOCK_USER = users[0];

const eventImage1 = PlaceHolderImages.find(img => img.id === 'event-card-1');
const eventImage2 = PlaceHolderImages.find(img => img.id === 'event-card-2');
const eventImage3 = PlaceHolderImages.find(img => img.id === 'event-card-3');

export const MOCK_EVENTS: Event[] = [
  {
    id: 'evt-1',
    name: "Jane's 30th Birthday Bash",
    date: '2024-08-15',
    time: '19:00',
    location: 'The Grand Ballroom',
    description: 'Join us for a night of celebration as Jane turns 30! There will be dinner, dancing, and plenty of cake.',
    theme: 'Roaring Twenties',
    host: users[0],
    guests: [
      { id: 'guest-1', name: 'John Smith', email: 'john@example.com', status: 'accepted', avatarUrl: users[1].avatarUrl },
      { id: 'guest-2', name: 'Alice Johnson', email: 'alice@example.com', status: 'invited', avatarUrl: users[2].avatarUrl },
      { id: 'guest-3', name: 'Bob Brown', email: 'bob@example.com', status: 'declined', avatarUrl: PlaceHolderImages.find(img => img.id === 'avatar-4')?.imageUrl },
    ],
    tasks: [
      { id: 'task-1', text: 'Book venue', completed: true, priority: 'high' },
      { id: 'task-2', text: 'Send invitations', completed: true, priority: 'high' },
      { id: 'task-3', text: 'Order cake', completed: false, priority: 'medium' },
    ],
    chat: [
      { id: 'msg-1', user: users[0], text: "Can't wait to see everyone!", timestamp: Date.now() - 100000 },
      { id: 'msg-2', user: users[1], text: "I'm so excited! What's the dress code?", timestamp: Date.now() - 50000 },
    ],
    image: {
      id: eventImage1!.id,
      url: eventImage1!.imageUrl,
      alt: eventImage1!.description,
      hint: eventImage1!.imageHint,
    }
  },
  {
    id: 'evt-2',
    name: 'Summer BBQ & Pool Party',
    date: '2024-07-20',
    time: '13:00',
    location: '123 Main St, Anytown, USA',
    description: 'Let\'s kick off summer with a fun BBQ and pool party. Bring your swimsuits and a side dish to share!',
    theme: 'Tropical Luau',
    host: users[1],
    guests: [
      { id: 'guest-4', name: 'Jane Doe', email: 'jane@example.com', status: 'accepted', avatarUrl: users[0].avatarUrl },
      { id: 'guest-5', name: 'Charlie Davis', email: 'charlie@example.com', status: 'accepted', avatarUrl: PlaceHolderImages.find(img => img.id === 'avatar-5')?.imageUrl },
    ],
    tasks: [],
    chat: [],
     image: {
      id: eventImage2!.id,
      url: eventImage2!.imageUrl,
      alt: eventImage2!.description,
      hint: eventImage2!.imageHint,
    }
  },
  {
    id: 'evt-3',
    name: 'Annual Tech Conference Mixer',
    date: '2024-09-10',
    time: '18:00',
    location: 'Convention Center West Hall',
    description: 'Network with fellow professionals in the tech industry. Complimentary drinks and appetizers will be served.',
    theme: 'Futuristic Tech',
    host: users[2],
    guests: [],
    tasks: [],
    chat: [],
    image: {
      id: eventImage3!.id,
      url: eventImage3!.imageUrl,
      alt: eventImage3!.description,
      hint: eventImage3!.imageHint,
    }
  },
];
