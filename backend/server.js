// const express = require("express");
// const cluster = require("cluster");
// const os = require("os");
// const http = require("http");
// const cors = require("cors");

// const app = express();
// const PORT = 3000;
// app.use(cors());
// app.use(express.json());

// const taskRoutes = require("./routes/task");
// app.use("/task", taskRoutes);

// // app.get("/", (req, res) => {
// //   res.send("Welcome to the API!");
// // });

// app.post("/task", async (req, res) => {
//   try {
//     // Extract user_id from the request body
//     const { user_id } = req.body;

//     // Check if user_id is provided
//     if (!user_id || !task) {
//       return res.status(400).json({ error: "user_id is required" });
//     }

//     // Return a response with the user_id
//     res.status(200).json({ message: "Working", user_id });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   const { body } = req.body;

//   console.log(body);

//   res.status(500).send("Something broke!");
// });

// if (cluster.isMaster) {
//   const numCPUs = os.cpus().length;
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on("exit", (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died`);
//     cluster.fork();
//   });
// } else {
//   const server = http.createServer(app);
//   server.listen(PORT, () => {
//     console.log(`Server running on port ${PORT} | Worker ID: ${process.pid}`);
//   });
// }

// // const express = require("express");
// // const cluster = require("cluster");
// // const os = require("os");
// // const cors = require("cors");

// // const app = express();
// // const PORT = 4000;
// // app.use(cors());
// // app.use(express.json());

// // const taskRoutes = require("./routes/task");
// // app.use("/task", taskRoutes);

// // app.get("/", (req, res) => {
// //   res.send("Welcome to the API!");
// // });

// // app.get("/task", (req, res) => {
// //   try {
// //     res.status(200).json({ message: "Welcome to the Task API!" });
// //   } catch (error) {
// //     console.log(error);
// //     res.status(400).send("Internal Server Error");
// //   }
// // });

// // app.use((err, req, res, next) => {
// //   console.error(err.stack);
// //   res.status(500).send("Something broke!");
// // });

// // if (cluster.isMaster) {
// //   const numCPUs = os.cpus().length;
// //   for (let i = 0; i < numCPUs; i++) {
// //     cluster.fork();
// //   }

// //   cluster.on("exit", (worker, code, signal) => {
// //     console.log(`Worker ${worker.process.pid} died`);
// //     cluster.fork();
// //   });
// // } else {
// //   app.listen(PORT, () => {
// //     console.log(`Server running on port ${PORT} | Worker ID: ${process.pid}`);
// //   });
// // }

const express = require("express");
const cluster = require("cluster");
const os = require("os");
const http = require("http");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

const taskRoutes = require("./routes/task");
app.use("/task", taskRoutes);

app.get("/task", (req, res) => {
  res.send("Welcome to the Task API!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT} | Worker ID: ${process.pid}`);
  });
}

/*const express = require("express");
const cluster = require("cluster");
const os = require("os");
const http = require("http");
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Import task routes
const taskRoutes = require("./routes/task");
app.use("/task", taskRoutes);

// Basic health check route
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Clustering setup
if (cluster.isMaster) {
  const numCPUs = os.cpus().length; // Get the number of CPU cores
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork(); // Fork worker processes
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); // Restart a worker if it dies
  });
} else {
  // Start the server for each worker
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT} | Worker ID: ${process.pid}`);
  });
}*/
