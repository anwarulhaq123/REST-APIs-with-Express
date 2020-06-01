const express = require("express");
const router = express.Router();
const records = require("./records");

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

router.get("/quotes", async (req, res) => {
  try {
    const quotes = await records.getQuotes();
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Send a Get request to/quotes/:id to READ(view)a quote
// without async handler
// app.get("/quotes/:id", async (req, res) => {
//   try {
//     const quote = await records.getQuote(req.params.id);
//     if (quote) {
//       res.json(quote);
//     } else {
//       res.status(404).json({ message: "Quote not found" });
//     }
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// With asnchandler function
router.get(
  "/quotes/:id",
  asyncHandler(async (req, res) => {
    const quote = await records.getQuote(req.params.id);
    if (quote) {
      res.json(quote);
    } else {
      res.status(404).json({ message: "Quote not found" });
    }
  })
);

// Send a GET request to/quotes/quote/random to Read (view)a random quote.

router.get(
  "/quotes/quotes/random",
  asyncHandler(async (req, res, next) => {
    const quote = await records.getRandomQuote();
    res.json(quote);
  })
);

//Send a post request to /quotes to CREATE a New quote

router.post("/quotes", async (req, res) => {
  try {
    //throw new Error("Oh No Some this went wrong");
    if (req.body.author && req.body.quote) {
      const quote = await records.createQuote({
        quote: req.body.quote,
        author: req.body.author,
      });
      res.status(201).json(quote);
    } else {
      res.status(400).json({ message: "Quote and authore required" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// app.post(
//   "/quotes",
//   asyncHandler(async (res, req) => {
//     if (req.body.author && req.body.quote) {
//       const quote = await records.createQuote({
//         quote: req.body.quote,
//         author: req.body.author,
//       });
//       res.status(201).json(quote);
//     } else {
//       res.status(400).json({ message: "Quote and authore required" });
//     }
//   })
// );

//Send a PUT request to /quotes/:id to update(edit)a quote
router.put(
  "/quotes/:id",
  asyncHandler(async (req, res) => {
    const quote = await records.getQuote(req.params.id);
    if (quote) {
      quote.quote = req.body.quote;
      quote.author = req.body.author;
      await records.updateQuote(quote);
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Quote not found" });
    }
  })
);

//Send a Delete Request to /quotes/:id Delete a quote.

//app.delete("/quotes/:id", async (req, res, next) => {
//try {
//throw new Error("some thisng terribale happend");
//     const quote = await records.getQuote(req.params.id);
//     if (quote) {
//       quote.quote = req.body.quote;
//       quote.author = req.body.author;
//       await records.deleteQuote(quote);
//       res.status(204).end();
//     } else {
//       res.status(404).json({ message: "Quote not found" });
//     }
//   } catch (err) {
//     next(err);
//   }
// });

// delete  With asynHandler function

router.delete(
  "/quotes/:id",
  asyncHandler(async (req, res, next) => {
    const quote = await records.getQuote(req.params.id);
    if (quote) {
      quote.quote = req.body.quote;
      quote.author = req.body.author;
      await records.deleteQuote(quote);
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Quote not found" });
    }
  })
);

module.exports = router;
