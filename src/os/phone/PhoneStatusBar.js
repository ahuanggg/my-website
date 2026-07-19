import React from 'react';
import Clock from '../Clock';

const PhoneStatusBar = () => (
    <div className='phone-statusbar'>
        <span className='phone-statusbar-left'>
            <span aria-hidden='true'>▂▄▆█</span> AndyOS
        </span>
        <span className='phone-statusbar-right'>
            <Clock />
            <span aria-hidden='true'> 🔋</span>
        </span>
    </div>
);

export default PhoneStatusBar;
