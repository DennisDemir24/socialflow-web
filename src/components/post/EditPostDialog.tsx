'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { format } from 'date-fns';
import { Post } from '../calendar/Calendar';
import { useState, useEffect } from 'react';
import { PreviewPane } from '../preview/PreviewPane';
import { RichTextEditor } from '../editor/RichTextEditor';
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
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[800px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-lg font-semibold">Edit Post</Dialog.Title>
            <Dialog.Close className="rounded-full p-1.5 hover:bg-gray-100">
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
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter post title"
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <div className="min-h-[200px] border rounded-md">
                  <RichTextEditor
                    content={content}
                    onChange={(newContent) => {
                      console.log('Content updated:', newContent);
                      setContent(newContent);
                    }}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="platform">Platform</Label>
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
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="scheduled-time">Scheduled Time</Label>
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
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSave}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>

            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-4">Preview</h3>
              <div className="overflow-y-auto max-h-[600px]">
                <PreviewPane 
                  platform={platform} 
                  content={content}
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