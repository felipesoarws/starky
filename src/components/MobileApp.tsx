import { Construction } from "lucide-react";

const MobileApp = () => {
  return (
    <section className="py-24 px-10 border-y border-zinc-800 bg-zinc-900/50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-500/20 bg-yellow-500/10 mb-6">
            <Construction className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-medium text-yellow-500">
              App Mobile em Desenvolvimento
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">
            Estude em qualquer lugar, <br /> em breve.
          </h2>
          <p className="text-lg text-zinc-400 mb-10 max-w-md mx-auto md:mx-0">
            Estamos construindo a experiência mobile definitiva. Sincronize seus
            decks entre computador e celular.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              disabled
              className="opacity-50 cursor-not-allowed flex items-center justify-center gap-3 bg-zinc-800 text-zinc-400 px-5 py-3 rounded-xl border border-zinc-700"
            >
              <svg
                className="w-6 h-6 grayscale"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.653 17.522c-.628 1.05-1.577 2.14-2.612 2.14-.97 0-1.284-.658-2.513-.658-1.258 0-1.63.632-2.576.632-1.07 0-2.18-1.25-2.97-2.615-1.745-3.004-.372-7.56 2.65-7.56 1.134 0 2.016.746 2.578.746.562 0 1.63-.746 2.766-.746.908 0 2.875.313 4.004 1.905-.084.06-2.438 1.63-2.438 4.75 0 3.75 3.065 5.094 3.127 5.125-.018.125-.468 1.812-1.484 3.515h-.53zm-3.375-12.86c.66-.97 1.156-2.28 1.03-3.61-1.22.062-2.593.906-3.31 2.06-.594.908-1.063 2.188-0.908 3.5 1.25.125 2.625-.905 3.188-1.95z" />
              </svg>
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold leading-none tracking-wider">
                  Em breve na
                </div>
                <div className="text-sm font-bold leading-none mt-1">
                  App Store
                </div>
              </div>
            </button>

            <button
              disabled
              className="opacity-50 cursor-not-allowed flex items-center justify-center gap-3 bg-zinc-800 text-zinc-400 px-5 py-3 rounded-xl border border-zinc-700"
            >
              <svg
                className="w-6 h-6 grayscale"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.37,11.37L17.81,8.81L15.39,11.23L17.81,13.64L20.37,11.08C20.9,10.55 20.9,9.7 20.37,9.17M16.81,8.88L14.54,11.15L6.05,2.66L16.81,8.88Z" />
              </svg>
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold leading-none tracking-wider">
                  Em breve no
                </div>
                <div className="text-sm font-bold leading-none mt-1">
                  Google Play
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="flex-1 relative flex justify-center opacity-80">
          <div className="relative z-10 w-[280px] h-[580px] bg-zinc-900 border-8 border-zinc-800 rounded-[3rem] shadow-2xl overflow-hidden grayscale-[0.5]">
            <div className="absolute top-0 w-full h-8 bg-zinc-900 z-20 flex justify-center border-b border-zinc-800">
              <div className="w-32 h-6 bg-zinc-800 rounded-b-xl"></div>
            </div>

            <div className="w-full h-full bg-zinc-950 pt-12 p-6 flex flex-col relative">
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
                <div className="bg-zinc-900 border border-zinc-700 px-6 py-3 rounded-full shadow-2xl transform -rotate-12">
                  <span className="text-white font-bold tracking-widest uppercase text-sm">
                    Em Breve
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <h4 className="font-bold text-lg text-white">Meus Decks</h4>
                <div className="w-8 h-8 rounded-full bg-(--accent-color)/10 text-(--accent-color) flex items-center justify-center text-xs font-bold">
                  JD
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-zinc-200">
                      JavaScript
                    </span>
                    <span className="text-xs text-(--accent-color) bg-(--accent-color)/10 px-2 py-0.5 rounded">
                      12 para revisar
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full w-[65%] bg-(--accent-color)"></div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-zinc-200">Inglês C1</span>
                    <span className="text-xs text-green-500 bg-green-900/30 px-2 py-0.5 rounded">
                      Concluído
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-green-500"></div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-zinc-200">História</span>
                    <span className="text-xs text-orange-500 bg-orange-900/30 px-2 py-0.5 rounded">
                      45 para revisar
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full w-[30%] bg-orange-500"></div>
                  </div>
                </div>
              </div>

              <button className="mt-auto w-full py-4 bg-(--accent-color) text-white font-bold rounded-xl shadow-lg shadow-(--accent-color)/25">
                Revisar Agora
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileApp;
