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
  printTree(root);
  console.log(`Total combinations: ${computePossibilityCount(data)}`);
}

main();
