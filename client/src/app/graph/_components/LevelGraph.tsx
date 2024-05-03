'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { DateTimePicker } from '@mantine/dates';

import { useGraphQuery } from '@/query';
import { GET_LEVEL_POINTS_BETWEEN_DATES } from '@/gql/queries';

import GraphPanel from './GraphPanel';
import QueryLoadingState from '@/components/QueryLoadingState';
import { usePathname } from 'next/navigation';

const REFRESH_RATE_MS = 8000;
const TEXT_DEBOUNCE_MS = 800;
const GRAPH_OFFSET = 60;
const MAX_ATTEMPTS = 5;

const LevelGraph = () => {
  // DATE INPUTS
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [timereq, setTimereq] = useState({ start: '', end: '' });
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const s = parseInt(q.get('start')!);
    const e = parseInt(q.get('end')!);
    if (s && e) {
      setStartTime(new Date(s));
      setEndTime(new Date(e));
    } else {
      setEndTime(new Date());
    }
  }, []);
  // on change...
  const pathname = usePathname();
  useEffect(() => {
    // update url if applicable
    if (timereq.end) {
      const q = new URLSearchParams();
      q.set('start', '' + (startTime?.valueOf() ?? ''));
      q.set('end', '' + (endTime?.valueOf() ?? ''));
      const path = `${pathname}?${q.toString()}`;
      window.history.replaceState(
        { ...window.history.state, as: path, url: path },
        '',
        path,
      );
    }

    // debounce for api request
    const tm = setTimeout(() => {
      setTimereq({
        start: '' + startTime?.valueOf(),
        end: '' + endTime?.valueOf(),
      });
    }, TEXT_DEBOUNCE_MS);
    return () => clearTimeout(tm);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, endTime]);

  // QUERY
  const { data, error, isError, isPending, isFetching } = useGraphQuery(
    GET_LEVEL_POINTS_BETWEEN_DATES,
    timereq,
    {
      refetchInterval: REFRESH_RATE_MS,
      retry: (attempts) => attempts < MAX_ATTEMPTS,
    },
  );
  if (isError) console.log(error);
  const gdata = useMemo(
    () =>
      data?.levelPointsBetweenDates?.map((it) => ({
        x: new Date(parseInt(it.timeAt)),
        y: it.value - GRAPH_OFFSET,
      })),
    [data],
  );

  return (
    <>
      <QueryLoadingState {...{ isPending, isFetching, isError }} />

      <div className="container mx-auto flex flex-col gap-4">
        <div className="flex flex-col justify-center gap-6 rounded-xl bg-zinc-800 p-4 sm:flex-row">
          <DateTimePicker
            label="start date"
            placeholder="Pick date"
            firstDayOfWeek={0}
            weekendDays={[]}
            value={startTime}
            onChange={setStartTime}
            valueFormat="MM/DD/YYYY h:mm A"
            className="min-w-[16rem]"
          />
          <DateTimePicker
            label="end date"
            placeholder="Pick date"
            firstDayOfWeek={0}
            weekendDays={[]}
            value={endTime}
            onChange={setEndTime}
            valueFormat="MM/DD/YYYY h:mm A"
            className="min-w-[16rem]"
          />
        </div>
        <div className="h-96 rounded-xl bg-zinc-800">
          <GraphPanel data={gdata} />
        </div>
      </div>
    </>
  );
};
export default LevelGraph;
