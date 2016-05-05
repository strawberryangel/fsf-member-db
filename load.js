let fs = require('fs') 
let parse = require('csv-parse/lib/sync') 
let tools = require('./tools')

if(process.argv.length < 3) 
{
  console.error("No filename.")
  return
}

let filename = process.argv[2]
let data = fs.readFileSync(filename)
let records = parse(data, {})

for(r of records)
{
  let uuid = r[0]

  /* Prase name */
  let name = r[1]
  let parsed = tools.parseSLName(name)
  let login = parsed[0]
  let display = parsed[1]

  /* Parse date */
  let last = new Date()
  let date = r[2]
  if(date != "Online") 
  {
    let year = Number(date.substr(0, 4))
    if(Number.isNaN(year)) continue

    let month = Number(date.substr(5, 2)) - 1
    let day = Number(date.substr(8, 2))

    last = new Date(year, month, day)
  }

  console.log("uuid: ", uuid, "last: ", last, "name: ", login, ":", display)
}

