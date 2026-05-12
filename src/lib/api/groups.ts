import { apiFetch } from '@lib/api/client';
import type { CreateGroupInput, GroupItem } from '@mytypes/group';

function buildQuery(params: { categoryId?: number } = {}): string {
  const searchParams = new URLSearchParams();

  if (params.categoryId !== undefined) {
    searchParams.set('category_id', String(params.categoryId));
  }

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export function getGroups(
  params: { categoryId?: number } = {}
): Promise<{ count: number; items: GroupItem[] }> {
  return apiFetch<{ count: number; items: GroupItem[] }>(
    `/groups${buildQuery(params)}`,
    {
      method: 'GET',
      auth: true,
    }
  );
}

export function createGroup(payload: CreateGroupInput): Promise<GroupItem> {
  return apiFetch<GroupItem>('/groups', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  });
}

export function joinGroup(groupId: number): Promise<GroupItem> {
  return apiFetch<GroupItem>(`/groups/${groupId}/join`, {
    method: 'POST',
    auth: true,
  });
}

export function leaveGroup(groupId: number): Promise<GroupItem> {
  return apiFetch<GroupItem>(`/groups/${groupId}/leave`, {
    method: 'DELETE',
    auth: true,
  });
}

export function deleteGroup(groupId: number): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/groups/${groupId}`, {
    method: 'DELETE',
    auth: true,
  });
}
