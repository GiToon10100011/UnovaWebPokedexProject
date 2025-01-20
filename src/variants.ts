export const descBoxVariants = {
  initial: {
    y: 20,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      type: "tween",
      duration: 0.3,
    },
  },
};

export const infoBoxVariants1 = {
  initial: {
    x: -20,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      type: "tween",
      duration: 0.3,
      delay: 0.1,
    },
  },
  exit: {
    x: -20,
    opacity: 0,
    transition: {
      type: "tween",
      duration: 0.3,
    },
  },
};

export const infoBoxVariants2 = {
  initial: {
    x: 20,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      type: "tween",
      duration: 0.3,
      delay: 0.1,
    },
  },
  exit: {
    x: 20,
    opacity: 0,
    transition: {
      type: "tween",
      duration: 0.3,
    },
  },
};

export const searchBarVariants = {
  initial: {
    y: -20,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      type: "tween",
      duration: 0.3,
    },
  },
  exit:{
    y: -60,
    opacity: 1,
    transition: {
      type: "tween",
      duration: 0.3,
    },
  }
};
