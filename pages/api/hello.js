import faunadb from 'faunadb';

const { FAUNA_ADMIN_KEY } = process.env;
 
const q = faunadb.query;
const client = new faunadb.Client({ secret: FAUNA_ADMIN_KEY });

var createP = client.query(
  q.Create(
    q.Collection('test'),
    { data: { testField: 'testValue' } }
  )
)

export default function handler(req, res) {
  createP.then(function(response) {
  console.log(response.ref); // Logs the ref to the console.
})
  
  res.status(200).json({ name: 'John Doe' })
}
