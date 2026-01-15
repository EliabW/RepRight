import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

/**
 * @swagger
 * tags:
 *   name: General
 *   description: General endpoints
 */

const PORT = process.env.PORT || 5000;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "RepRight API",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ["./src/*.ts", "./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);

// health check route
/**
 * @swagger
 * /api/health:
 *   get:
 *     tags: [General]
 *     summary: Health check endpoint
 *     responses:
 *       200:
 *         description: Server is running
 */
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ message: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
