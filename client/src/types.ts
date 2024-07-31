export type Image = {
  _id: string;
  prompt: string;
  path: string;
  isPublic: boolean;
  user: User;
};

type User = {
  _id: string;
  username: string;
};
