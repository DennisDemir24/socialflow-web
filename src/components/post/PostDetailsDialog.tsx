'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { format } from 'date-fns';
import { Post } from '../calendar/Calendar';
import { DotsVerticalIcon } from '@radix-ui/react-icons';

interface PostDetailsDialogProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

export const PostDetailsDialog: React.FC<PostDetailsDialogProps> = ({
  post,
  isOpen,
  onClose,
  onEditClick,
  onDeleteClick,
}) => {
  if (!post) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow z-50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow z-50">
          <div className="flex justify-between items-start mb-4">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Post Details
            </Dialog.Title>
            <div className="flex items-center gap-2">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="rounded-full w-8 h-8 inline-flex items-center justify-center text-gray-500 hover:bg-gray-100">
                    <DotsVerticalIcon className="w-4 h-4" />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content className="min-w-[160px] bg-white rounded-md p-1 shadow-lg z-50">
                    <DropdownMenu.Item
                      className="text-[13px] leading-none text-gray-700 rounded-[3px] flex items-center h-8 px-2 relative select-none outline-none cursor-pointer hover:bg-gray-100"
                      onSelect={() => {
                        onEditClick();
                        onClose();
                      }}
                    >
                      Edit Post
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className="text-[13px] leading-none text-red-600 rounded-[3px] flex items-center h-8 px-2 relative select-none outline-none cursor-pointer hover:bg-red-50"
                      onSelect={() => {
                        onClose();
                        onDeleteClick();
                      }}
                    >
                      Delete Post
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
              <Dialog.Close asChild>
                <button className="rounded-full w-8 h-8 inline-flex items-center justify-center text-gray-500 hover:bg-gray-100">
                  ×
                </button>
              </Dialog.Close>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Title</h3>
              <p className="mt-1 text-sm text-gray-900">{post.title}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700">Content</h3>
              <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{post.content}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Platform</h3>
                <p className="mt-1 text-sm text-gray-900 capitalize">{post.platform}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700">Status</h3>
                <p className="mt-1 text-sm text-gray-900 capitalize">{post.status}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700">Scheduled Time</h3>
              <p className="mt-1 text-sm text-gray-900">
                {format(post.scheduledTime, 'PPP p')}
              </p>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">Tags</h3>
                <div className="mt-1 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
