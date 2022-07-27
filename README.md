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
}
```

- Encoding

```js
const block = new Block()
const encoded = await block.encode()
```

- Decoding

```js
const decoded = await Block.decode<Block>(encoded)
```
