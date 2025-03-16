import { expect, test } from "bun:test";
import { createCrud, crud } from ".";
import { index, layout, prefix, route } from "./lib/helpers";

test("returns a group of CRUD routes", () => {
	expect(crud("users")).toEqual([
		route("users", "./views/users/_layout.tsx", { id: "users.layout" }, [
			index("./views/users/index.tsx", { id: "users.index" }),
			route("new", "./views/users/new.tsx", { id: "users.new" }),
			...prefix(":userId", [
				index("./views/users/show.tsx", { id: "users.show" }),
				route("edit", "./views/users/edit.tsx", { id: "users.edit" }),
				route("destroy", "./views/users/destroy.tsx", { id: "users.destroy" }),
			]),
		]),
	]);
});

test("can limit the CRUD routes", () => {
	expect(crud("users", { only: ["index", "show"] })).toEqual([
		route("users", "./views/users/_layout.tsx", { id: "users.layout" }, [
			index("./views/users/index.tsx", { id: "users.index" }),
			...prefix(":userId", [
				index("./views/users/show.tsx", { id: "users.show" }),
			]),
		]),
	]);
});

test("can pass an ID prefix", () => {
	expect(crud("users", { idPrefix: "admin" })).toEqual([
		route("users", "./views/users/_layout.tsx", { id: "admin.users.layout" }, [
			index("./views/users/index.tsx", { id: "admin.users.index" }),
			route("new", "./views/users/new.tsx", { id: "admin.users.new" }),
			...prefix(":userId", [
				index("./views/users/show.tsx", { id: "admin.users.show" }),
				route("edit", "./views/users/edit.tsx", { id: "admin.users.edit" }),
				route("destroy", "./views/users/destroy.tsx", {
					id: "admin.users.destroy",
				}),
			]),
		]),
	]);
});

test("can add nested routes", () => {
	expect(crud("users", () => [crud("comments")])).toEqual([
		route("users", "./views/users/_layout.tsx", { id: "users.layout" }, [
			index("./views/users/index.tsx", { id: "users.index" }),
			route("new", "./views/users/new.tsx", { id: "users.new" }),
			...prefix(":userId", [
				index("./views/users/show.tsx", { id: "users.show" }),
				route("edit", "./views/users/edit.tsx", { id: "users.edit" }),
				route("destroy", "./views/users/destroy.tsx", { id: "users.destroy" }),
			]),
			route(
				"comments",
				"./views/comments/_layout.tsx",
				{ id: "users.comments.layout", on: undefined },
				[
					index("./views/comments/index.tsx", {
						id: "users.comments.index",
						on: undefined,
					}),
					route("new", "./views/comments/new.tsx", {
						id: "users.comments.new",
						on: undefined,
					}),
					...prefix(":commentId", [
						index("./views/comments/show.tsx", {
							id: "users.comments.show",
							on: undefined,
						}),
						route("edit", "./views/comments/edit.tsx", {
							id: "users.comments.edit",
							on: undefined,
						}),
						route("destroy", "./views/comments/destroy.tsx", {
							id: "users.comments.destroy",
							on: undefined,
						}),
					]),
				],
			),
		]),
	]);
});

test("can add options and nested routes", () => {
	expect(
		crud("users", { idPrefix: "admin" }, () => [crud("comments")]),
	).toEqual([
		route("users", "./views/users/_layout.tsx", { id: "admin.users.layout" }, [
			index("./views/users/index.tsx", { id: "admin.users.index" }),
			route("new", "./views/users/new.tsx", { id: "admin.users.new" }),
			...prefix(":userId", [
				index("./views/users/show.tsx", { id: "admin.users.show" }),
				route("edit", "./views/users/edit.tsx", { id: "admin.users.edit" }),
				route("destroy", "./views/users/destroy.tsx", {
					id: "admin.users.destroy",
				}),
			]),
			route(
				"comments",
				"./views/comments/_layout.tsx",
				{ id: "admin.users.comments.layout", on: undefined },
				[
					index("./views/comments/index.tsx", {
						id: "admin.users.comments.index",
						on: undefined,
					}),
					route("new", "./views/comments/new.tsx", {
						id: "admin.users.comments.new",
						on: undefined,
					}),
					...prefix(":commentId", [
						index("./views/comments/show.tsx", {
							id: "admin.users.comments.show",
							on: undefined,
						}),
						route("edit", "./views/comments/edit.tsx", {
							id: "admin.users.comments.edit",
							on: undefined,
						}),
						route("destroy", "./views/comments/destroy.tsx", {
							id: "admin.users.comments.destroy",
							on: undefined,
						}),
					]),
				],
			),
		]),
	]);
});

