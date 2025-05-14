'use client';

import { ColumnDef } from '@tanstack/table-core';
import { Task } from '@/features/tasks/types';

const columns: ColumnDef<Task>[] = [
  {
    accessorKey: 'name',
    header: 'Task Name',
  },
];

export { columns };
