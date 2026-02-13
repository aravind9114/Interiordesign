export type RoomType =
  | "Living Room"
  | "Bedroom"
  | "Bathroom"
  | "Kitchen"
  | "Dining Room"
  | "Home Office"
  | "Kids Room";

export type DesignTheme =
  | "Modern"
  | "Minimalist"
  | "Scandinavian"
  | "Industrial"
  | "Bohemian"
  | "Traditional"
  | "Coastal"
  | "Mid-Century Modern";

export type Provider = "offline" | "replicate" | "hf";

export interface GenerationResponse {
  image_url: string;
  provider_used: Provider;
  estimated_cost: number;
  budget: number;
  status: "within_budget" | "over_budget";
  time_taken_sec: number;
  total_time_sec?: number;
}

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}
