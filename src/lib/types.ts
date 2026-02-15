export type BrainItemType =
  | "todo"
  | "restaurant"
  | "reminder"
  | "event"
  | "video"
  | "article"
  | "idea";

export type BrainItem = {
  id: string;
  type: BrainItemType;
  title: string;
  summary: string;
  source: string;
  createdAt: string;
  confidence: number;
  tags: string[];
  metadata: Record<string, string>;
};

export type CaptureResult = {
  item: BrainItem;
  reasoning: string;
};
