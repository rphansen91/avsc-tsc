import { Type, Schema } from 'avsc';

const CTOR = 'constructor';
const ERRORS = {
  schema: 'No schema found, did you forget the "@AvroSchema" decorator',
  fields: 'No fields found, did you forget the "@AvroField" decorator',
};

type FieldTypes = string | string[] | { type: 'array'; items: Schema };

export class Avro {
  static schema: Type;
  static fields: { name: string; type: FieldTypes }[];

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ...base: unknown[]
  ) {
    // Allow extending class to define params
  }

  static async decode<V = unknown>(buffer: Buffer): Promise<V> {
    validateSchema(this.schema);
    const obj = await this.schema.fromBuffer(buffer);
    return Reflect.construct(this, [obj]);
  }

  async encode(): Promise<Buffer> {
    const ctor = this[CTOR] as typeof Avro;
    validateSchema(ctor.schema);
    return ctor.schema.toBuffer(this);
  }
}

export function AvroSchema({ name, namespace }: { name?: string; namespace?: string } = {}) {
  return function (record: typeof Avro) {
    record.schema = Type.forSchema({
      type: 'record',
      namespace: namespace || '',
      name: name || record.name,
      fields: record.fields || [],
    });
  };
}

export function AvroField(type: FieldTypes) {
  return function (record: Avro, name: string) {
    const ctor = record[CTOR] as typeof Avro;
    if (!ctor.fields) ctor.fields = [];
    ctor.fields.push({ name, type });
  };
}

function validateSchema(schema: Type) {
  if (!schema) throw new Error(ERRORS.schema);

  const fields = (schema as any)['fields'];
  if (!fields || !fields.length) throw new Error(ERRORS.fields);

  return true;
}
