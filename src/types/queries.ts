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


 export const validate = (
  key: keyof typeof allowedQuery,
  value?: string
) => {
  const allowedValues = allowedQuery[key] as readonly string[];

  if (value && !allowedValues.includes(value)) {
    throw new Error(`Invalid ${key} value`);
  }
};