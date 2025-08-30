import {
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "react-router";
import { useDebounce } from "rooks";
import {
  queryOptions,
  useIsFetching,
  useSuspenseQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";
import type { QueryClient } from "@tanstack/react-query";
import type { LoaderFunctionArgs } from "react-router";
import type { Company, PaginatedResult } from "../utils/companies.types";

const companyListQuery = (q?: string) =>
  queryOptions({
    queryKey: ["companies", "list", q ?? "all"],
    queryFn: async (): Promise<PaginatedResult<Company>> => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      params.set("page", "1");
      params.set("limit", "12");

      const response = await fetch(`/api/companies?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch companies");
      }
      return response.json();
    },
  });

// Create a server-side loader that doesn't need QueryClient
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";

  // Get companies data on the server side
  const { getCompanies } = await import("../utils/companies.server");
  const companies = await getCompanies({ page: 1, limit: 12, search: q });

  return { q, companies };
}

export default function Root() {
  const loaderData = useLoaderData() as
    | Awaited<ReturnType<typeof loader>>
    | undefined;
  const q = loaderData?.q ?? "";
  const initialCompanies = loaderData?.companies;
  const queryClient = useQueryClient();

  // Prefill the query cache with loader data on mount
  useEffect(() => {
    if (initialCompanies) {
      queryClient.setQueryData(["companies", "list", q ?? "all"], initialCompanies);
    }
  }, [initialCompanies, q, queryClient]);

  // Use TanStack Query with initial data from loader
  const { data: companies } = useSuspenseQuery({
    ...companyListQuery(q),
    initialData: initialCompanies,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  const searching = useIsFetching({ queryKey: ["companies", "list"] }) > 0;
  const navigation = useNavigation();
  const submit = useSubmit();

  const debouncedSubmit = useDebounce(submit, 500);

  return (
    <>
      <div id="sidebar">
        <h1>React Router Companies</h1>
        <div>
          <form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search companies"
              placeholder="Search"
              type="search"
              name="q"
              key={q}
              autoFocus
              defaultValue={q}
              className={searching ? "loading" : ""}
              onChange={(event) => {
                debouncedSubmit(event.currentTarget.form);
              }}
            />
            <div id="search-spinner" aria-hidden hidden={!searching} />
            <div className="sr-only" aria-live="polite"></div>
          </form>
          <Link to="companies/new" className="button">
            New
          </Link>
        </div>
        <nav>
          {companies.data.length ? (
            <ul>
              {companies.data.map((company) => (
                <li key={company.id}>
                  <NavLink
                    to={`companies/${company.id}`}
                    className={({
                      isActive,
                      isPending,
                    }: {
                      isActive: boolean;
                      isPending: boolean;
                    }) => (isActive ? "active" : isPending ? "pending" : "")}
                  >
                    {company.name ? <>{company.name}</> : <i>No Name</i>}{" "}
                    {company.rank && <span>#{company.rank}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No companies</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id="detail"
        className={navigation.state === "loading" ? "loading" : ""}
      >
        <Outlet />
      </div>
    </>
  );
}
