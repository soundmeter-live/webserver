# soundmeter.live

The live testing service can be accessed at https://soundmeter.live/points.

## Server endpoints

Connect to the API at this endpoint: `https://api.soundmeter.live`. Append an endpoint address shown below to this URL to determine the full URL you will need to query.

Any request passing **body** information must pass it in the `application/json` form. It may be necessary to add this header with the request:

```
Content-Type: application/json
```

Shown below are the available endpoints.

---

### _POST_ `/api/add-points`

Adds a set of new data points to the server. Each point needs an epoch timestamp in **milliseconds**, as well as a numerical value representing the loudness at that time.

**BODY**

```js
{
  "points": [
    {
      "timeAt": 000000000000, // integer unix timestamp [REQUIRED]
      "value": 0.0            // loudness value at this time [REQUIRED]
    },
    // ...
  ],
  "currentTime": 000000000000 // (OPTIONAL) current system time at time of
                              // upload. will be used to correct passed `timeAt`
                              // values if system time is incorrect.
}
```

**RETURNS**

On _success_, The endpoint returns the added points, this time with their newly generated IDs.

```js
{
  "points": [
    {
      "id": "00000000-0000-0000-0000-000000000000", // unique UUID identifier
      "timeAt": "000000000000", // integer unix timestamp as string
      "value": 0.0            // loudness value at this time
    },
    // ...
  ]
}
```

On _error_, the endpoint returns an error...

```js
{
  // error will either contain a string containing an error code,
  // such as `SERVER_ERROR`, or it will contain validation error
  // explaining why the given input failed to parse.
  "error":"ERROR_CODE" || [/* VALIDATION ERROR BLOCK */]
}
```

### _GET_ `/api/points`

Get all data points.

**RETURNS**

On _success_, The endpoint returns all endpoints in this format...

```js
{
  "points": [
    {
      "id": "00000000-0000-0000-0000-000000000000", // unique UUID identifier
      "timeAt": "000000000000", // integer unix timestamp as string
      "value": 0.0            // loudness value at this time
    },
    // ...
  ]
}
```

The error state is identical to the one shown above.

---

## Direct database access

The server internally uses a GraphQL system to maintain data consistency in the server. In order to see data directly and add or edit data, one can use the online portal linked below to interface with the GraphQL API.

[Direct Database Access URL](https://studio.apollographql.com/sandbox/explorer?endpoint=https%3A%2F%2Fapi.soundmeter.live%2Fgql)

Create a new tab in the window and close the "example query" to start. Then build queries using the sidebar on the left. Commands have been documented there. Add variable values if relevant at the bottom center, and then run the command with the blue play button. Place the right sidebar in table view for an easier-to-understand output.

## Running the server locally for development

### 1. install software

First, install [Node.js](https://nodejs.org/en/download) (LTS version). Then, install the package manager [pnpm](https://pnpm.io/installation#using-corepack) (click for installation instructions.)

### 2. install packages

each project, `client` and `server`, requires its own set of JS packages. To install them:

```sh
# install dev cli (run in root project directory first)
pnpm install
```

```sh
# install client packages
cd client
pnpm install
```

then, the server packages...

```sh
# install server packages
cd server
pnpm install
```

### 3. AWS credentials

In order to run database queries locally, you'll need AWS IAM credentials that provide database access.

Once you have credentials, create the file `server/.env`.

Enter your credentials into the file like this:

```
AWS_ACCESS_KEY_ID=????????????????????
AWS_SECRET_ACCESS_KEY=?????????????????????????????????????????
```

### 4. run the project

Start the development server using this command in a terminal at the root of the project:

```sh
pnpm dev
```

You can now access the server on `http://localhost:3000` and the client (user-facing website) on `http://localhost:3001`.
