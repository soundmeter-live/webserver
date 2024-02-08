export {};

type ErrUtil = (code: number, error: unknown, log?: unknown) => void;

declare global {
  namespace Express {
    export interface Response {
      err: ErrUtil;
    }
  }
}
