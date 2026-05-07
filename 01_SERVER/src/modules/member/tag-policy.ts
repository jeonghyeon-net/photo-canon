export const tagMin = 10_000_000;
export const tagMax = 99_999_999;

const tagRange = tagMax - tagMin + 1;
const uint32Range = 0x1_0000_0000;
const maxUnbiasedRandom = Math.floor(uint32Range / tagRange) * tagRange;

export function isValidTagNumber(tagNumber: number): boolean {
  return Number.isInteger(tagNumber) && tagNumber >= tagMin && tagNumber <= tagMax;
}

export function formatTagNumber(tagNumber: number): string {
  if (!isValidTagNumber(tagNumber)) {
    throw new Error("Invalid member tag number");
  }

  return tagNumber.toString();
}

export function randomTagNumber(): number {
  const value = new Uint32Array(1);

  do {
    crypto.getRandomValues(value);
  } while (value[0] >= maxUnbiasedRandom);

  return tagMin + (value[0] % tagRange);
}
