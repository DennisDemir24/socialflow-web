'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Label } from '../ui/Label';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Task } from '@/store/projectStore';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().optional(),
  tag: z.object({
    name: z.string(),
    color: z.string()
  }),
  timeEstimate: z.number().min(0),
  assignees: z.array(z.string()),
  comments: z.number().default(0)
});

type TaskFormData = z.infer<typeof taskSchema>;

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Task, 'id'>) => void;
  task?: Task | null;
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  onSubmit,
  task
}: CreateTaskDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task || {
      title: '',
      description: '',
      image: '',
      tag: {
        name: 'Feature',
        color: 'bg-[#3E7BFA]/10 text-[#3E7BFA]'
      },
      timeEstimate: 0,
      assignees: [],
      comments: 0
    }
  });

  useEffect(() => {
    if (task) {
      reset(task);
    }
  }, [task, reset]);

  const onSubmitForm = (data: TaskFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#141517] rounded-lg p-6 w-[400px]">
          <Dialog.Title className="text-lg font-medium mb-4 text-white">
            {task ? 'Edit Task' : 'Create New Task'}
          </Dialog.Title>
          
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register('title')}
                className="bg-[#1A1C22] border-[#2A2B31]"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                className="bg-[#1A1C22] border-[#2A2B31]"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="image">Image URL (optional)</Label>
              <Input
                id="image"
                {...register('image')}
                className="bg-[#1A1C22] border-[#2A2B31]"
              />
            </div>

            <div>
              <Label htmlFor="tag">Tag</Label>
              <Input
                id="tag"
                {...register('tag.name')}
                className="bg-[#1A1C22] border-[#2A2B31]"
              />
            </div>

            <div>
              <Label htmlFor="timeEstimate">Time Estimate (hours)</Label>
              <Input
                id="timeEstimate"
                type="number"
                {...register('timeEstimate', { valueAsNumber: true })}
                className="bg-[#1A1C22] border-[#2A2B31]"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {task ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}