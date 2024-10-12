// db/schema.ts
import { relations } from 'drizzle-orm';
import { pgTable, serial, text, doublePrecision, integer } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
// import { z } from 'zod';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name'),
  description: text('description'),
  price: doublePrecision('price'),
});

export const users = pgTable('users',  {
  id: serial('id').primaryKey(),
  name: text('name'),
  username: text('username').unique(),
  email: text('email').unique(),
  location: text('location'),
  avatarurl: text('avatarurl')
});

export const usersInsertSchema = createInsertSchema(users, { email: (schema) => schema.email.email() });
export const usersSelectSchema = createSelectSchema(users);

export const friends = pgTable('friends', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id),
  friend_id: integer('friend_id').references(() => users.id)
});

export const friendsInsertSchema = createInsertSchema(friends);
export const friendsSelectSchema = createSelectSchema(friends);

export const usersRelations = relations(users, ({many}) => ({
  friends: many(friends)
}));

// export const friends = pgTable('friends', {
//   id: serial('id').primaryKey(),
//   userId: serial('userId'),
//   friendId: serial('friendId'),
//   createdAt: timestamp('createdAt').defaultNow()
// })