```markdown
# Design System Document: The Kinetic Manuscript

## 1. Overview & Creative North Star
**Creative North Star: The Kinetic Manuscript**

This design system is a sophisticated collision between the rigorous discipline of technical documentation and the raw, refracted energy of chromatic glitch art. It moves away from the sterile, "template-driven" look of standard SaaS platforms, instead embracing a **High-Performance Editorial** aesthetic. 

The experience is defined by vast "white space" (utilizing the `surface` and `surface_container_lowest` tokens) which serves as a vacuum for high-intensity color accents. We break traditional grid rigidity through intentional asymmetry—using heavy left-aligned typography contrasted against floating, glass-morphic utility panels. The energy isn't found in clutter, but in the "chromatic leaks" (pinks, cyans, and purples) that highlight progress, code execution, and data hierarchy.

---

## 2. Colors: Chromatic Precision
The palette utilizes a high-contrast relationship between a clean, neutral base and high-saturation "kinetic" accents derived from light-refraction physics.

### The "No-Line" Rule
To achieve a premium, editorial feel, **1px solid borders are strictly prohibited for sectioning.** Structural boundaries must be defined through background color shifts. 
*   **Base Layer:** `surface` (#f5f6f7).
*   **Sidebar/Navigation:** `surface_container_low` (#eff1f2).
*   **Content Cards:** `surface_container_lowest` (#ffffff).
The eye should perceive depth through tonal changes, not architectural lines.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. A code snippet should be nested: 
`Surface (Base) > Surface Container Low (Section) > Inverse Surface (Code Block)`. 
This creates a "sunken" or "raised" effect purely through value contrast.

### Signature Textures & The Glass Rule
Floating elements (such as command palettes or tooltips) must use a **Glassmorphic effect**:
*   **Background:** `surface_container_lowest` at 85% opacity.
*   **Backdrop Blur:** 12px to 20px.
*   **Gradients:** Use linear gradients for primary actions. A CTA should transition from `primary` (#652fe7) to `primary_container` (#a98fff) at a 135-degree angle to mimic the kinetic flow of light.

---

## 3. Typography: The Inter Grid
Typography is the backbone of this system. We use **Inter** exclusively for its neutral, high-legibility "documentation" characteristics, but we apply it with editorial scale.

*   **Display & Headline:** Use `display-lg` (3.5rem) for hero sections with a letter-spacing of `-0.02em`. This "tight" tracking creates an authoritative, magazine-like feel.
*   **Documentation Body:** `body-md` (0.875rem) is the workhorse. Ensure a line-height of 1.6 to maintain readability during long-form technical consumption.
*   **Labels:** `label-sm` (0.6875rem) should always be in uppercase with `+0.05em` letter-spacing when used for category pills or metadata to distinguish them from prose.

---

## 4. Elevation & Depth
In this design system, elevation is a psychological cue, not just a CSS property.

*   **Tonal Layering:** Avoid shadows for static elements. Place a `surface_container_lowest` card on a `surface_container` background to create a "soft lift."
*   **Ambient Shadows:** For floating modals, use "Atmospheric Shadows."
    *   **Shadow Color:** 4% to 8% opacity of `on_surface` (#2c2f30).
    *   **Blur:** 40px to 60px.
    *   **Spread:** -5px (to keep the shadow "under" the element rather than glowing around it).
*   **The Ghost Border Fallback:** If accessibility requirements demand a container edge, use a **Ghost Border**: `outline_variant` (#abadae) at 15% opacity. Never use 100% opaque lines.

---

## 5. Components: Kinetic Implementation

### Progress & Performance Bars
Progress bars must represent "energy." Instead of a flat color fill, use a multi-stop gradient:
*   **Fill:** `secondary` (#006571) → `primary` (#652fe7) → `tertiary` (#b60051). 
*   **Track:** `surface_container_highest` (#dadddf).

### Code Blocks & Accents
To reflect the high-performance documentation vibe:
*   **Background:** `inverse_surface` (#0c0f10).
*   **Accent:** A 4px solid left-border using the `tertiary` (#b60051) token.
*   **Syntax Highlighting:** Use `secondary_fixed` (Cyan) for functions and `tertiary_fixed` (Pink) for strings to echo the glitch-art palette.

### Category Pills
*   **Style:** Fully rounded (`full` scale).
*   **Colors:** Use "high-chroma" pairings. For example: `tertiary_container` (#ff8fa9) background with `on_tertiary_container` (#66002b) text.
*   **Interactions:** On hover, the pill should expand slightly (scale 1.05) to emphasize kinetic energy.

### Buttons
*   **Primary:** Gradient of `primary` to `primary_dim`. Roundedness: `md` (0.375rem).
*   **Secondary:** Ghost Border style (15% opacity `outline`) with `on_surface` text.
*   **Tertiary:** Text-only with an underline that appears as a 2px `secondary` (#006571) bar on hover.

### Cards & Lists
**Strict Rule:** No dividers. Separate list items using `spacing-4` (vertical white space) or by alternating background tints between `surface` and `surface_container_low`.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical layouts. Push content to the right and keep navigation/meta-info in a wide left margin.
*   **Do** use high-contrast typography scales (e.g., a `display-sm` header immediately followed by `body-sm` metadata).
*   **Do** embrace "Chromatic Leaks." Use the vibrant `tertiary` pink for tiny details like notification dots or cursor highlights.

### Don't
*   **Don't** use pure black (#000000) for text. Always use `on_surface` (#2c2f30) to maintain a premium "ink on paper" feel.
*   **Don't** use standard 1px borders. If a section feels "lost," increase the tonal difference between the two surface tokens.
*   **Don't** use heavy shadows. If an element isn't "floating" (like a modal), it shouldn't have a shadow. Use tonal nesting instead.
*   **Don't** clutter the interface. If a piece of information isn't vital, hide it behind a glassmorphic "More" trigger.