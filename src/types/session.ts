export interface ErrorMessage {
  message: string;
}

export interface SessionType {
  errors: ErrorMessage[];
  token: string | null;
}
