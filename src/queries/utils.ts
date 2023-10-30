export interface ListResponse<I> {
  list: I[];
  offset: number;
  limit: number;
  total: number;
}

export interface CartResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}
