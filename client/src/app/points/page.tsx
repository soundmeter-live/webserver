import Link from 'next/link';
import Points from './_components/Points';

export const metadata = {
  title: 'table view - soundmeter',
};


export default function PointsPage() {
  return (
    <>
      <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-center space-x-2 p-6 text-center text-3xl">
            <div className="t">SoundMeter</div>
            <div className="text-lg">-</div>
            <div className="text-lg text-zinc-400">table view</div>
          </div>
        <div className="flex-1 p-2">
          <Points />
        </div>
        <div className="h-8"></div>
      </div>
    </>
  );
}
