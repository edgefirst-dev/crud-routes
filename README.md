# React Router CRUD Helper

A helper to define CRUD routes in a React Router application using `routes.ts`.

Inspired by [Rails](https://guides.rubyonrails.org/routing.html#resource-routing-the-rails-default) resource routing.

## Installation

```bash
bun add @edgefirst-dev/crud-routes
```

## Usage

Import the `crud` helper in your `app/routes.ts` file.

```ts
import { crud } from "@edgefirst-dev/crud-routes";
```

Then you can use to to define routes in the exported array.

```ts
export default [...crud("users")] satisfies RouteConfig;
```

This will generate the following routes:

| Path                   | File                        | ID            | Used to                       |
| ---------------------- | --------------------------- | ------------- | ----------------------------- |
| -                      | `./views/users/_layout.tsx` | users.layout  | Layout of every users route   |
| /users                 | `./views/users/index.tsx`   | users.index   | Display a list of all users   |
| /users/new             | `./views/users/new.tsx`     | users.new     | Form to create a new user     |
| /users/:userId         | `./views/users/show.tsx`    | users.show    | Display the details of a user |
| /users/:userId/edit    | `./views/users/edit.tsx`    | users.edit    | Form to edit a user           |
| /users/:userId/destroy | `./views/users/destroy.tsx` | users.destroy | Action to delete a user       |

### Custom ID Prefix

You can also define a custom ID prefix for the generated routes.

```ts
export default [...crud("users", { idPrefix: "admin" })] satisfies RouteConfig;
```

This will generate the following routes:

| Path                   | File                        | ID            | Used to                       |
| ---------------------- | --------------------------- | ------------- | ----------------------------- |
| -                      | `./views/users/_layout.tsx` | admin.layout  | Layout of every users route   |
| /users                 | `./views/users/index.tsx`   | admin.index   | Display a list of all users   |
| /users/new             | `./views/users/new.tsx`     | admin.new     | Form to create a new user     |
| /users/:userId         | `./views/users/show.tsx`    | admin.show    | Display the details of a user |
| /users/:userId/edit    | `./views/users/edit.tsx`    | admin.edit    | Form to edit a user           |
| /users/:userId/destroy | `./views/users/destroy.tsx` | admin.destroy | Action to delete a user       |

### Nested Routes

You can also define nested routes using the React Router built-in helpers.

```ts
import { crud } from "@edgefirst-dev/crud-routes";
import { route } from "@react-router/dev/routes";

export default [
  ...crud("users", () => [
    // /users/profile
    route("profile", "./views/users/profile.tsx", { id: "users.profile" }),
  ]),
] satisfies RouteConfig;
```

This will generate the following routes:

| Path                   | File                        | ID            | Used to                       |
| ---------------------- | --------------------------- | ------------- | ----------------------------- |
| -                      | `./views/users/_layout.tsx` | users.layout  | Layout of every users route   |
| /users                 | `./views/users/index.tsx`   | users.index   | Display a list of all users   |
| /users/new             | `./views/users/new.tsx`     | users.new     | Form to create a new user     |
| /users/:userId         | `./views/users/show.tsx`    | users.show    | Display the details of a user |
| /users/:userId/edit    | `./views/users/edit.tsx`    | users.edit    | Form to edit a user           |
| /users/:userId/destroy | `./views/users/destroy.tsx` | users.destroy | Action to delete a user       |
| /users/profile         | `./views/users/profile.tsx` | users.profile | Display the profile of a user |

The nested route will be added to the layout of the CRUD.

#### Member Routes

A member route is a route attached to a specific resource. For example, in the resource `users` a member can be nested inside `/users/:userId`.

```ts
import { crud, route } from "@edgefirst-dev/crud-routes";

export default [
  ...crud("users", () => [
    route("profile", "./views/users/profile.tsx", {
      id: "users.profile",
      on: "member",
    }),
  ]),
] satisfies RouteConfig;
```

Here we're using the `route` helper exported by this package to define a new route. The `on` option is used to define the type of route. In this case, it's a `member` route.

A member route could also be another CRUD

```ts
import { crud } from "@edgefirst-dev/crud-routes";

export default [
  ...crud("users", () => [
    ...crud("posts", { on: "member" }), // /users/:userId/posts and other CRUD routes
  ]),
] satisfies RouteConfig;
```

#### Collection Routes

A collection route is a route attached to a specific resource. For example, in the resource `users` a collection can be nested inside `/users`.

```ts
import { crud, route } from "@edgefirst-dev/crud-routes";

export default [
  ...crud("users", () => [
    route("profile", "./views/users/profile.tsx", {
      id: "users.profile",
      on: "member",
    }),
  ]),
] satisfies RouteConfig;
```

Here we're using the `route` helper exported by this package to define a new route. The `on` option is used to define the type of route. In this case, it's a `collection` route.

A collection route could also be another CRUD

```ts
import { crud } from "@edgefirst-dev/crud-routes";

export default [
  ...crud("users", () => [
    ...crud("posts", { on: "collection" }), // /users/posts and other CRUD routes
  ]),
] satisfies RouteConfig;
```

#### Shallow Routes

> [!CAUTION]
> Shallow routes are not yet implemented.

Shallow routes allows you to nest a resource inside another resource, but limiting it to only the index and new routes. While the show, edit, and destroy routes are not nested.

```ts
import { crud } from "@edgefirst-dev/crud-routes";

export default [
  ...crud("users", () => [...crud("posts", { on: "shallow" })]),
] satisfies RouteConfig;
```

This will generate the following routes:

| Path                     | File                        | ID              | Used to                       |
| ------------------------ | --------------------------- | --------------- | ----------------------------- |
| -                        | `./views/users/_layout.tsx` | users.layout    | Layout of every users route   |
| /users                   | `./views/users/index.tsx`   | users.index     | Display a list of all users   |
| /users/new               | `./views/users/new.tsx`     | users.new       | Form to create a new user     |
| /users/:userId           | `./views/users/show.tsx`    | users.show      | Display the details of a user |
| /users/:userId/edit      | `./views/users/edit.tsx`    | users.edit      | Form to edit a user           |
| /users/:userId/destroy   | `./views/users/destroy.tsx` | users.destroy   | Action to delete a user       |
| /users/:userId/posts     | `./views/posts/index.tsx`   | users.posts     | Display a list of all posts   |
| /users/:userId/posts/new | `./views/posts/new.tsx`     | users.posts.new | Form to create a new post     |
| /posts/:postId           | `./views/posts/show.tsx`    | posts.show      | Display the details of a post |
| /posts/:postId/edit      | `./views/posts/edit.tsx`    | posts.edit      | Form to edit a post           |
| /posts/:postId/destroy   | `./views/posts/destroy.tsx` | posts.destroy   | Action to delete a post       |

Note that shallow routes will not include a layout for the nested resource. This is because the layout is shared with the parent resource.

## Author

- [Sergio Xalambrí](https://sergiodxa.com)
