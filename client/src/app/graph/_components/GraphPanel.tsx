import { LineChart, type LineSeriesType } from '@mui/x-charts';

const GRAPH_PROPS: Partial<LineSeriesType> = {
  area: true,
  curve: 'linear',
  color: '#0284c7',
  showMark: false,
};

const GraphPanel = ({ data }: { data?: { x: Date; y: number }[] }) => {
  return (
    data && (
      <>
        <LineChart
          xAxis={[{ data: data.map(({ x }) => x), scaleType: 'time' }]}
          // yAxis={[{ scaleType: 'log' }]}
          series={[{ data: data.map(({ y }) => y), ...GRAPH_PROPS }]}
          grid={{ vertical: true, horizontal: true }}
          skipAnimation
        />
      </>
    )
  );
};
export default GraphPanel;
