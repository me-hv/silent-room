"use client";

import { useEffect, useMemo, useState } from "react";
import { Library } from "lucide-react";
import { AudioFileDTO } from "@/lib/types";
import { FileCard } from "@/components/files/file-card";
import { LibraryFilters, SearchFilters } from "@/components/files/search-filters";
import { EmptyState } from "@/components/ui/empty-state";

const defaultFilters: LibraryFilters = {
  query: "",
  category: "",
  genre: "",
  mood: "",
  favoriteOnly: true,
  sort: "newest",
};

function filterFavorites(files: AudioFileDTO[], filters: LibraryFilters) {
  const query = filters.query.trim().toLowerCase();

  return files
    .filter((file) => {
      const searchable = [file.title, file.category, file.genre, file.mood, ...file.tags]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        file.isFavorite &&
        (!query || searchable.includes(query)) &&
        (!filters.category || file.category === filters.category) &&
        (!filters.genre || file.genre === filters.genre) &&
        (!filters.mood || file.mood === filters.mood)
      );
    })
    .sort((a, b) => {
      if (filters.sort === "name") return a.title.localeCompare(b.title);
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return filters.sort === "oldest" ? aTime - bTime : bTime - aTime;
    });
}

export default function FavoritesPage() {
  const [files, setFiles] = useState<AudioFileDTO[]>([]);
  const [filters, setFilters] = useState<LibraryFilters>(defaultFilters);
  const [isLoading, setIsLoading] = useState(true);

  async function loadFiles() {
    const response = await fetch("/api/files");
    if (response.ok) {
      const result = await response.json();
      setFiles(result.files || []);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    let cancelled = false;

    fetch("/api/files")
      .then((response) => (response.ok ? response.json() : { files: [] }))
      .then((result) => {
        if (cancelled) return;
        setFiles(result.files || []);
        setIsLoading(false);
      })
      .catch(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const favoriteFiles = useMemo(() => files.filter((file) => file.isFavorite), [files]);
  const genres = useMemo(() => Array.from(new Set(favoriteFiles.map((file) => file.genre).filter(Boolean))) as string[], [favoriteFiles]);
  const moods = useMemo(() => Array.from(new Set(favoriteFiles.map((file) => file.mood).filter(Boolean))) as string[], [favoriteFiles]);
  const filteredFiles = useMemo(() => filterFavorites(files, filters), [files, filters]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-white">Favorites</h1>
        <p className="mt-2 text-sm text-muted">The files you want closest to the session.</p>
      </div>

      <SearchFilters
        filters={filters}
        onFiltersChange={setFilters}
        genres={genres}
        moods={moods}
        showFavoriteToggle={false}
      />

      <div className="mt-6">
        {isLoading ? (
          <p className="rounded-md border border-line bg-panel p-6 text-sm text-muted">Loading favorites...</p>
        ) : favoriteFiles.length === 0 ? (
          <EmptyState
            title="No favorites yet"
            description="Star files in your library and they will appear here."
            action={{ href: "/library", label: "Browse library", icon: <Library className="size-4" /> }}
          />
        ) : filteredFiles.length === 0 ? (
          <EmptyState
            title="No search results found"
            description="Try another favorite file search or filter."
            action={{ href: "/library", label: "Browse library", icon: <Library className="size-4" /> }}
          />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {filteredFiles.map((file) => (
              <FileCard key={file.id} file={file} onChanged={loadFiles} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
