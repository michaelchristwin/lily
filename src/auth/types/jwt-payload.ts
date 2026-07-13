export interface JwtPayload {
  sub: string;
  email: string;
  role: 'customer' | 'admin';
}
