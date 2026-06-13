"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fileCategories, metadataSchema, type MetadataInput } from "@/lib/validations";

type FormValues = MetadataInput & {
  file: FileList;
};

export function UploadForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      title: "",
      category: "beat",
      genre: "",
      mood: "",
      bpm: "",
      musicalKey: "",
      tags: "",
      notes: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setError("");
    setIsSubmitting(true);

    const parsed = metadataSchema.safeParse(values);
    const selectedFile = values.file?.[0];

    if (!selectedFile) {
      setError("Choose an audio or project file.");
      setIsSubmitting(false);
      return;
    }

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Check the upload details.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    Object.entries(parsed.data).forEach(([key, value]) => {
      formData.append(key, value === undefined ? "" : String(value));
    });

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(result.error || "Upload failed.");
      setIsSubmitting(false);
      return;
    }

    reset();
    router.push("/library");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl rounded-md border border-line bg-panel p-5">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-medium text-neutral-300">File</span>
          <Input
            type="file"
            accept=".mp3,.wav,.flac,.aac,.m4a,.zip,.flp,.als,.rpp"
            {...register("file", { required: true })}
            className="pt-2"
          />
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium text-neutral-300">Title</span>
          <Input placeholder="Late night drums" {...register("title", { required: true })} />
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium text-neutral-300">Type</span>
          <Select {...register("category", { required: true })}>
            {fileCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium text-neutral-300">Genre</span>
          <Input placeholder="ambient, trap, house..." {...register("genre")} />
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium text-neutral-300">Mood</span>
          <Input placeholder="dark, warm, cinematic..." {...register("mood")} />
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium text-neutral-300">BPM</span>
          <Input type="number" min="1" max="400" placeholder="Optional" {...register("bpm")} />
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium text-neutral-300">Key</span>
          <Input placeholder="F minor" {...register("musicalKey")} />
        </label>
        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-medium text-neutral-300">Tags</span>
          <Input placeholder="drums, idea, mix-v2" {...register("tags")} />
        </label>
        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-medium text-neutral-300">Notes</span>
          <Textarea placeholder="Session notes, arrangement ideas, mix feedback..." {...register("notes")} />
        </label>
      </div>

      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

      <div className="mt-6 flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          <Upload className="size-4" />
          {isSubmitting ? "Uploading..." : "Upload file"}
        </Button>
      </div>
    </form>
  );
}
