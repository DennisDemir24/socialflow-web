'use client';

import React from 'react';
import { format, eachDayOfInterval, startOfWeek, endOfWeek, eachHourOfInterval, startOfDay, endOfDay } from 'date-fns';
import { useDrop } from 'react-dnd';
import { Post } from '../Calendar';
import { PostCard } from '../PostCard';

interface WeekViewProps {
  selectedDate: Date;
  posts?: Post[];
  onTimeSlotClick?: (date: Date) => void;
  onPostClick?: (post: Post) => void;
  onPostDrop?: (post: Post, date: Date) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  selectedDate,
  posts = [],
  onTimeSlotClick,
  onPostClick,
  onPostDrop,
}) => {
  const days = eachDayOfInterval({
    start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
    end: endOfWeek(selectedDate, { weekStartsOn: 1 }),
  });

  const hours = eachHourOfInterval({
    start: startOfDay(selectedDate),
    end: endOfDay(selectedDate),
  });

  const handleDrop = (day: Date, hour: number, post: Post) => {
    if (onPostDrop) {
      const dropDate = new Date(day);
      dropDate.setHours(hour);
      onPostDrop(post, dropDate);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b">
        <div className="w-24 shrink-0" />
        {days.map((day) => (
          <div
            key={day.toString()}
            className="flex-1 p-4 text-center border-l first:border-l-0"
          >
            <div className="text-sm font-medium text-gray-900">
              {format(day, 'EEE')}
            </div>
            <div className="mt-1 text-sm text-gray-500">
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>
      <div className="flex-1 overflow-auto">
        {hours.map((hour) => (
          <div key={hour.toString()} className="flex border-b min-h-[100px]">
            <div className="w-24 p-4 border-r bg-gray-50 shrink-0">
              <span className="text-sm font-medium text-gray-600">
                {format(hour, 'h:mm a')}
              </span>
            </div>
            {days.map((day) => {
              const [{ isOver }, drop] = useDrop(() => ({
                accept: 'POST',
                drop: (item: Post) => handleDrop(day, hour.getHours(), item),
                collect: (monitor) => ({
                  isOver: monitor.isOver(),
                }),
              }));

              const dayHourPosts = posts.filter((post) => {
                const postDate = new Date(post.scheduledTime);
                return (
                  format(postDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd') &&
                  postDate.getHours() === hour.getHours()
                );
              });

              return (
                <div
                  key={day.toString()}
                  ref={drop}
                  className={`
                    flex-1 border-l first:border-l-0 p-2 transition-colors cursor-pointer
                    ${isOver ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'}
                  `}
                  onClick={() => {
                    const clickDate = new Date(day);
                    clickDate.setHours(hour.getHours());
                    onTimeSlotClick?.(clickDate);
                  }}
                >
                  <div className="space-y-2">
                    {dayHourPosts.map((post) => (
                      <PostCard 
                        key={post.id} 
                        post={post} 
                        onClick={onPostClick}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
