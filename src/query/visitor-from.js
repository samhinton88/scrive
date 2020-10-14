const visitorFrom = (config) => {
  let block = false;

  const visitor = {
    [config.partType](path) {
    
      if (block) return;
      if (!config.test(path)) return;
      config.callBack && config.callBack(path)

      if (!config.isPlural) block = true;
    }  
  }

  return visitor;
}

module.exports = { visitorFrom };
