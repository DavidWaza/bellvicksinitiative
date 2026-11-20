interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

/**
 * The envelope every endpoint answers with (ARCHITECTURE §8.1).
 * `status: false` means the operation failed — read `message`. It can arrive on an HTTP 200.
 */
export interface ApiResponse<T> {
  status: boolean;
  data: T;
  message?: string;
  meta?: PaginationMeta;
}
