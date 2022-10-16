import * as dotenv from "dotenv";
import fs from "fs";
import * as yaml from "js-yaml";

function getConfig(): AppConfig {
  dotenv.config();
  return yaml.load(fs.readFileSync("config.yml", "utf8")) as AppConfig;
}

export const appConfig: AppConfig = getConfig();

export function setConfig(_config: AppConfig) {
  fs.writeFile("config.yml", yaml.dump(_config), (err) => {
    if (err) {
      console.log(err);
    }
  });
}
