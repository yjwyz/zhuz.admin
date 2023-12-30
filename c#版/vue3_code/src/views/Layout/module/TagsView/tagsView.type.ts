export type ITag = {
  type: "right" | "other" | "index" | "all";
  index: number;
};

export type TagViewType = {
  fullPath: string;
  meta: { title: string; uuid: string };
  name: string;
  path: string;
  title: string;
};
