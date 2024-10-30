import { SessionService } from "../services/session/session.service";

export const useCallbackSession = () => {
  const createSession = SessionService.createSession;
  return { createSession };
};
