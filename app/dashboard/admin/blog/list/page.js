import Link from "next/link";
// import BlogList from "@/components/blogs/BlogList";

async function getBlogs(searchParams) {
  // console.log("searchParams => ", searchParams);
  const urlParams = {
    page: searchParams.page || 1,
  };
  const searchQuery = new URLSearchParams(urlParams).toString();
  // console.log("searchQuery => ", searchQuery);
  const response = await fetch(`${process.env.API}/blog?${searchQuery}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 1 },
  });

  if (!response.ok) {
    console.log("Failed to fetch blogs => ", response);
    throw new Error("Failed to fetch  blogs");
  }

  const data = await response.json();
  return data; // {blogs, currentPage, totalPages}
}

export default async function AdminBlogsList({ searchParams }) {
  const data = await getBlogs(searchParams);
  // console.log("data in home page => ", data);
  const { blogs, currentPage, totalPages } = data;

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <div className="container">
      <p className="lead text-primary text-center">Latest Blogs</p>

      {blogs.map((blog) => (
        <div key={blog._id} className="d-flex justify-content-between">
          <p>{blog.title}</p>
          <Link
            className="text-danger"
            href={`/dashboard/admin/blog/update/${blog.slug}`}
          >
            Update
          </Link>
        </div>
      ))}

      {/* <BlogList blogs={blogs} /> */}
      {/* <pre>{JSON.stringify(data, null, 4)}</pre> */}

      <div className="d-flex justify-content-center">
        <nav aria-label="Page navigation">
          <ul className="pagination">
            {hasPreviousPage && (
              <li className="page-item">
                <Link
                  className="page-link px-3"
                  href={`?page=${currentPage - 1}`}
                >
                  Previous
                </Link>
              </li>
            )}

            {hasNextPage && (
              <li className="page-item">
                <Link
                  className="page-link px-3"
                  href={`?page=${currentPage + 1}`}
                >
                  Next
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}
