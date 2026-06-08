# Settings Secondary Pages Design

Date: 2026-06-08
Project: 薯鲜生

## Goal

Extend the settings area from a mostly flat menu into a complete one-level settings flow. Every meaningful settings entry should either open a focused secondary page or remain a direct action when a page would add friction.

The first implementation should be complete but lightweight: pages, routes, visual hierarchy, local state, and user feedback should be in place now; backend integration can be added later by replacing clearly named load/save actions.

## Scope

Create or refresh these secondary pages:

- `/profile/edit` - Personal profile
- `/settings/security` - Account and security
- `/settings/notifications` - Notification settings
- `/settings/privacy` - Privacy settings
- `/settings/cache` - Cache management
- `/settings/about` - About 薯鲜生
- `/settings/agreement` - User agreement
- `/settings/privacy-policy` - Privacy policy

Keep the existing background/theme switch as an inline action on `/settings`. It should not become a secondary page.

## Non-Goals

- Do not add a new UI library or icon library.
- Do not introduce new backend tables or API contracts in this pass.
- Do not build deep third-level settings pages.
- Do not replace the existing theme system.
- Do not redesign unrelated app pages.

## Technology Constraints

Stay consistent with the current project stack:

- Vue 3 single-file components
- Vue Router route definitions in `src/router/index.js`
- Vite
- Tailwind utility classes and existing CSS variables from `src/assets/main.css`
- Existing theme variables: `--theme-bg`, `--theme-card`, `--theme-text`, `--theme-text-secondary`, `--theme-card-border`
- Existing Material Symbols icon style
- Existing composables where relevant: `useAuth`, `useToast`, `useTheme`
- Existing Supabase user update behavior on the personal profile page

UI can be enhanced, but it must look like it belongs to the current app: warm produce-market visual tone, compact mobile-first layout, rounded cards, soft borders, current typography, and no unrelated design system.

## UX Principles

- One settings level only: `/settings` -> secondary page.
- Every page has a sticky top bar with back button and centered title.
- Use clear setting labels and short supporting text.
- Keep touch targets at least 44px high.
- Prefer grouped cards for related settings.
- Show immediate feedback for local actions using the existing toast system.
- Document pages should be readable on mobile, with comfortable line height and section spacing.
- Keep the background/theme row as a direct action because it is faster than opening a page.

## Architecture

Use a shared settings-page structure and independent page bodies.

Recommended components:

- `SettingsPageShell.vue`
  - Sticky header
  - Back button
  - Title
  - Optional right action slot for Save
  - Shared page background and max-width wrapper

- `SettingsSection.vue`
  - Optional section title
  - Rounded card surface
  - Consistent borders and spacing

- `SettingsRow.vue`
  - Icon, label, optional description, optional value, optional chevron
  - Supports button rows and static rows

- `SettingsSwitchRow.vue`
  - Label, description, switch state
  - Uses local Vue refs for this pass

- `SettingsDocumentPage.vue` or document content sections
  - Reusable layout for agreement and privacy policy text

The components should stay small. If a page only needs a simple custom block, implement it inside that page rather than making the shared API too broad.

## Routes

Add routes with `meta: { hideNav: true, hideHeader: true }`:

- `/settings/security`
- `/settings/notifications`
- `/settings/privacy`
- `/settings/cache`
- `/settings/about`
- `/settings/agreement`
- `/settings/privacy-policy`

Keep `/profile/edit`, but update its visual structure to use the same secondary settings page style.

Update the settings menu rows:

- Personal profile -> `/profile/edit`
- Account and security -> `/settings/security`
- Notifications -> `/settings/notifications`
- Privacy settings -> `/settings/privacy`
- Clear cache -> `/settings/cache`
- About 薯鲜生 -> `/settings/about`
- User agreement -> `/settings/agreement`
- Privacy policy -> `/settings/privacy-policy`
- Background/theme -> keep current inline `cycleTheme()` behavior

## Page Designs

### Personal Profile

Purpose: Let the user review and edit basic account identity.

Content:

- Avatar display with Material Symbols person icon
- Nickname input
- Email read-only row
- Member/source label, such as "黄金产区直供"
- Save action in header

Behavior:

- Preserve current Supabase `updateUser({ data: { nickname } })` behavior.
- Empty nickname shows toast.
- Saving state disables the action and changes the label.
- Success returns to previous page.

### Account and Security

Purpose: Make account safety feel present even before full security APIs are integrated.

Content:

- Account summary: email, login status
- Password row: "登录密码", value "建议定期更新"
- Phone binding row: local display value
- Login device row: "当前设备", value "已登录"
- Security tips card with two or three short tips

