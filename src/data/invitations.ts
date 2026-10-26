// Mock invitations behind the personal booking link (app.govizmo.de/u/einladung/<token>).
// Clara Richter is the applicant shown as "Eingeladen" in the landlord's list.

export type Invitation = {
  token: string;
  listingSlug: string;
  applicant: { salutation: "Frau" | "Herr" | "Keine Angabe"; firstName: string; lastName: string; email: string; phone: string };
  invitedMinutesAgo: number;
  validHours: number;
  deposit: number;
};

export const invitations: Invitation[] = [
  {
    token: "cr-8f3k2m",
    listingSlug: "gneisenaustrasse-41",
    applicant: { salutation: "Frau", firstName: "Clara", lastName: "Richter", email: "clara.richter@posteo.de", phone: "0157 39284716" },
    invitedMinutesAgo: 19 * 60,
    validHours: 72,
    deposit: 25,
  },
];

export const getInvitation = (token: string) => invitations.find((invitation) => invitation.token === token);
export const invitationPath = (invitation: Invitation) => `/u/einladung/${invitation.token}`;
