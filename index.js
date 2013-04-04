module.exports = {read: read, create: create}

function Tree(members, raw) {
  this._members = members
  this._raw = raw
}

var cons = Tree
  , proto = cons.prototype

proto.type = 2 
proto.looseType = 'tree'

proto.entries = function() {
  return this._members.slice()
}

proto.serialize = function() {
  if(this._raw) {
    return this._raw
  }

  var buffers = []
    , size = 0
    , buf

  for(var i = 0, len = this._members.length; i < len; ++i) {
    buf = new Buffer(this._members[i].mode.toString(8)+' ', 'utf8')
    size += buf.length
    buffers.push(buf)
    buf = new Buffer(this._members[i].name + '\0', 'utf8')
    size += buf.length
    buffers.push(buf)

    if(typeof this._members[i].hash === 'string') {
      buf = new Buffer(this._members[i].hash, 'hex')
    } else {
      buf = this._members[i].hash
    }
    size += buf.length
    buffers.push(buf)
  }

  return Buffer.concat(buffers, size)
}

var STATE_MODE = 0
  , STATE_NAME = 1
  , STATE_HASH = 2

function read(buf) {
  var idx = 0
    , len = buf.length
    , state = STATE_MODE
    , start = 0
    , end_mode = 0
    , end_name = 0
    , members = []
    , _byte

  while(idx < len) {
    _byte = buf.readUInt8(idx++)
    switch(state) {
      case STATE_MODE: mode(); break
      case STATE_NAME: name(); break
      case STATE_HASH: hash(); break
    } 
  }

  return new Tree(members, buf)

  function mode() {
    if(_byte !== 32) {
      return
    }
    end_mode = idx
    state = STATE_NAME
  }

  function name() {
    if(_byte !== 0) {
      return
    }    
    end_name = idx
    state = STATE_HASH
  }

  function hash() {
    if(idx - end_name < 20) {
      return
    }

    members.push({
        mode: parseInt(buf.slice(start, end_mode - 1).toString('utf8'), 8)
      , name: buf.slice(end_mode, end_name - 1).toString('utf8')
      , hash: buf.slice(end_name, idx)
    })

    start = idx
    state = STATE_MODE
  }
}

// members = [{id: <hash>, mode: <number>, name: <string>}]
function create(members) {
  return new Tree(members)
}
