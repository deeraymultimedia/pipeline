/**
 * Confirmed Deeray Multimedia Ltd company information.
 * Used in document templates, footers, and branded outputs.
 * Do not modify without authorisation.
 */
export const COMPANY = {
  name: 'Deeray Multimedia Ltd',
  number: '12586799',
  address: {
    line1: '20–22 Wenlock Road',
    city: 'London',
    country: 'England',
    postcode: 'N1 7GU',
  },
  website: 'deeraymultimedia.co.uk',
  email: {
    sales: 'sales@deeraymultimedia.co.uk',
    support: 'support@deeraymultimedia.co.uk',
  },
  taglines: {
    primary: 'Smarter Solutions. Intelligent Growth.',
    secondary: 'UK-based expertise. Global delivery.',
  },
} as const;

/** GHL sub-account identifier. Never expose in browser bundle. */
export const GHL_SUBACCOUNT_ID = 'RchFyTDETt7hKo5YOG7n';

/** Google Sheets workbook ID. Safe to include as it requires OAuth to access. */
export const SHEETS_WORKBOOK_ID = '16z5P_tLOdbiUfV-kgObuHRtTZNmb3wNeSdAtGbdGsiA';

/** Allowed Google accounts. */
export const ALLOWED_EMAILS: readonly string[] = ['adegisanrin@gmail.com'];

/** Google OAuth client ID (public — safe in frontend bundle). */
export const GOOGLE_CLIENT_ID =
  '1021401833054-kj021cr7g7tqbmpjmbtar2heu1kblao6.apps.googleusercontent.com';

/** Sheet tab names. */
export const SHEET_NAMES = {
  opportunities: 'Opportunities',
  activity: 'Activity',
} as const;
