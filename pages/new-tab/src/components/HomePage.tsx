import omnivore from '@src/assets/omnivore.svg';
import pocket from '@src/assets/pocket.svg';
import { MessageType } from '@extension/shared/lib/message/message';
import { Shield, Lock } from 'lucide-react';
import { useSnackbar, VariantType } from 'notistack';
import { useEffect } from 'react';

export const HomePage = () => {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    async function listener(request: {
      type: MessageType;
      spaceId: string;
      moduleId: string;
      payload: string;
      variantType?: VariantType;
    }) {
      if (request.type == MessageType.SNACKBAR_MESSAGE) {
        const snackbarMessage = request.payload;
        const variantType = request.variantType;
        enqueueSnackbar(snackbarMessage, { variant: variantType ?? 'default' });
      }
    }

    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, [enqueueSnackbar]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center gap-4 mb-6">
            {/* App icons/logos */}
            <div className="p-3 rounded-xl">
              <div className="w-12 h-12  rounded-lg flex items-center justify-center">
                <img src={omnivore} alt="omnivore" />
              </div>
            </div>
            <div className="p-3 rounded-xl">
              <div className="w-12 h-12  rounded-lg flex items-center justify-center">
                <img src={pocket} alt="pocket" />
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">Authorization Required</h1>
          <p className="text-gray-600 mb-6">Please authorize to connect this service</p>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-3">
            <Lock className="w-5 h-5 text-gray-500" />
            <div className="text-sm text-gray-600">Secure connection will be established</div>
          </div>

          <button
            onClick={() => {
              chrome.runtime.sendMessage({
                type: MessageType.POCKET_AUTH,
              });
            }}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
            <Shield className="w-5 h-5" />
            Authorize Connection
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">You can revoke this authorization at any time</p>
        </div>
      </div>
    </div>
  );
};
