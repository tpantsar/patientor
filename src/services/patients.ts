import axios from 'axios';

import { apiBaseUrl } from '../constants';
import { Entry, Patient, PatientEntryFormValues, PatientFormValues } from '../types';

const getAllPatients = async () => {
  const { data } = await axios.get<Patient[]>(`${apiBaseUrl}/patients`);
  return data;
};

const getPatient = async (id: string) => {
  const { data } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
  return data;
};

const createPatient = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(`${apiBaseUrl}/patients`, object);
  return data;
};

const createPatientEntry = async (id: string, object: PatientEntryFormValues) => {
  const { data } = await axios.post<Entry>(`${apiBaseUrl}/patients/${id}/entries`, object);
  return data;
};

export default {
  getAllPatients,
  getPatient,
  createPatient,
  createPatientEntry,
};
