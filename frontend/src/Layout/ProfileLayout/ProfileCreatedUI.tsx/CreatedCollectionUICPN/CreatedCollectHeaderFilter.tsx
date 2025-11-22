import React from 'react'
import BTNCreatedCollectNavBar from './BTNCreatedCollectNavBar'

const CreatedCollectHeaderFilter = () => {
  return (
    <>
      <div className='flex justify-between bg-amber-400 p-2  container mx-auto '>
        <BTNCreatedCollectNavBar></BTNCreatedCollectNavBar>
        <BTNCreatedCollectNavBar></BTNCreatedCollectNavBar>
      </div>
    </>
  )
}

export default CreatedCollectHeaderFilter