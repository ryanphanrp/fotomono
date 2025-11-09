# Database Setup Guide

## Overview

This guide walks you through setting up the PostgreSQL database for FotoMono using Supabase (recommended) or a local PostgreSQL instance.

**Database:** PostgreSQL (version 14+)
**ORM:** Drizzle ORM
**Migration Tool:** Drizzle Kit

---

## Quick Start

### Option 1: Supabase (Recommended)

**1. Create Supabase Project**
- Go to [supabase.com](https://supabase.com)
- Click "New Project"
- Choose organization and project name
- Set database password (save this!)
- Select region (choose closest to your users)
- Wait for project to provision (~2 minutes)

**2. Get Connection String**
- Go to Project Settings → Database
- Find "Connection string" section
- Copy the "Connection string" (URI format)
- It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`

**3. Configure Environment**
```bash
# In apps/server/.env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres

# Also set these Supabase-specific vars
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

**4. Run Migration**
```bash
cd /home/user/fotomono
bun run db:push
```

**5. Verify Tables**
```bash
bun run db:studio
```

---

### Option 2: Local PostgreSQL

**1. Install PostgreSQL**
```bash
# macOS (Homebrew)
brew install postgresql@14
brew services start postgresql@14

# Ubuntu/Debian
sudo apt-get install postgresql-14
sudo systemctl start postgresql

# Windows
# Download from: https://www.postgresql.org/download/windows/
```

**2. Create Database**
```bash
# Create user
createuser -s fotomono

# Create database
createdb fotomono -O fotomono

# Set password
psql -c "ALTER USER fotomono WITH PASSWORD 'your-password';"
```

**3. Configure Environment**
```bash
# In apps/server/.env
DATABASE_URL=postgresql://fotomono:your-password@localhost:5432/fotomono
```

**4. Run Migration**
```bash
cd /home/user/fotomono
bun run db:push
```

---

## Database Schema

The following tables will be created:

### Authentication Tables (Better-Auth)
- `user` - User accounts
- `session` - Active sessions
- `account` - OAuth accounts & password hashes
- `verification` - Email verification tokens

### Photography Business Tables
- `show` - Photography sessions/bookings
- `show_reminder` - Scheduled reminders
- `image` - Uploaded photos with metadata
- `image_tag` - Tags and categories for images
- `image_approval` - Client approval workflow
- `portfolio_image` - Curated portfolio images
- `portfolio_settings` - Portfolio customization (theme, bio, etc.)
- `client_album` - Photo collections for clients
- `client_album_image` - Album-to-image relationships
- `client_album_link` - Shareable links with expiration
- `client_feedback` - Client ratings and comments
- `storage_config` - Cloud storage credentials (encrypted)

**Total: 15 tables**

---

## Migration Commands

### Push Schema to Database
Pushes the current Drizzle schema to the database without creating migration files.
Best for development.

```bash
bun run db:push
```

### Generate Migration Files
Creates migration SQL files for production deployments.

```bash
bun run db:generate
```

### Apply Migrations
Applies generated migration files to the database.

```bash
bun run db:migrate
```

### Open Database Studio
Opens Drizzle Studio for visual database management.

```bash
bun run db:studio
```

Then visit: `https://local.drizzle.studio`

---

## Verification Steps

### 1. Check Database Connection

```bash
# Test connection with psql
psql "postgresql://user:password@host:5432/database"

# Or using Drizzle Studio
bun run db:studio
```

### 2. Verify Tables Created

In Drizzle Studio or psql, run:

```sql
-- List all tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Expected tables:**
```
account
client_album
client_album_image
client_album_link
client_feedback
image
image_approval
image_tag
portfolio_image
portfolio_settings
session
show
show_reminder
storage_config
user
verification
```

### 3. Check Table Structure

```sql
-- Check user table
\d user

-- Check show table
\d show

-- Check all tables
\dt
```

### 4. Test Insert

```sql
-- Insert test user (Better-Auth will handle this normally)
INSERT INTO "user" (id, name, email, email_verified, created_at, updated_at)
VALUES ('test-id', 'Test User', 'test@example.com', false, NOW(), NOW());

-- Verify
SELECT * FROM "user";

-- Clean up
DELETE FROM "user" WHERE id = 'test-id';
```

---

## Troubleshooting

### Error: "relation does not exist"

**Problem:** Tables haven't been created yet
**Solution:**
```bash
bun run db:push
```

### Error: "connection refused"

**Problem:** Database server not running or wrong connection string
**Solution:**
- Verify DATABASE_URL in .env
- Check if PostgreSQL is running:
  ```bash
  # Local
  brew services list | grep postgresql
  sudo systemctl status postgresql

  # Supabase
  # Check project status in dashboard
  ```

### Error: "password authentication failed"

**Problem:** Wrong password in connection string
**Solution:**
- Double-check DATABASE_URL password
- For Supabase, reset database password in dashboard
- For local, use: `psql -c "ALTER USER fotomono WITH PASSWORD 'newpass';"`

### Error: "database does not exist"

**Problem:** Database not created
**Solution:**
```bash
createdb fotomono
```

### Error: "too many clients"

**Problem:** Connection pool exhausted
**Solution:**
- Close existing connections
- Use connection pooling (Supabase has this built-in)
- For local DB, increase max_connections in postgresql.conf

---

## Environment Variables

Complete list of database-related environment variables:

```bash
# Required
DATABASE_URL=postgresql://user:password@host:5432/database

# Optional (Supabase-specific)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Optional (for encryption)
ENCRYPTION_KEY=your-encryption-key-32-chars-min
# OR fallback to:
BETTER_AUTH_SECRET=your-secret-here
```

---

## Production Setup

### Supabase Production

**1. Create Production Project**
- Separate Supabase project for production
- Choose region closest to users
- Enable Point-in-Time Recovery (PITR)
- Set up regular backups

**2. Run Migrations**
```bash
# Generate migration files
bun run db:generate

# Review migration files in packages/db/src/migrations/

# Apply to production
DATABASE_URL=your-production-url bun run db:migrate
```

**3. Connection Pooling**
Supabase provides connection pooling by default. Use the pooler connection string for serverless:
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:6543/postgres?pgbouncer=true
```

### Self-Hosted Production

**1. PostgreSQL Configuration**
```conf
# In postgresql.conf
max_connections = 200
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 1MB
min_wal_size = 1GB
max_wal_size = 4GB
```

**2. Backups**
```bash
# Daily backup cron job
0 2 * * * pg_dump fotomono > /backups/fotomono_$(date +\%Y\%m\%d).sql

# Or use pg_dump with compression
pg_dump -Fc fotomono > backup.dump
```

**3. Monitoring**
- Set up monitoring with Prometheus + Grafana
- Monitor connection pool usage
- Track query performance
- Set up alerts for disk space

---

## Database Performance

### Indexes

The schema includes automatic indexes for:
- Primary keys (all id columns)
- Foreign keys (userId, showId, imageId, etc.)
- Unique constraints (email, token, subdomain)

### Query Optimization

```sql
-- Check slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Analyze table statistics
ANALYZE;

-- Vacuum database
VACUUM ANALYZE;
```

### Connection Pooling

For serverless deployments, use a connection pooler:
- Supabase: Built-in pgBouncer
- Self-hosted: PgBouncer or PgPool-II
- Serverless: Neon, PlanetScale, or Supabase

---

## Data Seeding (Optional)

Create sample data for development:

```bash
# Create seed script
mkdir -p packages/db/src/seeds
```

```typescript
// packages/db/src/seeds/seed.ts
import { db } from "../index";

async function seed() {
  console.log("Seeding database...");

  // Create test user
  const user = await db.insert(user).values({
    id: "seed-user-1",
    name: "Test Photographer",
    email: "photographer@example.com",
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Create portfolio settings
  await db.insert(portfolioSettings).values({
    id: "seed-portfolio-1",
    userId: "seed-user-1",
    subdomain: "test-photographer",
    theme: "modern",
    primaryColor: "#000000",
    accentColor: "#FF6B6B",
    bio: "Professional photographer specializing in weddings and portraits",
  });

  console.log("✅ Database seeded!");
}

seed().catch(console.error);
```

```bash
# Run seed
bun packages/db/src/seeds/seed.ts
```

---

## Migration History

Track migration changes:

```bash
# View migration history
ls -la packages/db/src/migrations/

# Each migration file contains:
# - Timestamp
# - SQL to apply changes
# - SQL to rollback changes
```

---

## Backup & Restore

### Backup

```bash
# Supabase
# Backups are automatic, download from dashboard

# Local
pg_dump fotomono > backup.sql

# With compression
pg_dump -Fc fotomono > backup.dump
```

### Restore

```bash
# From SQL file
psql fotomono < backup.sql

# From dump file
pg_restore -d fotomono backup.dump
```

---

## Next Steps

After database setup is complete:

1. ✅ Verify all tables created
2. ✅ Test database connection
3. ✅ Set up backups (production)
4. [ ] Run the application: `bun run dev`
5. [ ] Test registration flow
6. [ ] Check Drizzle Studio: `bun run db:studio`

---

## Related Files

- `packages/db/drizzle.config.ts` - Drizzle configuration
- `packages/db/src/schema/` - Database schema definitions
- `packages/db/src/index.ts` - Database client export
- `apps/server/.env.example` - Environment variables template

---

## Support

If you encounter issues:
1. Check [Drizzle ORM Docs](https://orm.drizzle.team/)
2. Check [Supabase Docs](https://supabase.com/docs)
3. Review error logs: `tail -f /var/log/postgresql/*.log`
4. Open Drizzle Studio for visual inspection: `bun run db:studio`
