'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { format } from 'date-fns';
import { Post } from '../calendar/Calendar';
import { useState, useEffect } from 'react';
import { PreviewPane } from '../preview/PreviewPane';
import { Label } from '../ui/Label';
import { Input } from '../ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';

interface CreatePostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (post: Omit<Post, 'id'>) => void;
  defaultDate?: Date;
}

export function CreatePostDialog({
  isOpen,
  onClose,
  onSave,
  defaultDate = new Date(),
}: CreatePostDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('twitter');
  const [scheduledTime, setScheduledTime] = useState<Date>(defaultDate);

  // Update scheduledTime when defaultDate changes
  useEffect(() => {
    try {
      setScheduledTime(defaultDate);
    } catch (err: any) {
      console.error('Error setting scheduled time:', err?.message || 'Unknown error');
      setScheduledTime(new Date());
    }
  }, [defaultDate]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setContent('');
      setPlatform('twitter');
    }
  }, [isOpen]);

  const handleSave = () => {
    try {
      onSave({
        title,
        content,
        platform,
        scheduledTime,
        status: 'draft',
      });
      onClose();
    } catch (err: any) {
      console.error('Error saving post:', err?.message || 'Unknown error');
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[800px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-[#141517] p-6 shadow-lg overflow-y-auto border border-[#2A2B31]">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-lg font-semibold text-white">Create Post</Dialog.Title>
            <Dialog.Close className="rounded-full p-1.5 hover:bg-[#2A2B31] text-white transition-colors">
              <span className="sr-only">Close</span>
              <svg
                className="h-5 w-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Dialog.Close>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-white">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter post title"
                  className="bg-[#1A1C22] text-white"
                />
              </div>

              <div>
                <Label htmlFor="content" className="text-white">Content</Label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter your post content"
                  className="w-full min-h-[200px] p-3 rounded-md bg-[#1E1F25] border border-[#2A2B31] text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B5FED] focus:border-transparent resize-y"
                />
              </div>

              <div>
                <Label htmlFor="platform" className="text-white">Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="scheduled-time" className="text-white">Scheduled Time</Label>
                <Input
                  id="scheduled-time"
                  type="datetime-local"
                  value={format(scheduledTime, "yyyy-MM-dd'T'HH:mm")}
                  onChange={(e) => {
                    try {
                      const date = new Date(e.target.value);
                      if (!isNaN(date.getTime())) {
                        setScheduledTime(date);
                      }
                    } catch (err) {
                      console.error('Invalid date:', err);
                    }
                  }}
                  className="bg-[#1A1C22] text-white"
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSave}
                  className="w-full bg-[#5B5FED] hover:bg-[#4B4FDD] text-white px-4 py-2 rounded-md transition-colors"
                >
                  Create Post
                </button>
              </div>
            </div>

            <div className="border border-[#2A2B31] rounded-md p-4 text-white">
              <h3 className="font-medium mb-4">Preview</h3>
              <div className="overflow-y-auto max-h-[600px]">
                <PreviewPane 
                  platform={platform} 
                  content={content || 'Your post content will appear here'}
                  title={title}
                  scheduledTime={scheduledTime} 
                />
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
