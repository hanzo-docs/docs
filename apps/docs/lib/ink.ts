/**
 * The two text inks the chrome uses beside `$color12`.
 *
 * gui's grey ramp is not symmetric: dark's step 10 is #ababab, a muted grey,
 * while light's step 10 is #333, a near-black that sits a hair from the #0a0a0a
 * of a title and flattens every hierarchy it is used in. So muted text names a
 * step per theme — 10 in dark, 9 (#4d4d4d) in light — here, once. Both clear
 * 7:1 on their ground.
 */
export const muted = { color: '$color10', '$theme-light': { color: '$color9' } } as const;

export const loud = { color: '$color12' } as const;
