export function createResponse(data) {
  const res = new Response(
    JSON.stringify(data),
    {
      headers: {'Content-Type': 'application/json'},      
    }
  );
  return res;
}

export function createErrorResponse(error, message) {
  const res = new Response(
    JSON.stringify({success: false, error, message}),
    { 
      headers: {'Content-Type': 'application/json'},
      status: 500
    }
  );
  return res;
}