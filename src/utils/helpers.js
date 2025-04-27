import { formatDistanceToNowStrict } from 'date-fns';


export function getRankSymbol(xp) {
  if (xp >= 0 && xp <= 999) {
    return "α";  // Initiate
  } else if (xp >= 1000 && xp <= 2999) {
    return "ϝ";  // Disciple
  } else if (xp >= 3000 && xp <= 5999) {
    return "Δ";  // Vanguard
  } else if (xp >= 6000 && xp <= 9999) {
    return "Δ";  // Blader
  } else if (xp >= 10000 && xp <= 14999) {
    return "Ϟ";  // Slayer
  } else if (xp >= 15000 && xp <= 19999) {
    return "ᛉ";  // Reaper
  } else if (xp >= 20000 && xp <= 24999) {
    return "Φ";  // Warden
  } else if (xp >= 25000 && xp <= 29999) {
    return "☥";  // Finisher
  } else if (xp >= 30000 && xp <= 39999) {
    return "Ω";  // Champion
  } else if (xp >= 40000) {
    return "𓂀";  // Ascendant
  } else {
    return "Invalid XP";  // If XP is out of range
  }
}


export function getCharacterData(xp) {
  if (xp >= 0 && xp <= 999) {
    return {
      img: "/Characters/Rank01_BlazeKnight[1].png",
      name: "Blaze Knight",
      description: "The Blaze Knight is a fiery and courageous individual, with a heart full of determination and a drive to conquer challenges. They often charge into tasks with a lot of enthusiasm but may need to work on refining their focus and consistency. Much like their flame-colored armor and intense eyes, they approach each day with eagerness and boldness, though they might be prone to taking on too many things at once. As a Blaze Knight, they dive into activities with passion but may struggle with completing them all. They are always looking for new ways to challenge themselves.",
      color: "#FF5733" // Red-Orange for Blaze Knight
    };
  } else if (xp >= 1000 && xp <= 2999) {
    return {
      img: "/Characters/Rank02_ShadowNinja[1].png",
      name: "Shadow Ninja",
      description: "The Shadow Ninja is stealthy, strategic, and reflective. They approach tasks with precision, taking their time to assess situations before acting. With their dark, sleek appearance and shadowy attire, they blend in seamlessly with their surroundings, often working behind the scenes. This personality is great at quiet, introspective tasks and thrives in focused environments. They may prefer solo activities where they can challenge their own skills without distractions, and they're adept at using subtle methods to solve problems. They excel at tasks that require calm, patience, and careful thought.",
      color: "#2E2E2E" // Dark Gray/Purple for Shadow Ninja
    };
  } else if (xp >= 3000 && xp <= 5999) {
    return {
      img: "/Characters/Rank03_AquaSamurai[1].png",
      name: "Aqua Samurai",
      description: "The Aqua Samurai is disciplined, balanced, and graceful. Much like their appearance — clad in cool, flowing blue armor — they approach each task with a sense of purpose and equilibrium. They are calm under pressure and navigate through challenges with ease. They excel at balancing both mental and physical tasks, focusing on long-term growth and personal well-being. This character is all about finding harmony in their actions and seeks out tasks that align with both body and mind. They enjoy tasks that bring peace and tranquility while also offering an opportunity to improve.",
      color: "#007ACC" // Aqua Blue for Aqua Samurai
    };
  } else if (xp >= 6000 && xp <= 9999) {
    return {
      img: "/Characters/Rank04_ThunderMage[1].png",
      name: "Thunder Mage",
      description: "The Thunder Mage is a force of nature — energetic, powerful, and full of vibrant energy. Their crackling, electric presence is felt as they take on new challenges with enthusiasm and excitement. Much like their glowing armor, they shine brightly in the face of adversity, but their energy can sometimes feel scattered. They're natural motivators, always ready to inspire others, but they must learn to focus and harness their power carefully. This character is quick to act, and they excel in high-energy tasks that require rapid decision-making and innovative thinking.",
      color: "#FFD700" // Electric Yellow for Thunder Mage
    };
  } else if (xp >= 10000 && xp <= 14999) {
    return {
      img: "/Characters/Rank05_IronFist[1].png",
      name: "Iron Fist",
      description: "The Iron Fist is a stoic, unyielding force of nature. Strong, focused, and persistent, they take on the toughest challenges with resolve and resilience. Their muscular, battle-ready appearance mirrors their inner strength. They are excellent at completing tasks that require grit, determination, and long-term commitment. The Iron Fist thrives on hard work and discipline, taking on projects that others might shy away from. With unwavering focus, they get the job done — nothing will stop them from achieving their goals once they set their mind to it.",
      color: "#B5651D" // Iron Gray and Dark Red for Iron Fist
    };
  } else if (xp >= 15000 && xp <= 19999) {
    return {
      img: "/Characters/Rank06_VenomViper[1].png",
      name: "Venom Viper",
      description: "The Venom Viper is fast, cunning, and adaptable. Like the sleek, venomous appearance of their armor, they approach tasks with quick wit and sharp strategy. Always a step ahead, they excel in situations that require swift decision-making and agility. Their natural charisma allows them to charm and outmaneuver obstacles with ease, but they also have a biting edge when needed. Their tasks are usually quick and effective, requiring a balance between rapid action and subtlety. They are always prepared to strike when the moment is right, with their sharp focus on immediate objectives.",
      color: "#00FF00" // Venom Green for Venom Viper
    };
  } else if (xp >= 20000 && xp <= 24999) {
    return {
      img: "/Characters/Rank07_StormRider[1].png",
      name: "Storm Rider",
      description: "The Storm Rider is bold, adventurous, and always ready for the next big challenge. Like their armor that mirrors a storm, they embrace uncertainty and thrive in unpredictable situations. The Storm Rider is a natural leader, guiding others through chaotic times while remaining calm and focused. They take on tasks with a sense of freedom and adventure, often juggling multiple projects at once. Their energy is unstoppable, and they inspire those around them to take on big challenges, face adversity head-on, and take risks in order to grow.",
      color: "#607D8B" // Stormy Gray for Storm Rider
    };
  } else if (xp >= 25000 && xp <= 29999) {
    return {
      img: "/Characters/Rank08_CrimsonWolf[1].png",
      name: "Crimson Wolf",
      description: "The Crimson Wolf is a fierce protector, loyal to their cause and those they care about. With their crimson red armor, they command respect and stand unyielding in the face of challenges. This character is disciplined and focused, always with a clear vision of what they want to achieve. Their approach to tasks is methodical and determined, tackling each obstacle with a warrior's spirit. They are excellent at leading teams and collaborating with others, yet they're also capable of handling challenges alone when needed. Loyalty and strength define the Crimson Wolf's path.",
      color: "#D32F2F" // Crimson Red for Crimson Wolf
    };
  } else if (xp >= 30000 && xp <= 39999) {
    return {
      img: "/Characters/Rank09_PhantomBlade[1].png",
      name: "Phantom Blade",
      description: "The Phantom Blade is elusive, strategic, and always a step ahead. With their dark armor blending into the shadows, they move with an air of mystery and skill. This character excels in environments that require intelligence, quick thinking, and precision. The Phantom Blade is a master tactician, solving problems with calculated decisions and working behind the scenes to achieve their goals. They are self-reliant and prefer tasks that allow them to use their keen intellect to outmaneuver obstacles. Subtlety, speed, and foresight are their greatest strengths.",
      color: "#1A3A4C" // Phantom Dark Green for Phantom Blade
    };
  } else if (xp >= 40000) {
    return {
      img: "/Characters/Rank10_SilverGhost[1].png",
      name: "Silver Ghost",
      description: "The Silver Ghost is an ethereal and legendary figure, known for their wisdom and mastery of both mind and body. Their silver armor radiates tranquility, embodying the balance between strength and inner peace. As a Silver Ghost, this character is the ultimate mentor, guiding others with their profound insights and calm demeanor. They have seen it all and use their experience to help others grow, taking on tasks that require deep reflection and understanding. Their calm presence and vast knowledge make them the perfect guide through life's challenges, offering wisdom and clarity to those around them.",
      color: "#B0BEC5" // Silver and White for Silver Ghost
    };
  } else {
    return null; // Invalid XP
  }
}




