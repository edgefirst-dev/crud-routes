import { AsyncLocalStorage } from "node:async_hooks";
import { camelize, pluralize, singularize } from "inflected";
import { type RouteConfigEntry, index, prefix, route } from "./lib/helpers.js";

const baseStorage = new AsyncLocalStorage<string>();
const prefixStorage = new AsyncLocalStorage<string>();

export function createCrud(base: string): crud.CrudFunction {
	function customCrud(resource: string): Array<RouteConfigEntry>;
	function customCrud(
		resource: string,
		options: crud.CrudOptions,
	): Array<RouteConfigEntry>;
	function customCrud(
		resource: string,
		options: crud.CrudOptions,
		children: crud.ChildrenFunction,
	): Array<RouteConfigEntry>;
	function customCrud(
		resource: string,
		children: crud.ChildrenFunction,
	): Array<RouteConfigEntry>;
	function customCrud(
		resource: string,
		options: crud.CrudOptions | crud.ChildrenFunction = {},
		children: crud.ChildrenFunction = () => [],
	): Array<RouteConfigEntry> {
		return baseStorage.run(base, () => {
			if (typeof options === "function") {
				// biome-ignore lint/style/noParameterAssign: This is a valid use case.
				children = options;
				// biome-ignore lint/style/noParameterAssign: This is a valid use case.
				options = {};
			}

			return crud(resource, options, children);
		});
	}

	return customCrud;
}

export function crud(resource: string): Array<RouteConfigEntry>;
export function crud(
	resource: string,
	options: crud.CrudOptions,
): Array<RouteConfigEntry>;
export function crud(
	resource: string,
	options: crud.CrudOptions,
	children: crud.ChildrenFunction,
): Array<RouteConfigEntry>;
export function crud(
	resource: string,
	children: crud.ChildrenFunction,
): Array<RouteConfigEntry>;
export function crud(
	resource: string,
	options: crud.CrudOptions | crud.ChildrenFunction = {},
	children: crud.ChildrenFunction = () => [],
): Array<RouteConfigEntry> {
	if (typeof options === "function") {
		// biome-ignore lint/style/noParameterAssign: This is a valid use case.
		children = options;
		// biome-ignore lint/style/noParameterAssign: This is a valid use case.
		options = {};
	}

	if (options.on === "shallow") {
		throw new Error("Shallow routes are not implemented yet");
	}

	let base = baseStorage.getStore() ?? "./views";

	let plural = pluralize(resource);
	let camelCase = camelize(singularize(resource), false);

	let only = options.only ?? ["index", "show", "new", "edit", "destroy"];

	let routes: RouteConfigEntry[] = [];

	let nestedRoutes = prefixStorage
		.run(generateRouteId(resource, options.idPrefix), () => children())
		.flat();

	if (only.includes("index")) {
		routes.push({
			...index(`${base}/${plural}/index.tsx`, {
				id: generateRouteId(resource, options.idPrefix, "index"),
				on: options.on,
			}),
		});
	}

	if (only.includes("new")) {
		routes.push(
			route("new", `${base}/${plural}/new.tsx`, {
				id: generateRouteId(resource, options.idPrefix, "new"),
				on: options.on,
			}),
		);
	}

	if (
		only.includes("show") ||
		only.includes("edit") ||
		only.includes("destroy")
	) {
		let prefixedRoutes: RouteConfigEntry[] = [];

		if (only.includes("show")) {
			prefixedRoutes.push(
				index(`${base}/${plural}/show.tsx`, {
					id: generateRouteId(resource, options.idPrefix, "show"),
					on: options.on,
				}),
			);
		}

		if (only.includes("edit")) {
			prefixedRoutes.push(
				route("edit", `${base}/${plural}/edit.tsx`, {
					id: generateRouteId(resource, options.idPrefix, "edit"),
					on: options.on,
				}),
			);
		}

		if (only.includes("destroy")) {
			prefixedRoutes.push(
				route("destroy", `${base}/${plural}/destroy.tsx`, {
					id: generateRouteId(resource, options.idPrefix, "destroy"),
					on: options.on,
				}),
			);
		}

		prefixedRoutes.push(
			...nestedRoutes.filter((child) => child.on === "member"),
		);

		routes.push(...prefix(`:${camelCase}Id`, prefixedRoutes));
	}

	routes.push(
		...nestedRoutes.filter((child) => !child.on || child.on === "collection"),
	);

	return [
		route(
			plural,
			`${base}/${plural}/_layout.tsx`,
			{
				id: generateRouteId(resource, options.idPrefix, "layout"),
				on: options.on,
			},
			routes,
		),
	];
}

function generateRouteId(
	resource: string,
	idPrefix: string | undefined,
	name?: string,
) {
	let prefix = prefixStorage.getStore();
	let id = [];
	if (prefix) id.push(prefix);
	if (idPrefix) id.push(idPrefix);
	id.push(resource);
	if (name) id.push(name);
	return id.join(".");
}

export namespace crud {
	export type ChildrenFunction = () =>
		| Array<RouteConfigEntry>
		| Array<Array<RouteConfigEntry>>;

	export interface CrudOptions {
		idPrefix?: string;
		only?: Array<"index" | "show" | "new" | "edit" | "destroy">;
		on?: "member" | "collection" | "shallow";
		shallow?: true;
	}

	export type CrudFunction =
		| ((resource: string) => Array<RouteConfigEntry>)
		| ((resource: string, options?: CrudOptions) => Array<RouteConfigEntry>)
		| ((
				resource: string,
				children?: ChildrenFunction,
		  ) => Array<RouteConfigEntry>)
		| ((
				resource: string,
				options?: CrudOptions,
				children?: ChildrenFunction,
		  ) => Array<RouteConfigEntry>);
}

export { index, prefix, route };
