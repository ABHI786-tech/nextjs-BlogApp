import React from 'react'

export const FilterPosts = (posts, search) => {
  if (!search) return posts;

  return posts.filter((post) =>
    post.title?.toLowerCase().includes(search.toLowerCase()) ||
    post.content?.toLowerCase().includes(search.toLowerCase())
  );
};


export const Searchbar = ({value, onChange}) => {
  return (
  <>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="Search posts..."
      className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
    />
  </>
  )
}

