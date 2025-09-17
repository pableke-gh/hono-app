
function TreeBox() {
	const self = this; //self instance
	var pkName, fkName, fnGroup;

	//helpers
	function fnTrue() { return true; }
	function fnTraversal(root, node, preorder, postorder) { // PreOrder and PostOrder
		let size = node.childnodes.length;
		for (let i = 0; (i < size); i++) {
			let child = node.childnodes[i];
			preorder(root, node, child, i) && fnTraversal(root, child, preorder, postorder); //preorder = cut/poda
			i = postorder(root, node, child, i) ? i : size; //postorder cut/poda siblings
		}
		return self;
	}
	this.preorder = function(root, preorder, postorder) {
		return fnTraversal(root, root, preorder, postorder || fnTrue);
	}

	function fnAdd(arr, node) {
		arr.push(node);
		return node;
	}
	this.resume = function(data, onGroup) {
		fnGroup = onGroup || fnTrue;
		let size = data.length;
		let parts = []; //container

		if (size > 0)
			var prev = fnAdd(parts, data[0]);
		for (let i = 1; (i < size); i++) {
			let row = data[i];
			if (fnGroup(prev, row, i, parts))
				prev = fnAdd(parts, row);
		}
		return parts;
	}

	function newNode(parent, contents, idChild) {
		var child = { id: idChild, data: contents, childnodes: [] };
		child.level = parent.level + 1; //inc. level
		// Call group event handler and determine if cut/poda?
		return fnGroup(parent, child) ? fnAdd(parent.childnodes, child) : null;
	}
	function addNode(json, parent, idChild) {
		var child = newNode(parent, json.filter(row => (row[fkName] == idChild)), idChild);
		child && child.data.forEach(row => addNode(json, child, row[pkName])); //build level+1
		return child;
	}
	this.group = function(json, groups, root) {
		root = Object.assign({ id: 0, level: 0, childnodes: [] }, root);
		fnGroup = root.onGroup || fnTrue; //default event

		root.data = json;
		json.forEach(function(row, i) {
			var node = root; //root node
			groups.forEach(function(colName, g) {
				var idChild = row[colName]; //pk value
				node = node.childnodes.find(n => (n.id == idChild)) //node exists
					|| newNode(node, node.data.filter(row => (row[colName] == idChild)), idChild)
					|| node; //move to next deep level
			});
		});
		return root;
	}
	this.tree = function(json, root) {
		root = Object.assign({ id: 0, level: 0, childnodes: [] }, root);

		//set global properties key name
		pkName = root.pk || "id"; //pk
		fkName = root.fk || "parent"; //fk
		fnGroup = root.onGroup || fnTrue;

		//build tree iterating recursively over nodes
		root.data = json.filter(row => !row[fkName]); //first deep level
		root.data.forEach(row => addNode(json, root, row[pkName])); //build level=1
		return root;
	}
}

/*
TESTS:
------
var arr = [
	{ text: "text3", g1: "aaa", g2: "210", id: "3", parentId: "2" },
	{ text: "text2", g1: "aaa", g2: "210", id: "2", parentId: "1" },
	{ text: "text4", g1: "aaa", g2: "210", id: "4", parentId: "1" },
	{ text: "text1", g1: "bbb", g2: "210", id: "1" },
	{ text: "text5", g1: "ccc", g2: "210", id: "5" },
	{ text: "text6", g1: "ccc", g2: "213", id: "6", parentId: "2" }
];

let root = { maxLevel: 0, fk: "parentId" };
root.onGroup = function(parent, child) { root.maxLevel = Math.max(root.maxLevel, child.level); return true; }

tb.group(arr, ["g1", "g2"], root);
tb.resume(arr, (prev, node) => (prev.g1!=node.g1));
root.maxLevel = 0;
tb.tree(arr, root);
*/
