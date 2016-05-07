let mongo = MongoClient = require('mongodb').MongoClient
let fs = require('fs') 
let parse = require('csv-parse/lib/sync') 
let tools = require('./tools')

if(process.argv.length < 3) 
{
  console.error("No filename.")
  return
}


function loadFile (db, callback)
{
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
    let last = null
    let date = r[2]
    if(date != "Online") 
    {
      let year = Number(date.substr(0, 4))
      if(Number.isNaN(year)) continue
  
      let month = Number(date.substr(5, 2)) - 1
      let day = Number(date.substr(8, 2))
  
      last = new Date(year, month, day)
    }
  
    let result = 
    {
      _id: uuid,
      uuid: uuid,
      lastLogin: last,
      loginName: login,
      displayName: display
    }

    callback(db, result)
  
    /* console.log("uuid: ", uuid, "last: ", last, "name: ", login, ":", display) */
  }

  console.log("Finished processing file.") 
}

function processRow(db, data) 
{
  let group = db.collection('groupMembers')
  let search = { _id: data.uuid } 
  group.findOne( search ).then(function(doc) {
    if(doc == null)  
    {
      group.insertOne(data, function(err, result) {
        if(err != null)
	  console.log("Insert failed: ", err)
	else
	  console.log("Insert succeeded:  ")
      })
    }
    else
    {
      console.log("Found record for ", search)
    }
  }).catch(function(err) {
    console.log("group.findOne failed. ", search, err)
  })
}



let db = null
mongo.connect("mongodb://localhost/fsf", function(err, connection) {
  if(err == null) 
  {
    db = connection
    loadFile(db, processRow)
    return
  }
  else 
    console.log("Could not connect to database: ", err)
})
