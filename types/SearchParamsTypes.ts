import { ProductTypes } from './ProductTypes';

type Params = {
  id: string;
};

export type SearchParamTypes = {
  params: Params;
  searchParams: ProductTypes;
};
