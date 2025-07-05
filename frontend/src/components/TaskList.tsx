import React, { useState } from "react";
import { format, previousDay } from "date-fns";
import ActionsMenu from "./ActionMenu";
import { useDispatch } from "react-redux";
import { deleteTaskAsync } from "../Redux/Slices/TaskSlice";
import { MoreVertical } from "lucide-react";
interface Task {
  id: number;
  title: string;
  description: string;
  status: "Completed" | "In-Progress" | "Pending";
  dueDate?: string; // optional
}

interface TaskEditDetails {
  id: number | null;
  title: string | null;
  description: string | null;
  status: string | null;
}

interface TaskListProps {
  tasks: Task[];
  isOpenTaskEditModal: boolean;
  setIsOpenTaskEditModal: (isOpen: boolean) => void;
  settaskEditDetails: React.Dispatch<React.SetStateAction<TaskEditDetails>>;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  isOpenTaskEditModal,
  setIsOpenTaskEditModal,
  settaskEditDetails,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const [whichTaskMenu, setwhichTaskMenu] = useState({ id: null });

  const [selectedProjectId, setselectedProjectId] = useState(null);

  const dispatch = useDispatch();

  const handleDeleteTask = async (id) => {
    try {
      if (window.confirm("Do you want to Delete Task ")) {
        await dispatch(deleteTaskAsync({ id, projectId: selectedProjectId }));
      }
    } catch (error) {
      console.log("Error - ", error);
    }
    setShowMenu(false);
  };

  const handleEditTask = async (id, title, description, status) => {
    try {
      setIsOpenTaskEditModal(true);

      settaskEditDetails({
        id,
        title,
        description,
        status,
      });
    } catch (error) {
      console.log("Error - ", error);
    }
    setShowMenu(false);
  };

  return (
    <div className="max-w-3xl mx-auto ">
      <h6 className="text-xl font-bold mb-4">Tasks</h6>
      <ul className="space-y-4 h-[180px] overflow-scroll ">
        {tasks &&
          tasks.map((task) => (
            <li
              key={task.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer "
            >
              <div className="flex justify-between items-center mb-2">
                <h3
                  className="text-lg font-semibold text-gray-800"
                  title="Task Title"
                >
                  {task.title}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    task.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : task.status === "In-Progress"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-200 text-gray-800"
                  }`}
                  title="Task Status"
                >
                  {task.status}
                </span>
                <div className="relative">
                  <button
                    onClick={() => [
                      setwhichTaskMenu({ id: task.id }),
                      setselectedProjectId(task.projectId),
                    ]}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer "
                    title="Menu Button"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                  {whichTaskMenu.id === task.id && (
                    <ActionsMenu
                      showMenu={whichTaskMenu.id === task.id}
                      setShowMenu={setwhichTaskMenu}
                      project={task}
                      handleEdit={handleEditTask}
                      handleDelete={handleDeleteTask}
                    />
                  )}
                </div>
              </div>
              <p className="text-gray-600 mb-2" title="Task Description">
                {task.description}
              </p>
              <p className="text-sm text-gray-500" title="Task Due Date">
                Due:{" "}
                {format(new Date(task.dueDate), "MMM d, yyyy") || "No due date"}
              </p>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default TaskList;
