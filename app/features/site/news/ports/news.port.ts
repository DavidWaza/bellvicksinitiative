import type { UseQueryReturnType } from "@tanstack/vue-query";
import type { ApiResponse } from "~/shared/api-response";
import type { Post, PostKind } from "../domain/news-types";

export interface NewsServicePort {
  getPosts: (kind: PostKind) => Promise<ApiResponse<Post[]>>;
}

export interface NewsQueryPort {
  usePostsQuery: (options: {
    kind: () => PostKind;
  }) => UseQueryReturnType<ApiResponse<Post[]>, Error>;
}
