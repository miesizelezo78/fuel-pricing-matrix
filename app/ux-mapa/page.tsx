import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Mapa ciest",
  description:
    "Návrh, ako spolu žijú sprievodca Kováčske palivá, Woo obchod a paletová objednávka. Staging sa nemení, kým to neodobríš.",
};

const STAGING = {
  guide: "https://staging.vulcanus.sk/kovacske-paliva/",
  shop: "https://staging.vulcanus.sk/?ukazka=obchod&rodina=kovacske-paliva",
  uhlie: "https://staging.vulcanus.sk/produkt/kovacske-cierne-uhlie-25-kg",
  antracit: "https://staging.vulcanus.sk/produkt/kovacsky-antracit-25-kg",
  koks: "https://staging.vulcanus.sk/produkt/kovacsky-koks-20-kg",
  pallet: "https://staging.vulcanus.sk/objednavka-paleta/",
  island: "https://staging.vulcanus.sk/paliva/",
};

export default function UxMapPage() {
  return (
    <article className="space-y-12">
      <header className="max-w-3xl space-y-4">
        <p className="text-xs uppercase tracking-[0.22em] text-primary">
          Návrh · nič sa ešte na stagingu nemení
        </p>
        <h1 className="font-heading text-4xl leading-[1.1] sm:text-5xl">
          Tri miestnosti. Žiadny štvrtý obchod.
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
          Pozrel som sprievodcu aj Woo filter Kováčske palivá. Dnes vedľa seba
          stoja dva obchody a konfigurátor, ktorý vyzerá ako iný web. Toto je
          mapa, ktorú treba odobrať — potom to kreslí Grok Bot do G3, Cursor
          drží kilogramy.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge>Sprievodca = učiť sa</Badge>
          <Badge variant="secondary">Obchod = vrecia s doručením</Badge>
          <Badge variant="outline">Paleta = od 100 kg</Badge>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        <Room
          kicker="1 · Landing"
          title="Sprievodca"
          href={STAGING.guide}
          linkLabel="Otvoriť /kovacske-paliva/"
        >
          Video z vyhne, tri charaktery ohňa, prečo uhlie nie je koks. Portréty
          odkazujú na Woo vrece. Dole jedno tlačidlo do obchodu — nie druhý
          cenník.
        </Room>
        <Room
          kicker="2 · Woo"
          title="Obchod"
          href={STAGING.shop}
          linkLabel="Otvoriť filter Kováčske palivá"
        >
          Šesť G3 kariet v jednom gride: tri vrecia s doručením (Do košíka) a
          tri „od 100 kg“ (K objednávke). Rovnaká fotka, rovnaké zaoblenie,
          iné tlačidlo.
        </Room>
        <Room
          kicker="3 · SuperFaktúra"
          title="Paleta"
          href={STAGING.pallet}
          linkLabel="Dnešný konfigurátor (zlý obal)"
        >
          Kilá, mix, formulár. Musí sedieť v G3 hlavičke a pätičke. Dnes
          vypadneš do Figtree lišty Palivá · Paleta · Ako — to je slepá ulička.
        </Room>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-3xl">Cesta zákazníka</h2>
        <ol className="grid gap-3 sm:grid-cols-3">
          <Step n="A" title="Chcem pochopiť oheň">
            Sprievodca → video → portrét paliva → Woo vrece, ak kupuje. Späť
            do sprievodcu z obchodu je v poriadku. To nie je slučka, to sú dve
            miestnosti.
          </Step>
          <Step n="B" title="Chcem 1 až 4 vrecia">
            E-shop → Kováčske palivá → karta „… s doručením“ → ten istý
            produkt, fotka, popis, košík. Nikdy `/palivo/uhlie-25kg`.
          </Step>
          <Step n="C" title="Chcem od 100 kg">
            V obchode klik na „Uhlie – od 100 kg“ → konfigurátor s
            `?palivo=uhlie`. Z detailu vreca tá istá skratka. Paleta do košíka
            nejde.
          </Step>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-3xl">Čo je dnes zle</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <Problem title="Tretí katalóg">
            <a className="underline underline-offset-2" href={STAGING.island}>
              /paliva/
            </a>{" "}
            kreslí šesť vlastných dlaždíc a ceny 28,90 €. Woo má 40 / 42 / 39 €
            a karty <code>vd-card</code>. G3 menu na Palivá ani neukazuje.
          </Problem>
          <Problem title="Falošný detail">
            Klik na vrece z /paliva/ ide na /palivo/uhlie-25kg, nie na{" "}
            <a className="underline underline-offset-2" href={STAGING.uhlie}>
              Woo uhlie 25 kg
            </a>
            .
          </Problem>
          <Problem title="Paleta je iný web">
            Konfigurátor má vlastnú hlavičku a pätičku. Z G3 webu človek
            vypadne. Má žiť v get_header / get_footer.
          </Problem>
          <Problem title="Jedna dlaždica namiesto troch">
            Obchod aj landing majú jeden pruh „OD 100 KG“. Chýbajú tri karty v
            dizajne Woo, každá na svoje palivo.
          </Problem>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-3xl">Názov namiesto „solo“</h2>
        <p className="max-w-2xl leading-relaxed text-muted-foreground">
          Solovrecia v G3 nikde nie je. Woo už hovorí{" "}
          <strong className="text-foreground">s doručením</strong>. Landing:
          „Vyberte vrece s doručením v SR.“ V UI slovo solo nepoužívame.
          Interný kód môže ostať.
        </p>
        <div className="overflow-x-auto rounded-2xl ring-1 ring-foreground/10">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="bg-muted/60 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Namiesto</th>
                <th className="px-4 py-3 font-medium">Použiť</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-foreground/10">
                <td className="px-4 py-3">Solo vrecia / Solovrecia</td>
                <td className="px-4 py-3">Vrecia s doručením</td>
              </tr>
              <tr className="border-t border-foreground/10">
                <td className="px-4 py-3">E-shop · kuriér</td>
                <td className="px-4 py-3">s doručením (už je v názve produktu)</td>
              </tr>
              <tr className="border-t border-foreground/10">
                <td className="px-4 py-3">Na objednávku od 100 kg</td>
                <td className="px-4 py-3">
                  Kováčske čierne uhlie – od 100 kg (karta ako Woo, bez košíka)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-3xl">Šesť kariet v obchode</h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Prvé tri už existujú. Ďalšie tri Grok dokreslí v tom istom jazyku
          karty — nie ako Woo SKU.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ShopFace
            kind="woo"
            name="Kováčske čierne uhlie – 25 kg s doručením"
            pack="Vrece · 25 kg"
            action="Do košíka"
            href={STAGING.uhlie}
          />
          <ShopFace
            kind="woo"
            name="Kováčsky antracit – 25 kg s doručením"
            pack="Vrece · 25 kg"
            action="Do košíka"
            href={STAGING.antracit}
          />
          <ShopFace
            kind="woo"
            name="Kováčsky koks – 20 kg s doručením"
            pack="Vrece · 20 kg"
            action="Do košíka"
            href={STAGING.koks}
          />
          <ShopFace
            kind="order"
            name="Kováčske čierne uhlie – od 100 kg"
            pack="Na objednávku · od 100 kg"
            action="K objednávke"
          />
          <ShopFace
            kind="order"
            name="Kováčsky antracit – od 100 kg"
            pack="Na objednávku · od 100 kg"
            action="K objednávke"
          />
          <ShopFace
            kind="order"
            name="Kováčsky koks – od 100 kg"
            pack="Na objednávku · od 100 kg"
            action="K objednávke"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Na kartách od 100 kg zatiaľ žiadne €/kg — Woo 40 € a vzorový paletový
          cenník sa bijú. Čísla ostanú v konfigurátore.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-3xl">Kto čo kreslí</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Grok Bot — staging</CardTitle>
              <CardDescription>G3, Woo, Identity, Bricks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              <p>Landing ostáva sprievodca. Woo vrecia nemente.</p>
              <p>Tri karty od 100 kg do gridu obchodu, bez Add to cart.</p>
              <p>
                Konfigurátor do get_header / get_footer. Redirect /paliva/ a
                /palivo/… preč. Žiadna druhá lišta.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Cursor — toto repo</CardTitle>
              <CardDescription>kg, mix, SuperFaktúra</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              <p>
                Konfigurátor bez vlastnej hlavičky. Po schválení mapy, nie
                skôr.
              </p>
              <p>
                Next stránka /paliva/ je starý náhľad, nie ostrý obchod. Mapa
                je táto stránka.
              </p>
              <p>
                Zmluva pre Groka je v GROK.md. Celý text mapy v UX-MAPA.md.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
        <h2 className="font-heading text-3xl">Čo potrebujeme od teba</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
          Táto mapa, alebo úprava. Kým nenapíšeš „kreslite“, staging sa
          neprepisuje. Starý náhľad šiestich dlaždíc je stále na{" "}
          <Link href="/paliva" className="underline underline-offset-2">
            /paliva
          </Link>
          — to je presne ten ostrov, ktorý chceme zrušiť.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button nativeButton={false} render={<Link href="/paliva" />}>
            Starý náhľad /paliva
            <ArrowRight />
          </Button>
          <Button
            nativeButton={false}
            render={<a href={STAGING.shop} />}
            variant="outline"
          >
            Woo Kováčske palivá
          </Button>
          <Button
            nativeButton={false}
            render={<a href={STAGING.guide} />}
            variant="outline"
          >
            Sprievodca
          </Button>
        </div>
      </section>
    </article>
  );
}

