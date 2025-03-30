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
import { Diagnosis, HealthCheckRating, PatientEntryFormValues } from '../../types';

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

const AddPatientEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(
    HealthCheckRating.Healthy,
  );
  const [diagnosisCodes, setDiagnosisCodes] = useState<Array<Diagnosis['code']>>([]);
  const [selectedDiagnosisCodes, setSelectedDiagnosisCodes] = useState<Array<Diagnosis['code']>>(
    [],
  );

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

  const addPatientEntry = (event: SyntheticEvent) => {
    event.preventDefault();

    const healthCheckEntry: PatientEntryFormValues = {
      date,
      description,
      specialist,
      diagnosisCodes: selectedDiagnosisCodes,
      type: 'HealthCheck',
      healthCheckRating,
    };
    console.debug('healthCheckEntry:', healthCheckEntry);
    onSubmit(healthCheckEntry);
  };

  return (
    <div>
      <form onSubmit={addPatientEntry}>
        <TextField
          label="Date"
          placeholder="YYYY-MM-DD"
          fullWidth
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />
        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        <TextField
          label="Specialist"
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />

        <InputLabel style={{ marginTop: 20 }}>Diagnosis Codes</InputLabel>
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

        <InputLabel style={{ marginTop: 20 }}>Health Check Rating</InputLabel>
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

        <Grid>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: 'left' }}
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
