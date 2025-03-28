import { Button, Container, Divider, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, Route, Routes, useMatch } from 'react-router-dom';

import { apiBaseUrl } from './constants';
import { Patient } from './types';

import PatientListPage from './components/PatientListPage';
import PatientPage from './components/PatientPage';
import patientService from './services/patients';

const App = () => {
  // Patients with non-sensitive information
  const [patients, setPatients] = useState<Patient[]>([]);

  // Patient with sensitive information
  // This is the patient that is shown when the user clicks on a patient in the list
  const [patient, setPatient] = useState<Patient | null>(null);

  // Fetch the patient list and ping the server on initial load
  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      const patients = await patientService.getAllPatients();
      setPatients(patients);
    };
    void fetchPatientList();
  }, []);

  const patientMatch = useMatch('/patients/:id');
  const individualPatient = patientMatch
    ? patients.find((p) => p.id === patientMatch.params.id)
    : null;

  // Fetch individual patient data when the route changes
  useEffect(() => {
    if (individualPatient) {
      const fetchPatient = async () => {
        const patient = await patientService.getPatient(individualPatient.id);
        setPatient(patient);
      };
      void fetchPatient();
    }
  }, [individualPatient]);

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
          <Route path="/patients/:id" element={<PatientPage patient={patient} />} />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
