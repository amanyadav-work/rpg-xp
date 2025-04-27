import { User } from '@/models/user';
import { Task } from '@/models/task';
import { dbConnect } from '@/utils/dbConnect';

/**
 * Shuffle an array
 */
const shuffleArray = (arr) => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Assign 15 tasks to a user based on their interests
 */
export const assignTasksToUser = async (userId) => {
  try {
    await dbConnect();

    const user = await User.findById(userId).populate('interests');

    if (!user) throw new Error('User not found');

    const allTasks = await Task.find();

    const userInterests = user.interests.map(i => i.name); // category names

    const totalToAssign = 15;
    const assignedTasks = [];

    if (userInterests.length > 1) {
      // Case: 2 or more interests → assign from those interests only
      const baseCount = Math.floor(totalToAssign / userInterests.length);
      const remaining = totalToAssign % userInterests.length;

      for (let i = 0; i < userInterests.length; i++) {
        const category = userInterests[i];
        const taskCount = baseCount + (i < remaining ? 1 : 0);
        const tasks = shuffleArray(allTasks.filter(t => t.category === category)).slice(0, taskCount);

        assignedTasks.push(...tasks);
      }

    } else {
      // Case: only 1 interest → assign majority from it, rest random
      const mainCategory = userInterests[0];
      const mainTasks = shuffleArray(allTasks.filter(t => t.category === mainCategory)).slice(0, 10);
      const otherTasks = shuffleArray(
        allTasks.filter(t => t.category !== mainCategory)
      ).slice(0, 5);

      assignedTasks.push(...mainTasks, ...otherTasks);
    }

    // Save to user
    const taskRefs = assignedTasks.map(task => ({
      taskId: task._id,
      completed: false,
    }));

    user.assignedTasks = taskRefs;
    await user.save();

    return taskRefs;
  } catch (err) {
    console.error('[TASK ASSIGN ERROR]', err);
    throw err;
  }
};
