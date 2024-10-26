import { MultiErrors } from "./multiErrors.interface";

export interface ResponseMessage<T> {
  success: boolean;
  message?: string;
  error?: T | MultiErrors;
}
