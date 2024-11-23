import { Card } from "@/components/ui/card";
import { MoreVertical, MessageSquare, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";


interface Task {
  id: string;
  title: string;
  description: string;
  image?: string;
  tag: {
    name: string;
    color: string;
  };
  assignees: string[];
  comments: number;
  timeEstimate: number;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color?: string;
}

const columns: Column[] = [
  {
    id: 'todo',
    title: 'To-Do',
    color: '#FF4A4A', // red
    tasks: [
      {
        id: '1',
        title: 'Designing a Portfolio',
        description: 'Create several options for customers to choose their preferred one.',
        image: '/waves-blue.jpg',
        tag: { name: 'Design and Prototype', color: 'bg-[#3E7BFA]/10 text-[#3E7BFA]' },
        assignees: ['user1', 'user2'],
        comments: 8,
        timeEstimate: 24
      },
      // More tasks...
    ]
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    color: '#3E7BFA', // blue
    tasks: []
  },
  {
    id: 'review',
    title: 'To be Review',
    color: '#5B5FED', // purple
    tasks: []
  },
  {
    id: 'done',
    title: 'Done',
    color: '#00B884', // green
    tasks: []
  }
];

export function KanbanBoard() {
  return (
    <div className="h-full overflow-x-auto">
      <div className="flex gap-6 p-6 min-w-max">
        {columns.map((column) => (
          <div key={column.id} className="w-80">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: column.color }}
                />
                <h3 className="font-medium text-sm text-white">{column.title}</h3>
              </div>
              <button className="hover:bg-[#2A2B31] p-1 rounded">
                <MoreVertical className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              {column.tasks.map((task) => (
                <Card key={task.id} className="bg-[#141517] border-[#2A2B31] overflow-hidden hover:border-[#5B5FED] transition-colors">
                  {task.image && (
                    <div className="relative">
                      <Image 
                        src={task.image} 
                        width={100}
                        height={100}
                        alt="" 
                        className="w-full h-32 object-cover"
                      />
                      <Badge 
                        className={`absolute top-2 left-2 ${task.tag.color}`}
                      >
                        {task.tag.name}
                      </Badge>
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="font-medium mb-2 text-white">{task.title}</h4>
                    <p className="text-sm text-gray-400 mb-4">{task.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-gray-400">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span className="text-xs">{task.comments}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span className="text-xs">{task.timeEstimate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}