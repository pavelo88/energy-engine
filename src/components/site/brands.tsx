import { brands } from '@/lib/data';

export default function Brands() {
  return (
    <section id="marcas" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <h2 className="text-center text-3xl font-black uppercase tracking-tighter font-headline text-foreground/80">
          Aliados Tecnológicos Multimarca
        </h2>
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-2 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-3 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          {brands.map((brand) => (
            <div key={brand} className="flex justify-center items-center text-center p-4 bg-secondary/50 dark:bg-white/[0.03] rounded-lg border h-20">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{brand}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
