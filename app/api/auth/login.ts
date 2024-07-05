import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import User from '@/lib/models/user.models';

import {connectDB} from "@/mongoose";
import { loginSchema } from '@/lib/validations/authSchemas';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      return res.status(200).json({ message: "Login successful" });
    } catch (error:any) {
      return res.status(400).json({ message: error.errors });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
