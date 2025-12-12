export interface Task {
  id: string;
  text: string;
  location: string;
  locationColor?: string;
  detail: string;
  technicalNote?: string;
  done: boolean;
  actionType?: 'download' | 'link';
  actionLabel?: string;
  // In a real app, actions might be more complex, but for this generator we map IDs to functions
}

export interface Step {
  id: string;
  title: string;
  description: string;
  icon: string; // ID of the icon
  color: string;
  textColor: string;
  badge?: string;
  visualType?: 'workflow_diagram' | 'none';
  tasks: Task[];
}

export interface WorkflowData extends Array<Step> {}

export type TabType = 'workflow' | 'advanced' | 'ai_help';