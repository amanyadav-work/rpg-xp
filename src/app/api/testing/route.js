import mongoose from 'mongoose';
import { Interest as AtlasInterest } from '@/models/interest';
import { Task as AtlasTask } from '@/models/task';
import { Collectible as AtlasCollectible } from '@/models/collectible';
import { dbConnect } from '@/utils/dbConnect';

const localDbUri = 'mongodb://127.0.0.1:27017/rpg';

// export async function GET(req) {
//   let localConn;
//   try {
//     // Step 1: Connect to local MongoDB
//     localConn = await mongoose.createConnection(localDbUri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     }).asPromise();

//     // Step 2: Use same schema for local Interest model
//     const localInterestSchema = new mongoose.Schema({
//       name: { type: String, required: true },
//       imgUrl: { type: String, default: '' },
//       description: { type: String, default: '' },
//     });

//     const LocalInterest = localConn.model('Interest', localInterestSchema);

//     // Step 3: Fetch all documents from local MongoDB
//     const localInterests = await LocalInterest.find().lean();

//     // Step 4: Connect to Atlas and insert data
//     await dbConnect();

//     // Optional: Clear existing Atlas collection to avoid duplicates
//     // await AtlasInterest.deleteMany({});

//     await AtlasInterest.insertMany(localInterests);

//     return Response.json({ success: true, count: localInterests.length }, { status: 201 });
//   } catch (error) {
//     console.error('Error copying data:', error);
//     return Response.json({ success: false, error: error.message }, { status: 500 });
//   } finally {
//     if (localConn) await localConn.close();
//   }
// }



// export async function GET(req) {
//     let localConn;
//     try {
//       // Step 1: Connect to local MongoDB
//       localConn = await mongoose.createConnection(localDbUri, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       }).asPromise();

//       // Step 2: Define same schema locally
//       const localTaskSchema = new mongoose.Schema(
//         {
//           title: { type: String, required: true, trim: true },
//           shortDescription: { type: String, required: true, trim: true },
//           longDescription: { type: String, required: true, trim: true },
//           category: {
//             type: String,
//             enum: [
//               'Health',
//               'Fitness',
//               'Education',
//               'Adventure',
//               'Technology',
//               'Creativity',
//               'Finance',
//               'Mindfulness',
//             ],
//             required: true,
//           },
//           xp: { type: Number, required: true },
//           coins: { type: Number, required: true },
//           likes: { type: Number, default: 0 },
//           difficulty: {
//             type: String,
//             enum: ['Easy', 'Medium', 'Hard'],
//             default: 'Easy',
//             required: true,
//           },
//         },
//         {
//           timestamps: true,
//         }
//       );

//       const LocalTask = localConn.model('Task', localTaskSchema);

//       // Step 3: Fetch data from local DB
//       const localTasks = await LocalTask.find().lean();

//       // Step 4: Connect to Atlas and insert
//       await dbConnect();

//       // Optional: Clear existing collection
//       // await AtlasTask.deleteMany({});

//       await AtlasTask.insertMany(localTasks);

//       return Response.json(
//         { success: true, message: 'Tasks copied', count: localTasks.length },
//         { status: 201 }
//       );
//     } catch (error) {
//       console.error('Error copying tasks:', error);
//       return Response.json({ success: false, error: error.message }, { status: 500 });
//     } finally {
//       if (localConn) await localConn.close();
//     }
//   }





// export async function GET(req) {
//     let localConn;

//     try {
//       // Step 1: Connect to local MongoDB
//       localConn = await mongoose.createConnection(localDbUri, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       }).asPromise();

//       // Step 2: Re-create schemas locally
//       const localTaskSchema = new mongoose.Schema({
//         title: { type: String, required: true },
//         description: { type: String, required: true },
//       }, { _id: false });

//       const localCollectibleSchema = new mongoose.Schema({
//         name: { type: String, required: true },
//         description: { type: String, required: true },
//         image: { type: String, required: true },
//         requiredXp: { type: Number, default: 1000 },
//         requiredCoins: { type: Number, default: 3000 },
//         type: { type: String, enum: ['chest', 'common'], default: 'common' },
//         task: {
//           type: localTaskSchema,
//           required: function () {
//             return this.type === 'chest';
//           }
//         }
//       });

//       const LocalCollectible = localConn.model('Collectible', localCollectibleSchema);

//       // Step 3: Fetch from local DB
//       const localCollectibles = await LocalCollectible.find().lean();

//       // Step 4: Connect to Atlas
//       await dbConnect();

//       // Optional: Clear existing if needed
//       // await AtlasCollectible.deleteMany({});

//       // Step 5: Insert into Atlas
//       await AtlasCollectible.insertMany(localCollectibles);

//       return Response.json(
//         { success: true, message: 'Collectibles copied', count: localCollectibles.length },
//         { status: 201 }
//       );
//     } catch (error) {
//       console.error('Error copying collectibles:', error);
//       return Response.json({ success: false, error: error.message }, { status: 500 });
//     } finally {
//       if (localConn) await localConn.close();
//     }
//   }




export async function GET(req) {
    return Response.json({ status:"working" }, { status: 201 });

}