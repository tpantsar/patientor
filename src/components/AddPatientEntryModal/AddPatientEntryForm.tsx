import {
  Button,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';

import { SyntheticEvent, useEffect, useState } from 'react';

import diagnoseService from '../../services/diagnoses';
import {
  BaseEntryWithoutId,
  Diagnosis,
  Entry,
  HealthCheckRating,
  PatientEntryFormValues,
} from '../../types';
import { assertNever } from '../../utils';

interface Props {
  onSubmit: (values: PatientEntryFormValues) => void;
  onCancel: () => void;
}

interface HealthCheckRatingOption {
  value: HealthCheckRating;
  label: string;
}

const healthCheckRatingOptions: HealthCheckRatingOption[] = Object.values(HealthCheckRating)
  .filter((v): v is HealthCheckRating => typeof v === 'number')
  .map((v) => ({
    value: v,
    label: v.toString(),
  }));

const typeOptions: { value: string; label: string }[] = [
  { value: 'HealthCheck', label: 'Health Check' },
  { value: 'OccupationalHealthcare', label: 'Occupational Healthcare' },
  { value: 'Hospital', label: 'Hospital' },
];

const AddPatientEntryForm = ({ onSubmit, onCancel }: Props) => {
  // BaseEntry
  const [date, setDate] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [specialist, setSpecialist] = useState<string>('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<Array<Diagnosis['code']>>([]);
  const [selectedDiagnosisCodes, setSelectedDiagnosisCodes] = useState<Array<Diagnosis['code']>>(
    [],
  );

  // Type of the patient entry
  const [type, setType] = useState<Entry['type']>('HealthCheck');

  // HealthCheckEntry
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(
    HealthCheckRating.Healthy,
  );

  // HospitalEntry
  const [dischargeDate, setDischargeDate] = useState<string>('');
  const [dischargeCriteria, setDischargeCriteria] = useState<string>('');

  // OccupationalHealthcareEntry
  const [employerName, setEmployerName] = useState<string>('');
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState<string>('');
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState<string>('');

  console.debug('diagnosisCodes:', diagnosisCodes);
  console.debug('selectedDiagnosisCodes:', selectedDiagnosisCodes);
  console.debug('healthCheckRating:', healthCheckRating);

  // Fetch the diagnoses list
  useEffect(() => {
    const fetchDiagnoses = async () => {
      const diagnoses = await diagnoseService.getAllDiagnoses();
      diagnoses.sort((a, b) => a.code.localeCompare(b.code));
      setDiagnosisCodes(diagnoses.map((d) => d.code));
    };
    void fetchDiagnoses();
  }, []);

  const handleTypeChange = (event: SelectChangeEvent<typeof type>) => {
    event.preventDefault();
    const value = String(event.target.value);
    setType(value as 'HealthCheck' | 'OccupationalHealthcare' | 'Hospital');
  };

  const handleHealthCheckRatingChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();

    const value = Number(event.target.value); // Convert string to number
    if (Object.values(HealthCheckRating).includes(value)) {
      setHealthCheckRating(value as HealthCheckRating);
    }
  };

  const handleDiagnosisCodeChange = (event: SelectChangeEvent<typeof selectedDiagnosisCodes>) => {
    const {
      target: { value },
    } = event;
    setSelectedDiagnosisCodes(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const createPatientEntry = (type: Entry['type']): PatientEntryFormValues => {
    const baseEntry: BaseEntryWithoutId = {
      date,
      description,
      specialist,
      diagnosisCodes: selectedDiagnosisCodes,
    };

    switch (type) {
      case 'HealthCheck':
        return { ...baseEntry, type: 'HealthCheck', healthCheckRating };
      case 'OccupationalHealthcare':
        return {
          ...baseEntry,
          type: 'OccupationalHealthcare',
          employerName,
          ...(sickLeaveStartDate && sickLeaveEndDate
            ? { sickLeave: { startDate: sickLeaveStartDate, endDate: sickLeaveEndDate } }
            : {}),
        };
      case 'Hospital':
        return {
          ...baseEntry,
          type: 'Hospital',
          discharge: { date: dischargeDate, criteria: dischargeCriteria },
        };
      default:
        return assertNever(type);
    }
  };

  const addPatientEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    const patientEntry: PatientEntryFormValues = createPatientEntry(type);
    console.debug('patientEntry:', patientEntry);
    onSubmit(patientEntry);
  };

  return (
    <div>
      <form onSubmit={addPatientEntry}>
        <InputLabel required>Type</InputLabel>
        <Select label="Type" fullWidth value={type} onChange={handleTypeChange}>
          {typeOptions.map((option) => (
            <MenuItem key={option.label} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>

        <TextField
          style={{ marginTop: 10 }}
          label="Date"
          placeholder="YYYY-MM-DD"
          fullWidth
          required
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />
        <TextField
          style={{ marginTop: 10 }}
          label="Description"
          fullWidth
          required
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        <TextField
          style={{ marginTop: 10 }}
          label="Specialist"
          fullWidth
          required
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />

        <InputLabel style={{ marginTop: 10 }}>Diagnosis Codes</InputLabel>
        <Select
          label="Diagnosis codes"
          id="diagnosis-codes"
          fullWidth
          multiple
          value={selectedDiagnosisCodes}
          onChange={handleDiagnosisCodeChange}
          input={<OutlinedInput label="Diagnosis codes" />}
        >
          {diagnosisCodes.map((code) => (
            <MenuItem key={code} value={code}>
              {code}
            </MenuItem>
          ))}
        </Select>

        {/* Show health check rating if type is HealthCheck */}
        {type === 'HealthCheck' && (
          <>
            <InputLabel required style={{ marginTop: 10 }}>
              Health Check Rating
            </InputLabel>
            <Select
              label="HealthCheckRating"
              fullWidth
              value={healthCheckRating.toString()}
              onChange={handleHealthCheckRatingChange}
            >
              {healthCheckRatingOptions.map((option) => (
                <MenuItem key={option.label} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </>
        )}

        {/* Show discharge if type is Hospital */}
        {type === 'Hospital' && (
          <>
            <TextField
              style={{ marginTop: 10 }}
              label="Discharge Date"
              placeholder="YYYY-MM-DD"
              fullWidth
              required
              value={dischargeDate}
              onChange={({ target }) => setDischargeDate(target.value)}
            />
            <TextField
              style={{ marginTop: 10 }}
              label="Discharge Criteria"
              fullWidth
              required
              value={dischargeCriteria}
              onChange={({ target }) => setDischargeCriteria(target.value)}
            />
          </>
        )}

        {/* Show employer name and sick leave if type is OccupationalHealthcare */}
        {type === 'OccupationalHealthcare' && (
          <>
            <TextField
              style={{ marginTop: 10 }}
              label="Employer Name"
              fullWidth
              required
              value={employerName}
              onChange={({ target }) => setEmployerName(target.value)}
            />
            {/* Add sick leave fields here if needed */}
            <TextField
              style={{ marginTop: 10 }}
              label="Sick Leave Start Date"
              placeholder="YYYY-MM-DD"
              fullWidth
              value={sickLeaveStartDate}
              onChange={({ target }) => setSickLeaveStartDate(target.value)}
            />
            <TextField
              style={{ marginTop: 10 }}
              label="Sick Leave End Date"
              placeholder="YYYY-MM-DD"
              fullWidth
              value={sickLeaveEndDate}
              onChange={({ target }) => setSickLeaveEndDate(target.value)}
            />
          </>
        )}

        <Grid>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: 'left', marginTop: 10 }}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{
                float: 'right',
                marginTop: 10,
              }}
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddPatientEntryForm;
