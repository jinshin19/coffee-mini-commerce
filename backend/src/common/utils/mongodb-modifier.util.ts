export const PaginationFieldsU = (
  page: number = 1,
  limit: number = 25,
  sortField: string = "createdAt",
  sort: number = -1,
): any => {
  return [
    {
      $sort: { [sortField]: sort },
    },
    {
      $facet: {
        items: [{ $skip: (page - 1) * limit }, { $limit: limit }],
      },
    },
    {
      $addFields: {
        metadata: {
          page,
          limit: limit,
        },
      },
    },
  ];
};
