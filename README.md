````markdown
# Carbon Portfolio

Generate a carbon credit portfolio for companies.

## Instructions to Run the Project

### 1. Clone the Project

```bash
git clone https://github.com/aash1407/carbon-portfolio.git
```
````

### 2. Set Up the Backend

#### Navigate to the Backend Directory:

```bash
cd backend
```

#### Rename `env_template` in the backend folder to `.env`

#### Spin Up the Postgres Instance:

```bash
docker compose up
```

Verify that the Postgres instance is running using Docker Desktop or the command:

```bash
docker ps
```

#### Restore the Data:

Run the following commands to set up Prisma and import the data:

```bash
npx prisma generate
npx prisma migrate dev --name init
npx ts-node prisma/import-csv.ts
```

Once this step is done, a migrations sub-folder should be generated inside the prisma folder.

#### Install Backend Dependencies:

```bash
npm install
```

#### Build and Start the Backend:

```bash
npm run start:dev
```

### 3. Set Up the Frontend

#### Open a new terminal

#### Navigate to the Frontend Directory:

```bash
cd ..
cd frontend
```

### Rename `env_template` inside the frontend folder to `.env`

#### Install Frontend Dependencies:

```bash
npm install
```

#### Run the Frontend:

```bash
npm run dev
```

The app will now be available at `localhost:5173`.

### 4. Use the App

- Open the **User Tab** to generate the portfolio by providing the requested number of tons for portfolio generation.

---

## Planning and Achievements

### Planned:

1. **Create Postgres Instance Using Docker** - Achieved
2. **Create Backend Using NestJS** - Achieved
   - Portfolio module (with project imports for portfolio generation) - Achieved
   - Projects module - Achieved
   - Prisma schema for projects - Achieved
   - Restore data from CSV using TypeScript - Achieved
   - Test cases for `PortfolioService` - Achieved
3. **Create Frontend Using React** - Achieved
   - UserTab for portfolio generation and viewing - Achieved
   - AdminTab for managing projects (CRUD operations) - Partially achieved (fetching and searching works; TODO: Add projects, delete projects, and optimize UI)
   - Search bar to filter projects - Achieved
   - Test cases for `UserTab` (tried but TODO)
4. **Create README File** - Achieved
5. **Create GitHub Repo** - Achieved
6. **Create Docker Compose File to Spin Everything Together** - Tried but TODO

### Future work:

1. Search optimization
2. Project normalized weights db storage to reduce computation time during portfolio generation for faster response
3. Pie chart/Visualization
