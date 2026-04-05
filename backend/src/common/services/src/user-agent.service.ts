// Packages
import { UAParser } from "ua-parser-js";

export const SameUserAgent = (ua1: string, ua2: string): boolean => {
  try {
    const userAgentOne = new UAParser(ua1).getResult();
    const userAgentTwo = new UAParser(ua2).getResult();

    if (userAgentOne.browser.name !== userAgentTwo.browser.name) {
      return false;
    }

    if (userAgentOne.engine.name !== userAgentTwo.engine.name) {
      return false;
    }

    if (userAgentOne.os.name !== userAgentTwo.os.name) {
      return false;
    }

    if (userAgentOne.device.type !== userAgentTwo.device.type) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};
