import type { ReactNode } from "react";

import { X, Vote } from "lucide-react";

interface ModalProps {
  children: ReactNode;
  isOpenModal: boolean;
  setIsOpenModal: (isOpen: boolean) => void;
  title?: string;
  setIsOpenEditModal: (isOpen: boolean) => void;
}

export default function Modal({
  children,
  isOpenModal,
  setIsOpenModal,
  title,
  setIsOpenEditModal,
}: ModalProps) {
  if (!isOpenModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Vote className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          </div>
          <button
            onClick={() => [setIsOpenModal(false), setIsOpenEditModal(false)]}
            className="p-1 rounded hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-3">{children}</div>
      </div>
    </div>
  );
}
