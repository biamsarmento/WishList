export const BIRTHDAY_MONTH = 8; // setembro (0-indexado)
export const BIRTHDAY_DAY = 28;
export const AGE_BEFORE = 26;
export const AGE_AFTER = 27;

export function getBirthdayRange(now) {
  const thisYear = new Date(now.getFullYear(), BIRTHDAY_MONTH, BIRTHDAY_DAY, 0, 0, 0, 0);
  const next =
    thisYear.getTime() > now.getTime()
      ? thisYear
      : new Date(now.getFullYear() + 1, BIRTHDAY_MONTH, BIRTHDAY_DAY, 0, 0, 0, 0);
  const previous = new Date(next.getFullYear() - 1, BIRTHDAY_MONTH, BIRTHDAY_DAY, 0, 0, 0, 0);

  return { previous, next };
}
