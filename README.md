# 🚀 Kickstarter Clone — MVC Boilerplate

A full-featured crowdfunding platform boilerplate inspired by Kickstarter, built with **Node.js**, **Express**, **MongoDB (Mongoose)**, and **EJS** templating, following strict **MVC architecture**.

---

## 📁 Project Structure

```
kickstarter-clone/
├── server.js               # Entry point
├── .env.example            # Environment variables template
├── package.json
│
├── config/
│   └── database.js         # MongoDB connection
│
├── models/                 # (M) Data layer
│   ├── User.js
│   ├── Project.js
│   └── Pledge.js
│
├── controllers/            # (C) Business logic
│   ├── indexController.js
│   ├── authController.js
│   ├── projectController.js
│   ├── pledgeController.js
│   ├── userController.js
│   └── dashboardController.js
│
├── routes/                 # URL routing
│   ├── index.js
│   ├── auth.js
│   ├── projects.js
│   ├── pledges.js
│   ├── users.js
│   └── dashboard.js
│
├── views/                  # (V) EJS templates
│   ├── layouts/
│   │   └── main.ejs
│   ├── partials/
│   │   ├── navbar.ejs
│   │   ├── footer.ejs
│   │   ├── flash.ejs
│   │   └── projectCard.ejs
│   ├── index.ejs
│   ├── error.ejs
│   ├── projects/
│   │   ├── index.ejs
│   │   ├── show.ejs
│   │   └── new.ejs
│   ├── users/
│   │   ├── register.ejs
│   │   ├── login.ejs
│   │   └── profile.ejs
│   ├── pledges/
│   │   └── my-pledges.ejs
│   └── dashboard/
│       └── index.ejs
│
├── middlewares/
│   ├── auth.js             # requireAuth, redirectIfAuthenticated
│   ├── upload.js           # Multer file upload
│   └── errorHandler.js     # 404 + global error handler
│
└── public/
    ├── css/style.css
    ├── js/main.js
    ├── images/
    └── uploads/            # User-uploaded images
```

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Then edit .env with your values
```

### 3. Start MongoDB
Make sure MongoDB is running locally, or use a MongoDB Atlas URI.

### 4. Run the server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Visit: **http://localhost:3000**

---

## 🗺 Route Map

| Method | Route                        | Controller              | Auth  | Description               |
|--------|------------------------------|-------------------------|-------|---------------------------|
| GET    | /                            | indexController.home    | No    | Homepage                  |
| GET    | /auth/register               | authController          | No    | Register form             |
| POST   | /auth/register               | authController          | No    | Create account            |
| GET    | /auth/login                  | authController          | No    | Login form                |
| POST   | /auth/login                  | authController          | No    | Authenticate user         |
| POST   | /auth/logout                 | authController          | No    | Destroy session           |
| GET    | /projects                    | projectController.index | No    | Browse projects           |
| GET    | /projects/new                | projectController       | ✅    | New project form          |
| POST   | /projects                    | projectController       | ✅    | Create project            |
| GET    | /projects/:slug              | projectController.show  | No    | Project detail page       |
| GET    | /projects/:slug/edit         | projectController       | ✅    | Edit form (owner only)    |
| PUT    | /projects/:slug              | projectController       | ✅    | Update project            |
| DELETE | /projects/:slug              | projectController       | ✅    | Delete project            |
| POST   | /projects/:slug/updates      | projectController       | ✅    | Post campaign update      |
| POST   | /pledges                     | pledgeController.create | ✅    | Back a project            |
| GET    | /pledges/my-pledges          | pledgeController        | ✅    | View my pledges           |
| POST   | /pledges/:id/cancel          | pledgeController        | ✅    | Cancel a pledge           |
| GET    | /users/:id                   | userController.show     | No    | Public user profile       |
| GET    | /users/settings              | userController          | ✅    | Edit profile              |
| PUT    | /users/settings              | userController          | ✅    | Save profile changes      |
| GET    | /dashboard                   | dashboardController     | ✅    | Creator dashboard         |

---

## 🛠 Tech Stack

| Layer        | Technology                       |
|--------------|----------------------------------|
| Runtime      | Node.js                          |
| Framework    | Express.js                       |
| Database     | MongoDB + Mongoose ODM           |
| Templating   | EJS + express-ejs-layouts        |
| Auth         | express-session + bcryptjs       |
| Validation   | express-validator                |
| File Upload  | Multer                           |
| Styling      | Custom CSS (no framework)        |

---

## 💡 Next Steps

- [ ] Integrate **Stripe** for real payments (`paymentIntentId` already on Pledge model)
- [ ] Add **email verification** (nodemailer)
- [ ] Add **reward tier management** UI for project creators
- [ ] Add **search indexing** (MongoDB text index on Project)
- [ ] Implement **admin panel**
- [ ] Add **image optimization** (sharp)
- [ ] Deploy to **Railway / Render / Heroku**

---

## 📝 License

MIT — free to use as a starting point for your own project.
