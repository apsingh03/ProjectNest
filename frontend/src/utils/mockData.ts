// lib/mockData.ts

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: "Active" | "Completed" | "On Hold";
  tasks: Task[];
}

export function getProjectsWithTasks(): Project[] {
  return [
    {
      id: "1",
      title: "Website Redesign",
      description: "Revamp the company website with new branding and UX.",
      status: "Active",
      tasks: [
        { id: "t1", title: "Design homepage", completed: true },
        { id: "t2", title: "Update logo", completed: false },
        { id: "t3", title: "Deploy to staging", completed: false },
      ],
    },
    {
      id: "2",
      title: "Mobile App Launch",
      description: "Build and launch the new mobile app for Android and iOS.",
      status: "On Hold",
      tasks: [
        { id: "t1", title: "Set up Firebase", completed: true },
        { id: "t2", title: "Push notification integration", completed: false },
      ],
    },
    {
      id: "3",
      title: "Marketing Campaign",
      description: "Plan and execute the summer marketing campaign.",
      status: "Completed",
      tasks: [
        { id: "t1", title: "Design ads", completed: true },
        { id: "t2", title: "Launch ads", completed: true },
      ],
    },
  ];
}
