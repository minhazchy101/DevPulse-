export const allowedQuery = {
  sort: ["newest", "oldest"],
  type: ["bug", "feature_request"],
  status: ["open", "in_progress", "resolved"],
} as const;


export type QueryParams = {
  sort?: "newest" | "oldest";
  type?: "bug" | "feature_request";
  status?: "open" | "in_progress" | "resolved";
};

