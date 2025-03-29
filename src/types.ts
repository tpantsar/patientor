export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

interface SickLeave {
  startDate: string;
  endDate: string;
}

interface Discharge {
  date: string;
  criteria: string;
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export enum HealthCheckRating {
  Healthy = 0,
  LowRisk = 1,
  HighRisk = 2,
  CriticalRisk = 3,
}

// Common properties of all patient page entries
interface BaseEntry {
  id: string;
  date: string;
  description: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}

interface HealthCheckEntry extends BaseEntry {
  type: 'HealthCheck';
  healthCheckRating: HealthCheckRating;
}

interface HospitalEntry extends BaseEntry {
  type: 'Hospital';
  discharge: Discharge;
}

interface OccupationalHealthcareEntry extends BaseEntry {
  type: 'OccupationalHealthcare';
  employerName: string;
  sickLeave?: SickLeave;
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: string;
  occupation: string;
  entries: Entry[];
}

export type Entry = HospitalEntry | OccupationalHealthcareEntry | HealthCheckEntry;

export type PatientFormValues = Omit<Patient, 'id' | 'entries'>;

// Define special omit for unions
type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;

// Define patient entry without the 'id' property
export type PatientEntryFormValues = UnionOmit<Entry, 'id'>;
