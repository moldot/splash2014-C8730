/**
 * Splash 2014 - C8730: Find the Shortest Path! 
 * File: solution.cpp
 * Description: Solutions for all exercises. To be reduced into skeleton file.
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

void initialize() {
  for (int i = 0; i < MAX_N; i++) {
    distance[i] = INF;
    parent[i] = i;
    for (int j = 0; j < MAX_N; j++) {
      edge[i][j] = 0;
    }
  }
}

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

void printDistance() {
  printf("<node>: <distance> <parent>\n");
  for (int i = 0; i < n; i++) {
    printf("Node %3d: %3d %3d\n", i, distance[i], parent[i]);
  }
}

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


void BFS(int source) {
  int queue[MAX_N], front, rear;
  int u;
  
  distance[source] = 0;
  queue[rear = front = 0] = source;

  while (front <= rear) {
    u = queue[front++];
    for (int v = 0; v < n; v++) {
      if (edge[u][v] != 0 && distance[v] == INF) {
        distance[v] = distance[u] + 1;
        parent[v] = u;
        queue[++rear] = v;
      }
    }
  }
}

void Dijkstra(int source) {
  int visited[MAX_N]; 
  int u, bestDistance;

  for (int i = 0; i < n; i++) {
    visited[i] = 0;
  }

  distance[source] = 0;
  
  while (1) {
    // pick the nearest node from the cloud.
    u = -1; bestDistance = INF;
    for (int i = 0; i < n; i++) {
      if (distance[i] < bestDistance && visited[i] == 0) {
        u = i;
        bestDistance = distance[i];
      }
    }
    
    // If there is no non-visited node, end the search.
    if (bestDistance == INF) break;

    // Include u into our cloud
    visited[u] = 1;

    // update distance table
    for (int v = 0; v < n; v++) {
      if (edge[u][v] != 0 && distance[u] + edge[u][v] < distance[v]) {
        distance[v] = distance[u] + edge[u][v];
        parent[v] = u;
      }
    }
  }
}

int main() {
  initialize();
  inputUnitGraph(); 
  //inputGraph(); printTable();
  //Dijkstra(0);
  BFS(0);
  printDistance();
  printPath(899);
  return 0;
}

