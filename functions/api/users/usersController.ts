
// TODO: Connect to DB and manipulate real data
// TODO: Handle and return errors

import { count, eq, not, ilike, and } from "drizzle-orm";
import { getDB } from "../../db/index.ts";
import { friends, users, usersInsertSchema } from "../../db/schema.ts";
import { getFriendsOfUser } from "./[user]/friends/friendsController.ts";
import { createErrorResponse, createResponse } from "../../util.ts";

export const getUsers = async (context, {page = 0, limit = 25, filter = { search: "%", excludeUser: -1 }}: {page?: number, limit?: number, filter: {search: string, excludeUser?: number}}) => {
  const limitMin = 5;
  const limitMax = 100;
  const clampedLimit = Math.max(limitMin, Math.min(limit, limitMax));
  try {  
    const db = getDB(context.env);
    const [usersResult, totalUsers, totalFriends] = await Promise.all([
      db.select().from(users).where(and(
        ilike(users.username, filter.search),
        not(eq(users.id, filter.excludeUser))
      )).limit(clampedLimit).offset(page * limit),
      db.select({count: count()}).from(users),
      db.select({count: count()}).from(friends)
    ])
    return createResponse({
      usersResult,
      totalUsers: totalUsers[0].count,
      totalFriends: totalFriends[0].count, 
    });
  }
  catch (e) {
    console.log('There was an error retrieving users...', e);
    return createErrorResponse(e, "Error getting users");
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createUser = async (context, {username, email, name, location, bio}) => {
  const db = getDB(context.env);
  try {
    const values = {username, email, name, location, bio, avatarurl: `https://robohash.org/${username}`}
    const userValues = usersInsertSchema.parse(values);
    const createUserResult = await db.insert(users).values(userValues).returning();
    return createResponse(createUserResult[0]);
  }
  catch (error) {
    return createErrorResponse(error, "Error creating user");
  }
}

export const getUserById = async(context, id) => {
  const db = getDB(context.env);
  try {

    const userResult = await db.select().from(users)
      .where(eq(users.id, id));
    const friends = await getFriendsOfUser(context, id);
    const user = {
      ...userResult[0],
      friends
    }
    return createResponse(user);
  }
  catch (e) {
    return createErrorResponse(e, "Error getting user by ID");
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const updateUserById = async(id: number|string, {username, email, name, location, bio}) => {
  // TODO: Ensure user exists
  // TODO: Sanitize/validate input using zod
  const user = {
    name: 'Edited placeholder'
  };
  return user;
}

export const deleteUserById = async (context, id) => {
  const db = getDB(context.env);
  try{
    await Promise.all([
      db.delete(friends).where(eq(friends.friend_id, id)),
      db.delete(friends).where(eq(friends.user_id, id)),
      db.delete(users).where(eq(users.id, id))
    ]);
    return createResponse({success: true})
  } catch (e) {
    return createErrorResponse(e, "Error deleting user and friendships");
  }
}