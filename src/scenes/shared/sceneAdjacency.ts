export const SCENE_ADJACENCY: Record<string, string[]> = {
  "/brodiclass/one": ["/hall/thirdclass"],
  "/brodiclass/two": ["/hall/thirdclass"],
  "/brodiclass/nine": ["/hall/thirdclass"],
  "/cantina/one": ["/hall/center-one", "/director/two", "/cafeteria/four", "/cafeteria/one"],
  "/cantina/two": ["/hall/center-one", "/director/two", "/cafeteria/four", "/cafeteria/one", "/hall/afterpcroom-one", "/hall/one"],
  "/hall/one": ["/hall/jailson-one", "/hall/left-one", "/pcroom/one", "/cantina/two"],
  "/hall/center-one": ["/hall/hell", "/cantina/two", "/hall/center-front", "/hall/left-one"],
  "/hall/center-two": ["/hall/hell", "/cantina/two", "/hall/center-front", "/hall/left-one"],
  "/hall/center-front": ["/hall/thirdclass", "/hall/center-one"],
  "/hall/left-one": ["/hall/afterpcroom-one", "/hall/one", "/hall/center-one"],
  "/hall/jailson-one": ["/hall/afterpcroom-one", "/hall/one"],
  "/hall/jailson-two": ["/hall/afterpcroom-one"],
  "/hall/hell": ["/hall/center-one", "/hellroom/one", "/hall/pandemony"],
  "/hall/pandemony": ["/hall/hell"],
  "/hall/thirdclass": ["/brodiclass/one", "/library/one", "/hall/center-front"],
  "/hall/afterpcroom-one": ["/hall/jailson-two", "/hall/jailson-one", "/pcroom/six", "/cantina/two", "/hall/left-one"],
  "/pcroom/one": ["/hall/one"],
  "/pcroom/six": ["/hall/afterpcroom-one"],
  "/pcroom/seven": ["/hall/afterpcroom-one"],
  "/library/one": ["/hall/thirdclass"],
  "/library/two": ["/hall/thirdclass", "/library/secret-passage"],
  "/library/secret-passage": ["/footballcourt/one", "/library/two"],
  "/footballcourt/one": ["/library/secret-passage"],
  "/footballcourt/two": ["/library/secret-passage"],
  "/cafeteria/one": ["/cantina/two"],
  "/cafeteria/four": ["/cantina/two"],
};

function buildReverseAdjacency(): Map<string, Set<string>> {
  const reverse = new Map<string, Set<string>>();
  for (const [scene, neighbors] of Object.entries(SCENE_ADJACENCY)) {
    for (const neighbor of neighbors) {
      let set = reverse.get(neighbor);
      if (!set) {
        set = new Set();
        reverse.set(neighbor, set);
      }
      set.add(scene);
    }
  }
  return reverse;
}

function bfsNextHop(
  startRoute: string,
  targetRoutes: Set<string>,
): string | null {
  if (targetRoutes.has(startRoute)) {
    return startRoute;
  }

  const reverseAdj = buildReverseAdjacency();
  const visited = new Map<string, string>();

  const queue: string[] = [...targetRoutes];
  for (const t of targetRoutes) {
    visited.set(t, t);
  }

  while (queue.length > 0) {
    const current = queue.shift()!;
    const predecessors = reverseAdj.get(current);
    if (!predecessors) continue;

    for (const pred of predecessors) {
      if (!visited.has(pred)) {
        visited.set(pred, current);
        if (pred === startRoute) {
          let hop: string = current;
          while (visited.get(hop) !== hop) {
            hop = visited.get(hop)!;
          }
          return hop;
        }
        queue.push(pred);
      }
    }
  }

  return null;
}

export { bfsNextHop };
