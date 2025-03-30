import axios from 'axios';

import { apiBaseUrl } from '../constants';
import { Diagnosis } from '../types';

const getAllDiagnoses = () => {
  return axios
    .get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`)
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error fetching diagnoses:', error);
      throw error;
    });
};

export default {
  getAllDiagnoses,
};
