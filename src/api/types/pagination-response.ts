export type PaginationResponse<Result> = {
  nextUrl: string | null;
  previousUrl: string | null;
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  results: Result[];
};
