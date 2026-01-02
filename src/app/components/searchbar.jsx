import React from 'react'

const Searchbar = () => {
  return (
  <div className="mb-6 w-[75%]">
    <input
      type="text"
      placeholder="Search posts..."
      className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
  )
}

export default Searchbar