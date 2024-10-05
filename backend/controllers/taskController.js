const { userQueues } = require("../queue/taskQueue");
const rateLimiter = require("../middleware/rateLimiter");
const fs = require("fs");
const path = require("path");
const { RateLimiterRes } = require("rate-limiter-flexible");

async function logTaskCompletion(user_id) {
  const message = `${user_id} - task completed at ${new Date().toISOString()}\n`;
  try {
    await fs.promises.appendFile(
      path.join(__dirname, "../task_logs.txt"),
      message
    );
  } catch (err) {
    console.error("Failed to write log:", err);
  }
}

async function processTask(req, res) {
  console.log("Received POST request:", req.body);
  const userId = req.body.user_id;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "Valid User ID is required" });
  }

  if (!userQueues[userId]) {
    userQueues[userId] = [];
  }

  const taskFunction = async () => {
    try {
      await Promise.all([
        rateLimiter.rateLimiter.consume(userId),
        rateLimiter.userRateLimiter.consume(userId),
      ]);
      await logTaskCompletion(userId);
      res.status(200).json({ message: "Task processed successfully" });
    } catch (err) {
      if (err instanceof RateLimiterRes) {
        res
          .status(429)
          .json({ error: "Rate limit exceeded", retryAfter: err.msBeforeNext });
      } else {
        console.error("Internal Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };

  userQueues[userId].push(taskFunction);

  if (userQueues[userId].length === 1) {
    processQueue(userId);
  }
}

async function processQueue(userId) {
  while (userQueues[userId].length > 0) {
    const currentTask = userQueues[userId].shift();
    await currentTask();
  }
}

module.exports = { processTask };
