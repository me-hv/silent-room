type FormErrorProps = {
  message?: string;
};

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <p className="rounded-md border border-red-900/50 bg-red-950/20 px-3 py-2 text-sm text-red-300">
      {message}
    </p>
  );
}
