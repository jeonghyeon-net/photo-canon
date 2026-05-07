import type { Member, MemberIdentity, MemberStatus } from "./member-contract";
import { formatTagNumber } from "./tag-policy";

type MemberRow = {
  id: string;
  nickname: string;
  display_name: string | null;
  avatar_url: string | null;
  tag_number: number;
  role: "USER" | "ADMIN";
  status: MemberStatus;
  created_at: string;
  updated_at: string;
};

type IdentityRow = {
  id: string;
  member_id: string;
  provider: string;
  subject: string;
  email: string | null;
  email_verified: number;
};

export function memberFromRow(row: MemberRow): Member {
  return {
    id: row.id,
    nickname: row.nickname,
    displayName: row.display_name ?? undefined,
    avatarUrl: row.avatar_url ?? undefined,
    tag: formatTagNumber(row.tag_number),
    role: row.role,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function identityFromRow(row: IdentityRow): MemberIdentity {
  return {
    id: row.id,
    memberId: row.member_id,
    provider: row.provider,
    subject: row.subject,
    email: row.email ?? undefined,
    emailVerified: row.email_verified === 1,
  };
}

export type { IdentityRow, MemberRow };
