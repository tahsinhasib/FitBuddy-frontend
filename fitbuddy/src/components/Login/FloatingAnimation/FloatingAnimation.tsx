import React from 'react'



function FloatingIcon({
    src,
    size,
    top,
    left,
    delay,
}: {
    src: string;
    size: number;
    top: string;
    left: string;
    delay?: string;
}) {
    return (
        <img
            src={src}
            alt=""
            className="absolute opacity-20 animate-floating"
            style={{
                width: `${size}px`,
                height: `${size}px`,
                top,
                left,
                animationDelay: delay || '0s',
            }}
        />
    );
}


export default function FloatingAnimation() {
    return (
        <>
            {/* Animated Background Icons */}
            <div className="absolute inset-0 pointer-events-none">
                <FloatingIcon
                    src="https://img.icons8.com/?size=100&id=CFuW6MZtcW3E&format=png&color=000000" // dumbbell
                    size={100}
                    top="20%"
                    left="15%"
                    delay="0s"
                />
                <FloatingIcon
                    src="https://img.icons8.com/?size=100&id=35583&format=png&color=000000" // heart rate
                    size={100}
                    top="40%"
                    left="80%"
                    delay="2s"
                />
                <FloatingIcon
                    src="https://img.icons8.com/?size=100&id=3005&format=png&color=000000" // chart
                    size={100}
                    top="70%"
                    left="40%"
                    delay="1s"
                />
            </div>
        </>
    )
}
