const faunadb = require('faunadb');

const { FAUNA_ADMIN_KEY } = process.env;
 
const q = faunadb.query;
const faunaClient = new faunadb.Client({ secret: FAUNA_ADMIN_KEY });

async function getUser(username) {
  let user = {};

  try {
    user = await faunaClient.query(
      q.Get(q.Match(q.Index("by_username"), username))
    );
  } catch (e) {
    // ...    
  }

  return user;
}

export default async function handler(req, res) {
  const user = await getUser('zactopus');
  res.status(200).json(user);
}
