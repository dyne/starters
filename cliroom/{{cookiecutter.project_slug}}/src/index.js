const { zencode_exec } = require("zenroom");
const fs = require("fs");
const path = require("path");
const { program } = require("commander");
const package = require("../package.json");
const u = require("./utils");
const { execute } = require("@dyne/zencode-chain");
const yaml = require("yaml");

const DIR = path.join(__dirname, "..", "contracts");
const ignore_list = ["^\\.", "\\.data$", "\\.keys$", "\\.param$"];
const rules = new RegExp(ignore_list.join("|"));
// const quoted = new RegExp(/'[^']*'/, "g");
const gradient = require("gradient-string");
const figlet = require("figlet");

const made_with = gradient.fruit
  .multiline(`           _____  .      _____  ______  _____   _____  _______
made with |       |        |   |_____/ |     | |     | |  |  |
          |_____  |_____ __|__ |    \\_ |_____| |_____| |  |  |
`);

const contracts = fs.readdirSync(DIR).filter((n) => !rules.test(n));

program
  .name(package.name)
  .version(package.version)
  .description(package.description)
  .addHelpText(
    "beforeAll",
    gradient.instagram(figlet.textSync(package.name, { font: "ANSI Shadow" }))
  )
  .addHelpText("before", made_with);

contracts.map((c) => {
  const contract = fs.readFileSync(path.join(DIR, c), "utf-8").toString();
  let chain;
  let isChain;
  try {
    chain = yaml.parse(contract);
    isChain = typeof chain === "object";
  } catch {
    isChain = false;
  }
  const command = program.command(c);
  if (isChain) {
    command.description(chain.description);
  }
  const config = u.parseParams(c);

  if (config) {
    command.description(config.description);
    if (config.arguments)
      config.arguments.map((a) => command.addArgument(u.addArgument(a)));

    if (config.options)
      config.options.map((o) => command.addOption(u.addOption(o)));
  }

  command.action(function () {
    if (isChain) {
      execute(chain)
        .then(({ result }) => console.log(result))
        .catch(({ logs }) => console.error(logs));
    } else {
      const params = {};
      const options = this.opts();

      if (Object.keys(options).length > 0) {
        params.data = { ...options };
      }

      if (this.args.length > 0) {
        params.data = { ...params.data, args: this.args };
      }

      try {
        const keys = fs
          .readFileSync(path.join(DIR, `${c}.keys`), "utf-8")
          .toString();
        params.keys = JSON.parse(keys);
      } catch (e) {}

      zencode_exec(contract, {
        data: JSON.stringify(params.data),
        keys: JSON.stringify(params.keys),
      })
        .then(({ result }) => console.log(result))
        .catch(({ logs }) => console.error(logs));
    }
  });
});

program.parse();
