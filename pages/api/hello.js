import faunadb from 'faunadb';

const { FAUNA_ADMIN_KEY } = process.env;
 
const q = faunadb.query;
const client = new faunadb.Client({ secret: FAUNA_ADMIN_KEY });


export default function handler(req, res) {
 
client.query(
  q.Paginate(q.Collections()),
  { queryTimeout: 100 }
).then(function(response) {
   console.log(response.ref); // Logs the ref to the console.
 }).catch(function(e) {
  console.error(e);
 })
  
  res.status(200).json({ name: 'John Doe' })
}
