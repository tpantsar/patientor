import { Alert, Dialog, DialogContent, DialogTitle, Divider } from '@mui/material';

import { PatientFormValues } from '../../types';
import AddPatientEntryForm from './AddPatientEntryForm';

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: PatientFormValues) => void;
  error?: string;
}

const AddPatientEntryModal = ({ modalOpen, onClose, onSubmit, error }: Props) => (
  <Dialog fullWidth={true} open={modalOpen} onClose={() => onClose()}>
    <DialogTitle>New Entry</DialogTitle>
    <Divider />
    <DialogContent>
      {error && <Alert severity="error">{error}</Alert>}
      <AddPatientEntryForm onSubmit={onSubmit} onCancel={onClose} />
    </DialogContent>
  </Dialog>
);

export default AddPatientEntryModal;
