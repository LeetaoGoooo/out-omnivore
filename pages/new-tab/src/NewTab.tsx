import '@src/NewTab.css';
import '@src/NewTab.scss';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';

import { SnackbarProvider, useSnackbar } from 'notistack';
import { X } from 'lucide-react';
import { HomePage } from '@src/components/HomePage';
import { useMemo } from 'react';
import { pocketCodeStorage } from '@extension/storage/lib/impl/pocketStorage';
import AuthedPage from '@src/components/AuthedPage';

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
  const pocketStorage = useStorage(pocketCodeStorage);
  const authed = useMemo(() => {
    return pocketStorage.state;
  }, [pocketStorage.state]);

  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      action={snackbarKey => <SnackbarCloseButton snackbarKey={snackbarKey} />}>
      {authed ? <AuthedPage /> : <HomePage />}
    </SnackbarProvider>
  );
};

export default withErrorBoundary(withSuspense(NewTab, <div>{'loading'}</div>), <div> Error Occur </div>);
