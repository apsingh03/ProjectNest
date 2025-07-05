import React from "react";
import { Edit, Trash2 } from "lucide-react";

interface ActionsMenuProps {
  showMenu: boolean;
  setShowMenu: (show: { id: number | null }) => void;
  project: {
    id: number;
    title: string;
    description: string;
    status: string;
  };
  handleEdit: (
    id: number,
    title: string,
    description: string,
    status: string
  ) => void;
  handleDelete: (id: number) => void;
}

const ActionsMenu: React.FC<ActionsMenuProps> = ({
  showMenu,
  setShowMenu,
  project,
  handleEdit,
  handleDelete,
}) => {
  if (!showMenu) return null;

  return (
    <>
      {/* Overlay to close the menu */}
      <div
        className="fixed inset-0 z-10"
        onClick={() => setShowMenu({ id: null })}
      />
      {/* Dropdown */}
      <div className="absolute right-0 top-8 z-20 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-32">
        <button
          onClick={() =>
            handleEdit(
              project.id,
              project.title,
              project.description,
              project.status
            )
          }
          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center cursor-pointer "
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </button>
        <button
          onClick={() => handleDelete(project.id)}
          className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center cursor-pointer"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </button>
      </div>
      {/* {project.id} {project.title} */}
    </>
  );
};

export default ActionsMenu;
