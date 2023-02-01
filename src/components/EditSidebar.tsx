import React from 'react'

export const EditSidebar: React.FC<{
  mode: 'opened' | 'closed'
  children: JSX.Element | JSX.Element[]
}> = (props) => {
  return (
    <div
      className={`
            flex
            h-full
            items-stretch overflow-x-hidden
            overflow-y-scroll border-l-2 border-slate-300
            bg-slate-200 p-2
            ${props.mode === 'opened' ? '' : 'hidden'}`}
    >
      <div>
        {/** Content */}
        <h1 className='mb-4 text-4xl'>Settings</h1>
        {props.children}
      </div>
    </div>
  )
}
