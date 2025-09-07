import { useMutation, useQueryClient } from "@tanstack/react-query";
import { companiesKeys, companiesCacheUtils } from "@/lib/companies-client";
import type { CompaniesQueryParams } from "@/types/schemas";

/**
 * Example mutation hook using the Query Key Factory pattern
 * This demonstrates how to efficiently update the cache after mutations
 */
export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      // Your API call here
      const response = await fetch(`/api/companies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: (updatedCompany) => {
      // Update the specific company detail in cache
      queryClient.setQueryData(
        companiesKeys.detail(updatedCompany.id),
        updatedCompany
      );

      // Update all lists that might contain this company
      queryClient.setQueriesData(
        { queryKey: companiesKeys.lists() },
        (oldData: any) => {
          if (!oldData?.data) return oldData;

          return {
            ...oldData,
            data: oldData.data.map((company: any) =>
              company.id === updatedCompany.id ? updatedCompany : company
            ),
          };
        }
      );
    },
  });
}

/**
 * Example mutation hook for creating a new company
 */
export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate all lists to refetch with the new company
      companiesCacheUtils.invalidateLists(queryClient);
    },
  });
}

/**
 * Example mutation hook for deleting a company
 */
export function useDeleteCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/companies/${id}`, {
        method: "DELETE",
      });
      return response.json();
    },
    onSuccess: (_, deletedId) => {
      // Remove the specific company detail from cache
      queryClient.removeQueries({ queryKey: companiesKeys.detail(deletedId) });

      // Update all lists to remove the deleted company
      queryClient.setQueriesData(
        { queryKey: companiesKeys.lists() },
        (oldData: any) => {
          if (!oldData?.data) return oldData;

          return {
            ...oldData,
            data: oldData.data.filter(
              (company: any) => company.id !== deletedId
            ),
            total: oldData.total - 1,
          };
        }
      );
    },
  });
}

/**
 * Example of prefetching a company detail
 */
export function usePrefetchCompany() {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: companiesKeys.detail(id),
      queryFn: async () => {
        const response = await fetch(`/api/companies/${id}`);
        return response.json();
      },
    });
  };
}
