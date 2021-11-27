<h1 align="center">
  <br>
  <a href="https://app.jnyiunn.com/book-exchange/"><img src="https://github.com/yasamnoya/book-exchange-app/blob/readme/Book_Exchange.png?raw=trueg" alt="Book exchange" width="600"></a>
</h1>

<h4 align="center">📚 Turn the old book into useful ones.</h4>

<p align="center">
  <a href="https://app.jnyiunn.com/book-exchange/"><img src="https://img.shields.io/badge/Deployed%20On-AWS-yellow"></a>
</p>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#download">Download</a> •
  <a href="#credits">Credits</a> •
  <a href="#related">Related</a> •
  <a href="#license">License</a>
</p>

![screenshot](https://github.com/yasamnoya/book-exchange-app/blob/readme/Book_Exchange_screenshot.png?raw=true)

# Tech Used

- [Express](https://expressjs.com/) - web framework for Node.js
- [mongoose](https://mongoosejs.com/) - ODM for MongoDB
- [Passport](https://www.passportjs.org/) - authentication middleware for Node.js
- [GitHub OAuth](https://developer.github.com/v3/oauth/) - signing in with GitHub accounts

## Deployment

- [Amazon EC2](https://aws.amazon.com/ec2/) - hosting both frontend & backend of the application
- [MongoDB Atlas](https://www.mongodb.com/atlas/database) - hosting the database
- [NGINX](https://www.nginx.com/) - web server as a reverse proxy

# Setup

1. Clone this repository
2. Create .env files, `.envs/prod.env` for production and `.envs/dev.env` for development. Sample as below:
```
PORT=3000
MONGODB_URL=mongodb://localhost:27017/book-exchange
GITHUB_CLIENT_ID=<your github client id>
GITHUB_CLIENT_SECRET=<your github client secret>
SESSION_SECRET=secret
FRONTEND_URL=http://localhost:8080
BACKEND_URL=http://localhost:3000
```
3. Start the server
  - For development: `npm run dev`
  - For production: `npm run start`