export function darkenHexColor(hex, factor = 0.2) {
  // Remove the hash if present
  hex = hex.replace(/^#/, '');

  // Convert hex to RGB
  let r = parseInt(hex.substr(0, 2), 16);
  let g = parseInt(hex.substr(2, 2), 16);
  let b = parseInt(hex.substr(4, 2), 16);

  // Darken the RGB values by the factor (between 0 and 1)
  r = Math.max(0, r - r * factor);
  g = Math.max(0, g - g * factor);
  b = Math.max(0, b - b * factor);

  // Convert back to hex and return
  const darkenedHex = `#${((1 << 24) | (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b)).toString(16).slice(1)}`;
  return darkenedHex;
}



export function getMotivationalChestMessage(name = "") {
  const theme = name.split(" ")[0]; // e.g., "Gratitude" from "Gratitude Chest"
  const variations = [
    `Purchase this chest to unlock meaningful ${theme}-inspired tasks that challenge you to grow. Embrace the journey — your rewards await!`,
    `Unlock powerful ${theme}-themed challenges inside this chest. Take the first step — greatness starts here!`,
    `This chest holds ${theme}-based tasks that spark growth and reflection. Ready to level up?`,
    `Embrace the path of ${theme}. Open the chest, conquer the task, and rise stronger.`,
    `Unlock a ${theme}-driven journey inside this chest. Discover, reflect, and evolve.`,
    `Dive into ${theme}-inspired challenges and uncover rewards that go beyond the game.`,
    `This chest contains lessons of ${theme}. Open it, grow through action, and earn your reward.`,
    `Unleash the spirit of ${theme}. One task. One step. Infinite growth.`,
  ];

  // Return one randomly
  return variations[Math.floor(Math.random() * variations.length)];
}

export const getColorByCategory = () => {
  const tailwindClasses = [
    'bg-blue-100 border-blue-200',
    'bg-orange-100 border-orange-200',
    'bg-rose-100 border-rose-200',
    'bg-green-100 border-green-200',
    'bg-purple-100 border-purple-200',
  ];

  const random = tailwindClasses[Math.floor(Math.random() * tailwindClasses.length)];
  return random;
};


export function formatDistanceShort(date) {
  const full = formatDistanceToNowStrict(new Date(date), { addSuffix: false });

  const replacements = [
    { long: 'seconds', short: 's' },
    { long: 'second', short: 's' },
    { long: 'minutes', short: 'm' },
    { long: 'minute', short: 'm' },
    { long: 'hours', short: 'h' },
    { long: 'hour', short: 'h' },
    { long: 'days', short: 'd' },
    { long: 'day', short: 'd' },
    { long: 'months', short: 'mo' },
    { long: 'month', short: 'mo' },
    { long: 'years', short: 'yr' },
    { long: 'year', short: 'yr' },
  ];

  let short = full;
  replacements.forEach(({ long, short: s }) => {
    short = short.replace(long, s);
  });

  return `${short} ago`;
}



export const createPrompt = (category) => {
  const prompt = `You're a helpful task generator for a productivity and wellness app.

Generate 10 micro-tasks under the category "${category}". These tasks should be short, actionable, and motivating. Each task must include the following fields:

{
  "title": "string - short and action-oriented",
  "shortDescription": "string - around 13 words summarizing the task",
  "longDescription": "string - friendly, helpful instruction (~60–65 words)",
  "category": "${category}", // must exactly match the given category
  "xp": number - experience points between 50 and 300,
  "coins": number - virtual coins between 100 and 300,
  "difficulty": "Easy" | "Medium" | "Hard"
}

Return a JSON array of exactly 10 such tasks.

Rules:
- Keep all string values concise, clear, and human-friendly
- Match the field names and types exactly
- The category must match "${category}" exactly
- Ensure the shortDescription is about 13 words
- Ensure the longDescription is around 60–65 words
- xp must be an integer between 50 and 300
- coins must be an integer between 100 and 300
- Do not include any notes, markdown, or explanation — only a valid JSON array
`;

  return prompt;
};



export const createChestsPrompt = () => {
  // Generate the prompt for Groq AI to create 15 chests with tasks and relevant data in MongoDB format
  return `
    Generate an array of 15 unique chests for a productivity and wellness app. Each chest should have the following fields:

    - Name: A two-word, dynamic name for the chest.
    - Description: A brief three-word description of the chest.
    - Image: Provide an image URL for each chest based on the complexity of the task. 
      Choose an image based on the task complexity:
      - Simple tasks: Images from URLs 1 or 2.
      - Moderate tasks: Images from URLs 3 or 4.
      - Complex tasks: Images from URLs 5-10.
      Use the following image URLs:
      ["https://via.placeholder.com/150?text=Image+1", "https://via.placeholder.com/150?text=Image+2", "https://via.placeholder.com/150?text=Image+3", "https://via.placeholder.com/150?text=Image+4", "https://via.placeholder.com/150?text=Image+5", "https://via.placeholder.com/150?text=Image+6", "https://via.placeholder.com/150?text=Image+7", "https://via.placeholder.com/150?text=Image+8", "https://via.placeholder.com/150?text=Image+9", "https://via.placeholder.com/150?text=Image+10"].
    - Required XP: A random number between 500 and 8000.
    - Required Coins: A random number between 500 and 8000.
    - Type: "chest".
    - Task: A unique task with:
        - Title: A brief title.
        - Description: A short description (60-65 words) explaining the task in a fun and engaging way.

    Return a JSON array of exactly 15 chests formatted like this, with **NO additional notes, explanations, or markdown** — just the JSON.

    {
      "name": "<Chest Name>",
      "description": "<Chest Description>",
      "image": "<Chest Image URL>",
      "requiredXp": <Random XP>,
      "requiredCoins": <Random Coins>,
      "type": "chest",
      "task": {
        "title": "<Task Title>",
        "description": "<Task Description>"
      }
    }
  `;
};







export const getOrGenerateWeeklyGoal = (tasks) => {
  if (!tasks || tasks.length === 0) return { xpGoal: 0, coinsGoal: 0 };

  const now = new Date();
  const year = now.getFullYear();
  const week = Math.ceil(((now - new Date(year, 0, 1)) / 86400000 + new Date(year, 0, 1).getDay() + 1) / 7);
  const currentWeekKey = `${year}-W${week}`;

  const storageKey = "weeklyGoal";
  const stored = localStorage.getItem(storageKey);

  if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.weekKey === currentWeekKey) {
          return parsed.goal;
      }
  }

  const totalXP = tasks.reduce((sum, t) => sum + t.xp, 0);
  const totalCoins = tasks.reduce((sum, t) => sum + t.coins, 0);
  
  const xpGoal = Math.floor(totalXP * (0.35 + Math.random() * 0.25)); // Deduct between 35% and 60%
  const coinsGoal = Math.floor(totalCoins * (0.35 + Math.random() * 0.25)); // Deduct between 35% and 60%
  

  const goal = { xpGoal, coinsGoal };
  localStorage.setItem(storageKey, JSON.stringify({ weekKey: currentWeekKey, goal }));

  return goal;
};


