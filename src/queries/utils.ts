export interface ListResponse<I> {
  list: I[];
  offset: number;
  limit: number;
  total: number;
}
