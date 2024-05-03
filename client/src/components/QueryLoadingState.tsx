const QueryLoadingState = ({
  isPending,
  isFetching,
  isError,
}: {
  isPending: boolean;
  isFetching: boolean;
  isError: boolean;
}) => {
  return (
    <>
      {/* loading state */}
      <div className="fixed right-4 top-4 text-right text-sm opacity-80">
        {isPending && (
          <div className="text-amber-500">waiting for initial load</div>
        )}
        {isError && <div className="text-red-500">request failed</div>}
        {isFetching && <div className="text-amber-300">(loading data)</div>}
      </div>
    </>
  );
};
export default QueryLoadingState;
