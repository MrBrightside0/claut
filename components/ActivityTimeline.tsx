import React from 'react';
import { Circle, CheckCircle2 } from 'lucide-react';

interface TimelineItem {
  date: string;
  title: string;
  description?: string;
  status?: 'active' | 'completed' | 'pending';
}

interface ActivityTimelineProps {
  items: TimelineItem[];
}

const ActivityTimeline = ({ items }: ActivityTimelineProps) => {
  return (
    <div className="relative border-l-2 border-gray-200 ml-3 space-y-6">
      {items.map((item, index) => (
        <div key={index} className="ml-6 relative">
          <span className="absolute -left-[31px] top-1 bg-white">
            {item.status === 'completed' ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
            ) : item.status === 'active' ? (
                <Circle className="w-6 h-6 text-blue-500 fill-blue-100" />
            ) : (
                <Circle className="w-6 h-6 text-gray-300" />
            )}
          </span>
          <div>
            <span className="text-xs text-gray-500 font-mono">
                {new Date(item.date).toLocaleString()}
            </span>
            <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
            {item.description && (
                <p className="text-xs text-gray-600 mt-1">{item.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityTimeline;