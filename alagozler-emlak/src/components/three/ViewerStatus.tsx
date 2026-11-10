export default function ViewerStatus({ error = false }: { error?: boolean }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[#050914] p-6 text-center" role={error ? "alert" : "status"}>
      <div className="max-w-sm space-y-3">
        <p className="text-sm text-slate-200">{error ? "3D bina modeli gösterilemedi." : "3D bina modeli yükleniyor…"}</p>
        {error && <>
          <p className="text-sm leading-6 text-slate-400">Model dosyası yüklenememiş veya tarayıcınızda WebGL kullanılamıyor olabilir. Bağlantınızı kontrol edip tekrar deneyin.</p>
          <button className="rounded border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-slate-300" onClick={() => window.location.reload()}>Yeniden dene</button>
        </>}
      </div>
    </div>
  );
}
