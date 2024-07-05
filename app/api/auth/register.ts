import bcrypt from 'bcrypt';
import User from '@/lib/models/user.models';
import { connectDB } from '@/mongoose';
import { signUpSchema } from '@/lib/validations/authSchemas';



export async function Regester(data: any) {
        try {
            connectDB();
      const { email, password } = signUpSchema.parse(data);

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        alert("Email already in use");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        email,
        password: hashedPassword,
      });
      await newUser.save();
      console.log(newUser);
      alert("User registered successfully!");

    } catch (error:any) {
      alert("Error registering user"+error);
    }
  
}
