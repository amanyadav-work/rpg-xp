import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_ROUTES = ['/api/login', '/api/register','/api/public'];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    PUBLIC_ROUTES.includes(pathname)
  ) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new NextResponse(
      JSON.stringify({ message: 'Authorization header missing or invalid' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const token = authHeader.split(' ')[1];

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));

    const res = NextResponse.next();
     res.cookies.set('x-user-email', payload);

    res.headers.set('x-user', "blueee");

    return res;
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ message: 'Invalid or expired token' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export const config = {
  matcher: ['/api/:path*'],
};
