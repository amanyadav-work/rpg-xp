import { Collectible } from '@/models/collectible';
import { Task } from '@/models/task'; 
import { User } from '@/models/user';
import { dbConnect } from '@/utils/dbConnect';

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json(); // Array of { taskId, completed, _id }
    const taskIds = body.map(item => item.taskId);

    // Fetch all tasks by ID
    const tasks = await Task.find({ _id: { $in: taskIds } });

    // Merge the completed status from body with the fetched task
    const enrichedTasks = taskIds.map(taskId => {
      const assignedItem = body.find(item => item.taskId === taskId);
      const taskData = tasks.find(task => task._id.toString() === taskId);
      
          console.log("[tasks]", tasks,taskData);

      return {
        ...taskData.toObject(),
        completed: assignedItem?.completed || false,
        assignedId: assignedItem?._id || null, // Optional: to track assignedTask _id
      };
    });
    

    return Response.json({ tasks: enrichedTasks }, { status: 201 });

  } catch (err) {
    console.error('[FETCH ASSIGNED TASKS ERROR]', err);
    return Response.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}
