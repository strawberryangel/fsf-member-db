function reverse(string)
{
  let result = ""
  for(c of string)
  {
    result = c + result
  }
  return result
}


module.exports.parseSLName = function(name) 
{
  let login = ""
  let display = ""

  if(name.substr(-1) == ')')
  {
    let backwards = reverse(name)
    let index = backwards.indexOf("(")
    login = reverse(backwards.slice(1, index))
    display = reverse(backwards.slice(index+1))
  }
  else
    login = name

  return [login, display]
}
