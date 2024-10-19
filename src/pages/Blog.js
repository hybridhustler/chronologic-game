import React from 'react';
import { Link, useParams } from 'react-router-dom';

// Styled Title Component
const StyledTitle = ({ children }) => (
  <h1 className="text-4xl font-bold mb-6 text-center text-blue-600 relative">
    <span className="relative z-10">{children}</span>
    <span className="absolute bottom-0 left-0 w-full h-3 bg-yellow-300 transform -skew-x-12"></span>
  </h1>
);

const blogPosts = [
  {
    id: 'famous-firsts-in-technology',
    title: 'Famous Firsts in Technology',
    date: 'October 8, 2024',
    image: 'https://images.pexels.com/photos/158826/structure-light-led-movement-158826.jpeg',
    excerpt: 'In the ever-evolving landscape of technology, certain moments stand out as true game-changers. These "firsts" not only marked significant milestones in their respective fields but also laid the groundwork for the digital world we live in today.',
    content: `
      <p>In the ever-evolving landscape of technology, certain moments stand out as true game-changers. These "firsts" not only marked significant milestones in their respective fields but also laid the groundwork for the digital world we live in today. Let's journey through some of these groundbreaking moments that shaped our modern world.</p>

      <h2>The Birth of Digital Communication</h2>
      <p>The year man first set foot on the moon also saw another giant leap for mankind, this time in the realm of computer networking. As autumn leaves turned golden and thoughts of Halloween festivities filled the air, a small team of researchers huddled around a computer terminal. Their goal? To send a message across hundreds of miles using nothing but electronic signals.</p>
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Arpanet_logical_map%2C_march_1977.png/600px-Arpanet_logical_map%2C_march_1977.png" alt="Technological Firsts" class="w-full h-auto rounded-lg shadow-md my-4">

      <h2>The Rise of Mobile Technology</h2>
      <p>The early '80s pulsed with the rhythm of synth-pop and the glow of arcade screens. While E.T. phoned home on cinema screens across the nation, one visionary was about to make a call that would redefine the concept of "phone home" forever.</p>
      <img src="https://3.bp.blogspot.com/-El0khuBrsrc/T3Ldh8CaevI/AAAAAAAAEzY/6lt1S2zHA10/s1600/Martin+Cooper+Biography,martincooper.jpg alt="Technological Firsts" class="w-full h-auto rounded-lg shadow-md my-4">


      <h2>The Dawn of the World Wide Web</h2>
      <p>As the last echo of the Cold War faded and a new era of global cooperation dawned, a British computer scientist was quietly ushering in a revolution of his own. Summer vacations were drawing to a close, with sun-kissed tourists returning home and students preparing for a new school year. Amidst this seasonal transition, he put the finishing touches on a project that would transcend all borders.</p>
      <img src="https://media.npr.org/assets/img/2023/04/27/gettyimages-167798468_wide-6432196e35c6c7c75835e283c78861b0bc772f51.jpg?s=1400&c=100&f=jpeg alt="Technological Firsts" class="w-half h-auto rounded-lg shadow-md my-4">


      <h2>Gaming on the Go</h2>
      <p>While seismic political changes were reshaping the global landscape, a team of innovators in Japan was orchestrating a revolution of a different kind. As cherry blossoms painted Tokyo in delicate pink hues and students eagerly counted down the days to summer break, they put the final touches on a device that would redefine leisure time.</p>
      <img src="https://th.bing.com/th/id/OIP.za0bgwrBV6j3sNDfkCgESwAAAA?rs=1&pid=ImgDetMain alt="Technological Firsts" class="w-full h-auto rounded-lg shadow-md my-4">

      <p>These landmark moments, scattered across two transformative decades, each pushed the boundaries of what technology could achieve. From a two-letter message sent on an autumn evening to a pocket-sized gaming revolution launched in the fresh bloom of spring, these innovations have profoundly shaped our daily lives.</p>
    `
  },
  // Add more blog posts here
];

const BlogList = () => (
    <div className="container mx-auto mt-8 px-4 max-w-2xl">
      <StyledTitle>JS Game Hub Blog</StyledTitle>
      <div className="space-y-6">
        {blogPosts.map(post => (
          <div key={post.id} className="bg-gray-100 p-6 rounded-lg shadow-md">
            {post.image && (
              <img src={post.image} alt={post.title} className="w-full h-48 object-cover rounded-lg mb-4" />
            )}
            <h2 className="text-2xl font-bold mb-2 text-blue-500">{post.title}</h2>
            <p className="text-gray-600 mb-4">{post.date}</p>
            <p className="mb-4 text-gray-800">{post.excerpt}</p>
            <Link to={`/blog/${post.id}`} className="text-blue-500 hover:text-blue-700">Read more</Link>
          </div>
        ))}
      </div>
    </div>
  );
  
  const BlogPost = () => {
    const { id } = useParams();
    const post = blogPosts.find(post => post.id === id);
  
    if (!post) {
      return <div className="container mx-auto mt-8 px-4 max-w-2xl">Post not found</div>;
    }
  
    return (
      <div className="container mx-auto mt-8 px-4 max-w-2xl">
        <StyledTitle>{post.title}</StyledTitle>
        <p className="text-gray-600 mb-6 text-center">{post.date}</p>
        {post.image && (
          <img src={post.image} alt={post.title} className="w-full h-auto rounded-lg shadow-md mb-6" />
        )}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <div className="prose lg:prose-lg prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>
    );
  };
  
  const Blog = () => {
    const { id } = useParams();
    return id ? <BlogPost /> : <BlogList />;
  };
  
  export default Blog;