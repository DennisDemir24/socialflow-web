
import { MoreVertical, Figma, Code, FileText, Youtube } from "lucide-react";
import { Button } from "../ui/button";

interface Project {
  id: string;
  name: string;
  icon: keyof typeof iconMap;
  isActive?: boolean;
}

const iconMap = {
  design: Figma,
  code: Code,
  docs: FileText,
  video: Youtube,
};

const projects: Project[] = [
  { id: '1', name: 'Design and Prototype', icon: 'design' },
  { id: '2', name: 'Documentation', icon: 'docs' },
  { id: '3', name: 'Prepare Courses', icon: 'video' },
  { id: '4', name: 'Coding and Development', icon: 'code' },
];

export function ProjectList() {
  return (
    <div className="space-y-1">
      {projects.map((project) => {
        const Icon = iconMap[project.icon];
        return (
          <Button
            key={project.id}
            variant={project.isActive ? "secondary" : "ghost"}
            className="w-full justify-between group"
          >
            <div className="flex items-center space-x-3">
              <Icon className="h-4 w-4" />
              <span className="text-sm">{project.name}</span>
            </div>
            <MoreVertical className="h-4 w-4 opacity-0 group-hover:opacity-100" />
          </Button>
        );
      })}
    </div>
  );
} 