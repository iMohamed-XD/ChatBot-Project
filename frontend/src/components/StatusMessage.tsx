type StatusMessageProps = {
  status: string;
  error: string;
};

function StatusMessage({ status, error }: StatusMessageProps) {
  return (
    <>
      {status && (
        <p className="rounded bg-amber-100 p-3 text-sm text-amber-800">
          {status}
        </p>
      )}

      {error && (
        <p className="rounded bg-red-100 p-3 text-sm text-red-800">{error}</p>
      )}
    </>
  );
}

export default StatusMessage;
