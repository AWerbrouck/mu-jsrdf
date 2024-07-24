import { app, query, update } from "mu";
import { triplesToRDFLIBGraph } from "./lib/utils";
const rdf = require("rdflib");

app.get("/status", function (req, res) {
  res.send("i'm alive");
});

app.get("/test/update/authors", function (req, res) {
  const update_query = `
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX ex: <http://example.org/schema/>

INSERT DATA {
    GRAPH <public> {
        ex:brandon_sanderson a foaf:Person ;
                             foaf:name "Brandon Sanderson" .

        ex:jk_rowling a foaf:Person ;
                      foaf:name "J.K. Rowling" .
    }
}


  `;

  update(update_query).then(function (response) {
    // do something with the query results here
    // and send a response using res.json()
    res.json(response);
  });
});

app.get("/test/update/books", function (req, res) {
  const update_query = `
PREFIX ex: <http://example.org/schema/>

INSERT DATA {
    GRAPH <public> {
        ex:mistborn a ex:Book ;
                    ex:title "Mistborn" ;
                    ex:author ex:brandon_sanderson ;
                    ex:genre "Fantasy" ;
                    ex:publicationYear 2006 ;
                    ex:isbn "9780765311788" .

        ex:way_of_kings a ex:Book ;
                        ex:title "The Way of Kings" ;
                        ex:author ex:brandon_sanderson ;
                        ex:genre "Fantasy" ;
                        ex:publicationYear 2010 ;
                        ex:isbn "9780765326355" .

        ex:hp_philosophers_stone a ex:Book ;
                                 ex:title "Harry Potter and the Philosopher's Stone" ;
                                 ex:author ex:jk_rowling ;
                                 ex:genre "Fantasy" ;
                                 ex:publicationYear 1997 ;
                                 ex:isbn "9780747532699" .

        ex:hp_chamber_of_secrets a ex:Book ;
                                 ex:title "Harry Potter and the Chamber of Secrets" ;
                                 ex:author ex:jk_rowling ;
                                 ex:genre "Fantasy" ;
                                 ex:publicationYear 1998 ;
                                 ex:isbn "9780747538493" .
    }
}

  `;

  update(update_query).then(function (response) {
    // do something with the query results here
    // and send a response using res.json()
    res.json(response);
  });
});

app.get("/construct", function (req, res) {
  const construct_query = req.query.construct_query;
  if (!construct_query) {
    res.status(400).send("No construct query provided");
    return;
  }
  const responseType = req.query.responseType;
  if(responseType != "text/turtle" && responseType != "application/ld+json"){
    res.status(400).send("Invalid response type. Must be 'text/turtle' or 'application/ld+json'");
    return;
  }
  query(construct_query).then(function (response) {
    const store = rdf.graph(); // Create an empty RDF graph
    triplesToRDFLIBGraph(response, store);
    rdf.serialize(
      null,
      store,
      "http://example.org",
      responseType,
      (err, str) => {
        if (err) {
          res.json(err);

        } else {
          res.json(str);
        }
      }
    );
  });
});
