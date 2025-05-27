export interface Board {
  id: string;
  name: string;
}

export interface Card {
  id: string;
  boardId: string;
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Done';
  order: number;
}
