/**
 * Client entity — PLACEHOLDER TYPES ONLY
 *
 * UNRESOLVED CONTROLLED DATA-MODELLING DECISION:
 * A stable Client entity does not yet exist in the system.
 * The document system MUST remain disabled until stable ClientIds exist.
 *
 * Open questions that must be resolved before live client records are created:
 *   1. Is a separate Clients worksheet required, or is client ID derived
 *      from a canonical opportunity per client?
 *   2. Are "Senig Consulting" and "Senig Law & Probate" one client
 *      (two opportunities) or two separate clients?
 *   3. What is the stable client identifier? (Not display name, not email,
 *      not opportunity ID.)
 *
 * Do not assume any of these are resolved until separately authorised.
 */

import type { ClientId } from './branded';

export interface Client {
  client_id: ClientId;
  display_name: string;
  primary_email: string;
  primary_phone: string;
  created_at: string;
  updated_at: string;
  notes: string;
}

/**
 * Marker interface — documents and the document system cannot be activated
 * until this resolution is confirmed.
 */
export interface ClientEntityResolution {
  resolved: false;
  blockedReason: 'CLIENT_ENTITY_STRATEGY_UNRESOLVED';
  openQuestions: [
    'SENIG_ENTITY_RELATIONSHIP',
    'STABLE_CLIENT_ID_STRATEGY',
    'CLIENTS_WORKSHEET_DECISION',
  ];
}
