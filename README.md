# Task Manager
Simple task manager for creating and managing tasks.

- Click create button to create
- Click row to update
- Click delete to delete

# Quick Setup
Run background and frontend separately

## Backend
Uses SQLite so database file is created by prisma on migrate

- Create `.env` with the following line in your backend directory
```bash
DATABASE_URL="file:./dev.db"
```

```bash
cd backend
npm i
prisma migrate deploy
npm run dev
```

## Frontend
```bash
cd frontend
npm i
npm run dev
```

# Development
## Testing
```bash
cd backend
npm run test
```

## Stack
- Frontend: React
- Backend: Express
- Database: SQLite
- ORM: Prisma
- Testing: Jest

## Future Development
- Only title is required, display this better
- Better error display for users
- Table sorting
- Improve UI layout



