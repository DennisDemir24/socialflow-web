'use client';

import React from 'react';
import { format, eachHourOfInterval, startOfDay, endOfDay } from 'date-fns';
import { useDrop } from 'react-dnd';
import { Post } from '../Calendar';
import { PostCard } from '../PostCard';

interface DayViewProps {
  selectedDate: Date;
  posts?: Post[];
  onTimeSlotClick?: (date: Date) => void;
  onPostClick?: (post: Post) => void;
  onPostDrop?: (post: Post, date: Date) => void;
}

export const DayView: React.FC<DayViewProps> = ({
  selectedDate,
  posts = [],
  onTimeSlotClick,
  onPostClick,
  onPostDrop,
}) => {
  const hours = eachHourOfInterval({
    start: startOfDay(selectedDate),
    end: endOfDay(selectedDate),
  });

  const handleDrop = (hour: number, post: Post) => {
    if (onPostDrop) {
      const dropDate = new Date(selectedDate);
      dropDate.setHours(hour);
      onPostDrop(post, dropDate);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      {hours.map((hour) => {
        const [{ isOver }, drop] = useDrop(() => ({
          accept: 'POST',
          drop: (item: Post) => handleDrop(hour.getHours(), item),
          collect: (monitor) => ({
            isOver: monitor.isOver(),
          }),
        }));

        const hourPosts = posts.filter(
          (post) =>
            format(post.scheduledTime, 'yyyy-MM-dd HH') ===
            format(new Date(selectedDate.setHours(hour.getHours())), 'yyyy-MM-dd HH')
        );

        return (
          <div
            key={hour.toString()}
            ref={drop}
            className={`
              flex border-b min-h-[100px]
              ${isOver ? 'bg-blue-50' : 'hover:bg-gray-50'}
            `}
            onClick={() => {
              const clickDate = new Date(selectedDate);
              clickDate.setHours(hour.getHours());
              onTimeSlotClick?.(clickDate);
            }}
          >
            <div className="w-24 p-4 border-r bg-gray-50 shrink-0">
              <span className="text-sm font-medium text-gray-600">
                {format(hour, 'h:mm a')}
              </span>
            </div>
            <div className="flex-1 p-2">
              <div className="space-y-2">
                {hourPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onClick={onPostClick}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
