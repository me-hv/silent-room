import { UploadForm } from "@/components/files/upload-form";

export default function UploadPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-white">Upload</h1>
        <p className="mt-2 text-sm text-muted">Add audio, sessions, and project files to your private library.</p>
      </div>
      <UploadForm />
    </div>
  );
}
