import { ProductType } from "./ProductType";

type Params = {
  id: string;
};

export type SearchParamTypes = {
  params: Params;
  searchParams: ProductType;
};
