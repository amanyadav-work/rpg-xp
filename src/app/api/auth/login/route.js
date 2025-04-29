import { dbConnect } from '@/utils/dbConnect';
import { User } from '@/models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { assignTasksToUser } from '@/utils/assignTasks';

export async function POST(req) {
    await dbConnect();

    const formData = await req.formData();

    const email = formData.get("email");
    const password = formData.get("password");

    let user = await User.findOne({ email }).lean().populate('interests');

    if (!user) {
        return Response.json({ message: 'User not found' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return Response.json({ message: 'Incorrect Password' }, { status: 401 });
    }


    if (user.assignedTasks.length === 0 && user.interests.length > 0) {
        // Assign tasks to the user based on their interests
        const assignedTasks = await assignTasksToUser(user._id);
        user.assignedTasks = assignedTasks;
    }

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
    return Response.json({ user: { ...user, globalRank }, message: 'Login successful', jwttoken: token }, { status: 201 });
}
