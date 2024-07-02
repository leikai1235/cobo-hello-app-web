export interface RequestOptions extends RequestInit {
  params?: string | Record<string, any>;
  data?: Object;
}

interface RequestHandler {
  errorHandler?: (res: Response, data: any) => void;
  beforeRequest?: (options: RequestOptions) => RequestOptions;
  afterResponse?: <T>(data: T) => T;
}

export const baseRequest = async <T>(
  url: string,
  _options: RequestOptions = {},
  handler: RequestHandler = {},
): Promise<T | undefined> => {
  const { errorHandler, beforeRequest, afterResponse } = handler;

  function _beforeRequest(options: RequestOptions) {
    return {
      ...options,
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      body: options.data ? JSON.stringify(options.data) : undefined,
    };
  }

  const options = _beforeRequest(
    beforeRequest ? beforeRequest(_options) : _options,
  );

  let query = "";
  if (options.params && Object.keys(options.params).length > 0)
    query = "?" + new URLSearchParams(options.params).toString();

  try {
    const response: Response = await fetch(
      process.env.NEXT_PUBLIC_API_BASE + url + query,
      options,
    );
    const data = await response.json();

    if (!response.ok && errorHandler) errorHandler(response, data);

    return afterResponse ? afterResponse(data) : data;
  } catch (error: any) {
    console.log("request failed: " + error);
  }
};
