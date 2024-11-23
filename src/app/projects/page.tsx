import { KanbanBoard } from "@/components/projects/KanbanBoard";
import { Button } from "@/components/ui/button";
import { MoreVertical, Plus } from "lucide-react";


export default function ProjectsPage() {
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

        {/* Project List */}
        <div className="space-y-2 mb-8">
          <Button
            variant="ghost"
            className="w-full justify-between group hover:bg-[#2A2B31] py-6 text-white"
          >
            <div className="flex items-center gap-3">
              <div className="w-5 h-5">
                <svg viewBox="0 0 24 24" className="text-[#3E7BFA]">
                  <path fill="currentColor" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/>
                </svg>
              </div>
              <span>Design and Prototype</span>
            </div>
            <MoreVertical className="h-5 w-5 opacity-0 group-hover:opacity-100 text-gray-400" />
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-between group hover:bg-[#2A2B31] py-6 bg-[#2A2B31] text-white"
          >
            <div className="flex items-center gap-3">
              <div className="w-5 h-5">
                <svg viewBox="0 0 24 24" className="text-[#5B5FED]">
                  <path fill="currentColor" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/>
                </svg>
              </div>
              <span>Documentation</span>
            </div>
            <MoreVertical className="h-5 w-5 opacity-0 group-hover:opacity-100 text-gray-400" />
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-between group hover:bg-[#2A2B31] py-6 text-white"
          >
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 text-[#FF4A4A]">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </div>
              <span>Prepare Courses</span>
            </div>
            <MoreVertical className="h-5 w-5 opacity-0 group-hover:opacity-100 text-gray-400" />
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-between group hover:bg-[#2A2B31] py-6 text-white"
          >
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 text-[#00B884]">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                </svg>
              </div>
              <span>Coding and Development</span>
            </div>
            <MoreVertical className="h-5 w-5 opacity-0 group-hover:opacity-100 text-gray-400" />
          </Button>
        </div>

        {/* Add Project Button */}
        <Button className="w-full bg-[#5B5FED] hover:bg-[#4B4FDD] mb-8 text-white">
          <Plus className="h-5 w-5 mr-2" />
          Add Project
        </Button>

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