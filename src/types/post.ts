export interface Comment {
  id?: number;
  username: string;
  content: string;
  created_datetime: string;
}

export interface Post {
  id: number;
  username: string;
  created_datetime: string;
  title: string;
  content: string;
  imageUrl?: string;
  likes?: number;
  commentsList?: Comment[];
  mentions?: string[];
}

export interface CreatePostData {
  username: string;
  title: string;
  content: string;
  imageUrl?: string;
}

export interface UpdatePostData {
  title: string;
  content: string;
  imageUrl?: string;
}

