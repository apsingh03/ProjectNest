import type { Task } from "../../Redux/Slices/ProjectManagementSlice";

interface TaskCardProps {
  task: Task;
}
const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-lg border border-gray-100 cursor-pointer p-5 hover:shadow-xl transition-all duration-200 
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {task.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3">
            {task.description}
          </p>
        </div>
      </div>

      <p className="text-md font-semibold text-gray-900">
        {" "}
        Status - {task.status}
      </p>

      <div className="mt-2 mb-3">
        <div className="flex items-center text-xs  border p-2 bg-blue-500 text-white w-[180px]  rounded-2xl">
          <svg
            className="w-3 h-3 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Due Date - {formatDate(task.dueDate)}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
