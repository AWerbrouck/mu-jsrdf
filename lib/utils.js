const rdf = require('rdflib');


function triplesToRDFLIBGraph(triples, store) {
  const { bindings } = triples.results;
  
  bindings.forEach(binding => {
    console.log(binding);
    const subject = rdf.namedNode(binding.s.value);
    const predicate = rdf.namedNode(binding.p.value);
    let object;
    
    if (binding.o.type === "uri") {
      object = rdf.namedNode(binding.o.value);
    } else if (binding.o.type === "literal") {
      if (binding.o.datatype) {
        object = rdf.literal(binding.o.value, rdf.namedNode(binding.o.datatype));
      } else {
        object = rdf.literal(binding.o.value);
      }
    }
    
    store.add(subject, predicate, object);
  });
}

export { triplesToRDFLIBGraph };
