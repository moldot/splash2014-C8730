/**
 * Splash 2014 - C8730: Find the Shortest Path! 
 * File: skeleton.cpp
 * Description: Skeleton for all exercises. STUDENT CODE STARTS AT LINE 128.
 *
 * @author Varot Premtoon
 * @version 1.0 11/07/2014
 */

#include <stdio.h>

#define INF 1E9

#define VERBOSE 0       // 1 - Print all prompts to screen. 0 - Don't.
#define DR 0            // 1 - Graphs are directional. 0 - Undirectional.
#define MAX_N 1000      // Maximum number of nodes supported by the program.

int edge[MAX_N][MAX_N]; // Edge length from any pair of vertices. 0 if none.
int distance[MAX_N];    // Minimal distance from source node
int parent[MAX_N];      // Store the node before it in the shortest path
int n, e;               // Numbers of nodes and edges respectively.

// ****************************************************************************
// DO NOT EDIT THIS PART
// ****************************************************************************

void initialize() {
  // All initial distance is infinite
  // Every node's parent is itself
  // Edge distance between any pair of nodes is 0, meaning there is no edge
  for (int i = 0; i < MAX_N; i++) {
    distance[i] = INF;
    parent[i] = i;
    for (int j = 0; j < MAX_N; j++) {
      edge[i][j] = 0;
    }
  }
}

// Print the values of all edges
void printTable() {
  printf("Edge table\n");
  for (int i = 0; i < n; i++) {
    printf("%3d: ", i);
    for (int j = 0; j < n; j++) {
      printf("%3d ", edge[i][j]);
    }
    printf("\n");
  }
}

// Print 'distance' array
void printDistance() {
  printf("<node>: <distance> <parent>\n");
  for (int i = 0; i < n; i++) {
    printf("Node %3d: %3d %3d\n", i, distance[i], parent[i]);
  }
}

// Using 'parent' array, backtrack from destination to source,
// which is the node that has itself as its parent, and print
// the path from source to destination
void printPath(int destination) {
  int output[MAX_N];
  int m = 0;
  
  for (int u = destination; 1; u = parent[u]) {
    output[m++] = u;
    if (parent[u] == u) break;
  }
  
  for (int i = m-1; i >= 0; i--) {
    printf("%d ", output[i]);
  }
}

// For unweighted graph
void inputUnitGraph() {
  int n1, n2;
  if (VERBOSE) printf("Input numbers of nodes and edges: ");
  scanf("%d %d", &n, &e);

  if (VERBOSE) printf("Input edges <n1> <n2>\n");
  for (int i = 0; i < e; i++) {
    scanf("%d %d", &n1, &n2);
    edge[n1][n2] = 1;
    if (!DR) edge[n2][n1] = 1;
  }
}

// For weighted graph. Weight is given with each edge
void inputGraph() {
  int n1, n2, d;
  if (VERBOSE) printf("Input numbers of nodes and edges: ");
  scanf("%d %d", &n, &e);

  if (VERBOSE) printf("Input edges <n1> <n2> <distance>\n");
  for (int i = 0; i < e; i++) {
    scanf("%d %d %d", &n1, &n2, &d);
    edge[n1][n2] = d;
    if (!DR) edge[n2][n1] = d;
  }
}

// For weighted graph. Weight is given with each node
void inputMazeGraph() {
  int n1, n2;
  int d[MAX_N];
  if (VERBOSE) printf("Input numbers of nodes and edges: ");
  scanf("%d %d", &n, &e);

  for (int i = 0; i < n; i++) {
    scanf("%d", &d[i]);
  }
  
  if (VERBOSE) printf("Input edges <n1> <n2>\n");
  for (int i = 0; i < e; i++) {
    scanf("%d %d", &n1, &n2);
    edge[n1][n2] = d[n2];
    if (!DR) edge[n2][n1] = d[n1];
  }
}

// ****************************************************************************
// ALL YOURS BELOW THIS POINT
// ****************************************************************************

void BFS(int source) {
  // Declare all needed variables.
  
  // Set the distance of the source node.

  // Put source node into the queue.

  // Perform BFS, using the initial queue.
  while () {

    // Pop first item and store in 'u'.

    // Loop through each node 'v' in the graph.
    for (int v = 0; v < n; v++) {
    // If there is an edge from 'u' to 'v', and the 
    // distance of 'v' is still INF (meaning that it has not
    // been computed)...
      if () {
      
      }
    }
  }
}

void Dijkstra(int source) {
  // Declare all needed variables.

  // ALl nodes are intially unvisited.
  for (int i = 0; i < n; i++) {
    visited[i] = 0;
  }

  // Set the distance of the source node.
  
  // Perform dijkstra by expanding the cloud.
  while () {
    // pick the nearest node from the cloud.

    // Include 'u' into our cloud.

    // Update distance table.
    for (int v = 0; v < n; v++) {
      if ( ) {

      }
    }
  }
}

int main() {
  initialize();
  inputUnitGraph(); 
  //inputGraph(); 
  //inputMazeGraph();
  
  int s, t;
  scanf("%d %d", &s, &t);

  BFS(s);
  //Dijkstra(s);
  printDistance();
  printPath(t);
  return 0;
}

