# Supa Smoothies

A React + Supabase CRUD app for managing smoothie recipes. Features include authentication, image uploads, realtime updates, and pagination.

---

## Local Setup

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the project root (use `.env.example` as a template):
   ```
   REACT_APP_SUPABASE_URL=your_supabase_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   Get these from your Supabase dashboard → **Project Settings → API**.

3. Run the app:
   ```bash
   npm start
   ```

---

## Supabase Setup

### 1. Create a Project

Go to [supabase.com](https://supabase.com), create a new project, and note your **Project URL** and **anon/public key** from **Project Settings → API**.

---

### 2. Database Table

Go to **Table Editor → New table** and create a table named `smoothie` with the following columns:

| Column | Type | Default | Nullable |
|---|---|---|---|
| `id` | `int8` | auto-increment | No |
| `created_at` | `timestamptz` | `now()` | No |
| `title` | `text` | — | No |
| `method` | `text` | — | No |
| `rating` | `int4` | — | No |
| `image_url` | `text` | — | Yes |
| `voided` | `bool` | `false` | No |

---

### 3. Row Level Security (RLS)

Enable RLS on the `smoothie` table, then run the following in the **SQL Editor**:

```sql
-- Allow anyone to read non-voided smoothies
CREATE POLICY "Anon can read" ON smoothie
  FOR SELECT TO anon
  USING (true);

-- Allow logged-in users to create, update, and delete
CREATE POLICY "Authenticated can write" ON smoothie
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);
```

If you ever add a column and the API starts returning 400 errors, reload the schema cache:

```sql
NOTIFY pgrst, 'reload schema';
```

---

### 4. Authentication

Go to **Authentication → Providers → Email** and make sure Email auth is enabled.

To skip email confirmation during development, disable **"Confirm email"** under the Email provider settings. Re-enable it before going to production.

---

### 5. Storage Bucket

Go to **Storage → New bucket**:

- **Name:** `smoothies`
- **Public bucket:** ON

Then go to **Storage → Policies → smoothies** and run the following in the **SQL Editor** to allow uploads and reads:

```sql
CREATE POLICY "Allow select" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'smoothies');

CREATE POLICY "Allow insert" ON storage.objects
  FOR INSERT TO public
  WITH CHECK (bucket_id = 'smoothies');

CREATE POLICY "Allow update" ON storage.objects
  FOR UPDATE TO public
  USING (bucket_id = 'smoothies');

CREATE POLICY "Allow delete" ON storage.objects
  FOR DELETE TO public
  USING (bucket_id = 'smoothies');
```

> For production, change `TO public` to `TO authenticated` on the INSERT, UPDATE, and DELETE policies so only logged-in users can modify files.

---

### 6. Realtime

Go to **Database → Replication** and enable realtime for the `smoothie` table so the home page updates live without refreshing.

---

## Features

- View, create, edit, and soft-delete smoothie recipes
- Filter by rating, paginated (9 per page)
- Image upload per smoothie (stored in Supabase Storage)
- Realtime updates — new smoothies appear instantly
- Auth — only logged-in users can create, edit, or delete
