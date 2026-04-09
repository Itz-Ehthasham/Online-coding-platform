/**
 * Built-in contests on Battleground. Use `slug` in routes: /contest/:slug
 */

export const STATIC_BATTLEGROUND_CONTESTS = [
  {
    isStatic: true,
    id: "static-arena-warmup-sprint",
    slug: "arena-warmup-sprint",
    name: "Arena Warmup Sprint",
    description:
      "Three built-in Arena tasks: sum two numbers, maximum of two, and Hello Arena. Open each problem in the workspace and run your code.",
    startTime: "2026-04-01T12:00:00.000Z",
    endTime: "2026-04-30T23:59:59.999Z",
    problems: [
      { id: "static-sum-two" },
      { id: "static-max-two" },
      { id: "static-hello-arena" },
    ],
  },
];

export function getStaticBattlegroundContest(routeName) {
  return (
    STATIC_BATTLEGROUND_CONTESTS.find(
      (c) => c.slug === routeName || c.name === routeName
    ) ?? null
  );
}
