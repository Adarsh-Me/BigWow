/**
 * A single tool selected by the AI router.
 * href matches a route in /tools/[slug]
 */
export interface AgentToolSelection {
  href: string;
  name: string;
  order: number;
  category?: string;
  params?: Record<string, unknown>;
  workflowId?: string;
  workflowName?: string;
  privacyMode?: "local" | "ai-optional" | "api-required";
  implementationStatus?: "ready" | "beta" | "planned";
  requiresFile?: boolean;
  nextPrompt?: string;
}

/**
 * The full response from /api/agent/run
 */
export interface AgentRunResponse {
  reasoning: string;
  tools: AgentToolSelection[];
  error?: string;
  notFound?: boolean;
  notFoundMessage?: string;
}

/**
 * What we POST to /api/agent/run
 */
export interface AgentRunRequest {
  prompt: string;
  context?: string;
}

/**
 * Status of each tool in a running chain.
 */
export type ChainStepStatus = "pending" | "active" | "done";

export interface ChainStep extends AgentToolSelection {
  status: ChainStepStatus;
}
