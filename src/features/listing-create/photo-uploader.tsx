"use client";

import { ImagePlus, Trash } from "lucide-react";
import { useId, useState, type DragEvent } from "react";
import { cx } from "@/lib/cx";
import { rooms, type Photo, type Room } from "./draft";

// Photo upload for listing photos (shown to applicants, first one is the cover) and
// reference photos (private, tagged by room). Files stay in the browser (object URLs).

const suggestedRooms: Room[] = ["Wohnzimmer", "Küche", "Bad", "Schlafzimmer", "Flur", "Balkon"];

type PhotoUploaderProps = {
  photos: Photo[];
  onChange: (photos: Photo[]) => void;
  mode: "listing" | "reference";
  hint: string;
};

export function PhotoUploader({ photos, onChange, mode, hint }: PhotoUploaderProps) {
  const inputId = useId();
  const [dragging, setDragging] = useState(false);

  function addFiles(files: FileList | null) {
    if (!files) return;
    const images = [...files].filter((file) => file.type.startsWith("image/"));
    const used = new Set(photos.map((photo) => photo.room));
    const next = images.map((file, index) => {
      const room = suggestedRooms.find((r) => !used.has(r)) ?? "Sonstiges";
      used.add(room);
      return { id: `${Date.now()}-${index}-${file.name}`, url: URL.createObjectURL(file), name: file.name, room };
    });
    onChange([...photos, ...next]);
  }

  function remove(id: string) {
    const photo = photos.find((p) => p.id === id);
    if (photo) URL.revokeObjectURL(photo.url);
    onChange(photos.filter((p) => p.id !== id));
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    addFiles(event.dataTransfer.files);
  }

  return (
    <div className="flex flex-col gap-3">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {photos.map((photo, index) => (
          <li key={photo.id} className="overflow-hidden rounded-card border border-line bg-white">
            <div className="relative aspect-[4/3] bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview */}
              <img
                src={photo.url}
                alt={mode === "listing" ? `Inseratsfoto ${index + 1}` : `Zustandsfoto ${index + 1}: ${photo.room}`}
                className="size-full object-cover"
              />
              {mode === "listing" && index === 0 && (
                <span className="absolute top-2 left-2 rounded-full bg-night px-2 py-0.5 text-small font-medium text-white">
                  Titelbild
                </span>
              )}
              <button
                type="button"
                onClick={() => remove(photo.id)}
                aria-label={`Foto ${index + 1} entfernen`}
                className="absolute top-2 right-2 inline-flex size-8 items-center justify-center rounded-button bg-white text-night shadow-overlay hover:bg-mist"
              >
                <Trash aria-hidden className="size-4" />
              </button>
            </div>
            {mode === "reference" && (
              <div className="p-2">
                <label className="sr-only" htmlFor={`${photo.id}-room`}>
                  Raum für Foto {index + 1}
                </label>
                <select
                  id={`${photo.id}-room`}
                  value={photo.room}
                  onChange={(event) =>
                    onChange(photos.map((p) => (p.id === photo.id ? { ...p, room: event.target.value as Room } : p)))
                  }
                  className="h-8 w-full rounded-input border border-line bg-white px-2 text-body text-night hover:border-gray"
                >
                  {rooms.map((room) => (
                    <option key={room}>{room}</option>
                  ))}
                </select>
              </div>
            )}
          </li>
        ))}
        <li>
          <label
            htmlFor={inputId}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={cx(
              "flex h-full min-h-36 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-card border-2 border-dashed p-4 text-center transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-blue",
              dragging ? "border-blue bg-mist" : "border-line bg-surface hover:border-gray",
            )}
          >
            <ImagePlus aria-hidden className="size-6 text-deep-blue" />
            <span className="font-medium text-night">{photos.length ? "Weitere Fotos" : "Fotos hinzufügen"}</span>
            <span className="text-small text-slate">Auswählen oder hierher ziehen</span>
            <input
              id={inputId}
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(event) => {
                addFiles(event.target.files);
                event.target.value = "";
              }}
            />
          </label>
        </li>
      </ul>
      <p className="text-small text-slate">{hint}</p>
    </div>
  );
}
