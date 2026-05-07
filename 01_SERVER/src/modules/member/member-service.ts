import type { AuthenticatedIdentity } from "../auth/auth-token";
import type { Member, UpdateMemberInput } from "./member-contract";
import { createMemberForIdentity, findIdentity, findMemberById, updateMemberNickname } from "./member-repository";

export class MemberAccessError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "MemberAccessError";
    this.code = code;
  }
}

function assertActiveMember(member: Member | null): Member {
  if (!member) {
    throw new MemberAccessError("MEMBER_NOT_FOUND", "Member not found");
  }

  if (member.status !== "ACTIVE") {
    throw new MemberAccessError("MEMBER_INACTIVE", "Member is not active");
  }

  return member;
}

export async function getOrCreateActiveMember(db: D1Database, identity: AuthenticatedIdentity): Promise<Member> {
  const linkedIdentity = await findIdentity(db, identity);
  const member = linkedIdentity
    ? await findMemberById(db, linkedIdentity.memberId)
    : await createMemberForIdentity(db, identity);

  return assertActiveMember(member);
}

export async function updateActiveMember(
  db: D1Database,
  identity: AuthenticatedIdentity,
  input: UpdateMemberInput,
): Promise<Member> {
  const member = await getOrCreateActiveMember(db, identity);
  return updateMemberNickname(db, member.id, input.nickname);
}
