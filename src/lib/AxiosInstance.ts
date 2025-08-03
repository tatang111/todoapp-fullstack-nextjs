import axios from "axios";

const axiosInstance = await axios.create({
    baseURL: "https://todoapp-fullstack-express-production.up.railway.app"
})

export default axiosInstance