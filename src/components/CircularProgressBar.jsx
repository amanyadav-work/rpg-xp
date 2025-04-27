import { animateFlyingIcon, burstFlyingIcons } from "@/utils/helpers";
import { iconToDomNode } from "@/utils/iconToDom";
import { Coins } from "lucide-react";

export const CircularProgressBar = ({ progress, label, max = 100, progressColor, children, fn,targetId,claimed }) => {
    const radius = 50;
    const strokeWidth = 9;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / max) * circumference;

    const handleClick = (e,) => {
        if (progress >= max) {
            fn();
            const iconNode = iconToDomNode(<Coins size={24} color="gold" fill="gold" />);
    
            burstFlyingIcons({
                icon: "🔥",
                startElement: e.currentTarget,
                targetId,
                count: 5,
              });
              
        }
    };

    return (
        <div className="flex flex-col items-center justify-center"  style={{ pointerEvents: claimed ? 'none' : 'auto',filter:claimed && 'grayscale(1)' }}>
            <div className="relative w-[120px] h-[120px]">
                <svg width={120} height={120} className="absolute top-0 left-0">
                    {/* Background circle */}
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        stroke="var(--muted)"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        stroke={progressColor}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={progress >= max ? 0 : strokeDashoffset}
                        className="glow-progress"
                        transform="rotate(-90 60 60)" // only rotate this circle
                        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                    />
                </svg>
                {/* Centered RPG Flame Icon */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    {children}
                </div>
            </div>

            {/* RPG-style label */}
            <span 
  className={`mt-2 text-xs font-bold uppercase tracking-tight border px-2 py-1 rounded`} 
  style={{ color: progressColor }}
>
  {progress >= max ? (
    <span 
      onClick={(e) => handleClick(e)} 
      className={`text-xs p-3 cursor-pointer`}
      style={{ pointerEvents: claimed ? 'none' : 'auto',color:claimed ? 'gray':progressColor }} // Disable clicking if claimed
    >
      {claimed ? 'Claimed' : 'Claim'} {/* Update button text */}
    </span>
  ) : (
    label
  )}
</span>

        </div>
    );
};