export const updateWeeklyProgress = (xpEarned, coinsEarned, target) => {
  const now = new Date();
  const year = now.getFullYear();
  const week = Math.ceil(((now - new Date(year, 0, 1)) / 86400000 + new Date(year, 0, 1).getDay() + 1) / 7);
  const currentWeekKey = `${year}-W${week}`;

  const storageKey = "weeklyProgress";
  const stored = JSON.parse(localStorage.getItem(storageKey));

  // If data for the current week already exists
  if (stored && stored.weekKey === currentWeekKey) {
    // Create a copy of the existing data
    const updatedProgress = { 
      ...stored,
      xp: stored.xp + xpEarned, 
      coins: stored.coins + coinsEarned, 
      claimed: { 
        ...stored.claimed, 
        [target]: true  // Mark as claimed for the correct target
      }
    };
    
    // Save the updated data back to localStorage
    localStorage.setItem(storageKey, JSON.stringify(updatedProgress));
  } else {
    // If no data for the current week, create new progress object
    const newProgress = { 
      weekKey: currentWeekKey,
      xp: xpEarned, 
      coins: coinsEarned, 
      claimed: { 
        xp: target === "xp", 
        coins: target === "coins"
      }
    };
    
    // Save the new progress data to localStorage
    localStorage.setItem(storageKey, JSON.stringify(newProgress));
  }
};


