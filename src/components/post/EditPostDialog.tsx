'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { format } from 'date-fns';
import { Post } from '../calendar/Calendar';
import { useState, useEffect } from 'react';
import { PreviewPane } from '../preview/PreviewPane';
import { Label } from '../ui/Label';
import { Input } from '../ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';

interface EditPostDialogProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onSave: (post: Post) => void;
}

export function EditPostDialog({
  post,
  isOpen,
  onClose,
  onSave,
}: EditPostDialogProps) {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [platform, setPlatform] = useState(post?.platform || 'twitter');
  const [status, setStatus] = useState(post?.status || 'draft');
  const [scheduledTime, setScheduledTime] = useState<Date>(
    post?.scheduledTime instanceof Date ? post.scheduledTime : new Date()
  );

  // Update form when post changes
  useEffect(() => {
    if (!post) return;
    
    try {
      setTitle(post.title || '');
      setContent(post.content || '');
      setPlatform(post.platform || 'twitter');
      setStatus(post.status || 'draft');
      setScheduledTime(
        post.scheduledTime instanceof Date ? post.scheduledTime : new Date(post.scheduledTime)
      );
    } catch (err: any) {
      console.error('Error updating form:', err?.message || 'Unknown error');
    }
  }, [post]);

  const handleSave = () => {
    try {
      const updatedPost = {
        ...post,
        title,
        content,
        platform,
        status,
        scheduledTime: new Date(scheduledTime),
      };
      console.log('Saving updated post:', updatedPost);
      onSave(updatedPost);
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
            <Dialog.Title className="text-lg font-semibold text-white">Edit Post</Dialog.Title>
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
                  className="bg-[#1A1C22] text-white border border-[#2A2B31] rounded-md p-3"
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
                  <SelectTrigger className="bg-[#1A1C22] text-white border border-[#2A2B31] rounded-md p-3">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1C22] text-white border border-[#2A2B31]">
                    <SelectItem value="twitter" className="hover:bg-[#2A2B31]">Twitter</SelectItem>
                    <SelectItem value="facebook" className="hover:bg-[#2A2B31]">Facebook</SelectItem>
                    <SelectItem value="instagram" className="hover:bg-[#2A2B31]">Instagram</SelectItem>
                    <SelectItem value="linkedin" className="hover:bg-[#2A2B31]">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status" className="text-white">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="bg-[#1A1C22] text-white border border-[#2A2B31] rounded-md p-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1C22] text-white border border-[#2A2B31]">
                    <SelectItem value="draft" className="hover:bg-[#2A2B31]">Draft</SelectItem>
                    <SelectItem value="scheduled" className="hover:bg-[#2A2B31]">Scheduled</SelectItem>
                    <SelectItem value="published" className="hover:bg-[#2A2B31]">Published</SelectItem>
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
                  className="bg-[#1A1C22] text-white border border-[#2A2B31] rounded-md p-3"
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSave}
                  className="w-full bg-[#5B5FED] hover:bg-[#4B4FDD] text-white px-4 py-2 rounded-md transition-colors"
                >
                  Save Changes
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