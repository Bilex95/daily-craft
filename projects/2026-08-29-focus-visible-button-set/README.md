# Focus-Visible Button Set

A small study of button states done properly: hover, active, disabled, loading, and — the one most UIs get wrong — keyboard focus using `:focus-visible`.

## Why it's interesting

Mouse users shouldn't see focus rings on click, but keyboard users must. `:focus-visible` solves this natively, yet many production sites still suppress focus entirely. This demo shows the correct pattern in ~60 lines of CSS.

## Run it

Open `index.html` in any browser. Tab through the buttons, then click them — notice the focus ring appears only for keyboard navigation.

## Contribute

- Add a `prefers-reduced-motion` variant for the loading spinner
- Add a dark-mode token set using `light-dark()`
- Write a Playwright test asserting the focus-visible behavior
