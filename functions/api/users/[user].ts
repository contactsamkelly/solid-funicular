import { deleteUserById, getUserById } from "./usersController.ts";

export async function onRequestGet(context) {
  return await getUserById(context, context.params.user)
}

export async function onRequestDelete(context) {
  return deleteUserById(context, context.params.user);
}