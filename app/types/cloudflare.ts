export type CloudflareContext = {
  cloudflare: {
    env: Env;
    ctx: ExecutionContext;
  };
};

export type LoaderArgsWithParams = {
  request: Request;
  context: CloudflareContext;
  params: Record<string, string>;
};

export type ActionArgsWithParams = {
  request: Request;
  context: CloudflareContext;
  params: Record<string, string>;
};

export type LoaderArgs = {
  request: Request;
  context: CloudflareContext;
};

export type ActionArgs = {
  request: Request;
  context: CloudflareContext;
};
