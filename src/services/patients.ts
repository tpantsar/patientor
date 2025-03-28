import axios from 'axios';
import { Patient, PatientFormValues } from '../types';

import { apiBaseUrl } from '../constants';

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

export default {
  getAllPatients,
  getPatient,
  createPatient,
};
