import { ProductType } from "./ProductType";

type Params = {
  id: string;
};

export type SearchParamsType = {
  params: Params;
  searchParams: ProductType;
};
