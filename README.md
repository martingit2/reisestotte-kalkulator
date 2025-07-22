# Reisestøtte-kalkulator

Et fullstack "Proof-of-Concept"-prosjekt bygget med Java (Spring Boot), React og Docker.

Velkommen til **Reisestøtte-kalkulator**. Dette er et selvstendig læringsprosjekt designet for å demonstrere tekniske ferdigheter i en moderne, konteinerisert fullstack-arkitektur. Hele systemet – frontend, backend og database – kjører lokalt og kan startes med én enkelt kommando takket være Docker Compose.

---

## Innholdsfortegnelse

- [Om Prosjektet](#om-prosjektet)
    - [Formål og Kontekst](#formål-og-kontekst)
    - [Forretningslogikk](#forretningslogikk)
    - [Kjernefunksjonalitet](#kjernefunksjonalitet)
- [Teknologistack](#teknologistack)
- [Visuell Oversikt](#visuell-oversikt)
- [Arkitektur og Dataflyt](#arkitektur-og-dataflyt)
- [Komme i Gang](#komme-i-gang)
    - [Forutsetninger](#forutsetninger)
    - [Installasjon og Kjøring](#installasjon-og-kjøring)
- [Lisens](#lisens)

---

## Om Prosjektet

Dette prosjektet simulerer en enkel kalkulator for beregning av økonomisk støtte til reiser, basert på avstand og et forenklet regelsett.

### Formål og Kontekst

Dette er et aktivt læringsprosjekt med følgende hovedmål:

*   **Mestre en fullstack-arbeidsflyt:** Bygge og koble sammen en moderne frontend og en pålitelig backend.
*   **Anvende en spesifikk teknologistack:** Implementere et system ved hjelp av Java 21, Spring Boot 3, React og MariaDB.
*   **Lære konteinerisering:** Bruke **Docker** og **Docker Compose** til å definere, bygge og kjøre et komplett, isolert utviklingsmiljø. Dette sikrer at prosjektet fungerer likt på alle maskiner.
*   **Sette opp CI/CD:** Implementere en enkel pipeline med **GitHub Actions** for automatisk testing av backend-koden ved hver `push`.

### Forretningslogikk

Beregningen av støtte er basert på et **forenklet og fiktivt regelsett** kun for demonstrasjonsformål. Reglene som er implementert er:

*   **Standardsats:** 3,00 kr per kilometer for reise med egen bil.
*   **Egenandel:** En fast egenandel på 171,00 kr per reise.
*   **Minimumsavstand:** Reisen må være på minimum 10 km for å kvalifisere for støtte.
*   **Beregning:** `Støtte = (Avstand i km * Sats) - Egenandel`, men resultatet kan ikke være negativt.

### Kjernefunksjonalitet

*   **Beregning av reisestøtte:** Et enkelt skjema lar brukeren legge inn reisedetaljer.
*   **Lagring av historikk:** Hver beregning lagres i en MariaDB-database.
*   **Visning av historikk:** Applikasjonen viser en liste over de 5 siste beregningene som er utført.
*   **REST API:** En backend i Spring Boot som håndterer beregning og henting av data.

---

## Teknologistack

| Kategori              | Teknologi                                               |
| --------------------- | ------------------------------------------------------- |
| **Backend**           | Java 21, Spring Boot 3, Spring Data JPA, Lombok         |
| **Frontend**          | React, TypeScript, Vite, Axios                          |
| **Database**          | MariaDB                                                 |
| **DevOps & CI/CD**    | Docker, Docker Compose, GitHub Actions (for Maven-tester) |

---

## Visuell Oversikt

Her er et glimt av applikasjonens brukergrensesnitt.

| Kalkulator-skjema | Historikk-liste  |
|-------------------|------------------|
| `[Bilde kommer]`  | `[Bilde kommer]` |

---

## Arkitektur og Dataflyt

Applikasjonen følger en klassisk tre-lags arkitektur som kjører i separate Docker-containere.

1.  Brukeren fyller ut skjemaet i **React-appen** (Frontend).
2.  Ved klikk på "Beregn", sender React-appen en `POST`-request til `http://localhost:8080/api/v1/calculate-support`.
3.  **Spring Boot-appen** (Backend) mottar forespørselen.
4.  `CalculationService` anvender forretningslogikken for å beregne støtten.
5.  `TravelClaimRepository` lagrer forespørselen og resultatet til **MariaDB-databasen**.
6.  API-et returnerer det beregnede beløpet som JSON til React-appen.
7.  React-appen mottar svaret og oppdaterer brukergrensesnittet for å vise resultatet og den oppdaterte historikklisten.

---

## Komme i Gang

Hele prosjektet er designet for å kunne kjøres med én enkelt kommando.

### Forutsetninger

*   [Git](https://git-scm.com/)
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) må være installert og kjøre på maskinen din.

### Installasjon og Kjøring

1.  **Klone repoet:**
    ```bash
    git clone https://github.com/martingit2/reisestotte-kalkulator.git
    ```

2.  **Naviger til prosjektmappen:**
    ```bash
    cd ditt-repo-navn
    ```

3.  **Bygg og start containerne:**
    ```bash
    docker-compose up --build
    ```
    *   `--build`-flagget er viktig første gang du kjører, da det bygger Docker-imagene fra `Dockerfile`-ene dine.

4.  **Applikasjonen er nå tilgjengelig:**
    *   **Frontend:** Åpne nettleseren og gå til [**http://localhost:3000**](http://localhost:3000)
    *   **Backend API:** Kan nås på `http://localhost:8080`. Du kan f.eks. sjekke historikk-endepunktet på [http://localhost:8080/api/v1/history](http://localhost:8080/api/v1/history)

5.  **For å stoppe applikasjonen:**
    *   Gå tilbake til terminalen der `docker-compose` kjører og trykk `CTRL + C`.

---

## Lisens

Distribuert under MIT-lisensen. Se `LICENSE`-filen for mer informasjon.