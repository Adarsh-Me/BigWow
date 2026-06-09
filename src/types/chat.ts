import type { AgentToolSelection } from "./agent";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  /** When a tool was opened as part of this message */
  toolOpened?: {
    name: string;
    href: string;
    category: string;
  };
  /** True when the AI said the tool is not yet available */
  isNotFound?: boolean;
  /** True while the AI is generating a response */
  isStreaming?: boolean;
}

export interface ToolTab {
  id: string;
  href: string;
  name: string;
  category: string;
  /** Pre-filled params extracted by the AI from the user's prompt */
  params?: Record<string, unknown>;
  workflowId?: AgentToolSelection["workflowId"];
  workflowName?: AgentToolSelection["workflowName"];
  privacyMode?: AgentToolSelection["privacyMode"];
  implementationStatus?: AgentToolSelection["implementationStatus"];
  requiresFile?: AgentToolSelection["requiresFile"];
  nextPrompt?: AgentToolSelection["nextPrompt"];
  openedAt: number;
}

export interface ChatWorkspaceState {
  messages: ChatMessage[];
  tabs: ToolTab[];
  activeTabId: string | null;
  isThinking: boolean;
}
