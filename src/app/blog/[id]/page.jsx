import ViewBlog from '../../components/viewBlog'
export  const generateMetadata = async ({params})=>{
   const { id } = await params;
return { title: id}
}

const page = () => {
  return (
    <>
    <ViewBlog />
    </>
  )
}

export default page
