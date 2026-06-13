# Silent Room

Silent Room is a private music library and project archive for music producers. Phase 1 includes authentication, local uploads, a searchable music library, tags, favorites, and waveform playback.

## Install

```bash
npm install
npx prisma generate
```

## Environment

Create `.env` from `.env.example`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/silent_room?schema=public"
AUTH_SECRET="replace-with-secure-secret"
NEXTAUTH_SECRET="replace-with-secure-secret"
NEXTAUTH_URL="http://localhost:3000"
UPLOAD_DIR="./storage/uploads"
```

The app uses `AUTH_SECRET` or `NEXTAUTH_SECRET` to sign the local session cookie.

## PostgreSQL Setup on Windows

Check whether PostgreSQL is available:

```bash
psql -U postgres
```

Create the database:

```sql
CREATE DATABASE silent_room;
```

Then set `.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/silent_room?schema=public"
```

Apply migrations and start the app:

```bash
npx prisma migrate dev --name init
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Prisma Dev Database Fallback

If PostgreSQL is not installed locally, Prisma 7 can run a local development database:

```bash
npm run db:dev
npm run db:dev:ls
```

Copy the TCP URL shown by `db:dev:ls` into `.env`. In this workspace it is:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:51214/template1?schema=public&sslmode=disable&statement_cache_size=0"
SHADOW_DATABASE_URL="postgresql://postgres:postgres@localhost:51215/template1?schema=public&sslmode=disable&statement_cache_size=0"
```

Then sync the schema:

```bash
npm run db:push
npm run dev
```

The `statement_cache_size=0` parameter prevents Prisma Studio and `prisma db pull` prepared-statement conflicts on the Prisma dev daemon.

## Useful Commands

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run db:push
npm run db:studio
npm run db:check
npm run lint
npm run build
```

Prisma Studio opens at [http://localhost:5555](http://localhost:5555) by default and should show the `User`, `AudioFile`, `Tag`, and `AudioFileTag` tables after migration or `db:push`.

## Folder Structure

- `prisma/schema.prisma`: User, AudioFile, Tag, and AudioFileTag models.
- `prisma/migrations`: Initial PostgreSQL migration SQL.
- `src/app`: Next.js pages and API routes.
- `src/app/api/auth`: Signup, login, logout, and current-user endpoints.
- `src/components/auth`: Reusable authentication UI components.
- `src/components/files`: Upload, file card, waveform player, filters, and stats.
- `src/lib`: Auth, Prisma, validation, file storage, formatting, and shared types.
- `storage/uploads`: Local development upload target.

## Verified Auth Flow

The signup and login APIs:

- Save email in lowercase.
- Hash passwords into `passwordHash`.
- Create a local HTTP-only session cookie.
- Return duplicate email as `This email is already registered.`
- Redirect the frontend to `/dashboard` after successful signup or login.
- Log raw Prisma/database errors in development only.
