type Params = {
  id: string;
};

type SearchParams = {
  name: string;
  description: string;
  image: string;
  unit_amount: number;
  id: string;
};

export type SearchParamTypes = {
  params: Params;
  searchParams: SearchParams;
};
