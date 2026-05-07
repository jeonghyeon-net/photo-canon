import { z } from "zod";
import { nicknameMaxLength, nicknameMinLength, nicknamePattern, normalizeNicknameInput } from "./nickname-policy";

export type MemberRole = "USER" | "ADMIN";
export type MemberStatus = "ACTIVE" | "SUSPENDED" | "DELETED";

const nicknameSchema = z.string()
  .transform(normalizeNicknameInput)
  .pipe(z.string().min(nicknameMinLength).max(nicknameMaxLength).regex(nicknamePattern));

export const updateMemberSchema = z.object({
  nickname: nicknameSchema,
});

export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;

export type Member = {
  id: string;
  nickname: string;
  displayName?: string;
  avatarUrl?: string;
  tag: string;
  role: MemberRole;
  status: MemberStatus;
  createdAt: string;
  updatedAt: string;
};

export type MemberIdentity = {
  id: string;
  memberId: string;
  provider: string;
  subject: string;
  email?: string;
  emailVerified: boolean;
};
