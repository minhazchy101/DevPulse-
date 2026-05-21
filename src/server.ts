import app, { port } from "./app"


const main=()=>{
    app.listen(port, () => {
  console.log(`DevPulse app listening on  http://localhost:${port}`)
})
}
main();