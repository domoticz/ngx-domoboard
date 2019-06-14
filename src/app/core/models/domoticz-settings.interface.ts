import { Credentials } from './credentials.interface';

export interface DomoticzSettings {
  ssl: boolean;
  domain: string;
  port: number;
  credentials: Credentials;
  authToken?: string;
}
