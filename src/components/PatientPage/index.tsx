import { Patient } from '../../types';

interface EntryProps {
  entry: Patient['entries'][number];
}

const Entry = ({ entry }: EntryProps) => {
  return (
    <div>
      <h4>{entry.date}</h4>
      <p>{entry.description}</p>
      <h4>Specialist: {entry.specialist}</h4>
      <p>Diagnosis codes:</p>
      {entry.diagnosisCodes && (
        <ul>
          {entry.diagnosisCodes.map((code) => (
            <li key={code}>{code}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

interface PatientPageProps {
  patient: Patient | null;
}

const PatientPage = ({ patient }: PatientPageProps) => {
  if (!patient) {
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
      <ul>
        {patient.entries.map((entry) => (
          <Entry key={entry.id} entry={entry} />
        ))}
      </ul>
    </div>
  );
};

export default PatientPage;
