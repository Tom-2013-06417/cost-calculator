# Personal Expenses Calculator

Given a text file listing your possible expenses (food, rent, internet), compute for all possible combinations of those expenses.

Have an input textfile with this format:

```
Phone: 599
Food: 12000,15000
Internet: 1999
House Electricity: 1500,2000
```

For each expense, you can supply different values, separated by commas, depending on your possible estimated costs.

Afterwards, run this command:

`npx ts-node main.ts >> output.csv`

This gives you every combination of expenses in CSV format.

```
Phone,599,599,...
Food,12000,12000,...
Internet,1999,1999,...
Electricity,1500,2000,...
```

# Algorithm

The algorithm simply uses preorder traversal (DFS) of a tree representing the different paths / combinations of expenses, constructed from the input data.

After which, on each visit to the leaf node, make a snapshot of the currently visisted path of nodes and put them in a matrix.

Then transpose the matrix so that it's easier to handle via CSV.
