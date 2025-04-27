import { User } from '@/models/user';
import { dbConnect } from '@/utils/dbConnect';
import '@/models/interest'; // Make sure this path points to your interest model



  

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');
    
    await dbConnect();
    if (!username) {
      return Response.json({ message: 'User ID is required.' }, { status: 400 });
    }

    let user = await User.findOne({ username }).lean().populate('collectibles').populate('interests');

    if (!user) {
        return Response.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.assignedTasks.length === 0 && user.interests.length > 0) {
        console.log("Assigning tasks to user based on interests...");
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

    return Response.json({ specificUser: { ...user, globalRank } }, { status: 201 });
}