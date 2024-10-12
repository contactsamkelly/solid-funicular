import { createResponse } from "../../../../util.ts";
import { addFriend, getFriendsOfUser } from "./friendsController.ts";

export async function onRequestGet(context) {
  const p = context.params.user;
  const friends = await getFriendsOfUser(context, p);
  return createResponse(friends);
}

export async function onRequestPost(context) {
  const userId = context.params.user;
  console.log('POSTing to create friend for user ', userId);
  const json = await context.request.json();
  console.log('JSON IS', json);
  const username = json.username;
  const id = json.id;
  const friendToBe = {
    username,
    id
  }
  const result = await addFriend(context, userId, friendToBe);
  return createResponse(result);
}