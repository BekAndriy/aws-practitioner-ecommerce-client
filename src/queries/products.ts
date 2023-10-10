import axios, { AxiosError } from "axios";
import API_PATHS from "~/constants/apiPaths";
import { AvailableProduct } from "~/models/Product";
import { useQuery, useQueryClient, useMutation } from "react-query";
import React from "react";
import { ListResponse } from "./utils";

export function useAvailableProducts() {
  return useQuery<ListResponse<AvailableProduct>, AxiosError>(
    "available-products",
    async () => {
      const res = await axios.get<ListResponse<AvailableProduct>>(
        `${API_PATHS.product}/products`,
      );
      return res.data;
    },
  );
}

export function useInvalidateAvailableProducts() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () =>
      queryClient.invalidateQueries("available-products", {
        exact: true,
      }),
    [],
  );
}

export function useAvailableProduct(id?: string) {
  return useQuery<AvailableProduct, AxiosError>(
    ["products", { id }],
    async () => {
      const res = await axios.get<AvailableProduct>(
        `${API_PATHS.bff}/products/${id}`,
      );
      return res.data;
    },
    { enabled: !!id },
  );
}

export function useRemoveProductCache() {
  const queryClient = useQueryClient();
  return React.useCallback(
    (id?: string) =>
      queryClient.removeQueries(["products", { id }], {
        exact: true,
      }),
    [],
  );
}

export function useUpdateProduct(id?: string) {
  return useMutation((values: AvailableProduct) =>
    axios.put<AvailableProduct>(`${API_PATHS.bff}/products/${id}`, values, {
      headers: {
        // TODO: add after auth module
        // Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    }),
  );
}

export function useCreateProduct() {
  return useMutation((values: AvailableProduct) =>
    axios.post<AvailableProduct>(`${API_PATHS.bff}/products`, values, {
      headers: {
        // TODO: add after auth module
        // Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    }),
  );
}

export function useDeleteAvailableProduct() {
  return useMutation((id: string) =>
    axios.delete(`${API_PATHS.bff}/products/${id}`, {
      headers: {
        // TODO: add after auth module
        // Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    }),
  );
}
