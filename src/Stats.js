
/**
 * Creates a Stats Panel object.
 *
 * @param {string} name - The name of the panel.
 * @param {string} fg - The foreground color for the panel. Used if evaluateStatsColor is not overridden.
 * @param {string} bg - The background color for the panel.
 * @param {number} [width=80] - The width of the panel (in pixels).
 * @param {number} [height=48] - The height of the panel (in pixels).
 * @param {boolean} [showMaximum=false] - Whether to show the maximum value in the panel.
 * @return {object} - The Panel object.
 */
export function StatsPanel(name, fg, bg, width = 80, height = 48, showMaximum = false) {
  let min = Infinity;
  let max = 0;
  const
    { round } = Math;
  const PR = round(window.devicePixelRatio || 1);

  const WIDTH = width * PR;
  const HEIGHT = height * PR;
  const TEXT_X = 3 * PR;
  const TEXT_Y = 2 * (height / 48) * PR;
  const GRAPH_X = 3 * PR;
  const GRAPH_Y = 15 * PR;
  const GRAPH_WIDTH = (width - 6) * PR;
  const GRAPH_HEIGHT = (height - 18) * (height / 48) * PR;

  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  canvas.style.cssText = `width:${width}px;height:${height}px`;

  const context = canvas.getContext('2d');
  context.font = `bold ${(9 * PR * (height / 48))}px Helvetica,Arial,sans-serif`;
  context.textBaseline = 'top';

  context.fillStyle = bg;
  context.fillRect(0, 0, WIDTH, HEIGHT);

  context.fillStyle = fg;
  context.fillText(name, TEXT_X, TEXT_Y);
  context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

  context.fillStyle = bg;
  context.globalAlpha = 0.9;
  context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

  return {

    dom: canvas,

    /**
     * Evaluates the performance color based on the given value.
     *
     * @param {number} value - The value used to evaluate the performance color.
     * @param {number} maxValue - The maximum value used to evaluate the performance color.
     * @return {string} - The color representing the performance.
     */
    // eslint-disable-next-line no-unused-vars
    evaluateStatsColor(value, maxValue) {
      return fg;
    },

    update(value, maxValue) {
      min = Math.min(min, value);
      max = Math.max(max, value);

      context.fillStyle = bg;
      context.globalAlpha = 1;
      context.fillRect(0, 0, WIDTH, GRAPH_Y);

      context.fillStyle = this.evaluateStatsColor(value, maxValue);
      if (showMaximum) {
        context.fillText(`${round(value)}${name} (${round(min)}-${round(max)})/${maxValue}`, TEXT_X, TEXT_Y);
      } else {
        context.fillText(`${round(value)}${name} (${round(min)}-${round(max)})`, TEXT_X, TEXT_Y);
      }

      context.drawImage(
        canvas,
        GRAPH_X + PR,
        GRAPH_Y,
        GRAPH_WIDTH - PR,
        GRAPH_HEIGHT,
        GRAPH_X,
        GRAPH_Y,
        GRAPH_WIDTH - PR,
        GRAPH_HEIGHT,
      );

      context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT);

      context.fillStyle = bg;
      context.globalAlpha = 0.9;
      context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round((1 - (value / maxValue)) * GRAPH_HEIGHT));
    },

  };
}

/**
 * Creates a Stats object for displaying performance statistics.
 *
 * @param {number} width - The width of the Stats object in pixels. Default is 80.
 * @param {number} height - The height of the Stats object in pixels. Default is 48.
 * @param {boolean} showMaximum - Whether to show the maximum value or not. Default is false.
 * @returns {Object} - The Stats object with the following properties:
 *   - REVISION: The revision number of the Stats object.
 *   - currentPanelIndex: The index of the currently shown panel.
 *   - dom: The container DOM element of the Stats object.
 *   - addPanel: A function to add a new panel to the Stats object.
 *   - showPanel: A function to show a specific panel in the Stats object.
 *   - fpsPanel: The panel for displaying frames per second.
 *   - msPanel: The panel for displaying milliseconds per frame.
 *   - memPanel: The panel for displaying memory usage in megabytes (if available).
 */

// var Stats = function(width = 80, height = 48) {
export function Stats(width = 80, height = 48, showMaximum = false) {
  let currentPanelIndex = 0;
  const container = document.createElement('div');
  container.style.cssText = 'opacity:0.71;z-index:10000';

  function addPanel(panel) {
    container.appendChild(panel.dom);
    return panel;
  }

  function showPanel(id) {
    for (let i = 0; i < container.children.length; i += 1) {
      container.children[i].style.display = i === id ? 'block' : 'none';
    }

    currentPanelIndex = id;
  }

  const fpsPanel = addPanel(new StatsPanel('FPS', '#0ff', '#002', width, height, showMaximum));
  const msPanel = addPanel(new StatsPanel('MS', '#0f0', '#020', width, height, showMaximum));

  let memPanel;
  if (window.performance && window.performance.memory) {
    memPanel = addPanel(new StatsPanel('MB', '#f08', '#201', width, height, showMaximum));
  }

  showPanel(0);

  return {

    REVISION: 17,
    currentPanelIndex,

    dom: container,

    addPanel,
    showPanel,

    fpsPanel,
    msPanel,
    memPanel,
  };
}
