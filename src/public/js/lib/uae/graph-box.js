
//Build graph from json data
function GraphBox() {
	const self = this; //self instance
	const buffer = []; //nodes container

	function addVertex(json, parent, idChild) {
		if (buffer.indexOf(idChild) > -1) //cycle?
			return null; //child node pre-visited
		buffer.push(idChild); //marck id node as visited => avoid cycles
		var child = newNode(parent, json.filter(row => { return (row[fkName] == idChild); }), idChild);
		child && child.data.forEach(row => { addVertex(json, child, row[pkName]); }); //build level+1
		return child;
	}
	this.graph = function(json, root) {
		root = Object.assign({ id: 0, level: 0, childnodes: [] }, root);
		buffer.slice(0); //reset visited array

		//set global properties key name
		pkName = root.pk || "id"; //pk
		fkName = root.fk || "parent"; //fk
		fnGroup = root.onGroup || fnTrue;

		//build graph iterating over all vertex
		root.data = json.filter(row => { return !row[fkName]; }); //first deep level
		root.data.forEach(row => { addVertex(json, root, row[pkName]); }); //build level=1
		return root;
	}
	//Graph Traversal with Breadth-First Search (BFS)
	this.bfs = function(graph, fn) {
		buffer.slice(0); //reset visited array
		buffer.push(graph.id); //marck id node as visited => avoid cycles
		var queue = [graph]; //Initialize queue for BFS

		//Iterate over all vertex
		while (queue.length > 0) {
			let node = queue.shift(); //Dequeue a vertex
			queue = node.childnodes.filter((child, i) => {
				//check if child node has been pre-visited and call fn for cut/poda
				let pendiente = (buffer.indexOf(child.id) < 0) && fn(graph, node, child, i);
				return pendiente ? buffer.push(child.id) : 0; //marck id node as visited => avoid cycles
			}).concat(queue);
		}
		return graph;
	}

	function fnVertex(graph, node, fn) {
		if (buffer.indexOf(node.id) > -1) //cycle?
			return null; //child node pre-visited
		var result; //node result
		buffer.push(node.id); //marck id node as visited => avoid cycles
		for (let i = 0; !result && (i < node.childnodes.length); i++) {
			let child = node.childnodes[i]; //get childnode
			result = fn(graph, node, child, i) ? child : fnVertex(graph, child, fn); //next deep level
		}
		return result;
	}
	this.findVertex = function(graph, fn) {
		buffer.slice(0); //reset visited array
		return fnVertex(graph, graph, fn);
	}
}
