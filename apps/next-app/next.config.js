/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "storage.googleapis.com", 
            },
            {
                protocol: "https",
                hostname: "*.syssoftintegra.com", 
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '8001',
            },
        ],
    },
    output: 'standalone'
}

module.exports = nextConfig