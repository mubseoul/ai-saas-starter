# Database Guide

Complete guide for working with the database in the AI SaaS Starter Kit.

## Schema Overview

The application uses Prisma ORM with PostgreSQL. Here's the database schema:

### Tables

1. **User** - User accounts
2. **Account** - OAuth account linking
3. **Session** - User sessions
4. **VerificationToken** - Email verification tokens
5. **Subscription** - User subscription plans
6. **Usage** - Monthly usage tracking
7. **PromptHistory** - AI generation history
8. **ApiKey** - User API keys (optional)

## Setup

### Local Development

1. **Install PostgreSQL**

   - macOS: `brew install postgresql`
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/)
   - Linux: `sudo apt-get install postgresql`

2. **Create Database**

   ```bash
   createdb ai_saas_db
   ```

3. **Set Environment Variable**

   ```bash
   DATABASE_URL="postgresql://localhost:5432/ai_saas_db"
   ```

4. **Generate Prisma Client**

   ```bash
   npm run db:generate
   ```

5. **Push Schema**

   ```bash
   npm run db:push
   ```

6. **Seed Database (Optional)**

   ```bash
   npm run db:seed
   ```

### Production Setup

See [DEPLOYMENT.md](./DEPLOYMENT.md#database-setup) for production database setup.

## Prisma Commands

### Generate Client

```bash
npm run db:generate
# or
npx prisma generate
```

### Push Schema Changes

```bash
npm run db:push
# or
npx prisma db push
```

### Create Migration

```bash
npx prisma migrate dev --name your_migration_name
```

### Apply Migrations

```bash
npx prisma migrate deploy
```

### Reset Database

```bash
npx prisma migrate reset
```

**Warning:** This will delete all data!

### Open Prisma Studio

```bash
npx prisma studio
```

## Schema Details

### User

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  name          String?
  password      String?   // For email/password auth
  image         String?
  role          UserRole  @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]
  subscription  Subscription?
  usage         Usage[]
  promptHistory PromptHistory[]
  apiKeys       ApiKey[]
}

enum UserRole {
  USER
  ADMIN
}
```

### Subscription

```prisma
model Subscription {
  id                   String             @id @default(cuid())
  userId               String             @unique
  plan                 SubscriptionPlan   @default(FREE)
  status               SubscriptionStatus @default(ACTIVE)
  stripeCustomerId     String?            @unique
  stripeSubscriptionId String?            @unique
  stripePriceId        String?
  currentPeriodStart   DateTime?
  currentPeriodEnd     DateTime?
  createdAt            DateTime           @default(now())
  updatedAt            DateTime           @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum SubscriptionPlan {
  FREE
  PRO
  ENTERPRISE
}

enum SubscriptionStatus {
  ACTIVE
  CANCELED
  INCOMPLETE
  PAST_DUE
  TRIALING
}
```

### Usage

```prisma
model Usage {
  id           String   @id @default(cuid())
  userId       String
  month        Int      // 1-12
  year         Int
  requestCount Int      @default(0)
  resetAt      DateTime
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, month, year])
}
```

### PromptHistory

```prisma
model PromptHistory {
  id        String   @id @default(cuid())
  userId    String
  prompt    String   @db.Text
  response  String   @db.Text
  model     String
  tokens    Int?
  cost      Float?
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([createdAt])
}
```

## Migrations

### Creating a New Migration

1. **Modify schema.prisma**

   ```prisma
   model User {
     // ... existing fields
     phoneNumber String? // New field
   }
   ```

2. **Create migration**

   ```bash
   npx prisma migrate dev --name add_phone_number
   ```

3. **Review migration file**

   Check `prisma/migrations/` for the SQL file

4. **Apply to production**

   ```bash
   npx prisma migrate deploy
   ```

### Migration Best Practices

- Always test migrations in development first
- Back up production database before applying migrations
- Use descriptive migration names
- Review generated SQL before applying
- Never edit migration files manually after creation

## Seeding

The seed script creates test accounts:

```typescript
// prisma/seed.ts
const users = [
  {
    email: "admin@example.com",
    role: "ADMIN",
    password: await bcrypt.hash("password123", 10),
  },
  {
    email: "pro@example.com",
    role: "USER",
    password: await bcrypt.hash("password123", 10),
  },
  {
    email: "free@example.com",
    role: "USER",
    password: await bcrypt.hash("password123", 10),
  },
];
```

### Running Seed

```bash
npm run db:seed
```

### Custom Seed Data

Edit `prisma/seed.ts` to add your own test data.

## Database Helpers

Located in `lib/db-helpers.ts`, these functions provide common database operations:

### User Operations

```typescript
getUserSubscription(userId: string)
getUserUsage(userId: string)
checkAndIncrementUsage(userId: string)
```

### Subscription Operations

```typescript
upsertSubscription(userId: string, data: SubscriptionData)
```

### Prompt History

```typescript
getPromptHistory(userId: string, options: PaginationOptions)
createPromptHistory(data: PromptData)
```

### Admin Operations

```typescript
getAdminStats()
searchUsers(query: string, options: PaginationOptions)
```

## Indexes

Current indexes for performance:

```prisma
// User email (unique index)
@@unique([email])

// Usage tracking
@@unique([userId, month, year])

// Prompt history
@@index([userId])
@@index([createdAt])

// Subscriptions
@@unique([stripeCustomerId])
@@unique([stripeSubscriptionId])
```

### Adding New Indexes

```prisma
model PromptHistory {
  // ...fields

  @@index([model]) // Index on model field
}
```

## Backup and Restore

### Backup Database

```bash
pg_dump -U username -h hostname -p port database_name > backup.sql
```

### Restore Database

```bash
psql -U username -h hostname -p port database_name < backup.sql
```

### Automated Backups

Most managed database providers (Neon, Supabase, Railway) provide automated backups. Configure in your provider's dashboard.

## Monitoring

### Connection Pooling

For production, use connection pooling:

```bash
# Add to DATABASE_URL
?connection_limit=10&pool_timeout=20
```

### Query Logging

Enable Prisma query logging:

```typescript
// lib/db.ts
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

### Performance Monitoring

- Monitor slow queries
- Check connection pool usage
- Track database size
- Monitor index usage

## Troubleshooting

### Common Issues

**Issue:** "Prisma Client not generated"
```bash
npx prisma generate
```

**Issue:** "Migration failed"
```bash
# Reset and retry
npx prisma migrate reset
npx prisma migrate dev
```

**Issue:** "Connection pool exhausted"
```bash
# Increase connection limit or use Prisma Data Proxy
```

**Issue:** "Schema out of sync"
```bash
npx prisma db push
```

## Best Practices

1. **Always use Prisma Client** - Don't write raw SQL unless absolutely necessary
2. **Use transactions** for multiple related operations
3. **Implement pagination** for large result sets
4. **Add indexes** for frequently queried fields
5. **Use soft deletes** for important data (add `deletedAt` field)
6. **Validate data** before database operations
7. **Handle errors gracefully** with proper error messages
8. **Monitor query performance** regularly
9. **Back up data** before major changes
10. **Test migrations** in development environment first

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
