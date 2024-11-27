"use client";

import { KanbanBoard } from "@/components/projects/KanbanBoard";
import { ProjectList } from "@/components/projects/ProjectList";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { Button } from "@/components/ui/button";
import { MoreVertical, Plus } from "lucide-react";
import { useState } from "react";
import { useProjectStore } from "@/store/projectStore";

export default function ProjectsPage() {
  const [open, setOpen] = useState(false);
  const addProject = useProjectStore((state) => state.addProject);

  function onSubmit(values: any) {
    addProject({
      name: values.name,
      description: values.description,
      icon: values.icon,
    });
    setOpen(false);
  }


  return (
    <div className="flex h-screen">
      {/* Projects Sidebar */}
      <div className="w-72 bg-[#141517] border-r border-[#2A2B31] flex flex-col p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="p-1.5 bg-[#2A2B31] rounded">
            <div className="w-5 h-5 border-2 border-white rounded-sm" />
          </div>
          <h1 className="text-xl font-semibold text-white">Projects</h1>
        </div>

        {/* Project List Component */}
        <ProjectList />

        {/* Add Project Button and Dialog */}
        <Button
          className="w-full bg-[#5B5FED] hover:bg-[#4B4FDD] mb-8 text-white"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Project
        </Button>

        <CreateProjectDialog
          open={open}
          onOpenChange={setOpen}
          onSubmit={onSubmit}
        />

      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Kanban Board */}
        <main className="flex-1 overflow-hidden">
          <KanbanBoard />
        </main>
      </div>
    </div>
  );
}