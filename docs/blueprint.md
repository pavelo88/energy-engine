# **App Name**: AssetTrack AI

## Core Features:

- Admin Dashboard: Centralized dashboard for administrators with different views based on user roles (Admin, Gerente, Inspector).
- CMS Editor: Admin panel to update website content including hero sections, services, and public stats.
- Asset Inspection Form: Form to allow for inputting the conditions of an asset, GPS coords and attachment of photos, following defined validation rules.
- Offline Data Sync: Black box system ensuring reports are stored locally when offline and synchronized when online with data compression, retries, and batching. A tool notifies when sync failures occur, prioritizing important reports.
- Inspection Report PDF Generator: Generates detailed, professional PDF reports of field inspections using data from the form, photos and firma url from the technician user profile.
- Predictive Maintenance Suggestions: AI powered module to suggest upcoming maintenace based on technician's assessment reports
- User role claims: Allow specification of user role so security rules in firestore can be respected and only give certain users (e.g. only admins) the privilege of editing data.

## Style Guidelines:

- Primary color: Deep slate (#2E294E), offering a sense of industry with some warmth.
- Background color: Very light gray (#F0F0F2), a softer complement to the slate color scheme.
- Accent color: Vibrant purple (#9F7AEA), a bright highlight that fits thematically.
- Body font: 'Inter', a versatile grotesque-style sans-serif suitable for body text.
- Headline font: 'Space Grotesk', a sans-serif providing a techy and slightly futuristic touch.
- Use clean and precise icons, sourced from Lucide, representing different asset categories and maintenance actions.
- Responsive sidebar with a collapsing feature for desktop and a hamburger menu on mobile for ease of navigation. Grid-based layout for content organization.
- Subtle transitions and animations to indicate changes in status (e.g., syncing, saving) and to guide the user through inspection flows.