export const getWeeklyProgress = () => {
  const now = new Date();
  const year = now.getFullYear();
  const week = Math.ceil(((now - new Date(year, 0, 1)) / 86400000 + new Date(year, 0, 1).getDay() + 1) / 7);
  const currentWeekKey = `${year}-W${week}`;

  const storageKey = "weeklyProgress";
  const stored = JSON.parse(localStorage.getItem(storageKey));

  if (stored && stored.weekKey === currentWeekKey) {
    return {
      xp: stored.xp,
      coins: stored.coins,
      claimed: stored.claimed || { xp: false, coins: false },
    };
  }

  return {
    xp: 0,
    coins: 0,
    claimed: { xp: false, coins: false },
  };
};


// emptyStateMessages.js

export const getRandomCollectibleMessage = () => {
  const messages = [
      "No collectibles yet... but every legend starts somewhere 🌟",
      "Collectibles: 0. Potential: Infinite 🚀",
      "You're just getting started — greatness awaits! ✨",
      "No treasures yet, but the hunt has just begun 🔍",
      "Start collecting, start flexing 💎",
      "Nothing here... yet. Your journey is about to get shiny 🔮",
      "One day this will be filled with glory. Today is day one 🛡️",
      "Heroes earn their rewards. You're on your way 🏆",
      "Collectibles are waiting — go grab them! 🎯",
      "This space looks lonely. Time to fill it with fire 🔥",
      "Your vault is empty, your destiny isn't 🧭",
      "No badges of honor yet — let’s change that 🥇",
      "Even dragons start with empty hoards 🐉",
      "Make every task count. Your stash will grow 🌱",
      "No collectibles now, but legends never stay empty-handed ⚔️"
  ];

  return messages[Math.floor(Math.random() * messages.length)];
};

