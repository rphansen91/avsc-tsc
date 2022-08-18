<a href="https://avro.apache.org/docs/current/spec.html">
    <img src="avro-logo.png" alt="Avro logo" title="Avro" align="right" height="60" />
</a>

# Avro TSC Decorators

## Installation

```bash
npm install avsc-tsc
```

## Usage

- Decorators

```js
import { Avro, AvroField, AvroSchema } from 'avsc-tsc';

@AvroSchema({ namespace: 'evm' })
class Block extends Avro {
  @AvroField(['string', 'null'])
  number: number

  @AvroField(['string', 'null'])
  hash: number

  constructor({ number = 0, hash = '' } = {}) {
    this.number
    this.hash
  }
}
```

- Encoding

```js
const block = new Block({ number: 10, hash: '0x0' })
const encoded = await block.encode()
```

- Decoding

```js
const decoded = await Block.decode<Block>(encoded)
decoded.number === 10 // true
decoded.hash === '0x0' // true
```
