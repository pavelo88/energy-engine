import { brands } from '@/lib/data';

export default function Brands() {
  const allBrands = [...brands, ...brands];
  return (
    <section id="marcas" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <h2 className="text-center text-3xl font-black uppercase tracking-tighter font-headline text-foreground/80">
          Aliados Tecnológicos Multimarca
        </h2>
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)] mt-12">
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 animate-infinite-scroll">
            {allBrands.map((brand, index) => (
              <li key={index}>
                <div className="flex justify-center items-center text-center p-4 bg-secondary/50 dark:bg-white/[0.03] rounded-lg border h-20 w-44">
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{brand}</span>
                </div>
              </li>
            ))}
          </ul>
           <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 animate-infinite-scroll" aria-hidden="true">
            {allBrands.map((brand, index) => (
              <li key={index}>
                <div className="flex justify-center items-center text-center p-4 bg-secondary/50 dark:bg-white/[0.03] rounded-lg border h-20 w-44">
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{brand}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
