'use client';

import { Post } from '@/components/calendar/Calendar';
import { format, isSameDay } from 'date-fns';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PostListProps {
  posts: Post[];
  onEditPost: (post: Post) => void;
  onDeletePost: (postId: string) => void;
}

export function PostList({ posts, onEditPost, onDeletePost }: PostListProps) {
  // Group posts by date
  const groupedPosts = posts.reduce<{ [key: string]: Post[] }>((groups, post) => {
    const date = format(new Date(post.scheduledTime), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(post);
    return groups;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(groupedPosts).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return 'text-blue-500';
      case 'facebook':
        return 'text-indigo-500';
      case 'instagram':
        return 'text-pink-500';
      case 'linkedin':
        return 'text-blue-600';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'published':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {sortedDates.map((date) => (
        <div key={date} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {format(new Date(date), 'EEEE, MMMM d, yyyy')}
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {groupedPosts[date].map((post) => (
              <div
                key={post.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {post.title}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                        post.status
                      )}`}
                    >
                      {post.status}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center space-x-3">
                    <span className={`text-sm ${getPlatformColor(post.platform)}`}>
                      {post.platform}
                    </span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(post.scheduledTime), 'h:mm a')}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-2 hover:bg-gray-100 rounded-full">
                      <MoreHorizontal className="h-4 w-4 text-gray-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditPost(post)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onDeletePost(post.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
