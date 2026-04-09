export interface IPost {
  _id: string;
  userId: string;
  title: string;
  description: string;
  createdAt: Date;
  tags: string[];
  imageUrl?:string
}


export interface ICreatePostRequest {
  userId: string;
  title: string;
  description: string;
  tags: string[],
  imageUrl?: string
}

export interface IPostResponse {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  createdAt: Date;
  tags: string[];
  imageUrl?: string;
}

