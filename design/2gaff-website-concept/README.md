# 2Gaff website concept: "The Front Door"

Visual mockup for a redesigned 2gaff.com homepage (desktop and mobile), plus a storyboard for the hero motion. **Mockup only.** Nothing here has been built into the live site yet: the build waits for approval of this direction.

Live canvas (private until shared): https://claude.ai/artifact/K7dGsV3GPRdpwz8h5BvVoh

## Contents

| Path | What it is |
|------|------------|
| `preview/desktop.html` | Desktop homepage (1440 px), opens in any browser |
| `preview/mobile.html` | Mobile homepage (390 px), opens in any browser |
| `preview/motion.html` | Hero motion storyboard (three scenes, timings, accessibility) |
| `canvas/` | Source files for the claude.ai Design canvas (`*.dc.html` + `canvas.json`) |
| `images/` | 2Gaff photography and the official Google Play badge, taken from 2gaff.com |

## Brand tokens (from the 2gaff.com app source)

| Token | Hex |
|-------|-----|
| Forest (primary) | `#0F3D32` |
| Ivory (background) | `#FAF7F2` |
| Gold (accent) | `#D4AF7C` |
| Ink (text) | `#2D2D2D` |
| Muted | `#6D6458` |
| Line | `#E0D5C4` |
| Sage | `#EAF0E9` |
| Sand | `#E8DFD0` |

Type: Fraunces (display) and Figtree (body). The logo is the app's own SVG mark and wordmark.

## Concept

- The hero photo sits in a pitched-roof frame taken from the two-house logo, with an offset gold outline echoing the logo's gold house.
- The hero motion is an 18-second loop of three photos: morning notices, afternoon events and evening bookings. Each has a slow push-in, a 1.2-second dissolve and a small in-app message that rises into view. Visitors who ask for reduced motion see a still first frame.
- Features are shown as a numbered lobby-style directory beside a phone screen, not a grid of cards.
- Sign in and Get started appear in the header, the hero and the closing section. The Google Play badge appears in the header, the hero, the closing section and the footer.

## Getting the design into Figma

Figma's Claude connector is not available in cloud Claude Code sessions. Options:

1. **Import the previews with an HTML-to-Figma plugin** (for example html.to.design). Open `preview/desktop.html` or `preview/mobile.html` from a public URL (such as GitHub Pages or the raw file served by any static host), then import that URL in the plugin. The imported frames are editable layers.
2. **Use Claude Code locally** (desktop app or CLI) with the Figma connector or Figma's desktop MCP server enabled. Check out this branch and ask Claude to work from these files.
3. **Use a claude.ai chat** with the Figma connector switched on to read Figma frames back and compare them with this mockup.

## Open questions

- Hero video source: none yet. The photo-based motion works without video. A real clip can replace it inside the same frame later.
- Footer credit "Built by Deeray Multimedia Ltd": confirm it should appear.
- "Alder Court", "Residents' lounge" and the dates in the phone screens are sample content.
