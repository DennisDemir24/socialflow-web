'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { format } from 'date-fns';
import { Post } from '../calendar/Calendar';
import { useState, useEffect } from 'react';
import { PreviewPane } from '../preview/PreviewPane';
import { RichTextEditor } from '../editor/RichTextEditor';
import { Label } from '../ui/Label';
import { Input } from '../ui/Input';

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
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[800px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-lg font-semibold">
              {post ? 'Edit Post' : 'Create Post'}
            </Dialog.Title>
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
                  value={editedPost.title}
                  onChange={(e) =>
                    setEditedPost((prev) => prev ? { ...prev, title: e.target.value } : null)
                  }
                  placeholder="Enter post title"
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <RichTextEditor
                  content={editedPost.content}
                  onChange={(content) =>
                    setEditedPost((prev) => prev ? { ...prev, content } : null)
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <select
                    id="platform"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={editedPost.platform}
                    onChange={(e) =>
                      setEditedPost((prev) =>
                        prev ? { ...prev, platform: e.target.value as Post['platform'] } : null
                      )
                    }
                  >
                    {['twitter', 'facebook', 'instagram', 'linkedin'].map((platform) => (
                      <option key={platform} value={platform}>
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={editedPost.status}
                    onChange={(e) =>
                      setEditedPost((prev) =>
                        prev ? { ...prev, status: e.target.value as Post['status'] } : null
                      )
                    }
                  >
                    {['draft', 'scheduled', 'published'].map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="scheduledTime">Scheduled Time</Label>
                <Input
                  type="datetime-local"
                  id="scheduledTime"
                  value={format(new Date(editedPost.scheduledTime), "yyyy-MM-dd'T'HH:mm")}
                  onChange={(e) =>
                    setEditedPost((prev) =>
                      prev ? { ...prev, scheduledTime: new Date(e.target.value) } : null
                    )
                  }
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Preview</h3>
              <PreviewPane post={editedPost} />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            {post && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
              >
                Delete
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {post ? 'Save Changes' : 'Create Post'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
