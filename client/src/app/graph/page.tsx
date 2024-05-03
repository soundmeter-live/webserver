import Link from 'next/link';

import LevelGraph from './_components/LevelGraph';
import MUIProvider from './_components/MUIProvider';

export const metadata = {
  title: 'graph view - soundmeter',
};

export default function GraphPage() {
  return (
    <>
      <MUIProvider>
        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-center space-x-2 p-6 text-center text-3xl">
            <div className="t">SoundMeter</div>
            <div className="text-lg">-</div>
            <div className="text-lg text-zinc-400">graph view</div>
          </div>
          <div className="flex-1 p-2">
            <LevelGraph />
          </div>
          <div className="h-8"></div>
        </div>
      </MUIProvider>
    </>
  );
}
