# 07 – Pregled prevzetega projekta

Pregled projekta RepTrack (izvorni repozitorij `mateabojarovska/RepTrack`), opravljen ob prevzemu projekta. Pregledani so bili dokumentacija v mapi `docs/` (zasnova, obseg, podatkovni model, arhitektura, uporabniške zgodbe, wireframi in ADR-ji), koda celnega dela (Vue 3) in zaledja (Node.js, Express, Prisma), aplikacija pa je bila zagnana lokalno po navodilih iz `README.md` (PostgreSQL v Dockerju, migracije, testni podatki). Celoten tok MVP (ustvarjanje in objava načrta, beleženje treninga, osebni rekordi, upoštevanje načrta, pregled treninga) je bil preizkušen ročno prek API-ja, celni del pa je bil uspešno zgrajen in zagnan.

## Uspešno implementirane funkcionalnosti MVP

| Funkcionalnost | Uporabniška zgodba | Stanje |
|---|---|---|
| F1 – Prijava in dostop glede na vlogo | US-01 | Implementirano (JWT, bcrypt, zaščita poti v celnem delu in `requireAuth`/`requireRole` v zaledju) |
| F4 – Ustvarjanje vadbenega načrta | US-04 | Implementirano (sestavljalnik načrta, validacija v zaledju, stanje `Draft`) |
| F5 – Objava načrta | US-05 | Implementirano (objava v transakciji, arhiviranje prejšnjega aktivnega načrta) |
| F6 – Beleženje treninga glede na načrt | US-06 | Implementirano (obrazec za vadbeni dan aktivnega načrta, popravljanje do pregleda) |
| F7 – Samodejno zaznavanje osebnih rekordov | US-07 | Implementirano (oznaka ob shranjevanju, prikaz v zgodovini) |
| F8 – Izračun upoštevanja načrta | US-08 | Implementirano (tedensko upoštevanje, izračunano ob zahtevi, največ 100 %) |
| F9 – Pregled treninga s povratno informacijo | US-09, US-10 | Implementirano (seznam za pregled, povratna informacija, zgodovina stranke) |

Funkcionalnosti, ki niso del MVP (npr. F2 – upravljanje uporabnikov), niso implementirane; administrator ima samo začetno stran, uporabniki in dodelitve trenerjev pa so vneseni s testnimi podatki (`prisma/seed.js`). To je skladno z obsegom MVP v `02-funkcionalnosti-in-obseg.md`.

## Ali implementacija zadošča uporabniškim zgodbam

Pregledanih je bilo 5 uporabniških zgodb. Kriteriji sprejemljivosti so bili preverjeni v kodi in z ročnim preizkusom lokalno zagnane aplikacije.

### US-01 – Prijava in dostop glede na vlogo

- Prijava s pravilnimi podatki deluje, uporabnik je preusmerjen na začetno stran svoje vloge in vidi samo njene poglede. ✔
- Pri napačnem e-poštnem naslovu ali geslu je vrnjeno isto sporočilo, ki ne razkrije, kateri podatek je napačen. ✔ (sporočilo je v angleščini, »Invalid email or password«, in ne v slovenščini, kot je zapisano v kriteriju)
- Deaktiviran uporabnik se ne more prijaviti (status 403). ✔
- Zahteva brez žetona vrne 401, zahteva na končno točko druge vloge pa 403. ✔

**Ocena:** zadošča.

### US-04 – Ustvarjanje vadbenega načrta

- Trener lahko ustvari načrt samo za svojo stranko (sicer 403). ✔
- Zahtevani so naslov, vsaj en vadbeni dan z imenom in vsaj ena vaja na dan. ✔
- Ciljne serije in ponovitve morajo biti celi števili, večji od 0; teža in opomba sta neobvezni. ✔
- Nov načrt ima stanje `Draft` in ga stranka ne vidi. ✔
- Urejati je mogoče samo načrt v stanju `Draft` (sicer 409). ✔

**Ocena:** zadošča.

### US-05 – Objava načrta

- Objaviti je mogoče samo osnutek. ✔
- Po objavi ima načrt stanje `Active` in shranjen čas objave; stranka ga vidi kot aktivni načrt. ✔
- Prejšnji aktivni načrt se v isti transakciji arhivira. ✔
- Arhiviranega načrta ni mogoče urejati ali ponovno objaviti, stranka pa ga vidi med svojimi načrti. ✔
- Trener, ki objavlja načrt drugega trenerja, dobi 403. ✔

**Ocena:** zadošča.

### US-06 – Beleženje treninga glede na načrt

- Stranka izbira samo med vadbenimi dnevi aktivnega načrta; brez aktivnega načrta se prikaže sporočilo, da ga še nima. ✔ (sporočilo v angleščini)
- Obrazec prikaže načrtovane serije, ponovitve in težo. ✔
- Trening brez serij ni mogoče shraniti; teža 0 je dovoljena. ✔
- Shranjen trening ima stanje `Logged`, se prikaže v zgodovini stranke in na trenerjevem seznamu za pregled. ✔
- Popravljanje je mogoče samo v stanju `Logged` (po pregledu 409). ✔

**Ocena:** zadošča.

### US-09 – Pregled treninga s povratno informacijo

- Trener vidi samo treninge s stanjem `Logged` svojih strank. ✔
- Po vnosu povratne informacije ima trening stanje `Reviewed` in shranjen čas pregleda; prazna povratna informacija je zavrnjena. ✔
- Po pregledu stranka treninga ne more več urejati. ✔
- Pregled spremeni samo povratno informacijo, stanje in čas pregleda, serij stranke ne spreminja. ✔

**Ocena:** zadošča.

## Povzetek

Vseh 8 uporabniških zgodb MVP je implementiranih, pregledanih 5 zgodb (US-01, US-04, US-05, US-06, US-09) pa izpolnjuje vse kriterije sprejemljivosti. Edino odstopanje je jezik uporabniškega vmesnika: sporočila so v angleščini, kriteriji pa navajajo slovenska besedila. Ob prevzemu projekt ni imel linterja, avtomatskih testov ali CI/CD cevovoda, kar je dodano v drugem delu naloge.
