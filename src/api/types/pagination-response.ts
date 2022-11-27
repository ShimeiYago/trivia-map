export type PaginationResponse<Result> = {
  nextUrl: string | null;
  previousUrl: string | null;
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  startIndex: number;
  endIndex: number;
  results: Result[];
};
