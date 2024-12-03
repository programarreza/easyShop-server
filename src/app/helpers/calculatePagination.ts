type IOptions = {
  page?: number;
  limit?: number;
  sortBy?: number;
  sortOrder?: string;
};

const calculatePagination = (options: IOptions) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = Number(page - 1) * limit;

  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export { calculatePagination };
