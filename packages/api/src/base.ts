import ky, { HTTPError, type KyInstance } from "ky";

import { accessTokenAtom, tokenStore } from "./token/store";

type KyInstances = { auth: KyInstance; api: KyInstance; refresh: () => void };

type RefreshOptions<T = string, M extends "get" | "post" = "get" | "post"> = {
  method: M;
  url: string;
} & (M extends "post" ? { body: () => unknown } : { body: never }) &
  (T extends string ? { getter?: (response: T) => string } : { getter: (response: T) => string });

export function create<T = string>(
  prefixUrl: string,
  refreshOptions: RefreshOptions<T>,
): KyInstances {
  const auth = ky.create({
    prefixUrl,
    retry: 0,
  });

  const refresh = async () => {
    try {
      const { body, getter, method, url } = refreshOptions;

      const options = body ? { json: body() } : undefined;
      const response = await auth[method](url, options).json<T>();

      const accessToken = getter ? getter(response) : (response as string);

      tokenStore.set(accessTokenAtom, accessToken);
    } catch (_error) {
      tokenStore.set(accessTokenAtom, null);
      return ky.stop;
    }
  };

  const api = ky.create({
    prefixUrl,
    retry: {
      limit: 1,
      methods: ["get", "post", "put", "patch", "delete"],
      shouldRetry: ({ error }) => {
        // HTTPError이고 401인 경우만 재시도
        if (error instanceof HTTPError) {
          return error.response?.status === 401;
        }
        // 네트워크 에러 등은 재시도하지 않음
        return false;
      },
    },
    hooks: {
      beforeRequest: [
        async (request) => {
          const accessToken = tokenStore.get(accessTokenAtom);

          if (accessToken) {
            request.headers.set("Authorization", `Bearer ${accessToken}`);
          }
        },
      ],
      beforeRetry: [refresh],
    },
  });

  return { auth, api, refresh };
}
