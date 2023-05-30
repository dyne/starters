const fs = require("fs");
const path = require("path");
const yaml = require("yaml");
const commander = require("commander");

const DIR = path.join(__dirname, "..", "contracts");

const addArgument = (a) => {
  const arg = new commander.Argument(a.name, a.description, a.error);
  const opts = "hideHelp default choices env preset conflicts implies".split(
    " "
  );
  opts.map((attribute) => {
    if (a.hasOwnProperty(attribute)) {
      const method = arg[attribute];
      const params = a[attribute];

      method(params);
    }
  });
  return arg;
};

const addOption = (o) => {
  const option = new commander.Option(o.name, o.description);
  const opts = "hidden default choices env preset conflicts implies file".split(
    " "
  );

  opts.map((attribute) => {
    if (o.hasOwnProperty(attribute)) {
      const params = o[attribute];

      if (attribute === "default") {
        option.default(...params);
      } else if (attribute === "hidden") {
        option.hideHelp(params);
      } else if (attribute === "choices") {
        option.choices(params);
      } else if (attribute === "env") {
        option.env(...params);
      } else if (attribute === "file") {
        option.argParser((val, previous) => {
          if (val === "-") {
            // read from stdin
            return fs.readFileSync(0, "utf-8");
          } else {
            // read from file
            return fs.readFileSync(val, "utf-8");
          }
        });
      } else {
        const method = option[attribute];
        method(params);
      }
    }
  });
  return option;
};

const parseParams = (command) => {
  try {
    const file = fs
      .readFileSync(path.join(DIR, `${command}.param`), "utf-8")
      .toString();
    return yaml.parse(file);
  } catch (e) {}
};

module.exports = {
  parseParams,
  addArgument,
  addOption,
};
