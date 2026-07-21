import React from 'react';

// Stylized homage to the Windows XP "Bliss" desktop wallpaper: deep blue sky,
// soft cumulus clouds, and a rolling green hill. Recreated entirely with SVG
// gradients and blurred ellipses — no binary asset, since the real photograph
// is Microsoft's copyrighted work (see HANDOFF.md: background.png was
// deliberately deleted in the AndyOS rebuild). This is a static illustration,
// not a reproduction.
//
// The fixed 1600x900 viewBox plus preserveAspectRatio="xMidYMid slice" makes
// it behave like `background-size: cover`: the composition scales up and
// crops to fill any aspect ratio (ultrawide desktop, small laptop, phone
// portrait) while always showing the full sky-to-hill vertical sweep.
const Wallpaper = () => (
    <svg
        className='bliss-wallpaper-svg'
        viewBox='0 0 1600 900'
        preserveAspectRatio='xMidYMid slice'
        role='presentation'
        aria-hidden='true'
        focusable='false'
    >
        <defs>
            <linearGradient id='bliss-sky' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#0d3f8f' />
                <stop offset='25%' stopColor='#1655b8' />
                <stop offset='50%' stopColor='#2f74d6' />
                <stop offset='72%' stopColor='#6fa3e6' />
                <stop offset='88%' stopColor='#b7d9f5' />
                <stop offset='100%' stopColor='#e4f2fc' />
            </linearGradient>
            <linearGradient id='bliss-hill' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#a5d84a' />
                <stop offset='16%' stopColor='#82c637' />
                <stop offset='42%' stopColor='#57a832' />
                <stop offset='70%' stopColor='#33852b' />
                <stop offset='100%' stopColor='#1a5a22' />
            </linearGradient>
            <clipPath id='bliss-hill-clip'>
                <path d='M0,705 C180,672 360,556 620,532 C880,508 1180,596 1600,646 L1600,900 L0,900 Z' />
            </clipPath>
            <filter id='bliss-blur-cloud' x='-50%' y='-50%' width='200%' height='200%'>
                <feGaussianBlur stdDeviation='10' />
            </filter>
            <filter id='bliss-blur-soft' x='-60%' y='-60%' width='220%' height='220%'>
                <feGaussianBlur stdDeviation='26' />
            </filter>
        </defs>

        {/* Sky */}
        <rect x='0' y='0' width='1600' height='900' fill='url(#bliss-sky)' />

        {/* Clouds — each group is a soft blue-grey shadow tone under white highlight puffs */}
        <g filter='url(#bliss-blur-cloud)'>
            <ellipse cx='335' cy='248' rx='118' ry='40' fill='#c7d9ec' opacity='0.55' />
            <ellipse cx='440' cy='238' rx='140' ry='46' fill='#c7d9ec' opacity='0.5' />
            <ellipse cx='330' cy='224' rx='108' ry='40' fill='#ffffff' />
            <ellipse cx='425' cy='200' rx='130' ry='50' fill='#ffffff' />
            <ellipse cx='515' cy='222' rx='90' ry='36' fill='#ffffff' />
            <ellipse cx='395' cy='180' rx='64' ry='30' fill='#ffffff' />
        </g>
        <g filter='url(#bliss-blur-cloud)'>
            <ellipse cx='860' cy='175' rx='95' ry='34' fill='#c7d9ec' opacity='0.5' />
            <ellipse cx='880' cy='155' rx='60' ry='26' fill='#ffffff' />
            <ellipse cx='930' cy='150' rx='108' ry='42' fill='#ffffff' />
            <ellipse cx='1000' cy='172' rx='76' ry='30' fill='#ffffff' />
        </g>
        <g filter='url(#bliss-blur-cloud)'>
            <ellipse cx='1290' cy='235' rx='72' ry='26' fill='#c7d9ec' opacity='0.45' />
            <ellipse cx='1290' cy='222' rx='55' ry='22' fill='#ffffff' />
            <ellipse cx='1345' cy='218' rx='62' ry='24' fill='#ffffff' />
        </g>
        <g filter='url(#bliss-blur-cloud)'>
            <ellipse cx='1460' cy='100' rx='95' ry='15' fill='#ffffff' opacity='0.7' />
            <ellipse cx='1545' cy='88' rx='72' ry='12' fill='#ffffff' opacity='0.6' />
        </g>
        <g filter='url(#bliss-blur-cloud)'>
            <ellipse cx='185' cy='415' rx='82' ry='22' fill='#c7d9ec' opacity='0.4' />
            <ellipse cx='240' cy='405' rx='58' ry='18' fill='#ffffff' opacity='0.85' />
        </g>

        {/* Horizon haze — drawn under the hill so only a thin glow band peeks above it */}
        <ellipse cx='800' cy='600' rx='900' ry='60' fill='#eef8ff' opacity='0.45' filter='url(#bliss-blur-soft)' />

        {/* Rolling hill — one broad crest peaking left of centre, sloping away right */}
        <path d='M0,705 C180,672 360,556 620,532 C880,508 1180,596 1600,646 L1600,900 L0,900 Z' fill='url(#bliss-hill)' />
        <g clipPath='url(#bliss-hill-clip)'>
            {/* sunlit band hugging the crest, and a deeper shadow pooling in the foreground */}
            <ellipse cx='620' cy='585' rx='420' ry='70' fill='#d3ef7e' opacity='0.3' filter='url(#bliss-blur-soft)' />
            <ellipse cx='300' cy='900' rx='700' ry='190' fill='#14491c' opacity='0.35' filter='url(#bliss-blur-soft)' />
            <ellipse cx='1500' cy='880' rx='420' ry='150' fill='#14491c' opacity='0.25' filter='url(#bliss-blur-soft)' />
        </g>
    </svg>
);

export default Wallpaper;
