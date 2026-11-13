// Background marketing emails and AI digests are not part of this deployment.
const retired = () => new Response(null, { status: 404 });
export const GET = retired;
export const POST = retired;
export const PUT = retired;
