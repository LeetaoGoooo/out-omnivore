import '@src/NewTab.css';
import '@src/NewTab.scss';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { AuthButton } from '@src/components/AuthPage';
// @ts-ignore
import omnivore from '@assets/omnivore.svg';
// @ts-ignore
import pocket from '@assets/pocket.svg';

const NewTab = () => {
  return (
    <div
      className="flex items-center justify-center w-full flex-col"
      style={{
        height: '100vh',
      }}>
      <div className="flex items-center w-full justify-center h-full  gap-4">
        <img src={omnivore} alt="omnivore" className="w-[64px] h-[64px]" />
        <img src={pocket} alt="pocket" className="w-[64px] h-[64px]" />
      </div>
      <div className="flex items-center w-full justify-between">
        <AuthButton />
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(NewTab, <div>{'loading'}</div>), <div> Error Occur </div>);
