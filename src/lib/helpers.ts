import * as RRHelpers from "@react-router/dev/routes";

/**
 * This extends the RRHelpers module with additional types not exported by
 * the original module, but derived from the original module's types.
 */
declare module "@react-router/dev/routes" {
	export type IndexFunction = typeof RRHelpers.index;
	export type PrefixFunction = typeof RRHelpers.prefix;
	export type RouteFunction = typeof RRHelpers.route;
	export type LayoutFunction = typeof RRHelpers.layout;

	export interface CreateIndexOptions
		extends NonNullable<Parameters<IndexFunction>[1]> {}

	export interface CreateRouteOptions
		extends NonNullable<Parameters<RouteFunction>[2]> {}

	export interface CreateLayoutOptions
		extends NonNullable<Parameters<LayoutFunction>[1]> {}
}

export interface RouteConfigEntry extends RRHelpers.RouteConfigEntry {
	/**
	 * The type of route to add the children to.
	 * @default "collection"
	 */
	on?: "member" | "collection" | "shallow";
}

export function index(
	file: string,
	options?: index.CreateIndexOptions,
): RouteConfigEntry {
	return {
		...RRHelpers.index(file, options),
		on: options?.on,
	};
}

export namespace index {
	export type CreateIndexOptions = RRHelpers.CreateIndexOptions & {
		on?: "member" | "collection" | "shallow";
	};
}

export function route(
	name: string,
	file: string,
	options?: route.CreateRouteOptions,
	children?: RouteConfigEntry[],
): RouteConfigEntry {
	if (options && !children) {
		return {
			...RRHelpers.route(name, file, options),
			on: options?.on,
		};
	}

	if (options && children) {
		return {
			...RRHelpers.route(name, file, options, children),
			on: options?.on,
		};
	}

	return { ...RRHelpers.route(name, file), on: options?.on };
}

export namespace route {
	export type CreateRouteOptions = RRHelpers.CreateRouteOptions & {
		on?: "member" | "collection" | "shallow";
	};
}

export function layout(
	file: string,
	options?: layout.CreateLayoutOptions,
	children?: RouteConfigEntry[],
): RouteConfigEntry {
	if (options && !children) {
		return {
			...RRHelpers.layout(file, options),
			on: options?.on,
		};
	}

	if (options && children) {
		return {
			...RRHelpers.layout(file, options, children),
			on: options?.on,
		};
	}

	return { ...RRHelpers.layout(file), on: options?.on };
}

export namespace layout {
	export type CreateLayoutOptions = RRHelpers.CreateLayoutOptions & {
		on?: "member" | "collection" | "shallow";
	};
}

export const prefix = RRHelpers.prefix;
