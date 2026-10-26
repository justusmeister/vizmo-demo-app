"use client";

import { Camera, ImagePlus, Trash } from "lucide-react";
import { useId, useRef, useState, type DragEvent } from "react";
import { cx } from "@/lib/cx";
import { rooms, type Photo, type Room } from "./draft";

// Reference photos for the damage comparison. Files stay in the browser (object URLs).

const suggestedRooms: Room[] = ["Wohnzimmer", "Küche", "Bad", "Schlafzimmer", "Flur", "Balkon"];

type PhotoUploaderProps = { photos: Photo[]; onChange: (photos: Photo[]) => void };

export function PhotoUploader({ photos, onChange }: PhotoUploaderProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
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
    <div className="flex flex-col gap-4">
      <label
        htmlFor={inputId}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cx(
          "flex cursor-pointer flex-col items-center gap-2 rounded-card border-2 border-dashed px-4 py-7 text-center transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-blue",
          dragging ? "border-blue bg-mist" : "border-line bg-surface hover:border-gray",
        )}
      >
        <ImagePlus aria-hidden className="size-6 text-deep-blue" />
        <span className="font-medium text-night">Fotos auswählen oder hierher ziehen</span>
        <span className="text-small text-slate">JPG, PNG oder HEIC, je Raum ein Foto aus der Türperspektive</span>
        <input
          ref={inputRef}
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

      {photos.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((photo, index) => (
            <li key={photo.id} className="overflow-hidden rounded-card border border-line bg-white">
              <div className="relative aspect-[4/3] bg-surface">
                {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview */}
                <img src={photo.url} alt={`Zustandsfoto ${index + 1}: ${photo.room}`} className="size-full object-cover" />
                <button
                  type="button"
                  onClick={() => remove(photo.id)}
                  aria-label={`Foto ${index + 1} entfernen`}
                  className="absolute top-2 right-2 inline-flex size-8 items-center justify-center rounded-button bg-white text-night shadow-overlay hover:bg-mist"
                >
                  <Trash aria-hidden className="size-4" />
                </button>
              </div>
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
            </li>
          ))}
        </ul>
      )}

      <p className="flex items-start gap-2 text-small text-slate">
        <Camera aria-hidden className="mt-px size-4 shrink-0" />
        Bei Tageslicht, Türen offen, ganze Raumansicht. Diese Fotos sieht nur vizmo, sie erscheinen nicht im Inserat.
      </p>
    </div>
  );
}
