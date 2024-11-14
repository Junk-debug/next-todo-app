import { Task } from '@prisma/client';

export type AddTaskDto = Pick<Task, 'title' | 'description' | 'dueDate'>;

export type UpdateTaskDto = Omit<
  Partial<Task> & {
    id: Task['id'];
  },
  'createdAt' | 'updatedAt'
>;

export type DeleteTaskDto = {
  id: Task['id'];
};