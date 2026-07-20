import type { CountryNode, BorderConnection, Alliance } from '../types/game';

function areAllied(playerAId: string | null, playerBId: string | null, alliances: Alliance[]) {
  if (!playerAId || !playerBId || playerAId === playerBId) return false;
  return alliances.some(
    a => a.status === 'active' && a.members.includes(playerAId) && a.members.includes(playerBId)
  );
}

/**
 * BFS Graph Pathfinder for Empire-Wide Operations:
 * 1. Transport troops anywhere throughout your empire as long as they are completely connected by friendly/allied nodes.
 * 2. Attack/reinforce connected empires/territories as long as they are connected to any node in your empire network by a border link.
 */
export function canReachNode(
  sourceId: string,
  targetId: string,
  currentUserId: string,
  nodes: CountryNode[],
  connections: BorderConnection[],
  alliances: Alliance[]
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

  const isTargetFriendly = targetNode.ownerId === currentUserId || areAllied(targetNode.ownerId, currentUserId, alliances);

  while (queue.length > 0) {
    const currentId = queue.shift()!;

    const neighbors = adjMap[currentId] || [];
    for (const neighborId of neighbors) {
      if (neighborId === targetId) {
        // Friendly reinforcement: can transport anywhere in connected empire/coalition
        if (isTargetFriendly) {
          return true;
        } else {
          // Hostile/Neutral attack: currentId must be a friendly/allied node adjacent to targetId
          const borderNode = nodes.find(n => n.id === currentId);
          if (
            borderNode &&
            (borderNode.ownerId === currentUserId || areAllied(borderNode.ownerId, currentUserId, alliances))
          ) {
            return true;
          }
        }
      }

      // Continue BFS expansion only through friendly or allied nodes
      const neighborNode = nodes.find(n => n.id === neighborId);
      const isNeighborFriendly =
        neighborNode &&
        (neighborNode.ownerId === currentUserId || areAllied(neighborNode.ownerId, currentUserId, alliances));

      if (isNeighborFriendly && !visited.has(neighborId)) {
        visited.add(neighborId);
        queue.push(neighborId);
      }
    }
  }

  return false;
}

