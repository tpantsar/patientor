import axios from 'axios';
import { Diagnosis } from '../types';

import { apiBaseUrl } from '../constants';

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
