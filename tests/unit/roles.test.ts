import { describe, it, expect } from 'vitest';
import { ROLES, hasRole, hasAnyRole, isMemberOrAbove, isAdmin } from '@/lib/utils/roles';

describe('Role Management', () => {
  describe('ROLES constant', () => {
    it('should have correct role values', () => {
      expect(ROLES.PUBLIC).toBe('public');
      expect(ROLES.MEMBER).toBe('member');
      expect(ROLES.ADMIN).toBe('admin');
    });
  });

  describe('hasRole', () => {
    it('should return true when user has the required role', () => {
      const userRoles = ['public', 'member'];
      expect(hasRole(userRoles, 'member')).toBe(true);
      expect(hasRole(userRoles, 'public')).toBe(true);
    });

    it('should return false when user does not have the required role', () => {
      const userRoles = ['public'];
      expect(hasRole(userRoles, 'member')).toBe(false);
      expect(hasRole(userRoles, 'admin')).toBe(false);
    });

    it('should return false for empty role array', () => {
      expect(hasRole([], 'member')).toBe(false);
    });

    it('should return false for undefined roles', () => {
      expect(hasRole(undefined, 'member')).toBe(false);
    });

    it('should handle admin role checks', () => {
      const adminRoles = ['public', 'member', 'admin'];
      expect(hasRole(adminRoles, 'admin')).toBe(true);
    });
  });

  describe('hasAnyRole', () => {
    it('should return true if user has any of the required roles', () => {
      const userRoles = ['public', 'member'];
      expect(hasAnyRole(userRoles, ['member', 'admin'])).toBe(true);
    });

    it('should return false if user has none of the required roles', () => {
      const userRoles = ['public'];
      expect(hasAnyRole(userRoles, ['member', 'admin'])).toBe(false);
    });

    it('should return false for undefined roles', () => {
      expect(hasAnyRole(undefined, ['member'])).toBe(false);
    });
  });

  describe('isMemberOrAbove', () => {
    it('should return true for member', () => {
      expect(isMemberOrAbove(['member'])).toBe(true);
    });

    it('should return true for admin', () => {
      expect(isMemberOrAbove(['admin'])).toBe(true);
    });

    it('should return false for public only', () => {
      expect(isMemberOrAbove(['public'])).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isMemberOrAbove(undefined)).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('should return true for admin role', () => {
      expect(isAdmin(['admin'])).toBe(true);
    });

    it('should return false for non-admin roles', () => {
      expect(isAdmin(['member'])).toBe(false);
      expect(isAdmin(['public'])).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isAdmin(undefined)).toBe(false);
    });
  });
});
