const express = require("express");
const app = express();
const routes = require("./routes");

//Express Middleware
app.use(express.json());
app.use("/api", routes);

// Send a GET request to/quotes/quote/random to Read (view)a random quote.
// First we need the Middleware.

app.use((req, res, next) => {
  const err = new Error("Not found");
  err.status = 404;
  next(err);
});

// Error Handler

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ err: { message: err.message } });
});

app.listen(3000, () => console.log("Quote API listening on port 3000!"));
