# SkillBridge Backend

This is the Node.js + TypeScript backend for the SkillBridge Peer Skill Exchange Platform.

## ⚠️ Important TODOs for User Setup
To test and run this backend properly, you must configure your local environment:

1. **Database Setup**: You need a running PostgreSQL instance. 
   - Ensure PostgreSQL is installed locally or via Docker.
   - Example to run via Docker: `docker run --name skillbridge-db -e POSTGRES_PASSWORD=randompassword -p 5432:5432 -d postgres`
2. **Environment Variables**: Open `backend/.env` and update the `DATABASE_URL` placeholder if your credentials differ from the default placeholder.
3. **Run Migrations**: Once your DB is running, go to the `backend/` directory and run:
   ```bash
   npx prisma migrate dev --name init
   ```
4. **Start the API Server**:
   ```bash
   npm run dev
   ```

## OOP Architecture & Supported Patterns
This backend is strictly layered (Controllers -> Services -> Repositories) and demonstrates:
- **Singleton**: Handled globally for Prisma connection pooling.
- **Observer**: Found in `src/patterns/Observer.ts` (Event subscriptions).
- **Facade**: Found in `src/services/NotificationFacade.ts` (Simplifies external service complexity).
- **Solid Principles**: Extensive use of Interfaces, Interface Segregation, and Dependency Inversion.

See code documentation for detailed information.
