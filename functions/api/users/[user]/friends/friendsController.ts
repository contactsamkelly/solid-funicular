// TODO: Connect to DB and manipulate real data
// TODO: Handle and return errors
import { and, eq } from "drizzle-orm";
import { getDB } from "../../../../db/index.ts";
import { friends, friendsInsertSchema, users } from "../../../../db/schema.ts";
import { createErrorResponse, createResponse } from "../../../../util.ts";

export const getFriendsOfUser = async(context, id) => {
  const db = getDB(context.env);
  try {
    const friendsOfUserResult = await db.select().from(friends)
      .where(eq(friends.user_id, id))
      .leftJoin(users, eq(users.id, friends.friend_id));
    const friendList = friendsOfUserResult.map((friendObject) => {
      return {...friendObject.users, friendship: friendObject.friends};
    })
    return friendList;
  }
  catch (e) {
    throw new Error('Failed to get friends');
  }
}

export const addFriend = async(context, userId, friendToBeAdded: {id?: string, username?: string}) => {
  const db = getDB(context.env);
  let friendUserId = null;
  try {
    let foundUser = null;
    if(friendToBeAdded?.id){
      foundUser = await db.select().from(users).where(eq(users.id, parseInt(friendToBeAdded.id)));
    } else {
      foundUser = await db.select().from(users).where(eq(users.username, friendToBeAdded.username));
    }
    friendUserId = foundUser[0].id;
    const user_id = parseInt(userId);
    const friend_id = parseInt(friendUserId);
    const existingFriendship = await db.select().from(friends).where(and(
      eq(friends.user_id, user_id),
      eq(friends.friend_id, friend_id)
    ));
    if(existingFriendship.length > 0) {
      return createErrorResponse({error: "Friendship already exists"}, "Friendship already exists");
    } else {
      const values = friendsInsertSchema.parse({user_id, friend_id});
      const result = await db.insert(friends).values(values);
      return createResponse(result);
    }    
  }
  catch (e) {
    return createErrorResponse(e, "Could not become friends with user");
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const removeFriend = async(context, userId, friendId) => {
  const db = getDB(context.env);
  try {
    const friendship = await db.select().from(friends).where(
      and(
        eq(friends.user_id, userId),
        eq(friends.friend_id, friendId)
      )
    );
    await db.delete(friends).where(eq(friends.id, friendship[0].id));
    return createResponse({success: true})
  }
  catch (e) {
    return createErrorResponse(e, "Could not remove friend");
  }
}

export const deleteFriendship = async(context, friendshipId) => {
  try{
    const db = getDB(context.env);
    await db.delete(friends).where(eq(friends.id, friendshipId))
    return true;
  } catch (e) {
    console.log('Error deleting friendship', e);
    return createErrorResponse(e, "Friendship could not be deleted");
  }
}