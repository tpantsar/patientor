import { Diagnosis, Patient } from '../../types';

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
  patient: Patient | null;
  diagnoses: Diagnosis[];
}

const PatientPage = ({ patient, diagnoses }: PatientPageProps) => {
  if (patient === null || patient === undefined) {
    return <div>No patient information found</div>;
  }

  return (
    <div>
      <h2>
        {patient.name} ({patient.ssn})
      </h2>
      <p>Born: {patient.dateOfBirth}</p>
      <p>Gender: {patient.gender}</p>
      <p>Occupation: {patient.occupation}</p>
      <h3>Entries: {patient.entries.length}</h3>
      <div>
        {patient.entries.map((entry) => (
          <Entry key={entry.id} entry={entry} diagnoses={diagnoses} />
        ))}
      </div>
    </div>
  );
};

export default PatientPage;
