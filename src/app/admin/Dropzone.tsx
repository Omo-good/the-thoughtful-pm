/** Image drop zone for the back office. Shows the current image, or a prompt, and takes a file on click or drop. */
export function Dropzone({ src, name, empty, wide = false }: { src: string | null; name: string; empty: string; wide?: boolean }) {
  return (
    <label className={`flex cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden border-[1.5px] border-dashed border-[rgba(154,107,47,0.5)] bg-[#FAF7F0] text-[13px] ${wide ? "h-[150px]" : "h-[170px]"}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <span className="text-[#5C5244]">{empty}</span>
      )}
      <input type="file" name={name} accept="image/*" className="sr-only" />
      <span className="sr-only">Choose an image file</span>
    </label>
  );
}
