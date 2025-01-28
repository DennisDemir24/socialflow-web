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
        return 'bg-gray-100 text-gray-700';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'published':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {sortedDates.map((date) => (
        <div key={date} className="rounded-xl border bg-card shadow-sm">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">
              {format(new Date(date), 'EEEE, MMMM d, yyyy')}
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {groupedPosts[date].map((post) => (
              <div
                key={post.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium truncate">
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
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span className={getPlatformColor(post.platform)}>
                      {post.platform}
                    </span>
                    <span>•</span>
                    <span>
                      {format(new Date(post.scheduledTime), 'h:mm a')}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-2 hover:bg-muted rounded-full transition-colors">
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditPost(post)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
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
