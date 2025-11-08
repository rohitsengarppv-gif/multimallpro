import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import User from "../models/User";
import { config } from "../config/env";

interface JwtPayload {
  id: string;
}

export const protect = async (req: NextRequest) => {
  try {
    let token;

    if (req.headers.get("authorization")?.startsWith("Bearer")) {
      token = req.headers.get("authorization")?.split(" ")[1];
    }

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authorized to access this route" },
        { status: 401 }
      );
    }

    try {
      const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
      const user = await User.findById(decoded.id);

      if (!user) {
        return NextResponse.json(
          { success: false, message: "No user found with this id" },
          { status: 401 }
        );
      }

      return { user };
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Not authorized to access this route" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
};

export const authorize = (...roles: string[]) => {
  return (req: NextRequest, user: any) => {
    if (!roles.includes(user.role)) {
      return NextResponse.json(
        { success: false, message: `User role ${user.role} is not authorized to access this route` },
        { status: 403 }
      );
    }
    return null; // Authorized
  };
};
