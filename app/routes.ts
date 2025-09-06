import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("test", "routes/test.tsx"),
  route("companies", "routes/companies.tsx"),
  route("api/companies", "routes/api.companies.ts"),
] satisfies RouteConfig;
