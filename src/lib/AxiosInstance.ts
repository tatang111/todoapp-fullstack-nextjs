import axios from "axios";

const axiosInstance = await axios.create({
    baseURL: "http://localhost:3000"
})

export default axiosInstance