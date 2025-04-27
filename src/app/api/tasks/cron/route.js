import { NextResponse } from 'next/server';
import { dbConnect } from '@/utils/dbConnect';
import { Task } from '@/models/task';
import { GenerateAiData } from '@/utils/groq';
import { createChestsPrompt, createPrompt } from '@/utils/helpers';
import { User } from '@/models/user';
import { Share } from '@/models/share';
import { Comment } from '@/models/comment';
import { Collectible } from '@/models/collectible';

const categories = [
    'Health',
    'Fitness',
    'Education',
    'Adventure',
    'Technology',
    'Creativity',
    'Finance',
    'Mindfulness',
];

export async function GET() {
    try {

            // // Check if today is Monday (0 = Sunday, 1 = Monday, etc.)
            // const today = new Date();
            // if (today.getDay() !== 1) {
            //     return NextResponse.json({ message: 'Today is not Monday. Task generation skipped.' });
            // }
    
    

        await dbConnect();

        await Task.deleteMany({});
        console.log('[CRON] Cleared all previous main tasks.');
        await Share.deleteMany({});
        console.log('[CRON] Cleared all previous shared tasks.');
        await Comment.deleteMany({});
        console.log('[CRON] Cleared all comments.');

        for (const category of categories) {
            const prompt = createPrompt(category);
            const tasks = await GenerateAiData(prompt);

            if (Array.isArray(tasks)) {
                await Task.insertMany(tasks);
                console.log(`[CRON] Inserted ${tasks.length} tasks for ${category}`);
            }
        }

        await Collectible.deleteMany({ type: 'chest' });
        console.log('[CRON] Removed all "chest" type collectibles from the Collectible collection.');

        const chestPrompt = createChestsPrompt();
        const newChests = await GenerateAiData(chestPrompt);

        // Insert generated chests into the Collectible collection
        if (Array.isArray(newChests)) {
            await Collectible.insertMany(newChests);
            console.log(`[CRON] Inserted ${newChests.length} chests into Collectible collection.`);
        }

        // Step 1: Find all "chest" collectible ObjectIds
        const chestCollectibles = await Collectible.find({ type: 'chest' }).select('_id');
        const chestIds = chestCollectibles.map(item => item._id);

        // Step 2: Process users in batches
        const BATCH_SIZE = 1000;
        let usersProcessed = 0;

        while (true) {
            const users = await User.find().skip(usersProcessed).limit(BATCH_SIZE);
            if (users.length === 0) break;

            // Step 3: Update assignedTasks to be empty and remove "chest" collectibles using ObjectIds
            if (chestIds.length === 0) {
                console.log('[CRON] No "chest" collectibles found, skipping removal from users.');
            } else {
                await User.updateMany(
                    { _id: { $in: users.map(user => user._id) } },
                    {
                      $set: {
                        assignedTasks: [],
                      },
                      $pull: {
                        collectibles: { $in: chestIds },
                      },
                    }
                  );
                  
                console.log(`[CRON] Cleared assigned tasks and removed "chest" collectibles for ${users.length} users.`);
            }

            usersProcessed += users.length;
        }

        return NextResponse.json({ message: 'Weekly task generation complete.' });
    } catch (error) {
        console.error('[CRON ERROR]', error);
        return NextResponse.json({ error: 'Task generation failed' }, { status: 500 });
    }
}
