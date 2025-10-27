const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let reviews = [];

app.post("/api/reviews", (req, res) => {
    const { bookTitle, author, reviewText, rating, tags } = req.body;

    if (!bookTitle || !author || !reviewText || rating === undefined || rating === null) {
        return res.status(400).json({ error: "bookTitle, author, reviewText and rating are required" });
    }

    const rNum = Number(rating);
    if (Number.isNaN(rNum) || rNum < 1 || rNum > 5) {
        return res.status(400).json({ error: "Rating must be a number between 1 and 5" });
    }

    const newBook = {
        id: Date.now(),               // simple unique id
        bookTitle: String(bookTitle),
        author: String(author),
        reviewText: String(reviewText),
        rating: rNum,
        tags: Array.isArray(tags) ? tags : (tags ? [tags] : []),
        status: "pending",
        createdAt: new Date().toISOString()
    };

    reviews.push(newBook);
    res.status(201).json({ message: "Review added!", data: newBook });
});

app.get("/api/reviews", (req, res) => {
    res.json(reviews);
});

app.put("/api/reviews/:id", (req, res) => {
    const id = Number(req.params.id);              // convert param to number
    const { reviewText, rating, tags } = req.body;

    const review = reviews.find((r) => r.id === id);
    if (!review) return res.status(404).json({ error: "Review not found" });

    if (rating !== undefined && rating !== null) {
        const rNum = Number(rating);
        if (Number.isNaN(rNum) || rNum < 1 || rNum > 5) {
            return res.status(400).json({ error: "Rating must be a number between 1 and 5" });
        }
        review.rating = rNum;
    }

    if (reviewText !== undefined) review.reviewText = String(reviewText);
    if (tags !== undefined) review.tags = Array.isArray(tags) ? tags : (tags ? [tags] : []);

    review.updatedAt = new Date().toISOString();

    res.json({ message: "Review updated!", data: review });
});

app.delete("/api/reviews/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = reviews.findIndex((r) => r.id === id);
  if (index === -1) return res.status(404).json({ error: "Review not found" });

  reviews.splice(index, 1);
  res.json({ message: "Review deleted successfully" });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
