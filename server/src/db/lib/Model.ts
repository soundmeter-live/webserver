/* Model.ts - AWS db.js v1.4.0 by mbf. updated 2024.02.07. */

import db from './db';
import { randomUUID as uuid } from 'node:crypto';

import DataLoader from 'dataloader';

const timestamp = () => Math.round(Date.now() / 1000);

// define custom Partial that allows null values
type Partial<T> = { [P in keyof T]?: T[P] | undefined | null };

type InitialType<T> = Omit<T, 'id' | 'timestamp'>;

interface DBTypeProps {
  id: string;
  query: number;
  tcreated: number;
  tupdated: number;
}
export type DBType<T> = T & DBTypeProps;

/**
 * Model class for interacting with a database table.
 * @template Type The type of data stored in the table.
 */
abstract class Model<Type> {
  /**
   * The data type added as a column to all entries, allowing for multiple data types per table.
   * @abstract
   */
  protected abstract type: string;

  /**
   * The name of the DynamoDB table.
   * @abstract
   */
  protected abstract table: string;

  // add internal properties to this entry, such as created/updated timestamps and a unique id
  private schema = (self: Model<Type>, old?: boolean) => (data: any) => {
    const ts = timestamp();
    let out = data;

    if (!old)
      out = {
        type: self.type,
        id: uuid(),
        ...out,

        query: 0,
        tcreated: ts,
      };
    out.tupdated = ts;

    return Object.keys(out).reduce((obj, it) => {
      if (typeof out[it] !== 'undefined') return { ...obj, [it]: out[it] };
      return obj;
    }, {} as DBType<Type>);
  };

  // deduping function
  private loader = new DataLoader(this.DBbatchGet.bind(this));

  // standard resolver functions (overwrite if needed)

  /**
   * get one object by its id
   * @param id id of item to get (actual key becomes `type, id`)
   * @returns the item
   */
  async get(id: string) {
    return this.loader.load(id) as Promise<DBType<Type>>;
  }

  /**
   * get multiple items by their IDs
   * @param ids array of items to get from db
   * @returns array of items
   */
  async getMultiple(ids: string[]) {
    return this.loader.loadMany(ids) as Promise<DBType<Type>>;
  }

  /**
   * get all items stored in table
   * @returns all table items
   */
  async getAll() {
    return await this.DBgetAll();
  }

  /**
   * find items matching a certain key:value query
   * @param key the table column to query for
   * @param value the value of that property to match
   * @returns an array of matching items
   */
  async findBy(key: string, value: unknown) {
    return await this.DBfind(key, value);
  }

  async create(item: InitialType<Type>) {
    return await this.DBcreate(item);
  }
  async update(id: string, args: Partial<Type>) {
    return await this.DBupdate(id, args);
  }
  async delete(id: string) {
    return await this.DBdelete(id);
  }
  async createMultiple(items: InitialType<Type>[]) {
    return await this.DBcreateMultiple(items);
  }

  // internal: DB CRUD functions
  private async DBget(id: string) {
    return await db.get(this.table, { type: this.type, id });
  }
  private async DBcreate(item_: InitialType<Type>) {
    const item = this.schema(this)(item_);
    await db.put(this.table, item);
    return (await this.DBget(item.id)) as DBType<Type>;
  }
  private async DBupdate(id: string, changes: Partial<Type>) {
    const schema = this.schema(this, true);

    return (await db.update(this.table, {
      id: { type: this.type, id },
      add: schema(changes),
      remove: undefined,
    })) as DBType<Type>;
  }
  private async DBdelete(id: string) {
    return (await db.delete(this.table, {
      type: this.type,
      id,
    })) as DBType<Type>;
  }

  // internal: DB utilities
  private async DBbatchGet(ids: readonly string[]) {
    const type = this.type;
    const items = (await db.batchGet(
      this.table,
      ids.map((id) => ({ type, id }))
    )) as DBType<Type>[];

    return ids.map((id) => items.find((it) => it.id === id));
  }
  private async DBgetAll() {
    return (await db.query(this.table, {
      query: { type: this.type },
      index: undefined,
      include: undefined,
    })) as DBType<Type>[];
  }
  private async DBfind(key: string, value: unknown) {
    return (await db.query(this.table, {
      index: `type-${key}`,
      query: {
        type: this.type,
        [key]: value,
      },
      include: undefined,
    })) as DBType<Type>[];
  }

  private async DBcreateMultiple(items_: InitialType<Type>[]) {
    const schema = this.schema(this);
    const items = items_.map((it) => schema(it));
    const ids = items.map((it) => it.id);
    await db.import(this.table, items);
    return (await this.DBbatchGet(ids)) as DBType<Type>[];
  }
}

export default Model;
