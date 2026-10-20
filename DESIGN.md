---
name: Setu
description: Warm print materials for cross-generational conversation games.
colors:
  paper: "#faf8f2"
  ink: "#39382f"
  muted: "#737166"
  wine: "#713d4d"
  terra: "#a9472d"
  lavender: "#eae4f3"
  purple: "#665479"
  sage: "#e8ecdc"
  green: "#526746"
  line: "#e6e3d9"
  white: "#fffefa"
  action-text: "#fffdf8"
  terra-hover: "#913c26"
typography:
  display:
    fontFamily: "DM Serif Display, Georgia, serif"
    fontSize: "clamp(40px, 4vw, 64px)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "DM Serif Display, Georgia, serif"
    fontSize: "25px"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  title:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "16px"
    fontWeight: 600
  body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "13px"
    fontWeight: 600
rounded:
  paper: "3px"
  chip: "6px"
  control: "8px"
  panel: "12px"
  form: "13px"
spacing:
  compact: "8px"
  control-gap: "12px"
  section-gap: "20px"
  mobile-gutter: "22px"
  desktop-gutter: "48px"
components:
  button-primary:
    backgroundColor: "{colors.terra}"
    textColor: "{colors.action-text}"
    rounded: "{rounded.control}"
    padding: "13px 21px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.terra-hover}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "13px 21px"
  question-card:
    backgroundColor: "{colors.lavender}"
    rounded: "{rounded.panel}"
    padding: "26px 28px"
  input-code:
    textColor: "{colors.wine}"
    rounded: "{rounded.control}"
    padding: "16px"
---

# Design System: Setu

## Overview

**Creative North Star: "Community game-night print materials"**

Warm community game-night print materials become a calm operating interface. Cream ground, wine ink accents, colored prompt paper, and an exact SVG bridge give the product a welcoming, handmade character without raster decoration.

Display serif type carries invitations, prompts, and shared words. Compact sans-serif controls carry the work. Most surfaces stay flat; overlapping introductory papers and the closing letter receive restrained shadows.

**Key Characteristics:**
- Cream ground and muted, distinct game colors.
- Editorial serif language with practical sans-serif controls.
- Soft rectangular controls, paper surfaces, and an SVG bridge.

## Colors

### Primary
- **Terracotta:** filled primary actions; deeper terracotta on hover.
- **Wine:** brand, emphasized headline words, text actions, room codes, and response totals.

### Secondary
- **Lavender / Purple:** guessing prompts, student labels, and selected-response language.
- **Sage / Green:** prediction prompts, parent labels, and calm confirmation cues.

### Tertiary
- **Terracotta-tinted paper:** scenario prompts and the warm introductory response slip use local warm variants.

### Neutral
- **Paper:** page ground; **White:** field and panel ground.
- **Ink:** primary reading; **Muted:** supporting copy; **Line:** dividers and panel boundaries.

## Typography

**Display Font:** DM Serif Display, with Georgia and serif fallbacks. **Body Font:** DM Sans, with sans-serif fallback. Fonts are self-hosted through `app/fonts.css`.

The base roles above describe the shared hierarchy; surface-specific sizes remain deliberate. Home display uses a fluid range (42–59px), then (48px) on mobile. Game prompts use a smaller fluid range (27–37px), then (28px) on mobile. Serif section headings use (25px); task headings use sans-serif (18–20px). Descriptions and labels are compact on desktop; mobile home action descriptions and hero copy use (13px). Reading prose is limited to (70ch).

## Layout

Desktop uses a fixed sidebar (228px), an offset main area, a topbar (84px), and a centered content maximum (1440px). The sidebar narrows to (200px) at (1200px). Content gutters move from (48px) to (32px), then (22px) on mobile.

Home has a two-column hero, paired entry actions, and three game introductions. Between (761px) and (1000px), hero art is hidden and game introductions stack. At (760px) and below, the sidebar becomes an offcanvas drawer (240px), the topbar becomes (67px), and entry, game, result-chart, and letter columns stack. Closed mobile navigation is inert and hidden from accessibility APIs.

Forms use centered widths (760px or 630px). Play uses a flexible task column plus session rail (230px; 205px below 1200px). On mobile, the participant card is hidden and host progress follows the task. The closing letter and sharing controls stack rather than compress.

## Elevation & Depth

Flat tonal panels and fine borders organize operating screens. Introductory prompt and answer papers overlap at slight rotations with low-opacity shadows. The letter has a restrained paper shadow; mobile navigation and status toast use stronger shadows to signal overlays. Exact shadow and motion values live in the sidecar. Reduced-motion preferences disable animation, transitions, and smooth scrolling.

## Shapes

Controls and navigation use soft rectangular corners; form and game panels are slightly rounder. The letter keeps nearly square paper corners. Circular icon grounds, role dots, and rounded badges provide small accents. Thin solid borders divide content; dashed ellipses appear only in the introductory paper illustration.

## Components

- **Buttons:** terracotta primary, bordered transparent secondary, and wine text actions. Filled actions have a minimum height (46px), with disabled opacity (.45). Keyboard focus is a purple outline (3px) offset by (4px).
- **Fields:** white or warm-white grounds, thin warm borders, wine caret/accent, and soft corners. Room-code entry is centered, uppercase, and widely tracked. Textareas remain vertically resizable.
- **Selections:** bordered option rows, role choices, and chips gain lavender/wine or warm selected fills. Selection also has a checkmark or pressed state.
- **Navigation:** icon-and-label rows; active rows use a muted wine tint and heavier type. Mobile open/close controls and help retain accessible names.
- **Entry cards:** warm host and sage-tinted join cards; circular icons and trailing arrows. Hover lifts them slightly (3px) and deepens the fill.
- **Game prompt:** lavender, sage, or warm scenario paper; metadata and timer above one dominant serif question. Response controls follow beneath.
- **Bridge and papers:** SVG bridge geometry is repeated in the identity. Overlapping CSS papers carry real prompt text, without a background image.
- **Closing letter:** warm paper, serif greeting and approved lines, signoff, bridge watermark. Sharing checkboxes and an optional new line sit in a separate consent panel; only approved lines enter the preview.

## Do's and Don'ts

### Do:
- **Do** preserve visible purple keyboard focus and reduced-motion behavior.
- **Do** pair game colors with written labels and icons.
- **Do** keep shared letter approval controls distinct from the letter preview.

### Don't:
- **Don’t** use decorative shadows on every operating panel.
- **Don’t** let the collapsed mobile navigation receive focus.
- **Don’t** replace the SVG bridge with a raster approximation.
