export interface AuthTokenResponse {
  access_token?: string;
  token?: string;
  refresh_token?: string;
  access_ttl?: number;
  refresh_ttl?: number;
  role?: string;
  user_id?: string;
  id?: number | string;
  email?: string;
  fullName?: string;
  data?: AuthUser | AuthUser[];
  user?: AuthUser;
}

export type AuthUser = {
  id?: number | string;
  email?: string;
  fullName?: string;
};

export const normalizeAuthUser = (payload: unknown): AuthUser | null => {
  if (!payload) {
    return null;
  }

  // Возможные формы: { user }, { data }, [ { ... } ], либо плоский объект
  const raw =
    (payload as any).user ??
    (payload as any).data ??
    payload ??
    ((payload as any).user_id ? { id: (payload as any).user_id } : null);

  const candidate = Array.isArray(raw) ? raw[0] : raw;
  if (!candidate || typeof candidate !== 'object') {
    return null;
  }

  const id = (candidate as any).id ?? (candidate as any).user_id;
  const email = (candidate as any).email;
  const fullName = (candidate as any).fullName ?? (candidate as any).full_name ?? (candidate as any).name;

  if (id === undefined && !email && !fullName) {
    return null;
  }

  return { id, email, fullName };
};