function Room({
  kicker,
  title,
  href,
  linkLabel,
  children,
}: {
  kicker: string;
  title: string;
  href: string;
  linkLabel: string;
  children: ReactNode;
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <p className="text-xs uppercase tracking-[0.16em] text-primary">
          {kicker}
        </p>
        <CardTitle className="font-heading text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {children}
        </p>
        <a
          href={href}
          className="mt-auto inline-flex items-center gap-1 text-sm font-medium"
        >
          {linkLabel}
          <ArrowRight className="size-4" />
        </a>
      </CardContent>
    </Card>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
      <p className="font-heading text-2xl text-primary">{n}</p>
      <h3 className="font-heading mt-1 text-xl">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {children}
      </p>
    </div>
  );
}

function Problem({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl p-4 ring-1 ring-foreground/10">
      <h3 className="font-heading text-lg">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {children}
      </p>
    </div>
  );
}

function ShopFace({
  kind,
  name,
  pack,
  action,
  href,
}: {
  kind: "woo" | "order";
  name: string;
  pack: string;
  action: string;
  href?: string;
}) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-2">
        <Badge variant={kind === "woo" ? "secondary" : "default"}>
          {kind === "woo" ? "Woo · košík" : "Nie je produkt"}
        </Badge>
        <span className="text-xs text-muted-foreground">{pack}</span>
      </div>
      <div className="mt-4 h-28 rounded-xl bg-muted" aria-hidden />
      <h3 className="font-heading mt-4 text-lg leading-snug">{name}</h3>
      <p className="mt-3 text-sm font-medium">
        {action}
        <ArrowRight className="ml-1 inline size-4" />
      </p>
    </>
  );

  const className =
    "block h-full rounded-2xl bg-card p-4 ring-1 ring-foreground/10 transition-transform hover:-translate-y-0.5";

  if (href) {
    return (
      <a href={href} className={className}>
        {inner}
      </a>
    );
  }
  return <div className={className}>{inner}</div>;
}
