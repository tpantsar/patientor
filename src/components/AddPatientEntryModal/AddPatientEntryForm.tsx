import { SyntheticEvent, useState } from 'react';

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

  const onHealthCheckRatingChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();

    const value = Number(event.target.value); // Convert string to number
    if (Object.values(HealthCheckRating).includes(value)) {
      setHealthCheckRating(value as HealthCheckRating);
    }
  };

  const addPatientEntry = (event: SyntheticEvent) => {
    event.preventDefault();

    const newEntry: PatientEntryFormValues = {
      date,
      type: 'HealthCheck',
      description,
      specialist,
      diagnosisCodes,
      healthCheckRating,
    };
    onSubmit(newEntry);

    // Reset form fields after submission
    setDate('');
    setDescription('');
    setSpecialist('');
    setHealthCheckRating(HealthCheckRating.Healthy);
    setDiagnosisCodes([]);
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
          fullWidth
          multiple
          value={diagnosisCodes}
          onChange={({ target }) => {
            const { value } = target;
            setDiagnosisCodes(typeof value === 'string' ? value.split(',') : value);
          }}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return 'Select diagnosis codes';
            }
            return selected.join(', ');
          }}
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
          onChange={onHealthCheckRatingChange}
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
