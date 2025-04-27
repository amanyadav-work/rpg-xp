// app/api/share/route.js
import { dbConnect } from '@/utils/dbConnect';
import { Share } from '@/models/share';
import { Task } from '@/models/task';
import { User } from '@/models/user'; // assuming this is your user model


export async function GET(req) {
    try {
      await dbConnect();
  
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get('userId');
  
      if (!userId) {
        return Response.json({ message: 'User ID is required.' }, { status: 400 });
      }
  
      const shares = await Share.find({ to: userId })
        .populate('from', 'name image username')
        .populate('taskId')
        .sort({ createdAt: -1 });
  
      const groupedTasks = new Map();
  
      shares.forEach(share => {
        const taskId = share.taskId._id.toString();
  
        if (!groupedTasks.has(taskId)) {
          const { _id, ...taskData } = share.taskId.toObject();
          groupedTasks.set(taskId, {
            _id: taskId,  // Use _id for taskId
            ...taskData,
            from: []  // Array of users who shared the task
          });
        }
  
        groupedTasks.get(taskId).from.push({
          _id: share.from._id.toString(),  // Use _id for userId
          name: share.from.name,
          username: share.from.username,
          image: share.from.image,
          message: share.message
        });
      });
  
      const tasks = Array.from(groupedTasks.values());
  
      return Response.json({ tasks: [...tasks] }, { status: 201 });
  
    } catch (error) {
      console.error('Error fetching shared tasks:', error);
      return Response.json({ message: 'Failed to fetch shared tasks.' }, { status: 500 });
    }
  }
  
  

export async function POST(req) {
    try {
        await dbConnect();

        const body = await req.json();
        const { taskId, from, username, email, message } = body;

        if (!taskId || !from || !username || !email || !message) {
            return Response.json({ message: 'Missing required fields' }, { status: 400 });
        }


        // Check if user with given username and email exists
        const recipient = await User.findOne({ username, email });

        if (!recipient) {
            return Response.json({ message: 'Recipient user not found' }, { status: 404 });
        }

        // Create share entry
        const share = await Share.create({
            taskId,
            from,
            to: recipient._id,
            message,
        });

        return Response.json({ success: true, recipient }, { status: 201 });

    } catch (err) {
        console.error('[SHARE TASK ERROR]', err);
        return Response.json({ message: 'Failed to share task' }, { status: 500 });
    }
}
