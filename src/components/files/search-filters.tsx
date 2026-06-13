"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { fileCategories } from "@/lib/validations";

export type LibraryFilters = {
  query: string;
  category: string;
  genre: string;
  mood: string;
  favoriteOnly: boolean;
  sort: "newest" | "oldest" | "name";
};

type SearchFiltersProps = {
  filters: LibraryFilters;
  onFiltersChange: (filters: LibraryFilters) => void;
  genres: string[];
  moods: string[];
  showFavoriteToggle?: boolean;
};

export function SearchFilters({
  filters,
  onFiltersChange,
  genres,
  moods,
  showFavoriteToggle = true,
}: SearchFiltersProps) {
  function update(patch: Partial<LibraryFilters>) {
    onFiltersChange({ ...filters, ...patch });
  }

  return (
    <div className="rounded-md border border-line bg-panel p-4">
      <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
          <Input
            value={filters.query}
            onChange={(event) => update({ query: event.target.value })}
            placeholder="Search title, genre, mood, tags..."
            className="pl-9"
          />
        </label>
        <Select value={filters.category} onChange={(event) => update({ category: event.target.value })}>
          <option value="">All types</option>
          {fileCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
        <Select value={filters.genre} onChange={(event) => update({ genre: event.target.value })}>
          <option value="">All genres</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </Select>
        <Select value={filters.mood} onChange={(event) => update({ mood: event.target.value })}>
          <option value="">All moods</option>
          {moods.map((mood) => (
            <option key={mood} value={mood}>
              {mood}
            </option>
          ))}
        </Select>
        <Select value={filters.sort} onChange={(event) => update({ sort: event.target.value as LibraryFilters["sort"] })}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="name">Name A-Z</option>
        </Select>
      </div>
      {showFavoriteToggle ? (
        <label className="mt-4 flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={filters.favoriteOnly}
            onChange={(event) => update({ favoriteOnly: event.target.checked })}
            className="size-4 accent-white"
          />
          Favorite only
        </label>
      ) : null}
    </div>
  );
}
