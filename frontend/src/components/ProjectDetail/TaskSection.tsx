import React from "react";
import TaskCard from "./TaskCard";
import type { Task } from "../../Redux/Slices/ProjectManagementSlice";

interface TaskSectionProps {
  tasks: Task[]; // or Task[] | undefined if it can be missing
}

const TaskSection: React.FC<TaskSectionProps> = React.memo(({ tasks }) => {
  // console.log("tasks - ", tasks);
  return (
    <div className="px-5">
      {/* Tasks Grid */}
      {tasks && tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tasks found
          </h3>
          <p className="text-gray-600 mb-6">
            No tasks match your current filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks &&
            tasks.map((task, idx) => <TaskCard task={task} key={idx} />)}
        </div>
      )}
    </div>
  );
});

export default TaskSection;
