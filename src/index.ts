import express from 'express';

const app = express();

const paths = {
  users: "/api/users",
};

app.use(paths.users, require("./routes/users.routes"));

app.listen(3000, () => {
  console.log('Listening on port', 3000);
});
