# Predusk - Me-API Playground

A simple API for storing and querying candidate profiles with a minimal frontend.

## Architecture

```
Frontend (HTML/CSS/JS) -> Backend API (Node.js/Express) -> Database (MongoDB)
```

Backend uses Express.js REST API with Mongoose ODM for MongoDB.

## Setup

### Local Development

**Backend**
```bash
cd backend
npm install
npm run seed
npm run dev
```

Server runs on http://localhost:5000

**Frontend**
```bash
cd frontend
npx http-server -p 3000
```

Frontend runs on http://localhost:3000

### Production

**Live URLs**
- Backend: https://predusk-1-i4sy.onrender.com
- Frontend: Deploy to Vercel (see deployment section below)
- Database: MongoDB Atlas

**Backend Deployment (Render)**
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Set build command: `cd backend && npm install`
5. Set start command: `cd backend && npm start`
6. Add environment variable: `MONGODB_URI`

**Frontend Deployment (Vercel)**
1. Install Vercel CLI: `npm install -g vercel`
2. Navigate to frontend: `cd frontend`
3. Login: `vercel login`
4. Deploy: `vercel --prod`

Alternatively, connect GitHub repo to Vercel dashboard and set root directory to `frontend`.

## Schema

```javascript
{
  name: String,
  email: String,
  education: [{
    institution: String,
    degree: String,
    field: String,
    startYear: Number,
    endYear: Number
  }],
  skills: [String],
  projects: [{
    title: String,
    description: String,
    links: { github, demo },
    technologies: [String]
  }],
  work: [{
    company: String,
    position: String,
    startDate: Date,
    endDate: Date,
    description: String
  }],
  links: { github, linkedin, portfolio, resume }
}
```

## Sample Requests

**Health Check**
```bash
curl http://localhost:5000/health
```

**Get All Profiles**
```bash
curl http://localhost:5000/api/profiles
```

**Filter Projects by Skill**
```bash
curl http://localhost:5000/api/projects?skill=python
```

**Search**
```bash
curl http://localhost:5000/api/search?q=blockchain
```

**Get Top Skills**
```bash
curl http://localhost:5000/api/skills/top
```

**Create Profile**
```bash
curl -X POST http://localhost:5000/api/profile \
  -H \"Content-Type: application/json\" \
  -d '{"name":"Test","email":"test@email.com","skills":["Python"]}'
```

## Postman

```json
{
  "info": {"name": "Predusk API"},
  "item": [
    {"name": "Health", "request": {"method": "GET", "url": "http://localhost:5000/health"}},
    {"name": "Profiles", "request": {"method": "GET", "url": "http://localhost:5000/api/profiles"}},
    {"name": "Projects", "request": {"method": "GET", "url": "http://localhost:5000/api/projects?skill=python"}},
    {"name": "Search", "request": {"method": "GET", "url": "http://localhost:5000/api/search?q=blockchain"}},
    {"name": "Top Skills", "request": {"method": "GET", "url": "http://localhost:5000/api/skills/top"}}
  ]
}
```

## Known Limitations

- No authentication
- No pagination
- Basic error handling
- Single user design
- No file uploads
- No rate limiting

## Links

**Resume**: https://drive.google.com/file/d/1NfKN-pdDQNcv2AqbAAqzmOvgTFcGshsS/view?usp=drivesdk
