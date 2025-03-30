import { Button } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import patientService from '../../services/patients';
import { Diagnosis, Patient, PatientEntryFormValues } from '../../types';
import AddPatientEntryModal from '../AddPatientEntryModal';

/**
 * Helper function for exhaustive type checking
 */
const assertNever = (entry: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(entry)}`);
};

interface EntryProps {
  entry: Patient['entries'][number];
  diagnoses: Diagnosis[];
}

const Entry = ({ entry, diagnoses }: EntryProps) => {
  const getDiagnosisDescription = (code: string) => {
    const diagnosis = diagnoses.find((d) => d.code === code);
    return diagnosis ? diagnosis.name : code;
  };

  const renderDiagnosisCodes = () => {
    if (entry.diagnosisCodes) {
      return (
        <div>
          <p>Diagnosis codes:</p>
          <ul>
            {entry.diagnosisCodes.map((code) => (
              <li key={code}>
                <b>{code}:</b> {getDiagnosisDescription(code)}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return <div>No diagnoses</div>;
  };

  const renderEntryDetails = () => {
    switch (entry.type) {
      case 'HealthCheck':
        return (
          <div>
            <p>Health Check Rating: {entry.healthCheckRating}</p>
          </div>
        );
      case 'Hospital':
        return (
          <div>
            <p>Discharge Date: {entry.discharge.date}</p>
            <p>Discharge Criteria: {entry.discharge.criteria}</p>
          </div>
        );
      case 'OccupationalHealthcare':
        return (
          <div>
            <h4>Employer: {entry.employerName}</h4>
            {entry.sickLeave && (
              <div>
                <p>Sick Leave Start: {entry.sickLeave.startDate}</p>
                <p>Sick Leave End: {entry.sickLeave.endDate}</p>
              </div>
            )}
          </div>
        );
      default:
        return assertNever(entry);
    }
  };
  if (!entry) {
    return <div>No entry information found</div>;
  }

  return (
    <div className="patient-entry">
      <p>Date: {entry.date}</p>
      <p>{entry.description}</p>
      <h4>Specialist: {entry.specialist}</h4>
      {renderEntryDetails()}
      {renderDiagnosisCodes()}
    </div>
  );
};

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
      const addedEntry = await patientService.createPatientEntry(patient.id, newEntry);
      const patientWithNewEntry: Patient = {
        ...patient,
        entries: patient.entries.concat(addedEntry),
      };
      setPatient(patientWithNewEntry);
      setModalOpen(false);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === 'string') {
          const message = e.response.data.replace('Something went wrong. Error: ', '');
          console.error(message);
          setError(message);
        } else {
          const message = e.response?.data.error[0].message;
          const status = e.response?.status;
          const errorMsg = `${status}: ${message}`;
          console.log(errorMsg, e);
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
          <Entry key={entry.id} entry={entry} diagnoses={diagnoses} />
        ))}
      </div>
    </div>
  );
};

export default PatientPage;
