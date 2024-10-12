import { createResponse } from "../../../util.ts";
import { deleteFriendship } from "../../users/[user]/friends/friendsController.ts";

export async function onRequestDelete(context) {
  console.log('DELETING FRIENDSHIP BY FRIENDSHIP ID', context);
  const friendshipId = context.params.friend;
  const result = await deleteFriendship(context, friendshipId);
  return createResponse(result);
}