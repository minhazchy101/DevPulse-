import app from "./app"
import config from "./config"
import { initDB } from "./db"

// const port = 5000;
const port = config.port;

const main=()=>{
  initDB()
    app.listen(port, () => {
  console.log(`DevPulse app listening on  http://localhost:${port}`)
})
}
main();