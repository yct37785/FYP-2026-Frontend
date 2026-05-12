export interface GroupItem {
  id: number;
  ownerId: number;
  ownerName: string;
  categoryId: number | null;
  categoryName: string | null;
  name: string;
  description: string;
  memberCount: number;
  isMember: boolean;
  isOwner: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGroupInput {
  name: string;
  description: string;
  categoryId?: number | null;
}
