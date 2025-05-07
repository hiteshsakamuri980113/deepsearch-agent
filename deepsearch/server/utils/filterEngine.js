// 🔍 Get nested value like "album.release_date"
export function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

// 🔍 Evaluate one filter line
export function evaluateCondition(value, condition, criteria) {
  if (value == null) return false;

  switch (condition.toLowerCase()) {
    case "contains":
      return String(value)
        .toLowerCase()
        .includes(String(criteria).toLowerCase());
    case "equals":
      return String(value).toLowerCase() === String(criteria).toLowerCase();
    case "greater than":
      return Number(value) > Number(criteria);
    case "less than":
      return Number(value) < Number(criteria);
    case "is after":
      return new Date(value) > new Date(criteria);
    case "is before":
      return new Date(value) < new Date(criteria);
    case "is":
      return String(value).toLowerCase() === String(criteria).toLowerCase();
    case "is not":
      return String(value).toLowerCase() !== String(criteria).toLowerCase();
    default:
      return false;
  }
}

// 🔍 Combine array of true/false with logical operators
export function combineWithLogicalOperator(values, operators) {
  let result = values[0];

  for (let i = 1; i < values.length; i++) {
    const operator = operators[i - 1]?.toUpperCase();
    result = operator === "AND" ? result && values[i] : result || values[i];
  }

  return result;
}

// ✅ Main filter engine function
export function filterSongsByFilterObject(songs, filterObject) {
  return songs.filter((song) => {
    const blockResults = filterObject.filterBlocks.map((block) => {
      const lineResults = block.filterLines.map((line) => {
        console.log("$$$$ line: " + line);
        // console.log("line.filterName: " + line.filterName);
        console.log("song: " + song);
        const value = getNestedValue(song, line.filterName);
        // const value = line.filterName;
        console.log("value: " + value);
        return evaluateCondition(value, line.condition, line.criteria);
      });

      return combineWithLogicalOperator(
        lineResults,
        block.filterLines.map((l) => l.logicalOperator)
      );
    });

    return combineWithLogicalOperator(
      blockResults,
      filterObject.filterBlocks.map((b) => b.blockLogicalOperator)
    );
  });
}
