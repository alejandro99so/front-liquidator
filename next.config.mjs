/** @type {import('next').NextConfig} */
const nextConfig = {
    i18n: {
        locales: ['en', 'fr', 'es'], // Add the locales you want to support
        defaultLocale: 'es', // Set the default locale
    },
    reactStrictMode: false
}

export default nextConfig;
