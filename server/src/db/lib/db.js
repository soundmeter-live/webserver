/* AWS db.js v1.4.0 by mbf. updated 2023.10.16. */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
  BatchGetCommand,
  BatchWriteCommand,
} from '@aws-sdk/lib-dynamodb';

// const { AWS_REGION } = process.env;

const dbClient = new DynamoDBClient({});
const db = DynamoDBDocumentClient.from(dbClient, {
  marshallOptions: {},
  unmarshallOptions: {},
});

const methods = {};

methods.get = async (TableName, Key) => {
  if (!(TableName.length && Key))
    throw new Error('Missing table name or primary key.');

  const params = {
    TableName,
    Key,
  };

  return (await db.send(new GetCommand(params))).Item;
};

methods.put = async (TableName, Item) => {
  if (!(TableName.length && Item))
    throw new Error('Missing table name or item.');

  await db.send(new PutCommand({ TableName, Item }));
};

methods.find = async (TableName, { key, value, include: include_ }) => {
  const include = Object.assign([], include_) || [];
  let keyindex;
  if ((keyindex = include.indexOf(key)) < 0) {
    include.push(key);
    keyindex = include.length - 1;
  }
  const att = include.reduce(
    (obj, it, i) => ({ ...obj, [`#${String.fromCharCode(97 + i)}`]: it }),
    {}
  );
  const includeFilter = Object.keys(att)
    .slice(0, include_ ? include_.length : 0)
    .join(',');
  att['#qname'] = 'query';
  const ExpressionAttributeValues = { ':qval': 0, ':value': value };

  return (
    await db.send(
      new QueryCommand({
        TableName,
        ExpressionAttributeNames: att,
        ProjectionExpression: includeFilter.length ? includeFilter : null,
        IndexName: key,
        KeyConditionExpression: `
        #qname = :qval AND 
        ${Object.keys(att)[keyindex]} = :value`,
        ExpressionAttributeValues,
      })
    )
  ).Items;
};

methods.query = async (TableName, { query, index, include: include_ }) => {
  const include = Object.assign([], include_) || [];
  const queryIs = Object.keys(query).map((it) => {
    let keyindex;
    if ((keyindex = include.indexOf(it)) < 0) {
      include.push(it);
      keyindex = include.length - 1;
    }
    return keyindex;
  });
  const names = include.reduce(
    (obj, it, i) => ({ ...obj, [`#k${i.toString(16)}`]: it }),
    {}
  );
  const queryNames = queryIs.map((it) => Object.keys(names)[it]);
  const includeFilter = Object.keys(names)
    .slice(0, include_ ? include_.length : 0)
    .join(',');

  const values = Object.keys(query).reduce(
    (obj, it, i) => ({
      ...obj,
      [`:v${i.toString(16)}`]: query[it],
    }),
    {}
  );

  const params = {
    TableName,
    ExpressionAttributeNames: names,
    ExpressionAttributeValues: values,
    ProjectionExpression: includeFilter.length ? includeFilter : null,
    KeyConditionExpression: queryNames
      .map((it, i) => `${it} = ${Object.keys(values)[i]}`)
      .join(' AND '),
  };
  if (index) params.IndexName = index;

  try {
    return (await db.send(new QueryCommand(params))).Items;
  } catch (error) {
    throw { error };
  }
};

methods.update = async (TableName, { id: Key, add, remove }) => {
  const dontAdd = !add;
  add = add || {};
  const keys = Object.keys(add).reduce(
    (obj, it, i) => ({ ...obj, [`#k${i.toString(16)}`]: it }),
    {}
  );
  const vals = Object.keys(add).reduce(
    (obj, it, i) => ({ ...obj, [`:v${i.toString(16)}`]: add[it] }),
    {}
  );
  if (remove && remove.length)
    remove.forEach((it, i) => {
      if (vals.indexOf(it) >= 0) return;
      vals[`#k${vals.length.toString(16)}`] = it;
    });

  const params = {
    TableName,
    Key,
    ReturnValues: 'ALL_NEW',
    ExpressionAttributeNames: keys || undefined,
    ExpressionAttributeValues: vals || undefined,
    UpdateExpression:
      (dontAdd
        ? ''
        : `set ${Object.keys(keys)
            .map((it, i) => `${it} = ${Object.keys(vals)[i]}`)
            .join(', ')} `) +
      (!remove
        ? ''
        : `remove ${Object.keys(vals)
            .slice(Object.keys(keys).length)
            .map((it) => `${it}`)
            .join(', ')}`),
  };

  return (await db.send(new UpdateCommand(params))).Attributes;
};

methods.delete = async (TableName, Key) => {
  const params = {
    TableName,
    Key,
    ReturnValues: 'ALL_OLD',
  };

  return (await db.send(new DeleteCommand(params))).Attributes;
};

methods.import = async (table, items) => {
  const REQLIM = 25; // max requests allowed in one api call.
  const requests = [];
  for (let i = 0; i < Math.ceil(items.length / REQLIM); i++) {
    requests.push({});
    requests[i][table] = Object.assign([], items)
      .splice(i * REQLIM, REQLIM)
      .map((it) => ({
        PutRequest: {
          Item: it,
        },
      }));
  }

  requests.forEach(async (req) => {
    const { UnprocessedItems: unproc } = await db.send(
      new BatchWriteCommand({
        RequestItems: req,
      })
    );
    console.log(unproc);
  });
};

methods.batchGet = async (table, ids) => {
  const REQLIM = 100; // max items allowed per request
  const requests = [];
  for (let i = 0; i < Math.ceil(ids.length / REQLIM); i++) {
    requests.push({ RequestItems: {} });
    requests[i].RequestItems[table] = { Keys: Object.assign([], ids) };
  }

  const fetch = async (request, table) => {
    const resp = await db.send(new BatchGetCommand(request));
    let out = resp.Responses[table];
    if (Object.keys(resp.UnprocessedKeys).length)
      out = [...out, ...(await fetch({ RequestItems: resp.UnprocessedKeys }))];
    return out;
  };

  const all = await Promise.all(
    requests.map((request) => fetch(request, table))
  );
  return all.reduce((a, b) => [...a, ...b], []);
};

export default methods;
