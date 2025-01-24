const express = require('express');
const cors = require("cors");
const rootRouter = require("./routes/index");

const app = express();

app.use(cors());
app.use(express.json());

// Use the rootRouter for /api/v1
app.use("/api/v1", rootRouter);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

