'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { format } from 'date-fns';
import { Post } from '../calendar/Calendar';
import { useState, useEffect } from 'react';
import { PreviewPane } from '../preview/PreviewPane';
import { Label } from '../ui/Label';
import { Input } from '../ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';

interface PostDialogProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (post: Post) => void;
  onDelete: (postId: string) => void;
  defaultDate?: Date;
}

export function PostDialog({
  post,
  isOpen,
  onClose,
  onSave,
  onDelete,
  defaultDate,
}: PostDialogProps) {
  const [editedPost, setEditedPost] = useState<Post | null>(null);

  useEffect(() => {
    if (post) {
      setEditedPost(post);
    } else if (defaultDate) {
      setEditedPost({
        id: Math.random().toString(36).substring(7),
        title: '',
        content: '',
        platform: 'twitter',
        scheduledTime: defaultDate,
        status: 'draft',
      });
    }
  }, [post, defaultDate]);

  const handleSave = () => {
    if (editedPost) {
      onSave(editedPost);
      onClose();
    }
  };

  const handleDelete = () => {
    if (editedPost) {
      onDelete(editedPost.id);
      onClose();
    }
  };

  if (!editedPost) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[800px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-[#141517] p-6 shadow-lg overflow-y-auto border border-[#2A2B31]">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-lg font-semibold text-white">
              {post ? 'Edit Post' : 'Create Post'}
            </Dialog.Title>
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
                  value={editedPost.title}
                  onChange={(e) =>
                    setEditedPost((prev) => prev ? { ...prev, title: e.target.value } : null)
                  }
                  placeholder="Enter post title"
                  className="bg-[#1A1C22] text-white"
                />
              </div>

              <div>
                <Label htmlFor="content" className="text-white">Content</Label>
                <textarea
                  id="content"
                  value={editedPost.content}
                  onChange={(e) =>
                    setEditedPost((prev) => prev ? { ...prev, content: e.target.value } : null)
                  }
                  placeholder="Enter your post content"
                  className="w-full min-h-[200px] p-3 rounded-md bg-[#1E1F25] border border-[#2A2B31] text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B5FED] focus:border-transparent resize-y"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platform" className="text-white">Platform</Label>
                  <Select 
                    value={editedPost.platform} 
                    onValueChange={(value) => 
                      setEditedPost((prev) => 
                        prev ? { ...prev, platform: value as Post['platform'] } : null
                      )
                    }
                  >
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
                  <Label htmlFor="status" className="text-white">Status</Label>
                  <Select 
                    value={editedPost.status} 
                    onValueChange={(value) => 
                      setEditedPost((prev) => 
                        prev ? { ...prev, status: value as Post['status'] } : null
                      )
                    }
                  >
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
              </div>

              <div>
                <Label htmlFor="scheduledTime" className="text-white">Scheduled Time</Label>
                <Input
                  type="datetime-local"
                  id="scheduledTime"
                  value={format(new Date(editedPost.scheduledTime), "yyyy-MM-dd'T'HH:mm")}
                  onChange={(e) =>
                    setEditedPost((prev) =>
                      prev ? { ...prev, scheduledTime: new Date(e.target.value) } : null
                    )
                  }
                  className="bg-[#1A1C22] text-white"
                />
              </div>
            </div>

            <div className="border border-[#2A2B31] rounded-md p-4 text-white">
              <h3 className="font-medium mb-4">Preview</h3>
              <div className="overflow-y-auto max-h-[600px]">
                <PreviewPane 
                  platform={editedPost.platform}
                  content={editedPost.content}
                  title={editedPost.title}
                  scheduledTime={editedPost.scheduledTime}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            {post && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-red-500 hover:text-red-400 transition-colors"
              >
                Delete
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white hover:text-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-[#5B5FED] hover:bg-[#4B4FDD] rounded-md transition-colors"
            >
              {post ? 'Save Changes' : 'Create Post'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
