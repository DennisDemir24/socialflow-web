import { MoreVertical, Figma, Code, FileText, Youtube } from "lucide-react";
import { Button } from "../ui/button";
import { useProjectStore } from "@/store/projectStore";

const iconMap = {
  design: Figma,
  code: Code,
  docs: FileText,
  video: Youtube,
};

export function ProjectList() {
  const projects = useProjectStore((state) => state.projects);
  const setActiveProject = useProjectStore((state) => state.setActiveProject);

  return (
    <div className="space-y-1">
      {projects.map((project) => {
        const Icon = iconMap[project.icon];
        return (
          <Button
            key={project.id}
            variant={project.isActive ? "secondary" : "ghost"}
            className="w-full justify-between group"
            onClick={() => setActiveProject(project.id)}
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