import { Button, Container, Divider, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, Route, Routes, useMatch } from 'react-router-dom';

import { apiBaseUrl } from './constants';
import { Diagnosis, Patient } from './types';

import PatientListPage from './components/PatientListPage';
import PatientPage from './components/PatientPage';
import diagnoseService from './services/diagnoses';
import patientService from './services/patients';

const App = () => {
  // Patients with non-sensitive information
  const [patients, setPatients] = useState<Patient[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  // Fetch the patient and diagnoses list, ping the server on initial load
  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      const patients = await patientService.getAllPatients();
      setPatients(patients);
    };
    const fetchDiagnoses = async () => {
      const diagnoses = await diagnoseService.getAllDiagnoses();
      setDiagnoses(diagnoses);
      console.log('diagnoses:', diagnoses);
    };

    void fetchPatientList();
    void fetchDiagnoses();
  }, []);

  const patientMatch = useMatch('/patients/:id');
  const individualPatient = patientMatch
    ? patients.find((p) => p.id === patientMatch.params.id)
    : null;

  return (
    <div className="App">
      <Container>
        <Typography variant="h3" style={{ marginBottom: '0.5em' }}>
          Patientor
        </Typography>
        <Button component={Link} to="/" variant="contained" color="primary">
          Home
        </Button>
        <Divider hidden />
        <Routes>
          <Route
            path="/"
            element={<PatientListPage patients={patients} setPatients={setPatients} />}
          />
          <Route
            path="/patients/:id"
            element={<PatientPage id={individualPatient?.id} diagnoses={diagnoses} />}
          />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
