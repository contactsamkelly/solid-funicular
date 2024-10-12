import { createErrorResponse, createResponse } from "../../../../util.ts";
import { removeFriend } from "./friendsController.ts";

export async function onRequestGet(context) {
  const obj = {
    user: {
      username: 'Fake username',
      email: 'Fake email',
      id: context.params.user,
      friends: [
        {
          username: 'Fake friend',
          email: 'Friend email',
          id: context.params.friend,
        }
      ]
    }
  }
  const res = new Response(JSON.stringify(obj));
  res.headers.append('Content-Type', 'application/json');
  return res;
}

export async function onRequestDelete(context) {
  console.log('DELETING FRIENDSHIP');
  const userId = context.request.params.user;
  const friendId = context.request.params.friend;
  
  try {
    const result = await removeFriend(context, userId, friendId);
    return createResponse(result);
    
  } catch (e) {
    return createErrorResponse(e, `Could not delete friend of user ${userId}`);
  }
}