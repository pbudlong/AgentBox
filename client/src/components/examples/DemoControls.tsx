import DemoControls from '../DemoControls';
import { useState } from 'react';

export default function DemoControlsExample() {
  const [status, setStatus] = useState<'collecting' | 'approved' | 'declined' | 'scheduled'>('collecting');
  const [isRunning, setIsRunning] = useState(false);

  return (
    <DemoControls
      onStart={() => {
        console.log('Start demo triggered');
        setIsRunning(true);
        setTimeout(() => setIsRunning(false), 2000);
      }}
      onReset={() => {
        console.log('Reset triggered');
        setStatus('collecting');
        setIsRunning(false);
      }}
      threadStatus={status}
      isRunning={isRunning}
    />
  );
}
