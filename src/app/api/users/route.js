import { User } from '@/models/user';
import { dbConnect } from '@/utils/dbConnect';
import { getJwtData } from '@/utils/jwt';
import '@/models/interest'; // Make sure this path points to your interest model
import { assignTasksToUser } from '@/utils/assignTasks';



export async function GET(req) {
    await dbConnect();
    const { email } = await getJwtData(req)
    if (!email) {
        return Response.json({ message: 'Invalid header' }, { status: 400 });
    }
    let user = await User.findOne({ email }).lean().populate('interests');

    if (!user) {
        return Response.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.assignedTasks.length === 0 && user.interests.length > 0) {
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

    return Response.json({ user: { ...user, globalRank } }, { status: 201 });
}



// export async function PUT(req) {
//     try {
//         await dbConnect(); // Ensure database is connected

//         // Retrieve JWT data from request (assuming you have some authentication middleware)
//         const { email } = await getJwtData(req);

//         if (!email) {
//             return Response.json({ message: 'Invalid header' }, { status: 400 });
//         }

//         // Parse the request body to get new user data
//         const newUserData = await req.json();

//         // Find the user by email to update the user
//         let user = await User.findOne({ email });
//         if (!user) {
//             return Response.json({ message: 'User not found' }, { status: 404 });
//         }


//         // Update the user data
//         user.username = newUserData.username || user.username;
//         user.name = newUserData.name || user.name;
//         user.email = newUserData.email || user.email;
//         user.password = newUserData.password || user.password;
//         user.role = newUserData.role || user.role;
//         user.image = newUserData.image || user.image;
//         user.xp = newUserData.xp || user.xp;
//         user.coins = newUserData.coins || user.coins;
//         user.interests = newUserData.interests;
//         user.assignedTasks = newUserData.assignedTasks || user.assignedTasks;
//         user.collectibles = newUserData.collectibles || user.collectibles;


//         if (user.assignedTasks.length === 0 && user.interests.length > 0) {
//             // Assign tasks to the user based on their interests
//             console.log("Assigning tasks to user based on interests...");
            
//             const assignedTasks = await assignTasksToUser(user._id);
//             user.assignedTasks = assignedTasks;
//         }
    


//         // Save the updated user data
//         await user.save();

//         // Re-fetch the user with populated interests (to return updated interests)
//         user = await User.findOne({ email }).populate('interests');
//         let globalRank;
//         if (!newUserData.globalRank) {
//             const userXp = user.xp;
//             const rankAggregation = [
//                 {
//                     $match: {
//                         xp: { $gt: userXp } // Match users with XP greater than the provided user's XP
//                     }
//                 },
//                 {
//                     $count: "rankCount" // Count how many users have higher XP
//                 }
//             ];

//             const rankResult = await User.aggregate(rankAggregation);
//             globalRank = rankResult.length > 0 ? rankResult[0].rankCount + 1 : 1;
//         }
//         user.globalRank = newUserData.globalRank || globalRank;


//         return Response.json({ user }, { status: 201 });
//     } catch (error) {
//         console.error('Error updating user:', error);
//         return Response.json({ message: 'Something went wrong' }, { status: 500 });
//     }
// }


export async function PUT(req) {
    try {
        await dbConnect();

        const { email } = await getJwtData(req);
        if (!email) {
            return Response.json({ message: 'Invalid header' }, { status: 400 });
        }

        const newUserData = await req.json();

        // Step 1: Find the user
        let user = await User.findOne({ email });
        if (!user) {
            return Response.json({ message: 'User not found' }, { status: 404 });
        }

        // Step 2: Update fields (but DON'T assignTasks yet)
        user.username = newUserData.username || user.username;
        user.name = newUserData.name || user.name;
        user.email = newUserData.email || user.email;
        user.password = newUserData.password || user.password;
        user.role = newUserData.role || user.role;
        user.image = newUserData.image || user.image;
        user.xp = newUserData.xp || user.xp;
        user.coins = newUserData.coins || user.coins;
        user.interests = newUserData.interests;
        user.collectibles = newUserData.collectibles || user.collectibles;

        // Step 3: Save user FIRST to persist interests
        await user.save();

        // Step 4: Assign tasks if not yet assigned and interests exist
        if (user.assignedTasks.length === 0 && user.interests.length > 0) {
            console.log("Assigning tasks to user based on interests...");
            await assignTasksToUser(user._id);
        }

        // Step 5: Fetch updated user (after tasks assigned) with populated interests
        user = await User.findOne({ email }).populate('interests');

        // Step 6: Calculate global rank if needed
        let globalRank;
        if (!newUserData.globalRank) {
            const userXp = user.xp;
            const rankAggregation = [
                {
                    $match: {
                        xp: { $gt: userXp }
                    }
                },
                {
                    $count: "rankCount"
                }
            ];

            const rankResult = await User.aggregate(rankAggregation);
            globalRank = rankResult.length > 0 ? rankResult[0].rankCount + 1 : 1;
        }

        user.globalRank = newUserData.globalRank || globalRank;

        // Step 7: Return updated user
        return Response.json({ user }, { status: 201 });

    } catch (error) {
        console.error('Error updating user:', error);
        return Response.json({ message: 'Something went wrong' }, { status: 500 });
    }
}

