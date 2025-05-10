export interface Membership {
  membershipType: string;
  borrowLimit: number;
  durationInDays: number;
  price?: number | undefined;
  description?: string;
  isFamilyPlan: boolean;
  maxFamilyMembers?: number | undefined;
  requiresApproval: boolean;
}
