import React from 'react'
import Key from '../Key/page'

const Keyboard = () => {
  return (
    <div className='flex flex-col gap-2'>
        <div className='flex gap-2'>
            <Key label="Esc" />
            <Key label="1" />
            <Key label="2" />
            <Key label="3" />
            <Key label="4" />
            <Key label="5" />
            <Key label="6" />
            <Key label="7" />
            <Key label="8" />
        </div>
        <div className='flex gap-2'>
            <Key label="Tab" variant='tab'/>
            <Key label="Q" />
            <Key label="W" />
            <Key label="E" />
            <Key label="R" />
            <Key label="T" />
            <Key label="Y" />
            <Key label="U" />
        </div>
        <div className='flex gap-2'>
            <Key label="Caps" variant='tab'/>
            <Key label="A" />
            <Key label="S" />
            <Key label="D" />
            <Key label="F" />
            <Key label="G" />
            <Key label="H" />
            <Key label="J" />
        </div>
        <div className='flex gap-2'>
            <Key label="Shift" variant='shift'/>
            <Key label="Z" />
            <Key label="X" />
            <Key label="C" />
            <Key label="V" />
            <Key label="B" />
            <Key label="N" />
            <Key label="M" />
        </div>
        <div className='flex gap-2'>
            <Key label="^"/>
            <Key label="fn" />
            <Key label="cmd" />
            <Key label="space" variant='space'/>
            <Key label="cmd" />
        </div>  
    </div>
  )
}

export default Keyboard