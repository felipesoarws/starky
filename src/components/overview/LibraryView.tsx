const LibraryView = () => {
  return (
    <div className="animate-fade-in text-center py-20">
      <h2 className="text-3xl font-bold text-white mb-4">
        Biblioteca Comunitária
      </h2>
      <p className="text-zinc-400 mb-8">
        Baixe decks prontos criados pela comunidade Starky.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-left opacity-50">
          <h3 className="font-bold text-white">JavaScript Basics</h3>
          <p className="text-sm text-zinc-500">Em desenvolvimento...</p>
        </div>
      </div>
    </div>
  );
};

export default LibraryView;
