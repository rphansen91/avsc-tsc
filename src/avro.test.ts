import { Avro, AvroField, AvroSchema } from '.';

describe('Avro', () => {
  @AvroSchema({ namespace: 'evm' })
  class Block extends Avro {
    @AvroField(['long', 'null'])
    number: number;

    @AvroField(['string', 'null'])
    hash: string;

    constructor(base?: any) {
      super();
      this.number = base?.number ?? null;
      this.hash = base?.hash ?? null;
    }

    helper() {
      return this.number;
    }
  }

  it('Should extract fields', () => {
    expect(Block.schema.name).toEqual('evm.Block');
    expect(Block.fields).toEqual([
      { name: 'number', type: ['long', 'null'] },
      { name: 'hash', type: ['string', 'null'] },
    ]);
  });

  it('Should extract nested fields', async () => {
    @AvroSchema({ namespace: 'evm' })
    class Log extends Avro {
      @AvroField(['string', 'null'])
      address: string;

      @AvroField(['string', 'null'])
      topic0: string;

      constructor(base?: any) {
        super();
        this.address = base?.address ?? null;
        this.topic0 = base?.topic0 ?? null;
      }
    }

    @AvroSchema()
    class Transaction extends Avro {
      @AvroField({ type: 'array', items: Log.schema })
      logs: Log[];

      constructor(base?: any) {
        super();
        this.logs = base?.logs ?? null;
      }
    }

    expect(Transaction.fields).toEqual([{ name: 'logs', type: { type: 'array', items: Log.schema } }]);

    const tx = new Transaction();
    const log = new Log();
    log.address = 'address';
    log.topic0 = 'topic0';
    tx.logs = [log];

    const encoded = await tx.encode();
    expect(encoded.toString('utf8')).toMatchSnapshot();

    const decoded = await Transaction.decode<Transaction>(encoded);
    expect(decoded).toEqual(tx);
  });

  it('Should encode', async () => {
    const block = new Block({ number: 10, hash: '0x1010' });
    const encoded = await block.encode();
    expect(encoded.toString('utf8')).toMatchSnapshot();
  });

  it('Should decode', async () => {
    const block = new Block({ number: 10, hash: '0x1010' });
    const encoded = await block.encode();
    const decoded = await Block.decode<Block>(encoded);
    expect(decoded).toEqual(block);
    expect(decoded.helper()).toEqual(10);
  });

  it('Should provide useful class errors', async () => {
    class Block extends Avro {}
    await expect(() => new Block().encode()).rejects.toThrowError('No schema found, did you forget the "@AvroSchema" decorator');
  });

  it('Should provide useful field errors', async () => {
    @AvroSchema()
    class Block extends Avro {}
    await expect(() => new Block().encode()).rejects.toThrowError('No fields found, did you forget the "@AvroField" decorator');
  });
});
