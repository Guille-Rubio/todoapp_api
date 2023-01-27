
let baseUrl
if (process.env.NODE_ENV === 'production') {
    baseUrl = "https://to-do-app-gray-two.vercel.app"
    console.log("Production environment")
} else {
    baseUrl = "http://localhost:3000"
    console.log("development environment");
}

module.exports = baseUrl;