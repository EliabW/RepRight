import type { Request, Response } from "express";
// import business logic from auth service
import { AuthService } from "../services/authService.js";

// register endpoint controller
export const register = async (req: Request, res: Response) => {
  try {
    const { UserGivenName, UserFamilyName, UserEmail, UserPassword } = req.body;

    // basic validation first
    if (!UserGivenName || !UserFamilyName || !UserEmail || !UserPassword) {
      res.status(400).json({ message: "All fields are required. " });
      return;
    }

    // call the auth service to actually register the user
    const result = await AuthService.register({
      UserGivenName,
      UserFamilyName,
      UserEmail,
      UserPassword,
    });

    res.status(201).json(result);
  } catch (error) {
    // normal error handling
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
      // generic fallback
    } else {
      res.status(500).json({ error: "Registration failed. " });
    }
  }
};

// login endpoint controller
export const login = async (req: Request, res: Response) => {
  try {
    const { UserEmail, UserPassword } = req.body;

    // basic validation first
    if (!UserEmail || !UserPassword) {
      res.status(400).json({ message: "Email and password are required. " });
      return;
    }

    // call the auth service to actually log in the user
    const result = await AuthService.login({ UserEmail, UserPassword });
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Login failed. " });
    }
  }
};
