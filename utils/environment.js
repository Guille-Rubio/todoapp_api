
let baseUrl
if (process.env.NODE_ENV === 'production') {
    baseUrl = "to-do-app-gray-two.vercel.app"
} else {
    baseUrl = "http://localhost:3000"
}

module.exports = baseUrl;