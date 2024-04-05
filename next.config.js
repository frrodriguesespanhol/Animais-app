// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   images: {
//     loader: 'cloudinary',
//     path: 'https://res.cloudinary.com/dak6khhfy/image/upload/'
//   },
//   eslint: {
//     ignoreDuringBuilds: true,
// },
// }

// module.exports = nextConfig



module.exports = {
  images: {
    domains: ['msikgermgspiwqsqxjas.supabase.co']
  },
}


// module.exports = { images: { writeToCacheDir: false, }, }