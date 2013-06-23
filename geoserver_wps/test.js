var Process = require("geoscript/process").Process;

exports.process = new Process({
  title: "JavaScript Buffer Process",
  description: "Process that buffers a geometry.",
  inputs: {
    geom: {
      type: "Geometry",
      title: "Input Geometry",
      description: "The target geometry."
    },
    distance: {
      type: "Double",
      title: "Buffer Distance",
      description: "The distance by which to buffer the geometry."
    }
  },
  outputs: {
    result: {
      type: "Geometry",
      title: "Result",
      description: "The buffered geometry."
    }
  },
  run: function(inputs) {
    return {result: inputs.geom.buffer(inputs.distance)};
  }
});
