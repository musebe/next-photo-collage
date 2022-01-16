/**
 * @typedef {Object} CollageLayout
 * @property {number} id
 * @property {number} width
 * @property {number} height
 * @property {() => CollageLayout[]} sections
 */

/**
 * @typedef {Object} CollageSection
 * @property {number} width
 * @property {number} height
 * @property {number} x
 * @property {number} y
 */

/**
 * Pre-defined layouts. You can add more layouts here. Make sure each has a unique id.
 *
 * @type {CollageLayout[]}
 */
export const layouts = [
  {
    id: 1,
    width: 800,
    height: 800,
    sections: function () {
      return [
        {
          width: this.width * 0.5,
          height: this.height * 0.4,
          x: 0,
          y: 0,
        },
        {
          width: this.width * 0.5,
          height: this.height,
          x: this.width * 0.5,
          y: 0,
        },
        {
          width: this.width * 0.5,
          height: this.height * 0.6,
          x: 0,
          y: this.height * 0.4,
        },
      ];
    },
  },
  {
    id: 2,
    width: 800,
    height: 400,
    sections: function () {
      return [
        {
          width: this.width * 0.5,
          height: this.height,
          x: 0,
          y: 0,
        },
        {
          width: this.width * 0.5,
          height: this.height,
          x: this.width * 0.5,
          y: 0,
        },
      ];
    },
  },
  {
    id: 3,
    width: 800,
    height: 800,
    sections: function () {
      return [
        {
          width: this.width * 0.5,
          height: this.height * 0.5,
          x: 0,
          y: 0,
        },
        {
          width: this.width * 0.5,
          height: this.height * 0.5,
          x: this.width * 0.5,
          y: 0,
        },
        {
          width: this.width,
          height: this.height * 0.5,
          x: 0,
          y: this.height * 0.5,
        },
      ];
    },
  },
  {
    id: 4,
    width: 800,
    height: 800,
    sections: function () {
      return [
        {
          width: this.width,
          height: this.height * 0.5,
          x: 0,
          y: 0,
        },
        {
          width: this.width * 0.5,
          height: this.height * 0.5,
          x: 0,
          y: this.height * 0.5,
        },
        {
          width: this.width * 0.5,
          height: this.height * 0.5,
          x: this.width * 0.5,
          y: this.height * 0.5,
        },
      ];
    },
  },
  {
    id: 5,
    width: 800,
    height: 600,
    sections: function () {
      return [
        {
          width: this.width * 0.4,
          height: this.height,
          x: 0,
          y: 0,
        },
        {
          width: this.width * 0.6,
          height: this.height * 0.5,
          x: this.width * 0.4,
          y: 0,
        },
        {
          width: this.width * 0.6,
          height: this.height * 0.5,
          x: this.width * 0.4,
          y: this.height * 0.5,
        },
      ];
    },
  },
  {
    id: 6,
    width: 800,
    height: 800,
    sections: function () {
      return [
        {
          width: this.width,
          height: this.height * 0.25,
          x: 0,
          y: 0,
        },
        {
          width: this.width,
          height: this.height * 0.25,
          x: 0,
          y: this.height * 0.25,
        },
        {
          width: this.width,
          height: this.height * 0.25,
          x: 0,
          y: this.height * 0.5,
        },
        {
          width: this.width,
          height: this.height * 0.25,
          x: 0,
          y: this.height * 0.75,
        },
      ];
    },
  },
];
