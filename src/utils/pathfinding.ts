import type { CountryNode, BorderConnection } from '../types/game';

/**
 * BFS Graph Pathfinder for Empire-Wide Operations:
 * 1. Transport troops anywhere throughout your empire as long as they are completely connected by friendly nodes.
 * 2. Attack connected empires/territories as long as they are connected to any node in your empire network by a border link.
 */
export function canReachNode(
  sourceId: string,
  targetId: string,
  currentUserId: string,
  nodes: CountryNode[],
  connections: BorderConnection[]
): boolean {
  if (sourceId === targetId) return false;

  const sourceNode = nodes.find(n => n.id === sourceId);
  const targetNode = nodes.find(n => n.id === targetId);
  if (!sourceNode || !targetNode) return false;

  // Source must be owned by the player
  if (sourceNode.ownerId !== currentUserId) return false;

  // BFS Queue
  const visited = new Set<string>();
  const queue: string[] = [sourceId];
  visited.add(sourceId);

  // Build graph adjacency map
  const adjMap: Record<string, string[]> = {};
  connections.forEach(c => {
    if (!adjMap[c.from]) adjMap[c.from] = [];
    if (!adjMap[c.to]) adjMap[c.to] = [];
    adjMap[c.from].push(c.to);
    adjMap[c.to].push(c.from);
  });

  const isTargetFriendly = targetNode.ownerId === currentUserId;

  while (queue.length > 0) {
    const currentId = queue.shift()!;

    const neighbors = adjMap[currentId] || [];
    for (const neighborId of neighbors) {
      if (neighborId === targetId) {
        // Friendly reinforcement: can transport anywhere in connected empire
        if (isTargetFriendly) {
          return true;
        } else {
          // Hostile/Neutral attack: currentId must be a friendly node adjacent to targetId
          const borderNode = nodes.find(n => n.id === currentId);
          if (borderNode && borderNode.ownerId === currentUserId) {
            return true;
          }
        }
      }

      // Continue BFS expansion only through friendly nodes
      const neighborNode = nodes.find(n => n.id === neighborId);
      if (neighborNode && neighborNode.ownerId === currentUserId && !visited.has(neighborId)) {
        visited.add(neighborId);
        queue.push(neighborId);
      }
    }
  }

  return false;
}