Behavior:

- Rows that cannot yet perform real actions show a toast such as "功能建设中".
- Future backend hook points: load account security state, update password, bind phone, list devices.

### Notification Settings

Purpose: Let users understand and control message categories.

Content:

- Order notifications
- Delivery reminders
- Promotional offers
- Restock reminders
- System messages

Behavior:

- Use local switch state.
- Toggle changes are immediate.
- Optional footer note: "通知设置将在后续同步到账号。"
- Future backend hook points: load notification preferences, save notification preferences.

### Privacy Settings

Purpose: Give users clear control over personalization and data use.

Content:

- Personalized recommendations
- Location service usage
- Browsing history
- Data management row
- Short privacy explanation card

Behavior:

- Use local switch state for recommendation, location, and history.
- Data management row shows toast for now.
- Future backend hook points: load privacy preferences, save privacy preferences, request data export/delete.

### Cache Management

Purpose: Make "clear cache" feel safe and understandable.

Content:

- Total cache size
- Image cache row
- Browsing cache row
- Temporary data row
- Primary clear button

Behavior:

- Use local cache sizes.
- On clear, set displayed sizes to 0MB and show toast.
- Button can briefly enter clearing state.
- Future native/backend hook points: clear app cache, image cache, local browsing cache.

### About 薯鲜生

Purpose: Explain the brand and app version in a polished, lightweight page.

Content:

- Logo or brand mark if available
- App name
- Version: v1.2.0
- Short brand introduction
- Service promises: fresh origin supply, fast delivery, selected varieties
- Customer service/help row

Behavior:

- Help row can route to existing `/help` if appropriate.
- No backend dependency.

### User Agreement

Purpose: Provide a credible document-style agreement page.

Content sections:

- Service overview
- Account use
- Orders and payment
- Delivery and after-sales
- User responsibilities
- Agreement updates

Behavior:

- Read-only document.
- Include "Updated: 2026-06-08".
- No backend dependency.

### Privacy Policy

Purpose: Provide a credible document-style privacy page.

Content sections:

- Information collected
- How information is used
- Storage and protection
- Third-party services
- User rights
- Contact and updates

Behavior:

- Read-only document.
- Include "Updated: 2026-06-08".
- No backend dependency.

## UI Enhancement Rules

Allowed enhancements:

- Better section headers
- Compact summary cards
- Soft icon containers
- Switch rows
- Status chips
- Readable document typography
- Small empty/helper text blocks
- Subtle pressed and disabled states

Do not add:

- A new palette unrelated to existing theme variables
- Decorative gradients/orbs
- A landing-page style hero
- Oversized marketing cards
- Emoji icons
- New dependencies

## Data and State Strategy

For this pass:

- Profile page uses existing Supabase update behavior.
- Notification, privacy, and cache pages use local component state.
- Security page uses user data from `useAuth` plus local display values.
- Agreement, privacy policy, and about page use static local content.

Future integration points should be expressed as named functions inside pages or composables, not scattered inline logic:

- `loadNotificationSettings()`
- `saveNotificationSettings()`
- `loadPrivacySettings()`
- `savePrivacySettings()`
- `clearLocalCache()`
- `loadSecuritySummary()`

These can be local stubs now and replaced later.

## Feedback and Error Handling

- Use existing `useToast`.
- Show toast for unavailable future actions.
- Disable save/clear buttons while an action is running.
- Keep profile save error handling from the current implementation.
- Do not show fake success for actions that are not actually implemented, except local-only preference toggles and cache display reset.

## Accessibility and Responsive Behavior

- Mobile-first max width should match existing settings pages, around `max-w-lg`.
- Buttons and rows should have comfortable vertical padding.
- Icon-only buttons need clear visual affordance; the back button already uses a recognizable icon.
- Text should wrap instead of clipping.
- Document text should use readable line height and avoid dense edge-to-edge paragraphs.
- Color should come from existing theme variables so dark/light theme switching remains coherent.

## Verification Plan

Manual and automated checks should include:

- `npm run build`
- Navigate from `/settings` to every secondary page.
- Back button returns from each page.
- Background/theme row still cycles theme inline.
- Profile nickname save still works as before.
- Notification and privacy switches toggle without layout shift.
- Cache clear updates displayed values and shows toast.
- Agreement and privacy policy pages are readable on mobile viewport.
- No new dependencies are added to `package.json`.

## Open Questions

None. The agreed direction is:

- Use the lightweight complete approach.
- Build secondary pages for every settings entry except background/theme.
- Keep technical stack consistent.
- Allow UI polish only within the existing visual system.
