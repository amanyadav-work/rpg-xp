import { ArrowRight, ArrowUpRight, CircleArrowRight, Files, Settings } from "lucide-react";


import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TimeLineSlider from "@/components/ui/TimeLineSlider";
import Link from "next/link";

const Page = () => {
  return (
    <div className="container max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      <section className="py-32 mx-auto w-fit">
        <div className="container">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              {/* Badge */}
              <Badge variant="outline">
                ✨ Your Life, Your Quest
                <ArrowUpRight className="ml-2 size-4" />
              </Badge>

              {/* Heading */}
              <h1 className="my-6 text-4xl font-bold text-pretty lg:text-8xl gradient-title bg-[linear-gradient(to_right,_rgb(68_17_17),_rgb(89_32_32),_rgb(123_0_0),_#ab0303)] dark:bg-[linear-gradient(to_right,_rgb(67,78,85),_rgb(251,249,223),_rgb(240,209,166),_rgb(207,176,148))]" >
                Level Up Your Life With ⨯Ᵽ
              </h1>

              {/* Description */}
              <p className="mb-8 max-w-xl text-muted-foreground lg:text-lg">
                XP Life transforms your personal growth into an epic RPG. Track habits, complete challenges, and earn XP as you level up your real-life skills.
              </p>

              {/* Buttons */}
              <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
                {/* Primary Button */}
                <Button variant='destructive' asChild className="w-full sm:w-auto">
                  <Link href="/dashboard">Start Your Adventure</Link>
                </Button>

                {/* Secondary Button */}
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <a href="https://github.com/xplife">Join Our Guild</a>
                </Button>
              </div>
            </div>

            {/* Image */}
            <img
              src="Random/_5c4cb1c1-b0b5-4276-bff0-7be640204e87.jpeg" // Keep this image or replace with one that fits your theme
              alt="XP Life RPG showing user progress and challenges"
              className="max-h-96 w-full rounded-md object-cover object-top"
            />
          </div>
        </div>
      </section>



      <TimeLineSlider />



      <section className="py-32">
        <div className="container flex flex-col gap-28">
          {/* Intro / Mission Section */}
          <div className="grid gap-6 md:grid-cols-2">
            <img
              src="Random\_43f27961-9038-459a-9aa0-b04ef8d8155a.jpeg"
              alt="placeholder"
              className="size-full max-h-96 rounded-2xl object-cover object-top"
            />
            <div className="flex flex-col justify-between gap-10 rounded-2xl bg-muted p-10">
              <p className="text-sm text-muted-foreground ">YOUR QUEST BEGINS</p>
              <p className="text-lg font-medium">
                You&apos;re not just living life—you are leveling it up. Choose your class, complete real-life quests, and grow in strength, focus, and confidence. This isn’t just a to-do list—it’s your hero’s journey.
              </p>
            </div>
          </div>

          {/* Vision + Character Avatars */}
          <div className="flex flex-col gap-6 md:gap-20">
            <div className="flex justify-between items-center">
              <div className="max-w-xl">
                <h2 className="mb-2.5 text-3xl font-semibold md:text-5xl">
                  Unlock your potential.
                </h2>
                <p className="text-muted-foreground">
                  Whether you&apos;re training your body, expanding your mind, or mastering your craft—our mission is to guide you to your next evolution. Your rivals are procrastination and self-doubt. Let’s crush them.
                </p>
              </div>
              {/* Character Avatars */}
              <div className="flex items-center -space-x-1 transition-all duration-300">
                {[
                  "Characters/_71b2e70b-b603-4fae-89eb-b6505240071d.jpeg",
                  "Characters/_78fb855a-5810-4261-b677-77fbfc1b630e.jpeg",
                  "Characters/_3652a0a2-c0a3-4fae-931b-3c21ee058d41.jpeg",
                  "Characters/_2a7c99b2-7373-4680-9a4a-3ca7f1c4e924.jpeg",
                ].map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt=""
                    className="w-20 h-20 object-cover object-top rounded-full ring-2 ring-muted transition-transform duration-300 hover:z-10 hover:scale-110 "
                  />
                ))}
              </div>
            </div>

            {/* Feature Blocks */}
            <div className="grid gap-10 md:grid-cols-3">
              <div className="flex flex-col " style={{ backgroundImage: "Characters/_831fac83-5db3-4841-aba0-a63345103827.jpeg" }}>
                <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-accent">
                  <Files className="size-5" />
                </div>
                <h3 className="mt-2 mb-3 text-lg font-semibold">
                  Choose your class
                </h3>
                <p className="text-muted-foreground">
                  Whether you&apos;re a Fitness Warrior, Focus Monk, or Study Mage—pick your path and unlock themed quests that help you grow every day.
                </p>
              </div>
              <div className="flex flex-col">
                <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-accent">
                  <CircleArrowRight className="size-5" />
                </div>
                <h3 className="mt-2 mb-3 text-lg font-semibold">
                  Complete quests, gain XP
                </h3>
                <p className="text-muted-foreground">
                  Daily habits become missions. Each completed task boosts your stats and earns XP to level up your character—and your life.
                </p>
              </div>
              <div className="flex flex-col">
                <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-accent">
                  <Settings className="size-5" />
                </div>
                <h3 className="mt-2 mb-3 text-lg font-semibold">
                  Master your stats
                </h3>
                <p className="text-muted-foreground">
                  Track real-life attributes like Strength, Wisdom, Charisma, and Energy. Leveling up isn’t just visual—it’s transformational.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <p className="mb-10 text-sm font-medium text-muted-foreground">
                JOIN THE GUILD
              </p>
              <h2 className="mb-2.5 text-3xl font-semibold md:text-5xl">
                Become the hero of your own story
              </h2>
            </div>
            <div>
              <img
                src="https://shadcnblocks.com/images/block/placeholder-1.svg"
                alt="placeholder"
                className="mb-6 max-h-36 w-full rounded-xl object-cover"
              />
              <p className="text-muted-foreground">
                Ready to transform your routine into a legendary journey? Step into a world where every task matters and every day is a chance to level up.
              </p>
            </div>
          </div>
        </div>
      </section>




    </div>
  );
};

export default Page;
