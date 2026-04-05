export const PaginationService = (
  params: PaginationParamsI,
): PaginationResponseI => {
  return {
    items: params.items,
    metadata: params.metadata,
  };
};

export interface PaginationParamsI {
  items: any;
  metadata: {
    count: number;
    page: number;
    sort: string;
    sortField: string;
    limit: number;
  };
}

export interface PaginationResponseI {
  items: any;
  metadata: {
    count: number;
    page: number;
    limit: number;
  };
}
