import { useCallback, useEffect, useState } from "react";
import { getAuthInfo } from "../utils/auth-storage";
import { getUserById } from "../api/users";
import type { User } from "../types/user";

export function useMyInfo() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchMyInfo = useCallback(async () => {
    const auth = getAuthInfo();

    if (!auth) {
      setUser(null);
      return;
    }

    try {
      setLoading(true);
      const data = await getUserById(auth.userId);
      setUser(data);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchMyInfo();
  }, [fetchMyInfo]);

  return {
    user,
    loading,
    error,
    refetch: fetchMyInfo,
  };
}
