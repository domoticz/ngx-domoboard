import { Credentials } from './credentials.interface';

export interface DomoticzSettings {
  ssl: boolean;
  ip: string;
  port: number;
  credentials: Credentials;
}
