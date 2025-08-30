import {
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useNavigation,
  useSubmit,
} from 'react-router'
import { useDebounce } from 'rooks'
import {
  queryOptions,
  useIsFetching,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { getCompanies } from '../utils/companies.server'
import type { QueryClient } from '@tanstack/react-query'
import type { LoaderFunctionArgs } from 'react-router'

const companyListQuery = (q?: string) =>
  queryOptions({
    queryKey: ['companies', 'list', q ?? 'all'],
    queryFn: () => getCompanies({ page: 1, limit: 12, search: q }),
  })

export const loader =
  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url)
    const q = url.searchParams.get('q') ?? ''
    await queryClient.ensureQueryData(companyListQuery(q))
    return { q }
  }

export default function Root() {
  const { q } = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof loader>>
  >
  const { data: companies } = useSuspenseQuery(companyListQuery(q))
  const searching = useIsFetching({ queryKey: ['companies', 'list'] }) > 0
  const navigation = useNavigation()
  const submit = useSubmit()

  const debouncedSubmit = useDebounce(submit, 500)

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
              className={searching ? 'loading' : ''}
              onChange={(event) => {
                debouncedSubmit(event.currentTarget.form)
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
                    className={({ isActive, isPending }: { isActive: boolean; isPending: boolean }) =>
                      isActive ? 'active' : isPending ? 'pending' : ''
                    }
                  >
                    {company.name ? (
                      <>
                        {company.name}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{' '}
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
        className={navigation.state === 'loading' ? 'loading' : ''}
      >
        <Outlet />
      </div>
    </>
  )
}
