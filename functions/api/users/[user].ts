import { createResponse } from "../../util.ts";
import { deleteUserById, getUserById } from "./usersController.ts";
// import { createUser } from "./usersController";

export async function onRequestGet(context) {
  const user = await getUserById(context, context.params.user)
  return createResponse(user);
  // return new Response("OKEYDOKEY")
}

export async function onRequestDelete(context) {
  await deleteUserById(context, context.params.user);
  return createResponse({deleted: context.params.user});
}

// export async function onRequestPost(context) {
//   console.log('ON REQUEST POST!!!');
//   const newUserData = await createUser(context.params);
//   return createResponse(newUserData);
// }