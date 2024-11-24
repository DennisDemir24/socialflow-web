'use client';

import React from 'react';
import {
  format,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
} from 'date-fns';
import { useDrop } from 'react-dnd';
import { Post } from '../Calendar';
import { PostCard } from '../PostCard';

interface MonthViewProps {
  selectedDate: Date;
  posts?: Post[];
  onTimeSlotClick?: (date: Date) => void;
  onPostClick?: (post: Post) => void;
  onPostDrop?: (post: Post, date: Date) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  selectedDate,
  posts = [],
  onTimeSlotClick,
  onPostClick,
  onPostDrop,
}) => {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weeks = days.reduce<Date[][]>((weeks, day, i) => {
    if (i % 7 === 0) {
      weeks.push([]);
    }
    weeks[weeks.length - 1].push(day);
    return weeks;
  }, []);

  const handleDrop = (day: Date, post: Post) => {
    if (onPostDrop) {
      const dropDate = new Date(day);
      dropDate.setHours(post.scheduledTime.getHours());
      onPostDrop(post, dropDate);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-7 border-b border-gray-700">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div
            key={day}
            className="p-4 text-center text-sm font-medium text-gray-200"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="flex-1 grid grid-rows-[repeat(6,minmax(0,1fr))]">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 border-b border-gray-700 last:border-b-0">
            {week.map((day) => {
              const [{ isOver }, drop] = useDrop(() => ({
                accept: 'POST',
                drop: (item: Post) => handleDrop(day, item),
                collect: (monitor) => ({
                  isOver: monitor.isOver(),
                }),
              }));

              const dayPosts = posts.filter((post) =>
                isSameDay(post.scheduledTime, day)
              );

              return (
                <div
                  key={day.toString()}
                  ref={drop}
                  className={`
                    border-r border-gray-700 last:border-r-0 p-2 min-h-[120px]
                    ${!isSameMonth(day, selectedDate) ? 'bg-[#141517]' : 'bg-[#1E1F25]'}
                    ${isOver ? 'bg-[#2A2B31]' : 'hover:bg-[#2A2B31]'}
                    cursor-pointer transition-colors
                  `}
                  onClick={() => onTimeSlotClick?.(day)}
                >
                  <div className={`
                    text-sm font-medium mb-2
                    ${!isSameMonth(day, selectedDate) ? 'text-gray-500' : 'text-gray-200'}
                  `}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayPosts.map((post) => (
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
