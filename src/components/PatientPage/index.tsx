import { Button } from '@mui/material';
import axios from 'axios';

import { useEffect, useState } from 'react';

import patientService from '../../services/patients';
import { Diagnosis, Patient, PatientEntryFormValues } from '../../types';
import AddPatientEntryModal from '../AddPatientEntryModal';
import PatientEntry from './PatientEntry';

interface PatientPageProps {
  id: string | undefined;
  diagnoses: Diagnosis[];
}

const PatientPage = ({ id, diagnoses }: PatientPageProps) => {
  // Patient with sensitive information (SSN, entries, etc.)
  const [patient, setPatient] = useState<Patient>();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  // Fetch individual patient data when the patient ID changes or the component mounts
  useEffect(() => {
    if (id) {
      const fetchPatient = async () => {
        const patient = await patientService.getPatient(id);
        setPatient(patient);
      };
      void fetchPatient();
    }
  }, [id]);

  if (patient === null || patient === undefined) {
    return <div>No patient information found</div>;
  }

  console.log('patient:', patient);

  const submitNewPatientEntry = async (newEntry: PatientEntryFormValues) => {
    try {
      console.debug('Submitting new patient entry:', newEntry);
      console.debug('Patient ID:', patient.id);
      const addedEntry = await patientService.createPatientEntry(patient.id, newEntry);
      const patientWithNewEntry: Patient = {
        ...patient,
        entries: patient.entries.concat(addedEntry),
      };
      console.debug('Updated patient with new entry:', patientWithNewEntry);
      setPatient(patientWithNewEntry);
      setModalOpen(false);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const errorResponse = e?.response;
        const errorObj = errorResponse?.data.error[0];

        if (errorResponse?.data && typeof errorResponse?.data === 'string') {
          const message = errorResponse.data.replace('Something went wrong. Error: ', '');
          console.error(message);
          setError(message);
        } else {
          const message = errorObj.message;
          const status = errorResponse?.status;
          const path = errorObj.path;

          console.log('Error path:', path);
          const errorMsg = path ? `${path}: ${message}` : `Error: ${message}`;
          console.log(errorMsg, status, e);
          setError(errorMsg);
        }
      } else {
        console.error('Unknown error', e);
        setError('Unknown error');
      }
    }
  };

  return (
    <div>
      <h2>
        {patient.name} ({patient.ssn})
      </h2>
      <p>Born: {patient.dateOfBirth}</p>
      <p>Gender: {patient.gender}</p>
      <p>Occupation: {patient.occupation}</p>
      <h3>Entries: {patient.entries.length}</h3>
      <AddPatientEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewPatientEntry}
        error={error}
        onClose={closeModal}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Entry
      </Button>
      <div>
        {patient.entries.map((entry) => (
          <PatientEntry key={entry.id} entry={entry} diagnoses={diagnoses} />
        ))}
      </div>
    </div>
  );
};

export default PatientPage;
