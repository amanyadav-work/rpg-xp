import { User } from '@/models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { uploadImage } from '@/utils/cloudinary';
import { dbConnect } from '@/utils/dbConnect';

export const config = {
  api: {
    bodyParser: false,  // Disable the default body parser
  },
};

export async function POST(req) {
  await dbConnect();

  const formData = await req.formData();

  // Extract fields from form data
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const username = formData.get("username");
  const picture = formData.get("picture");
  const role = formData.get("role") || 'user';


  if (!name || !email || !password) {
    return Response.json({ message: "Name, Email, and Password are required." }, { status: 400 });
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    const conflictField =
      existingUser.email === email ? "Email" : "Username";
    return Response.json(
      { message: `${conflictField} already in use.` },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let imageUrl = '';
  if (picture && typeof picture === 'object') {

    imageUrl = await uploadImage(picture);
  }

  const user = await User.create({
    username,
    name,
    email,
    role,
    password: hashedPassword,
    image: imageUrl,
  });


  const userXp = user.xp;

  const rankAggregation = [
    {
      $match: {
        xp: { $gt: userXp } // Match users with XP greater than the provided user's XP
      }
    },
    {
      $count: "rankCount" // Count how many users have higher XP
    }
  ];

  const rankResult = await User.aggregate(rankAggregation);

  const globalRank = rankResult.length > 0 ? rankResult[0].rankCount + 1 : 1;


  const token = jwt.sign({ email }, process.env.JWT_SECRET);
  return Response.json({ user: { ...user, globalRank }, message: "Register successful", jwttoken: token }, { status: 201 });
}
