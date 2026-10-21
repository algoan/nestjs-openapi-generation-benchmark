/**
 * Caller identity, decoded from the bearer token
 */
export interface Identifier {
  sub: string;
  shelterIds: string[];
  roles: string[];
  email?: string;
}
