export const ROLES = {
  PUBLIC: 'public',
  MEMBER: 'member',
  ADMIN: 'admin',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export function hasRole(userRoles: string[] | undefined, requiredRole: Role): boolean {
  if (!userRoles) return false;
  return userRoles.includes(requiredRole);
}

export function hasAnyRole(userRoles: string[] | undefined, requiredRoles: Role[]): boolean {
  if (!userRoles) return false;
  return requiredRoles.some(role => userRoles.includes(role));
}

export function isMemberOrAbove(userRoles: string[] | undefined): boolean {
  return hasAnyRole(userRoles, [ROLES.MEMBER, ROLES.ADMIN]);
}

export function isAdmin(userRoles: string[] | undefined): boolean {
  return hasRole(userRoles, ROLES.ADMIN);
}
