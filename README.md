# git-object-tree

git tree objects as javascript objects.

tree objects are immutable once created.

```javascript
var Buffer = require('buffer').Buffer
  , tree = require('git-object-tree')

var b = tree.create(new Buffer(...))

b = tree.read(<some git buffer>)

```

## API

#### tree.read(<git buffer>) -> Tree

read a tree from some git buffer data.

#### tree.create(author, tree, message, parent[, treeter][, attrs]) -> Tree

create a tree from some source data.

all fields (save for message) may be arrays.

#### Tree.prototype.entries() -> [entry list]

return a list of tree entries: 

```javascript
{ mode: number
, name: string
, hash: Buffer(20) }
```

## License

MIT
