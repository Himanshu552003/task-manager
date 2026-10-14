// run this once to create test accounts and some sample tasks
// npm run seed
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Task = require("./models/Task");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to db");

    const accounts = [
      { name: "Test User", email: "testuser@example.com", password: "Test@1234", role: "user" },
      { name: "Admin", email: "admin@example.com", password: "Admin@1234", role: "admin" },
    ];

    const users = [];
    for (const acc of accounts) {
      let user = await User.findOne({ email: acc.email });
      if (!user) {
        user = await User.create(acc);
        console.log("Created user:", acc.email);
      } else {
        console.log("User already exists:", acc.email);
      }
      users.push(user);
    }

    const [testUser, admin] = users;

    const taskCount = await Task.countDocuments();
    if (taskCount === 0) {
      const today = new Date();
      const addDays = (n) => new Date(today.getTime() + n * 24 * 60 * 60 * 1000);

      await Task.insertMany([
        {
          title: "Setup project repository",
          description: "Create github repo and add basic folder structure",
          priority: "high",
          status: "completed",
          dueDate: addDays(-2),
          assignedTo: testUser._id,
          createdBy: admin._id,
        },
        {
          title: "Design login page",
          description: "Make login and register page UI with tailwind",
          priority: "medium",
          status: "in-progress",
          dueDate: addDays(2),
          assignedTo: testUser._id,
          createdBy: admin._id,
        },
        {
          title: "Write API documentation",
          description: "Document all the endpoints in README",
          priority: "low",
          status: "pending",
          dueDate: addDays(5),
          assignedTo: testUser._id,
          createdBy: testUser._id,
        },
        {
          title: "Deploy backend on Render",
          description: "Add env variables and deploy",
          priority: "high",
          status: "pending",
          dueDate: addDays(1),
          assignedTo: admin._id,
          createdBy: admin._id,
        },
        {
          title: "Team meeting notes",
          description: "Share weekly meeting notes with the team",
          priority: "low",
          status: "completed",
          dueDate: addDays(-1),
          assignedTo: admin._id,
          createdBy: testUser._id,
        },
      ]);
      console.log("Sample tasks added");
    }

    console.log("Seeding done");
    process.exit(0);
  } catch (error) {
    console.log("Seed error:", error.message);
    process.exit(1);
  }
};

seed();
