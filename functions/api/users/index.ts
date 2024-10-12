import { createResponse } from "../../util.ts";
import { createUser, getUsers } from "./usersController.ts";

export async function onRequestGet(context) {
  const params = new URL(context.request.url).searchParams;
  const query = params.get('query');
  const excludeUser = params.get('excludeUser') ? parseInt(params.get('excludeUser')) : -1;
  const pageParam = params.get('page');
  const page = pageParam ? parseInt(pageParam) : 0;
  const filter = { search: query ?`%${query}%` : '%', excludeUser };
  const users = await getUsers(context, {page, filter});
  return users;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function onRequestPost(context) {
  const data = await context.request.json();
  const createdUser = await createUser(context, data);
  return createResponse(createdUser);
}