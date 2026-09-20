import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-[#383838] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/55">
            Kde nás nájdete
          </p>
          <div className="mt-4 grid gap-5 text-sm leading-relaxed text-white/85">
            <address className="not-italic">
              <span className="block font-medium text-white">
                Office a sklad povrchových úprav
              </span>
              VULCANUS, s.r.o.
              <br />
              Smaragdová 619/7
              <br />
              010 09 Žilina
            </address>
            <address className="not-italic">
              <span className="block font-medium text-white">
                Sklad cortenu a uhlia
              </span>
              VULCANUS, s.r.o.
              <br />
              Hollého 1174/18
              <br />
              014 01 Bytča
            </address>
          </div>
        </div>
        <div className="text-sm">
          <p className="font-semibold uppercase tracking-[0.14em] text-white/55">
            Objednávky
          </p>
          <p className="mt-4">
            <Link
              href="/objednavka-paleta"
              className="underline decoration-white/30 underline-offset-4"
            >
              Paletová objednávka
            </Link>
          </p>
          <p className="mt-2 text-white/75">
            Solo vrecia — košík. Od 100 kg — záväzná objednávka, nie košík.
          </p>
          <p className="mt-3 text-white/75">
            Paleta je jednorazová, nevratná a v cene tovaru.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-semibold uppercase tracking-[0.14em] text-white/55">
            Kontakty
          </p>
          <p className="mt-4 text-white/75">
            Info a podpora: 09:00 – 17:30
            <br />
            Osobný odber treba dohodnúť vopred telefonicky.
          </p>
          <p className="mt-3">
            <a href="tel:+421911365598" className="hover:underline">
              +421 911 36 55 98
            </a>
          </p>
          <p>
            <a href="mailto:office@vulcanus.sk" className="hover:underline">
              office@vulcanus.sk
            </a>
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/50 sm:px-6">
        Dobierka a poplatok za platbu nie sú v cene tovaru.{" "}
        <Link
          href="/ako-to-predavame"
          className="underline decoration-white/30 underline-offset-4"
        >
          Ako je katalóg poskladaný
        </Link>
      </div>
    </footer>
  );
}
