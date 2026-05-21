import dotenv from 'dotenv'
import path from "path"

dotenv.config({
    path: path.join(process.cwd(),'.env')
})

const config ={
     connection_string: process.env.CONNECTION,
     port: Number(process.env.PORT),
     hashKey: Number(process.env.KEY_HASH),
     accessToken_key : process.env.ACCESS_KEY_JWT
}
export default config;