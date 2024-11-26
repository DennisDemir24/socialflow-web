'use client';

import React from 'react';
import { useDrag } from 'react-dnd';
import { format } from 'date-fns';
import { Post } from './Calendar';
import { htmlToPlainText } from '@/lib/utils';

interface PostCardProps {
  post: Post;
  onClick?: (post: Post) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'POST',
    item: post,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const platformColors: Record<string, { bg: string; text: string }> = {
    twitter: { bg: 'bg-blue-900/30', text: 'text-blue-200' },
    facebook: { bg: 'bg-indigo-900/30', text: 'text-indigo-200' },
    instagram: { bg: 'bg-pink-900/30', text: 'text-pink-200' },
    linkedin: { bg: 'bg-sky-900/30', text: 'text-sky-200' },
  };

  const { bg, text } = platformColors[post.platform.toLowerCase()] || { bg: 'bg-gray-800/30', text: 'text-gray-200' };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent time slot click
    onClick?.(post);
  };

  const plainTextContent = htmlToPlainText(post.content);

  return (
    <div
      ref={drag}
      onClick={handleClick}
      className={`
        group rounded p-1.5 text-sm cursor-pointer
        ${bg} ${text}
        ${isDragging ? 'opacity-50' : ''}
        transition-all duration-200 ease-in-out
        hover:ring-2 hover:ring-[#5B5FED] hover:ring-opacity-50
        max-w-full
      `}
    >
      <div className="flex items-center justify-between gap-1 max-w-full">
        <div className="flex items-center gap-1.5 min-w-0 flex-shrink">
          <span className="hidden sm:inline capitalize text-xs whitespace-nowrap">
            {post.platform}
          </span>
          <span className="sm:hidden text-xs whitespace-nowrap">
            {post.platform.charAt(0).toUpperCase()}
          </span>
          <span className="text-xs whitespace-nowrap">
            {format(post.scheduledTime, 'HH:mm')}
          </span>
        </div>
        <div className="flex-shrink-0">
          {post.status === 'draft' && (
            <span className="px-1.5 py-0.5 text-xs bg-gray-800/50 text-gray-300 rounded-full whitespace-nowrap">
              Draft
            </span>
          )}
        </div>
      </div>
      <div className="mt-1 font-medium truncate max-w-full">
        {post.title}
      </div>
      <div className="mt-0.5 text-xs truncate max-w-full opacity-75">
        {plainTextContent}
      </div>
      {post.tags && post.tags.length > 0 && (
        <div className="mt-1 hidden sm:flex flex-wrap gap-1">
          {post.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 text-xs bg-gray-800/50 text-gray-300 rounded whitespace-nowrap"
            >
              #{tag}
            </span>
          ))}
          {post.tags.length > 2 && (
            <span className="px-1.5 py-0.5 text-xs bg-gray-800/50 text-gray-300 rounded whitespace-nowrap">
              +{post.tags.length - 2}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
