# Focus-Visible Button Set — Playwright Tests

## What is this?

A Playwright end-to-end test that validates proper `:focus-visible` behavior on a set of buttons. This ensures that:

- **Keyboard users** (pressing `Tab`) see a visible focus outline on the first button.
- **Mouse users** (clicking) do **not** see a focus outline on the second button.

This is a common accessibility pattern that many UIs get wrong.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- A modern browser (Chromium is installed automatically)

## Setup

```bash
npm install
npx playwright install chromium