import '@src/NewTab.css';
import '@src/NewTab.scss';
import { withErrorBoundary, withSuspense } from '@extension/shared';

import { SnackbarProvider, useSnackbar } from 'notistack';
import { X } from 'lucide-react';
import { HomePage } from '@src/components/HomePage';

// @ts-ignore
function SnackbarCloseButton({ snackbarKey }) {
  const { closeSnackbar } = useSnackbar();

  return (
    <button onClick={() => closeSnackbar(snackbarKey)}>
      <X color="white" />
    </button>
  );
}

const NewTab = () => {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      action={snackbarKey => <SnackbarCloseButton snackbarKey={snackbarKey} />}>
      <HomePage />
    </SnackbarProvider>
  );
};

export default withErrorBoundary(withSuspense(NewTab, <div>{'loading'}</div>), <div> Error Occur </div>);
