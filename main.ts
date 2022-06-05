import * as fs from "fs";

// Interfaces

interface Node {
  name: string;
  number: number;
  next: Node[];
}

interface Data {
  [key: string]: number[];
}

// Functions

function printTree(root: Node) {
  const Q: Node[] = [root];

  console.log(root.number);

  while (Q.length > 0) {
    const pop = Q.shift();
    if (!pop) {
      continue;
    }

    if (pop.next.length > 0) {
      pop.next.forEach((childNode) => {
        process.stdout.write(`${childNode.number} `);
        Q.push(childNode);
      });

      console.log();
    }
  }
}

function printJson(root: Node) {
  process.stdout.write(`${JSON.stringify(root)}`);
}

function computePossibilityCount(data: Data): number {
  let product = 1;
  for (const feature in data) {
    const numbers = data[feature].length;
    product *= numbers;
  }

  return product;
}

function buildTree(data: Data): Node {
  let firstNode: Node = {
    name: "Root",
    number: 0,
    next: [],
  };
  let Q: Node[] = [firstNode];
  let R: Node[] = [];

  for (const feature in data) {
    const numbers = data[feature];

    while (Q.length > 0) {
      const poppedNode = Q.shift();

      if (!poppedNode) {
        throw Error("Impossible");
      }

      if (poppedNode.next.length === 0) {
        numbers.forEach((number) => {
          const newNode: Node = {
            name: feature,
            number,
            next: [],
          };

          poppedNode.next.push(newNode);
          Q.push(poppedNode);
        });

        break;
      }

      poppedNode.next.forEach((childNode) => {
        numbers.forEach((number) => {
          const newNode: Node = {
            name: feature,
            number,
            next: [],
          };

          childNode.next.push(newNode);
        });

        R.push(childNode);
      });

      if (Q.length === 0) {
        Q.push(...R);
        R = [];
        break;
      }
    }
  }

  return firstNode;
}

// Main

function main() {
  const lines = fs.readFileSync("./data.txt", "utf8").trim().split("\n");
  let data: Data = {};

  lines.forEach((line) => {
    const [label, numbers] = line.split(": ");
    data = {
      ...data,
      [label]: numbers.split(",").map((number) => parseInt(number, 10)),
    };
  });

  const root = buildTree(data);
  const matrix: any[][] = [];
  let branchArray: number[] = [];

  const preorder = (node: Node | undefined) => {
    if (node === undefined) {
      matrix.push(Array.from(branchArray));
      return;
    }

    branchArray.push(node.number);

    if (node.next.length > 0) {
      node.next.forEach((child) => {
        preorder(child);
        branchArray.pop();
      });
    } else {
      preorder(undefined);
    }
  };

  const invertMatrix = (matrix: number[][]): number[][] =>
    matrix[0].map((_, j) => matrix.map((row) => row[j]));

  preorder(root.next[0]);
  matrix.unshift(Object.keys(data));
  const invertedMatrix = invertMatrix(matrix);
  console.log(invertedMatrix.map((row) => row.join(",")).join("\n"));
}

main();
