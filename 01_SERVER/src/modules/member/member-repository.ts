import type { AuthenticatedIdentity } from "../auth/auth-token";
import type { Member, MemberIdentity } from "./member-contract";
import { identityFromRow, memberFromRow, type IdentityRow, type MemberRow } from "./member-mapper";
import { initialNicknameFromIdentity } from "./nickname-policy";
import { randomTagNumber } from "./tag-policy";

const createAttempts = 8;
const memberSelect = `
  SELECT m.id, m.nickname, m.display_name, m.avatar_url, t.tag_number, m.role, m.status, m.created_at, m.updated_at
  FROM members m
  INNER JOIN member_tag_numbers t ON t.member_id = m.id
  WHERE m.id = ?
`;

export async function findIdentity(db: D1Database, identity: AuthenticatedIdentity): Promise<MemberIdentity | null> {
  const row = await db
    .prepare("SELECT id, member_id, provider, subject, email, email_verified FROM member_identities WHERE provider = ? AND subject = ?")
    .bind(identity.provider, identity.subject)
    .first<IdentityRow>();

  return row ? identityFromRow(row) : null;
}

export async function findMemberById(db: D1Database, memberId: string): Promise<Member | null> {
  const row = await db.prepare(memberSelect).bind(memberId).first<MemberRow>();
  return row ? memberFromRow(row) : null;
}

async function findMemberByIdentity(db: D1Database, identity: AuthenticatedIdentity): Promise<Member | null> {
  const linkedIdentity = await findIdentity(db, identity);
  return linkedIdentity ? findMemberById(db, linkedIdentity.memberId) : null;
}

async function insertMember(db: D1Database, identity: AuthenticatedIdentity): Promise<Member> {
  const now = new Date().toISOString();
  const memberId = crypto.randomUUID();
  const identityId = crypto.randomUUID();
  const nickname = initialNicknameFromIdentity(identity);

  await db.batch([
    db.prepare("INSERT INTO members (id, nickname, display_name, avatar_url, role, status, created_at, updated_at) VALUES (?, ?, ?, ?, 'USER', 'ACTIVE', ?, ?)")
      .bind(memberId, nickname, identity.displayName ?? null, identity.avatarUrl ?? null, now, now),
    db.prepare("INSERT INTO member_tag_numbers (tag_number, member_id, created_at) VALUES (?, ?, ?)")
      .bind(randomTagNumber(), memberId, now),
    db.prepare("INSERT INTO member_identities (id, member_id, provider, subject, email, email_verified, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(identityId, memberId, identity.provider, identity.subject, identity.email ?? null, identity.emailVerified ? 1 : 0, now, now),
  ]);

  const member = await findMemberById(db, memberId);
  if (!member) {
    throw new Error("Created member was not found");
  }

  return member;
}

export async function createMemberForIdentity(db: D1Database, identity: AuthenticatedIdentity): Promise<Member> {
  let lastError: unknown;

  for (let attempt = 0; attempt < createAttempts; attempt += 1) {
    try {
      return await insertMember(db, identity);
    } catch (error) {
      const existingMember = await findMemberByIdentity(db, identity);
      if (existingMember) {
        return existingMember;
      }
      lastError = error;
    }
  }

  throw lastError;
}

export async function updateMemberNickname(db: D1Database, memberId: string, nickname: string): Promise<Member> {
  await db.prepare("UPDATE members SET nickname = ?, updated_at = ? WHERE id = ?").bind(nickname, new Date().toISOString(), memberId).run();
  const member = await findMemberById(db, memberId);
  if (!member) {
    throw new Error("Updated member was not found");
  }
  return member;
}
