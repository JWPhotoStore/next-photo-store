type Params = {
  id: string;
};

type SearchParams = {
  name: string;
  description: string;
  image: string;
  price: string;
  id: string;
};

export type SearchParamTypes = {
  params: Params;
  searchParams: SearchParams;
};