export const getRandomChestMessage = () => {
  const messages = [
      "No chests yet... but your fortune awaits 💰",
      "Empty chest slots. Sounds like a challenge 🗝️",
      "Your vault is craving some loot 🔐",
      "Treasureless, not hopeless. Adventure awaits! 🏔️",
      "Nothing to open — yet. Go claim your rewards 🧭",
      "Every champion needs a chest day 🧱",
      "Locked and empty... for now 🛑",
      "The treasure trail begins here 🧡",
      "Time to grind for gold and glory 🥇",
      "You’ve got space. Fill it with treasures 📦",
      "Chestless but not quest-less 🧩",
      "Empty pockets make room for riches 💎",
      "Silence before the gold rush 🌪️",
      "Soon this space will shine ✨",
      "The loot gods are watching. Stay hungry 👀"
  ];

  return messages[Math.floor(Math.random() * messages.length)];
};


export const animateFlyingIcon = ({ icon = "🪙", startElement, targetId }) => {
  const startRect = startElement.getBoundingClientRect();
  const target = document.getElementById(targetId);
  if (!target) return;

  const endRect = target.getBoundingClientRect();
  const flying = document.createElement("div");

  flying.className = "fixed z-[9999] pointer-events-none text-lg transition-all duration-700 ease-in-out";
  flying.style.left = `${startRect.left}px`;
  flying.style.top = `${startRect.top}px`;
  flying.innerHTML = icon;

  document.body.appendChild(flying);

  requestAnimationFrame(() => {
    flying.style.transform = `translate(${endRect.left - startRect.left}px, ${endRect.top - startRect.top}px) scale(1.5)`;
    flying.style.opacity = "0";
  });

  setTimeout(() => flying.remove(), 800);
};

export const burstFlyingIcons = ({
  icon,
  startElement,
  targetId,
  count = 5,
  delay = 250,
  randomize = true,
}) => {
  for (let i = 0; i < count; i++) {
    const timeout = randomize
      ? delay * i 
      : delay * i;

    setTimeout(() => {
      animateFlyingIcon({
        icon,
        startElement,
        targetId,
      });
    }, timeout);
  }
};

