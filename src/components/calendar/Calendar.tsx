'use client';

try {
  // date operation
} catch (err: any) {
  console.error('Error message:', err?.message || 'Unknown error');
  // fallback behavior
}import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { CalendarHeader } from './CalendarHeader';
import { DayView } from './views/DayView';
import { WeekView } from './views/WeekView';
import { MonthView } from './views/MonthView';
import { CreatePostDialog } from '../post/CreatePostDialog';
import { PostDialog } from '../post/PostDialog';
import { usePostStore } from '@/store/postStore';

export type ViewType = 'day' | 'week' | 'month';

export interface Post {
  id: string;
  title: string;
  content: string;
  platform: string;
  scheduledTime: Date;
  status: 'draft' | 'scheduled' | 'published';
  tags?: string[];
}

interface CalendarProps {
  onCreatePost?: (post: Omit<Post, 'id'>) => void;
  onUpdatePost?: (post: Post) => void;
  onDeletePost?: (postId: string) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  onCreatePost,
  onUpdatePost,
  onDeletePost,
}) => {
  const [view, setView] = useState<ViewType>('week');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [selectedSlotDate, setSelectedSlotDate] = useState<Date>(new Date());
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const { posts, addPost, updatePost, deletePost } = usePostStore();

  // Set default view based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setView('day');
      } else if (window.innerWidth < 1024) {
        setView('week');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTimeSlotClick = (date: Date) => {
    try {
      const newDate = new Date(date);
      if (isNaN(newDate.getTime())) {
        throw new Error('Invalid date');
      }
      setSelectedSlotDate(newDate);
      setIsCreateDialogOpen(true);
    } catch (err: any) {
      console.error('Error handling time slot click:', err?.message || 'Unknown error');
      setSelectedSlotDate(new Date());
      setIsCreateDialogOpen(true);
    }
  };

  const handleCreatePost = (postData: Omit<Post, 'id'>) => {
    try {
      const newPost = {
        ...postData,
        id: Math.random().toString(36).substring(7),
        scheduledTime: new Date(postData.scheduledTime),
      };
      addPost(newPost);
      setIsCreateDialogOpen(false);
    } catch (err: any) {
      console.error('Error creating post:', err?.message || 'Unknown error');
    }
  };

  const handlePostDrop = (post: Post, newDate: Date) => {
    try {
      const updatedDate = new Date(newDate);
      if (isNaN(updatedDate.getTime())) {
        throw new Error('Invalid date');
      }
      const updatedPost = {
        ...post,
        scheduledTime: updatedDate,
      };
      updatePost(updatedPost);
    } catch (err: any) {
      console.error('Error handling post drop:', err?.message || 'Unknown error');
    }
  };

  const handlePostClick = (post: Post) => {
    try {
      const clickedPost = {
        ...post,
        scheduledTime: new Date(post.scheduledTime),
      };
      setSelectedPost(clickedPost);
      setIsPostDialogOpen(true);
    } catch (err: any) {
      console.error('Error handling post click:', err?.message || 'Unknown error');
    }
  };

  const handlePostUpdate = (updatedPost: Post) => {
    try {
      const postWithValidDate = {
        ...updatedPost,
        scheduledTime: new Date(updatedPost.scheduledTime),
      };
      updatePost(postWithValidDate);
      setIsPostDialogOpen(false);
      setSelectedPost(null);
    } catch (err: any) {
      console.error('Error updating post:', err?.message || 'Unknown error');
    }
  };

  const handlePostDelete = (postId: string) => {
    try {
      deletePost(postId);
      setIsPostDialogOpen(false);
      setSelectedPost(null);
    } catch (err: any) {
      console.error('Error deleting post:', err?.message || 'Unknown error');
    }
  };

  const renderView = () => {
    const viewProps = {
      selectedDate,
      posts: posts.map(post => {
        try {
          return {
            ...post,
            scheduledTime: new Date(post.scheduledTime),
          };
        } catch (err: any) {
          console.error('Error processing post date:', err?.message || 'Unknown error');
          return {
            ...post,
            scheduledTime: new Date(),
          };
        }
      }),
      onTimeSlotClick: handleTimeSlotClick,
      onPostClick: handlePostClick,
      onPostDrop: handlePostDrop,
    };

    switch (view) {
      case 'day':
        return <DayView {...viewProps} />;
      case 'week':
        return <WeekView {...viewProps} />;
      case 'month':
        return <MonthView {...viewProps} />;
      default:
        return null;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-full">
        <CalendarHeader
          view={view}
          onViewChange={setView}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
        <div className="flex-1 overflow-hidden">
          {renderView()}
        </div>

        <CreatePostDialog
          isOpen={isCreateDialogOpen}
          onClose={() => {
            setIsCreateDialogOpen(false);
          }}
          onSave={handleCreatePost}
          defaultDate={selectedSlotDate}
        />

        <PostDialog
          post={selectedPost}
          isOpen={isPostDialogOpen}
          onClose={() => {
            setIsPostDialogOpen(false);
            setSelectedPost(null);
          }}
          onSave={handlePostUpdate}
          onDelete={handlePostDelete}
        />
      </div>
    </DndProvider>
  );
};
