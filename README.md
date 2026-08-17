# CivicConnect Hub

Role

Act as a senior frontend web developer, UI/UX designer, accessibility specialist, and QA engineer, working together as one team on a single deliverable.

Deliverable Definition

Build a complete, polished, realistic, responsive, accessible, and fully functional frontend website for a Class 12 project:

CivicConnect — One-Stop Citizen Service & Complaint Platform

The final result must feel like a real civic-tech product ready for users, while clearly remaining a student project prototype. Do not produce a generic template, unfinished mockup, static landing page, or collection of disconnected sections.

Definition of done: every interactive element on the page — link, button, filter, form, modal, accordion item — performs the specific action described in this document, with no exceptions and no placeholders. If any single element cannot be made functional within the stated tech constraints, state that limitation explicitly in the README rather than shipping it silently broken.

Output format: provide the complete project as separate, complete files (not excerpts, not diffs, not "...rest of code..." placeholders). If the environment supports direct file creation, create the full folder structure. If not, provide each file in full in its own labeled code block. Every required file must be complete and immediately usable by opening index.html in a browser — no build step, no server, no dependencies to install.

1. Project Purpose

CivicConnect is a concept-based digital civic platform that helps citizens:

Report everyday civic problems
Track complaint status
Access public service information
View local announcements
Contact the platform
Stay connected with their community

It should look and behave like a professional civic-tech/government-service portal while remaining simple, attractive, intuitive, trustworthy, and appropriate for a Class 12 school project.

Mandatory disclaimer. This is not an official government website. Display prominently (hero area and footer, at minimum):

"CivicConnect is a student project prototype and is not an official government service."

Do not claim CivicConnect provides real government services. Do not present demo data as real government information.

2. Technology Requirements

Use only:

HTML5
CSS3
Vanilla JavaScript (no frameworks, no build tools)
LocalStorage
Font Awesome (or another free icon library, loaded via CDN or local asset)
Google Fonts (e.g., Inter or Poppins)

Do not use: React, Vue, Angular, Svelte, Bootstrap, Tailwind, or any other frontend framework/utility-CSS library. No backend, build process, Node.js server, database, or API key.

File separation: HTML, CSS, and JavaScript must live in separate files.

Required folder structure:

civicconnect/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   ├── images/
│   └── icons/
└── README.md

The site must work correctly when index.html is opened directly in a browser (no local server required).

3. Design Goal

The site should look like a real, trustworthy civic technology platform.

Aim for: professional, modern, clean, trustworthy, accessible, citizen-focused, spacious, responsive, polished, consistent.

Avoid: generic AI-template appearance, excessive gradients/animation/glassmorphism, oversized decorative text, clutter, random decorative elements, empty-looking sections, fake dashboard elements with no purpose.

Use: rounded cards, soft shadows, clean borders, strong visual hierarchy, large readable typography, consistent spacing, subtle gradients, professional icons, responsive grids, clear section separation, high-quality hover states, strong focus states, consistent button styling.

Layout constants:

Max content width: 1200–1280px
Spacing system: ~8px base unit
Border radius: 12–20px
4. Color System

A consistent civic-inspired palette:

Role	Color
Primary	Deep Blue / Royal Blue
Secondary	Green
Accent	Orange or Cyan
Background	White / Very Light Gray
Text	Dark Navy / Charcoal
Success	Green
Warning	Orange
Error	Red
Information	Blue

Status must never be communicated by color alone. Every status indicator pairs an icon + text label + color:

Pending → icon + text + color
In Progress → icon + text + color
Resolved → icon + text + color
5. Global UX Requirements

The site must feel like one coherent application: consistent spacing, typography, buttons, cards, icons, form controls, modals, and notifications throughout.

Every interaction gives visible feedback for the states that apply to it: hover, focus, active, disabled, loading, success, error, empty, selected. The user should never be left wondering whether an action worked.

6. Single-Page Architecture

One HTML page. Do not create separate HTML pages for each section.

Required section IDs (exact):

#home
#services
#complaints
#track-status
#announcements
#about
#contact

Additional sections (FAQ, Community Impact, How It Works) may exist within the page without a listed ID requirement, but should still have their own id for anchor/focus purposes.

Use smooth scrolling. No page reloads for internal navigation.

7. Global Navigation Map

Every navigation destination must connect to an existing section, element, or explicit action. Exact mapping:

Trigger	Destination
Logo	#home
Home	#home
Services	#services
Complaints	#complaints
Track Status	#track-status
Announcements	#announcements
About	#about
Contact	#contact
File a Complaint	#complaints
Track Complaint	#track-status
Public Services	#services
Local Announcements	#announcements

Placeholder-link policy: href="#", href="", and javascript:void(0) are prohibited for navigation. The only permitted exceptions are elements that are demonstrably not real navigation — the map placeholder (§32) and social icons explicitly labeled as demo destinations (§33) — and even these must use a real, inert, keyboard-operable element (e.g.,  with a tooltip/label, or an anchor pointing to a genuine in-page anchor such as #contact) rather than a dead href. Never use a placeholder href to fill a gap in real navigation.

Prefer real anchors for section navigation (Services). Use  only for actual UI actions (open modal, submit, filter, toggle).

8. Sticky Navbar

Desktop: logo/icon, brand name, Home, Services, Complaints, Track Status, Announcements, About, Contact, and a "File a Complaint" CTA.

Mobile: logo + hamburger button.

Hamburger button must:

Open and close the menu
Toggle aria-expanded
Be keyboard accessible
Close on Escape
Close when a nav link is selected
Close on outside click

On scroll: add a subtle navbar shadow; maintain readability; never cover section headings (account for navbar height in scroll-margin/anchor offset).

Use IntersectionObserver to update the active nav item to match the section currently in view. Reflect this both visually and via aria-current="true" (or aria-current="page", applied consistently) on the active link.

9. Accessibility-First Navigation
Semantic  with an accessible label (e.g., aria-label="Main navigation")
Keyboard navigation for all controls
Visible focus indicators
aria-expanded on the hamburger toggle
aria-controls linking the toggle to the mobile menu element
aria-current on the active nav link, updated as the user scrolls

Keyboard behavior: Tab moves between controls; Enter/Space activates them; Escape closes the mobile menu or an open modal. No keyboard traps, except the intentional, managed focus trap inside an open modal.

10. Hero Section

Headline: "Your Voice. Your City. One Platform."

Supporting text: "Report civic issues, track complaints, access public service information, and stay connected with your community — all from one place."

CTA 1: "File a Complaint" → scrolls to #complaints

CTA 2: "Track Complaint" → scrolls to #track-status

Tagline: "Making communities better, one complaint at a time."

Include a civic-themed visual or illustration that supports the message (not meaningless decoration) — e.g., a simple SVG dashboard/report illustration.

Mobile: stack content vertically, keep buttons reachable and full-width or comfortably sized, prevent overflow, preserve hierarchy.

11. Quick Actions

Four clickable cards directly below the hero:

Card	Destination
File a Complaint	#complaints
Track Complaint	#track-status
Public Services	#services
Local Announcements	#announcements

Each card is clickable, keyboard-focusable, and visually interactive on hover/focus. If the whole card is a single click target, implement it as an anchor ( wrapping the card content) rather than a non-semantic clickable 

.

12. Services

Section: #services Title: "How Can We Help?" Subtitle: "Quickly report and find information about common civic services."

Service cards (8): Road Maintenance, Water Supply, Waste Management, Electricity & Streetlights, Public Safety, Sanitation, Drainage & Flooding, Public Infrastructure.

Each card includes: icon, service name, description, and a working "Report Issue" action (and optionally "Learn More").

"Report Issue" behavior (exact sequence):

Smoothly scroll to #complaints
Pre-select the mapped category in the complaint form
Move keyboard focus to the next appropriate field (typically Location or Description)
Visually indicate the pre-selected category (e.g., highlighted select, confirmation microcopy)
No page reload

Category mapping:

Service Card	Complaint Category
Road Maintenance	Road & Transportation
Water Supply	Water Supply
Waste Management	Waste Management
Electricity & Streetlights	Electricity or Streetlight
Public Safety	Public Safety
Sanitation	Sanitation
Drainage & Flooding	Drainage
Public Infrastructure	Other

If "Learn More" is included, it opens a real information modal (via the shared modal system) with a short, genuinely informative description of that service category — not filler text.

If a user reaches #complaints directly (via navbar, hero CTA, or Quick Actions) rather than through a service card, the category field starts unselected with its default "Select a category" option — do not carry over a stale selection from a previous interaction.

13. Complaint Form

Section: #complaints Title: "Report a Civic Issue" Subtitle: "Help improve your community by reporting a problem."

Fields:

Full Name (required)
Email or Phone Number (required)
Complaint Category (required, select)
Location (required)
Description (required)
Upload Image (optional)

Category options: Road & Transportation, Water Supply, Waste Management, Electricity, Streetlight, Public Safety, Sanitation, Drainage, Other.

Every field has a real, associated . Required fields are marked both visually (e.g., asterisk) and programmatically (required, aria-required="true" where useful).

14. Complaint Form Validation

Rules:

Name: not empty
Contact: valid email format or valid phone format (accept either)
Category: must be selected
Location: not empty
Description: must contain meaningful text (define "meaningful" as a minimum length, e.g., ≥ 10 characters after trimming whitespace, to block trivial input like "a" or spaces-only)

When validation runs: on submit for all fields; additionally on blur for a field once the user has interacted with it (so errors clear/appear responsively, not just at submit time).

Error display: inline, next to the relevant field; understandable, plain-language; never relies on color alone; never uses alert().

Exact error copy:

"Please enter your name."
"Please enter a valid email address or phone number."
"Please select a complaint category."
"Please enter the issue location."
"Please provide a meaningful description."

On validation failure: preserve all user-entered data in every field (do not clear valid fields because another field failed); move focus to the first invalid field; no page reload.

15. Complaint Submission

On successful submission:

Generate a unique complaint ID (format: CC-2026-#####, e.g., CC-2026-48291)
Save the complaint to LocalStorage
Store submission date/time
Store status as "Pending"
Show a success modal
Display within the modal: Complaint ID, Category, Location, Submission date, Current status

Success modal title: "Complaint Submitted Successfully!" Message: "Your complaint has been registered successfully." Instruction: "Please save this ID to track the progress of your complaint."

Buttons:

"Track This Complaint" →

Close modal
Scroll to #track-status
Pre-fill the tracking input with the generated ID
Move focus to the tracking input (or search button, if the search auto-triggers)
Optionally auto-trigger the search

"Submit Another Complaint" →

Close modal
Reset the complaint form (all fields, including category and image)
Clear all validation messages
Return focus to the first form field (Full Name)
16. Complaint ID Generation

Format: CC-2026-##### (5-digit numeric suffix, e.g., CC-2026-48291).

Before assigning a new ID, check it against all IDs already present in LocalStorage (including the three demo complaints) and regenerate on collision. Store complaint data as a structured JSON array of objects (not string concatenation).

17. Image Upload

Frontend-demo only; no backend, no external transmission.

On file selection:

Validate file type (accept common image types: .jpg, .jpeg, .png, .webp, .gif); reject others with an inline, non-alert error message
Validate file size (define an explicit demo ceiling, e.g., 5 MB); reject oversized files with a clear inline message rather than failing silently
Display the selected filename
Show a thumbnail preview
Allow removing or replacing the selected image before submit

Persistence: do not store full image binaries in LocalStorage. If any trace is persisted with the complaint record, store only lightweight metadata (e.g., filename) — never a full base64 image blob.

18. Modal System

One reusable, accessible modal component used for: complaint success, announcement details, and service details ("Learn More").

Requirements:

Visible backdrop
Visible close button
Escape key closes the modal
Backdrop click closes the modal (where appropriate — not for flows where accidental dismissal would lose critical info, though for this project's modals dismissal is safe)
Fully keyboard operable
Focus moves into the modal on open (to the modal container or first focusable element)
Focus returns to the triggering element on close
Background content is inert while the modal is open (prevent tabbing/interacting with content behind it)
role="dialog" and aria-modal="true"
An accessible title, referenced via aria-labelledby
Fits and is fully usable on small mobile screens (no clipped content, scrollable body if needed)
19. Complaint Tracking

Section: #track-status Title: "Track Your Complaint" Subtitle: "Enter your complaint ID to see the latest status."

Includes: complaint ID input, Search button, and a Clear/reset control.

Example placeholder text: CC-2026-48291

Search checks both LocalStorage complaints and the three predefined demo complaints. No page reload.

20. Demo Complaints

Prepopulated (fixed, not user-editable) records, clearly labeled "DEMO DATA" wherever shown:

ID	Category	Location	Status
CC-2026-10001	Road & Transportation	Main Road	In Progress
CC-2026-10002	Water Supply	Ward 5	Pending
CC-2026-10003	Streetlight	Community Park	Resolved

All three IDs must return valid tracking results.

21. Tracking Result

On a successful lookup, display: Complaint ID, Category, Location, Date submitted, Current status, Description, and a progress timeline.

Status descriptions (exact copy):

Pending → "Complaint received and waiting for review."
In Progress → "The responsible department is currently working on the issue."
Resolved → "The reported issue has been addressed."

Timeline stages: Submitted → Under Review → In Progress → Resolved. Highlight the current stage using icon + text + color together (never color alone).

Not found: "Complaint ID not found. Please check the ID and try again." Empty input: "Please enter a complaint ID."

In both error cases, move focus to the tracking input (or to the inline error message associated with it) so screen reader users hear it immediately.

22. Tracking States

The tracking component must visibly support each of these states, never displaying stale content from a previous state:

Initial: instructional copy (not an empty box) explaining what to do
Loading: a brief, lightweight loading indicator if the lookup isn't instantaneous
Success: the full result (§21)
Not found: the clear error message (§21)
Reset: clearing the input/result and returning to Initial

A new search always fully replaces the previous result — no stacking or leftover stale content.

23. Announcements

Section: #announcements Title: "Latest Announcements"

Demo announcements (3):

Title	Category	Description
Water Supply Maintenance	Utilities	"Scheduled maintenance may temporarily affect water supply in selected areas."
Road Improvement Project	Infrastructure	"Road improvement work has started in several local areas."
Community Clean-Up Campaign	Community	"Join the upcoming community cleanliness campaign and help keep our neighborhoods clean."

Each card shows: Category, Date, Title, Description (truncated/summary), and a "Read More" action.

24. Announcement Filtering

Filters: All, Infrastructure, Utilities, Community.

Requirements:

Filters instantly, no reload
Active filter is visually distinct
Keyboard accessible
aria-pressed (or aria-current, used consistently) reflects the active filter
Zero-result state shows a clear "no announcements in this category" message rather than an empty blank area

Every "Read More" button works (§25).

25. Announcement Details Modal

"Read More" opens the shared modal system (§18) showing: Category, Date, Title, full Description, and a close control. No separate page.

26. Community Impact

Title: "Our Community Impact"

Counters:

1,200+ Complaints Resolved
50+ Areas Covered
5,000+ Citizens Registered
92% Resolution Rate

Animate counters once using IntersectionObserver, triggered the first time the section enters the viewport (do not re-trigger on subsequent scrolls in/out). Respect prefers-reduced-motion: if set, show final values immediately without a counting animation.

27. How It Works

Four steps:

01 — Report — "Tell us about the civic issue."
02 — Review — "The complaint is reviewed by the responsible authority."
03 — Resolve — "The issue is assigned and addressed."
04 — Track — "Citizens can monitor the progress until resolution."

Desktop: horizontal layout with a connecting line/arrows. Mobile: vertical stacked layout.

28. About

Section: #about Title: "About CivicConnect"

Body: "CivicConnect is a concept platform designed to make communication between citizens and local authorities easier and more transparent."

Mission: "Our mission is to make civic services more accessible, transparent, and citizen-friendly."

Values: Transparency, Accessibility, Community Participation.

Clearly restate that this is a student project/concept platform.

29. FAQ

Accessible accordion with these questions:

What is CivicConnect?
How do I submit a complaint?
How can I track my complaint?
What types of issues can I report?
Is my complaint information stored?
Can I submit a complaint anonymously?

Requirements: each item opens/closes with an appropriate transition; aria-expanded updates on the trigger button; the button is associated with its answer panel (aria-controls + matching id, or equivalent); fully keyboard operable; single-open behavior is consistent (opening one closes any other open item) — apply this rule uniformly and state it in the README as an intentional design choice.

Use real 

 elements as accordion triggers, never a clickable 

.

30. Contact

Section: #contact Title: "Get in Touch"

Form fields: Name, Email, Subject, Message, and a "Send Message" submit button.

Validate all required fields; no page reload on submit.

On success: show "Your message has been sent successfully." via a toast or inline success notification (not alert()); reset the form afterward.

31. Demo Contact Information

Display (clearly labeled "Demo / project contact details"):

Name: CivicConnect Community Office
Phone: +977-XXX-XXXXXXX (use a real placeholder-format number consistent with a Nepal phone format, wired to a functional tel: link)
Email: hello@civicconnect.demo (wired to a functional mailto: link)

Do not imply these are real official government contacts.

32. Map Area

A visually polished map placeholder — no Google Maps API, no key, no backend required.

This element should not pretend to be a working interactive map. Acceptable implementations: a static styled graphic representing "coverage area," or a button/link that navigates to the #contact section for location-related inquiries. If implemented as a clickable element with no real geographic destination, use a  (not a bare href="#") with a clear accessible label describing what it does (e.g., "View contact section for location details").

33. Social Links

Include icons for Facebook, Instagram, X/Twitter, and LinkedIn. Every icon is a real, clickable, keyboard-focusable element.

Since this is a prototype with no real official accounts, clearly label the group as demo/placeholder links (e.g., a small "(demo links)" caption near the icon row). Do not point to unrelated real third-party accounts. Acceptable approaches:

Link to each platform's real homepage (e.g., https://facebook.com) with an accessible label clarifying it's a demo destination, or
Use  elements that open a small toast/tooltip stating "Social integration is a demo placeholder for this prototype."

Pick one approach and apply it consistently across all four icons.

34. Footer

Professional multi-column footer:

Column 1: Logo + short CivicConnect description.

Column 2 — Quick Links:

Link	Destination
Home	#home
Services	#services
Complaints	#complaints
Track Status	#track-status
About	#about
Contact	#contact

Column 3 — Services: Road Maintenance, Water Supply, Waste Management, Electricity, Sanitation. Each link navigates to #services and, where practical, highlights/scrolls-to the matching service card (reuse the highlight behavior from §12).

Column 4 — Contact: Phone (tel: link), Email (mailto: link), and Location — since there is no dedicated location section, the Location item links to #contact, where the demo office info lives.

Bottom bar:

"© 2026 CivicConnect. Student Project — Concept Platform." "Designed to connect citizens with their communities."

Repeat the project disclaimer from the top of this document in the footer.

35. Button & Interaction Contract

Every interactive element has exactly one clearly defined purpose. Reference table:

Element	Action
File a Complaint	→ #complaints
Track Complaint	→ #track-status
Public Services	→ #services
Local Announcements	→ #announcements
Track This Complaint (modal)	→ #track-status, pre-filled
Submit Another Complaint (modal)	reset form
Read More	open announcement modal
FAQ trigger	expand/collapse
Search (tracking)	search complaints
Send Message	validate + submit + success
Modal close (×)	close modal
Hamburger	open/close mobile nav
Filter buttons	filter announcements
Clear (tracking)	reset tracking component

Every  inside a 

 has an explicit type attribute: type="submit" only for the actual submit action; type="button" for everything else (this prevents accidental implicit submission).

36. Zero Dead Interactions — QA Checklist

This is the binding acceptance checklist for interactivity. Before delivering the project, confirm every item:

 Every  has a real, meaningful destination
 Every 

 has a bound event handler that does something observable
 Every form has a submit handler that prevents default reload and processes input
 Every modal has working open, close (×, Escape, backdrop), and focus-management logic
 Every filter control actually filters the visible content
 Every FAQ item opens and closes correctly
 Mobile menu opens, closes, and updates aria-expanded correctly
 Every card-level action (service cards, quick action cards) works
 Every CTA (hero, quick actions) works
 Every footer link works
 Every service "Report Issue" action pre-selects the right category and moves focus correctly
 Every tracking action (search, clear, all 3 demo IDs, a newly generated ID) works
 Every reset action (form reset, tracking reset) fully clears the relevant state

No visual control should exist that does not do something. This checklist is referenced again, with implementation-level detail, in §55.

37. Responsive Design

Verify correct rendering at: 320px, 375px, 480px, 768px, 1024px, 1280px, and 1440px+.

Use CSS Grid and Flexbox (no framework grid system).

Mobile: hamburger nav, single-column forms, responsive cards, stacked hero, stacked process steps, responsive modals, responsive footer, properly sized tap targets, no clipped content.

Tablet: balanced 2-column layouts where it makes sense; avoid excessive whitespace; navigation stays usable.

Desktop: multi-column grids, comfortable content width, strong hierarchy, professional spacing.

Non-negotiable: zero horizontal scrolling at any tested width. Explicitly test long text, long complaint descriptions, large buttons, modals, and navigation at the narrowest widths.

38. Touch UX
Comfortable tap targets (minimum ~44×44px)
Adequate spacing between adjacent controls
Forms are easy to complete on a touchscreen
Modal close buttons are easy to tap
Navigation is easy to operate by touch
No functionality that depends solely on :hover (every hover-revealed affordance must also work on focus/tap)
39. Accessibility

Follow WCAG-oriented practices throughout:

Semantic HTML5, proper heading hierarchy (single h1, logical nesting after)
 for every input
Accessible, descriptively-labeled buttons
Meaningful alt text on informative images; empty alt="" on purely decorative ones
Full keyboard navigation
Visible focus states on all interactive elements
Sufficient color contrast (WCAG AA minimum)
ARIA used only where semantic HTML is insufficient
Status/result text exposed to screen readers via appropriate live regions
Error messages programmatically associated with their fields (aria-describedby)

Never rely solely on color, hover, animation, or an icon without an accompanying text/accessible label.

Live regions: use aria-live="polite" for informational updates (search results appearing, filter results updating, success toasts) and aria-live="assertive" only for validation errors and failure states that need immediate announcement.

Respect prefers-reduced-motion throughout, not just for the counters.

40. Form Accessibility

Every input has: a , an appropriate name, a matching id, the correct type, required where applicable, and accessible validation feedback.

On error: identify the invalid field visually and programmatically; show understandable error text; associate the error with the field via aria-describedby; move focus to the first invalid field; never clear valid input in other fields because one field failed.

41. Animation

Use subtle, professional animation for: fade-in, slide-up, button transitions, card hover, modal transitions, FAQ expansion, counter animation, navbar transition, and mobile menu transition.

Keep every animation fast, smooth, subtle, and purposeful — never decorative for its own sake. Respect prefers-reduced-motion (reduce or remove non-essential motion when set).

42. Toast Notifications

One reusable toast system supporting Success, Error, Warning, and Information variants.

Requirements: accessible (appropriate aria-live region per §39), visually clear, non-blocking, auto-dismisses after a reasonable delay, also manually dismissible, mobile responsive, and never permanently covers important controls.

Never use alert(), confirm(), or prompt() anywhere in the project.

43. LocalStorage Architecture

Store complaint records under a single structured key, e.g. civicconnect_complaints, as a JSON array of objects.

Handle explicitly:

Missing key (first visit) → initialize as empty array
Corrupted/invalid JSON → catch the parse error, fall back to an empty array, and surface a non-technical toast (see §45) rather than crashing
Empty storage → tracking correctly reports "not found" for any non-demo ID
Reading/merging existing + newly submitted complaints correctly on every tracking search

If LocalStorage is unavailable entirely (e.g., disabled in browser settings, private-mode restrictions in some browsers), fail gracefully: disable/inform on complaint submission with a clear message rather than throwing an uncaught error.

Never store sensitive personal data beyond what the form explicitly collects, and never store full image binaries (§17).

44. Privacy

This is a frontend-only school-project prototype. Do not: send data to external servers, call real government APIs, collect real sensitive information, claim secure government-grade storage, or claim real complaint processing.

State clearly (in the UI and README) that submitted demo information is stored locally in the user's own browser only, and is not transmitted anywhere.

45. Error Handling Reference
Scenario	Message
Complaint form, general	"Please complete all required fields."
Invalid contact	"Please enter a valid email address or phone number."
Missing category	"Please select a complaint category."
Tracking, empty input	"Please enter a complaint ID."
Tracking, not found	"Complaint ID not found. Please check the ID and try again."
Contact form success	"Your message has been sent successfully."
LocalStorage failure	"Demo storage is currently unavailable. Your information could not be saved."
Image, invalid type	e.g., "Please upload a JPG, PNG, WEBP, or GIF image."
Image, too large	e.g., "Image is too large. Please choose a file under 5 MB."

Never expose raw JavaScript errors, stack traces, or console output to the user.

46. Loading States

Provide a lightweight loading indicator wherever an interaction could plausibly feel slow to a user, even if the underlying operation is fast:

Complaint submission
Complaint tracking search
Announcement filtering (only if there's a deliberate small delay for realism; otherwise instant is fine)

Disable the triggering button while processing to prevent duplicate submissions from rapid double-clicks, and restore its normal state once the operation completes (success or error).

47. SEO & Metadata

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://civic8848.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9fad4359-4719-4391-a256-08dc520df17f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