test("can set nested routes to be collection or member routes", () => {
	expect(
		crud("users", () => [
			crud("posts", { on: "collection" }),
			crud("comments", { on: "member" }),
		]),
	).toEqual([
		route("users", "./views/users/_layout.tsx", { id: "users.layout" }, [
			index("./views/users/index.tsx", { id: "users.index" }),
			route("new", "./views/users/new.tsx", { id: "users.new" }),
			...prefix(":userId", [
				index("./views/users/show.tsx", { id: "users.show" }),
				route("edit", "./views/users/edit.tsx", { id: "users.edit" }),
				route("destroy", "./views/users/destroy.tsx", { id: "users.destroy" }),
				route(
					"comments",
					"./views/comments/_layout.tsx",
					{ id: "users.comments.layout", on: "member" },
					[
						index("./views/comments/index.tsx", {
							id: "users.comments.index",
							on: "member",
						}),
						route("new", "./views/comments/new.tsx", {
							id: "users.comments.new",
							on: "member",
						}),
						...prefix(":commentId", [
							index("./views/comments/show.tsx", {
								id: "users.comments.show",
								on: "member",
							}),
							route("edit", "./views/comments/edit.tsx", {
								id: "users.comments.edit",
								on: "member",
							}),
							route("destroy", "./views/comments/destroy.tsx", {
								id: "users.comments.destroy",
								on: "member",
							}),
						]),
					],
				),
			]),
			route(
				"posts",
				"./views/posts/_layout.tsx",
				{ id: "users.posts.layout", on: "collection" },
				[
					index("./views/posts/index.tsx", {
						id: "users.posts.index",
						on: "collection",
					}),
					route("new", "./views/posts/new.tsx", {
						id: "users.posts.new",
						on: "collection",
					}),
					...prefix(":postId", [
						index("./views/posts/show.tsx", {
							id: "users.posts.show",
							on: "collection",
						}),
						route("edit", "./views/posts/edit.tsx", {
							id: "users.posts.edit",
							on: "collection",
						}),
						route("destroy", "./views/posts/destroy.tsx", {
							id: "users.posts.destroy",
							on: "collection",
						}),
					]),
				],
			),
		]),
	]);
});

test("can set nested routes to be shallow", () => {
	let result = crud("users", () => [
		crud("posts", { on: "shallow" }),
		crud("comments", { on: "shallow" }),
	]);
	expect(result).toEqual([
		route("users", "./views/users/_layout.tsx", { id: "users.layout" }, [
			index("./views/users/index.tsx", { id: "users.index" }),
			route("new", "./views/users/new.tsx", { id: "users.new" }),
			...prefix(":userId", [
				index("./views/users/show.tsx", { id: "users.show" }),
				route("edit", "./views/users/edit.tsx", { id: "users.edit" }),
				route("destroy", "./views/users/destroy.tsx", { id: "users.destroy" }),
			]),
		]),

		...prefix("users/:userId", [
			route(
				"posts",
				"./views/posts/_layout.tsx",
				{ id: "users.posts.layout", on: "shallow" },
				[
					index("./views/posts/index.tsx", {
						id: "users.posts.index",
						on: "shallow",
					}),
					route("new", "./views/posts/new.tsx", {
						id: "users.posts.new",
						on: "shallow",
					}),
				],
			),

			route(
				"comments",
				"./views/comments/_layout.tsx",
				{ id: "users.comments.layout", on: "shallow" },
				[
					index("./views/comments/index.tsx", {
						id: "users.comments.index",
						on: "shallow",
					}),
					route("new", "./views/comments/new.tsx", {
						id: "users.comments.new",
						on: "shallow",
					}),
				],
			),
		]),

		layout(
			"./views/posts/_layout.tsx",
			{ id: "posts.layout", on: "shallow" },
			prefix("posts/:postId", [
				index("./views/posts/show.tsx", {
					id: "posts.show",
					on: "shallow",
				}),
				route("edit", "./views/posts/edit.tsx", {
					id: "posts.edit",
					on: "shallow",
				}),
				route("destroy", "./views/posts/destroy.tsx", {
					id: "posts.destroy",
					on: "shallow",
				}),
			]),
		),

		layout(
			"./views/comments/_layout.tsx",
			{ id: "comments.layout", on: "shallow" },
			prefix("comments/:commentId", [
				index("./views/comments/show.tsx", {
					id: "comments.show",
					on: "shallow",
				}),
				route("edit", "./views/comments/edit.tsx", {
					id: "comments.edit",
					on: "shallow",
				}),
				route("destroy", "./views/comments/destroy.tsx", {
					id: "comments.destroy",
					on: "shallow",
				}),
			]),
		),
	]);
});

test("can create a CRUD helper", () => {
	const crud = createCrud("./views");
	expect(crud("users")).toEqual([
		route("users", "./views/users/_layout.tsx", { id: "users.layout" }, [
			index("./views/users/index.tsx", { id: "users.index" }),
			route("new", "./views/users/new.tsx", { id: "users.new" }),
			...prefix(":userId", [
				index("./views/users/show.tsx", { id: "users.show" }),
				route("edit", "./views/users/edit.tsx", { id: "users.edit" }),
				route("destroy", "./views/users/destroy.tsx", { id: "users.destroy" }),
			]),
		]),
	]);
});
