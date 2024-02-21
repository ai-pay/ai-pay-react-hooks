import { AiPayClient, SessionData, SessionStatus } from "ai-pay";
import { useEffect, useState } from "react";

export function useSessionData(): SessionData {
  const [session, setSession] = useState<SessionData>({
    sessionState: "UNANSWERED",
    browserExtensionInstalled: false,
  });
  
  useEffect(() => {
    return AiPayClient
      .getInstance()
      .subscribeToSessionState((session) => setSession({...session}));
  }, [setSession]);
  
  return session;
}
  
export function useSessionState(): SessionStatus {
  const [status, setStatus] = useState<SessionStatus>("UNANSWERED");
  
  useEffect(() => {
    return AiPayClient
      .getInstance()
      .subscribeToSessionState((session) => setStatus(session.sessionState));
  }, [setStatus]);
  
  return status;
}
  
export function useIsBrowserExtensionInstalled(): boolean {
  const [installed, setInstalled] = useState<boolean>(false);
  
  useEffect(() => {
    return AiPayClient
      .getInstance()
      .subscribeToSessionState((session) => setInstalled(session.browserExtensionInstalled));
  }, [setInstalled]);
  
  return installed;
}
  
export function useSessionId(): string | undefined {
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    return AiPayClient
      .getInstance()
      .subscribeToSessionState((session) => setSessionId(session.sessionId));
  }, [setSessionId]);
  
  return sessionId;
}