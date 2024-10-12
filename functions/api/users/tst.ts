export async function onRequestGet(context) {
  // const p = JSON.stringify(context.params);
  const userId = context.params.catchall[0];
  const friendId = context.params.catchall[2];
  const string = `Getting user ${userId}'s friend (user ${friendId})`;
  return new Response(string);
}