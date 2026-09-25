# 2Gaff website concept: "The Front Door"

Visual mockup for a redesigned 2gaff.com homepage (desktop and mobile), with a filmed hero video and the earlier photo-motion storyboard. **Mockup only.** Nothing here has been built into the live site yet: the build waits for approval of this direction.

Live canvas (private until shared): https://claude.ai/artifact/K7dGsV3GPRdpwz8h5BvVoh

## Contents

| Path | What it is |
|------|------------|
| `preview/desktop.html` | Desktop homepage (1440 px), opens in any browser |
| `preview/mobile.html` | Mobile homepage (390 px), opens in any browser |
| `preview/motion.html` | Earlier photo-motion storyboard, kept for reference (the hero now uses `video/`) |
| `video/` | Hero video, 22.5 s and silent: `hero-day.webm` / `hero-day.mp4` for desktop (1280×720, about 10–12 MB), `hero-day-540.webm` / `hero-day-540.mp4` for mobile (960×540, about 4.5 MB), and `hero-day-poster.jpg` |
| `canvas/` | Source files for the claude.ai Design canvas (`*.dc.html` + `canvas.json`). Not updated for the video hero |
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

- The hero is a wide 16:9 video in a pitched-roof frame taken from the two-house logo, with an offset gold outline echoing the logo's gold house. The headline and calls to action sit above it.
- The video is one continuous camera move through a day at the building: a couple arrives at the front door and is welcomed at the concierge desk, neighbours meet in the residents' room, and friends relax on the rooftop at sunset. It loops seamlessly.
- Four in-app messages follow the video: a property-team notice, a concierge message, a booking confirmation and a rooftop event. The scene labels and progress lines below the frame track the video's own time, so they stay in sync.
- A pause button sits beside the scene labels. The video pauses when it scrolls out of view or the tab is hidden. Visitors who ask for reduced motion see the still poster frame and the first message, with no playback.
- Features are shown as a numbered lobby-style directory beside a phone screen, not a grid of cards.
- Sign in and Get started appear in the header, the hero and the closing section. The Google Play badge appears in the header, the hero, the closing section and the footer.

## Getting the design into Figma

Figma's Claude connector is not available in cloud Claude Code sessions. Options:

1. **Import the previews with an HTML-to-Figma plugin** (for example html.to.design). Open `preview/desktop.html` or `preview/mobile.html` from a public URL (such as GitHub Pages or the raw file served by any static host), then import that URL in the plugin. The imported frames are editable layers.
2. **Use Claude Code locally** (desktop app or CLI) with the Figma connector or Figma's desktop MCP server enabled. Check out this branch and ask Claude to work from these files.
3. **Use a claude.ai chat** with the Figma connector switched on to read Figma frames back and compare them with this mockup.

## How the hero video was made

- Stills: five scenes generated for 2Gaff (front entrance, concierge desk, meeting room, rooftop lounge, barbecue garden). The barbecue image was not used: Google Flow rejected it on upload, most likely because it shows a child.
- The desk image was edited in Google Flow (Nano Banana 2) so the man matches the entrance image; the entrance image was cropped to 16:9.
- Three 8-second transitions were generated in Google Flow with Veo 3.1 Fast, each using one still as its first frame and the next as its last: entrance → desk, desk → meeting room, meeting room → rooftop. Generated on the Google AI Pro plan's included credits.
- The clips were joined with 0.25-second cross-fades, the audio removed, and the end cross-faded into the start so the loop has no visible jump.
- Everything is encoded in a single pass from Flow's 720p originals at close to their own bitrate (about 4 Mbps for desktop), so the only generation loss is Flow's own. An earlier 1 Mbps encode looked visibly soft.

## Open questions

- The rooftop and meeting-room messages are sample content, like the rest of the copy in the phone screens.
- Footer credit "Built by Deeray Multimedia Ltd": confirm it should appear.
- "Alder Court", "Residents' lounge" and the dates in the phone screens are sample content.
