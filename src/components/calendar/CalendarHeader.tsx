'use client';

import React from 'react';
import { format, addDays, addWeeks, addMonths, subDays, subWeeks, subMonths } from 'date-fns';
import { ViewType } from './Calendar';
import { cn } from "@/lib/utils";

interface CalendarHeaderProps {
  view: ViewType;
  selectedDate: Date;
  onViewChange: (view: ViewType) => void;
  onDateChange: (date: Date) => void;
  className?: string;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  view,
  selectedDate,
  onViewChange,
  onDateChange,
  className,
}) => {
  const handlePrevious = () => {
    switch (view) {
      case 'day':
        onDateChange(subDays(selectedDate, 1));
        break;
      case 'week':
        onDateChange(subWeeks(selectedDate, 1));
        break;
      case 'month':
        onDateChange(subMonths(selectedDate, 1));
        break;
    }
  };

  const handleNext = () => {
    switch (view) {
      case 'day':
        onDateChange(addDays(selectedDate, 1));
        break;
      case 'week':
        onDateChange(addWeeks(selectedDate, 1));
        break;
      case 'month':
        onDateChange(addMonths(selectedDate, 1));
        break;
    }
  };

  const getHeaderText = () => {
    switch (view) {
      case 'day':
        return format(selectedDate, 'MMMM d, yyyy');
      case 'week':
        return `Week of ${format(selectedDate, 'MMMM d, yyyy')}`;
      case 'month':
        return format(selectedDate, 'MMMM yyyy');
      default:
        return '';
    }
  };

  return (
    <div className={cn(
      "p-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
      className
    )}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <button
          onClick={() => onDateChange(new Date())}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Today
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            className="p-1 rounded hover:bg-gray-100"
          >
            ←
          </button>
          <button
            onClick={handleNext}
            className="p-1 rounded hover:bg-gray-100"
          >
            →
          </button>
          <h2 className="text-lg sm:text-xl font-semibold ml-2">{getHeaderText()}</h2>
        </div>
      </div>
      
      <div className="w-full sm:w-auto">
        <ViewSelector
          currentView={view}
          onViewChange={onViewChange}
        />
      </div>
    </div>
  );
};

const ViewSelector: React.FC<{
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}> = ({ currentView, onViewChange }) => {
  const views: ViewType[] = ['day', 'week', 'month'];
  
  return (
    <div className="flex rounded-lg border overflow-hidden w-full sm:w-auto">
      {views.map((view) => (
        <button
          key={view}
          onClick={() => onViewChange(view)}
          className={`
            flex-1 sm:flex-none px-3 py-1 text-sm capitalize
            ${currentView === view
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
            }
          `}
        >
          {view}
        </button>
      ))}
    </div>
  );
};
