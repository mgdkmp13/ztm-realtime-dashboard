# 🚊 ZTM Realtime Dashboard

Aplikacja do podglądu rzeczywistych odjazdów ZTM Gdańsk oraz zarządzania zapisanymi przystankami użytkownika. Backend w **.NET + PostgreSQL (EF Core)**, frontend **Vue 3 + Vite + Pinia + Tailwind**. Logowanie oparte o JWT, hasła hashowane bcryptem.

---

## 🔐 Funkcjonalności backendu (.NET + PostgreSQL)

- Rejestracja użytkownika z hashowaniem hasła (bcrypt)
- Logowanie + generowanie tokenu JWT (Bearer Authentication)
- Middleware weryfikujący token
- CRUD dla ulubionych przystanków użytkownika
- Pobieranie danych live z API ZTM (`delays?stopId`)
- Cache pliku `stops.json` (np. odświeżanie co 24h)
- Dokumentacja API w Swagger UI z możliwością autoryzacji Bearer
- Baza PostgreSQL + ORM **EF Core** + Value Objects w encjach

---

## 🖥 Funkcjonalności frontendu (Vue + Vite)

- Logowanie i utrzymywanie sesji w Pinia (JWT)
- Podgląd najbliższych odjazdów z ulubionych przystanków
- CRUD przystanków użytkownika (dodaj / edytuj / usuń)
- Tailwind CSS + własny plugin Vue
- Własny **composable** (np. `useZtmData` / requesty z tokenem)
- Własna dyrektywa (np. kolor opóźnienia)
- Testy jednostkowe + komponentowe + E2E

---

## 🏁 Uruchomienie

### 1. Backend — .NET + PostgreSQL
cd ztmApp
dotnet restore
dotnet ef database update        # tworzy bazę
dotnet run

### 2. Frontend - Vue.js
cd ztm-frontend
npm install
npm run dev

---

🏆 Cel projektu

✔ pełna obsługa użytkownika (rejestracja, logowanie, CRUD przystanków)
✔ integracja z API ZTM w czasie rzeczywistym
✔ backend chroniony JWT + Swagger z autoryzacją
✔ cache przystanków + PostgreSQL jako baza produkcyjna
