
function PV (finalCallback, initialLockValue) 
{
  this._lock = initialLockValue ? initialLockValue : 0
  this._callback = finalCallback
}

PV.prototype.lock = function() 
{
  this._lock++
}

PV.prototype.unlock = function() 
{
  this._lock--
  if(this._lock == 0 && this._callback)
    this._callback()
}

module.exports = PV

