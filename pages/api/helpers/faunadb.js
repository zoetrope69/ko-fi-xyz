import faunadb from "faunadb";

import logger from "../../../helpers/logger";

const { FAUNA_ADMIN_KEY } = process.env;

const q = faunadb.query;
const faunaClient = new faunadb.Client({ secret: FAUNA_ADMIN_KEY });

export async function getByCollectionId(collection, id) {
  let data = null;

  try {
    const query = await faunaClient.query(
      q.Let(
        {
          doc: q.Get(q.Ref(q.Collection(collection), id)),
        },
        {
          document: q.Var("doc"),
          id: q.Select(["ref", "id"], q.Var("doc")),
        }
      )
    );

    data = {
      ...query?.document?.data,
      id: query.id,
    };
  } catch (e) {
    logger.error("DB Error:", e.message);
  }

  return data;
}

export async function getByIndex(index, value) {
  let data = null;

  try {
    const query = await faunaClient.query(
      q.Let(
        {
          doc: q.Get(q.Match(q.Index(index), value)),
        },
        {
          document: q.Var("doc"),
          id: q.Select(["ref", "id"], q.Var("doc")),
        }
      )
    );

    data = {
      ...query?.document?.data,
      id: query.id,
    };
  } catch (e) {
    logger.error("DB Error:", e.message);
  }

  return data;
}

async function getPaginatedData(index, value) {
  return new Promise((resolve, reject) => {
    faunaClient
      .paginate(q.Match(q.Index(index), value), { size: 2000 })
      .map(function (ref) {
        return q.Let(
          {
            doc: q.Get(ref),
          },
          {
            document: q.Var("doc"),
            id: q.Select(["ref", "id"], q.Var("doc")),
          }
        );
      })
      .each(function (page) {
        resolve(page);
      })
      .catch(reject);
  });
}

export async function getAllByIndex(index, value) {
  let data = null;

  try {
    const query = await getPaginatedData(index, value);

    data = query.map((item) => {
      return {
        ...item?.document?.data,
        id: item.id,
      };
    });
  } catch (e) {
    logger.error("DB Error:", e.message);
  }

  return data;
}

export async function createDocument(collection, data) {
  const query = await faunaClient.query(
    q.Let(
      {
        doc: q.Create(collection, { data }),
      },
      {
        document: q.Var("doc"),
        id: q.Select(["ref", "id"], q.Var("doc")),
      }
    )
  );
  return query.id;
}

export async function updateDocument(collection, id, data) {
  return faunaClient.query(
    q.Update(q.Ref(q.Collection(collection), id), { data })
  );
}
