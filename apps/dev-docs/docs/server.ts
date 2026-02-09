// @ts-nocheck
import { frontmatter as __fd_glob_33 } from "../content/docs/reference/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_32 } from "../content/docs/reference/cli.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_31 } from "../content/docs/usage/slash-commands.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_30 } from "../content/docs/usage/skills.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_29 } from "../content/docs/usage/settings.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_28 } from "../content/docs/usage/prompts.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_27 } from "../content/docs/usage/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_26 } from "../content/docs/usage/execpolicy.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_25 } from "../content/docs/usage/exec.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_24 } from "../content/docs/usage/auto-drive.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_23 } from "../content/docs/usage/agents.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_22 } from "../content/docs/usage/advanced.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_21 } from "../content/docs/integrations/zed.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_20 } from "../content/docs/integrations/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_19 } from "../content/docs/integrations/copilot.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_18 } from "../content/docs/getting-started/install.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_17 } from "../content/docs/getting-started/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_16 } from "../content/docs/getting-started/homebrew.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_15 } from "../content/docs/getting-started/authentication.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_14 } from "../content/docs/contributing/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_13 } from "../content/docs/contributing/cla.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_12 } from "../content/docs/configuration/sandbox.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_11 } from "../content/docs/configuration/platform-sandboxing.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_10 } from "../content/docs/configuration/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_9 } from "../content/docs/configuration/example-config.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_8 } from "../content/docs/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_7 } from "../content/docs/faq.mdx?collection=docs&only=frontmatter"
import { default as __fd_glob_6 } from "../content/docs/reference/meta.json?collection=docs"
import { default as __fd_glob_5 } from "../content/docs/usage/meta.json?collection=docs"
import { default as __fd_glob_4 } from "../content/docs/integrations/meta.json?collection=docs"
import { default as __fd_glob_3 } from "../content/docs/getting-started/meta.json?collection=docs"
import { default as __fd_glob_2 } from "../content/docs/contributing/meta.json?collection=docs"
import { default as __fd_glob_1 } from "../content/docs/configuration/meta.json?collection=docs"
import { default as __fd_glob_0 } from "../content/docs/meta.json?collection=docs"
import { server } from '@hanzo/docs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("@hanzo/docs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
    docs: {
      /**
       * extracted references (e.g. hrefs, paths), useful for analyzing relationships between pages.
       */
      extractedReferences: import("@hanzo/docs-mdx").ExtractedReference[];
    },
  }
} & {
  DocData: {
    docs: {
      /**
       * Last modified date of document file, obtained from version control.
       *
       */
      lastModified?: Date;
    },
  }
}>({"doc":{"passthroughs":["extractedReferences","lastModified"]}});

export const docs = await create.docsLazy("docs", "content/docs", {"meta.json": __fd_glob_0, "configuration/meta.json": __fd_glob_1, "contributing/meta.json": __fd_glob_2, "getting-started/meta.json": __fd_glob_3, "integrations/meta.json": __fd_glob_4, "usage/meta.json": __fd_glob_5, "reference/meta.json": __fd_glob_6, }, {"faq.mdx": __fd_glob_7, "index.mdx": __fd_glob_8, "configuration/example-config.mdx": __fd_glob_9, "configuration/index.mdx": __fd_glob_10, "configuration/platform-sandboxing.mdx": __fd_glob_11, "configuration/sandbox.mdx": __fd_glob_12, "contributing/cla.mdx": __fd_glob_13, "contributing/index.mdx": __fd_glob_14, "getting-started/authentication.mdx": __fd_glob_15, "getting-started/homebrew.mdx": __fd_glob_16, "getting-started/index.mdx": __fd_glob_17, "getting-started/install.mdx": __fd_glob_18, "integrations/copilot.mdx": __fd_glob_19, "integrations/index.mdx": __fd_glob_20, "integrations/zed.mdx": __fd_glob_21, "usage/advanced.mdx": __fd_glob_22, "usage/agents.mdx": __fd_glob_23, "usage/auto-drive.mdx": __fd_glob_24, "usage/exec.mdx": __fd_glob_25, "usage/execpolicy.mdx": __fd_glob_26, "usage/index.mdx": __fd_glob_27, "usage/prompts.mdx": __fd_glob_28, "usage/settings.mdx": __fd_glob_29, "usage/skills.mdx": __fd_glob_30, "usage/slash-commands.mdx": __fd_glob_31, "reference/cli.mdx": __fd_glob_32, "reference/index.mdx": __fd_glob_33, }, {"faq.mdx": () => import("../content/docs/faq.mdx?collection=docs"), "index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "configuration/example-config.mdx": () => import("../content/docs/configuration/example-config.mdx?collection=docs"), "configuration/index.mdx": () => import("../content/docs/configuration/index.mdx?collection=docs"), "configuration/platform-sandboxing.mdx": () => import("../content/docs/configuration/platform-sandboxing.mdx?collection=docs"), "configuration/sandbox.mdx": () => import("../content/docs/configuration/sandbox.mdx?collection=docs"), "contributing/cla.mdx": () => import("../content/docs/contributing/cla.mdx?collection=docs"), "contributing/index.mdx": () => import("../content/docs/contributing/index.mdx?collection=docs"), "getting-started/authentication.mdx": () => import("../content/docs/getting-started/authentication.mdx?collection=docs"), "getting-started/homebrew.mdx": () => import("../content/docs/getting-started/homebrew.mdx?collection=docs"), "getting-started/index.mdx": () => import("../content/docs/getting-started/index.mdx?collection=docs"), "getting-started/install.mdx": () => import("../content/docs/getting-started/install.mdx?collection=docs"), "integrations/copilot.mdx": () => import("../content/docs/integrations/copilot.mdx?collection=docs"), "integrations/index.mdx": () => import("../content/docs/integrations/index.mdx?collection=docs"), "integrations/zed.mdx": () => import("../content/docs/integrations/zed.mdx?collection=docs"), "usage/advanced.mdx": () => import("../content/docs/usage/advanced.mdx?collection=docs"), "usage/agents.mdx": () => import("../content/docs/usage/agents.mdx?collection=docs"), "usage/auto-drive.mdx": () => import("../content/docs/usage/auto-drive.mdx?collection=docs"), "usage/exec.mdx": () => import("../content/docs/usage/exec.mdx?collection=docs"), "usage/execpolicy.mdx": () => import("../content/docs/usage/execpolicy.mdx?collection=docs"), "usage/index.mdx": () => import("../content/docs/usage/index.mdx?collection=docs"), "usage/prompts.mdx": () => import("../content/docs/usage/prompts.mdx?collection=docs"), "usage/settings.mdx": () => import("../content/docs/usage/settings.mdx?collection=docs"), "usage/skills.mdx": () => import("../content/docs/usage/skills.mdx?collection=docs"), "usage/slash-commands.mdx": () => import("../content/docs/usage/slash-commands.mdx?collection=docs"), "reference/cli.mdx": () => import("../content/docs/reference/cli.mdx?collection=docs"), "reference/index.mdx": () => import("../content/docs/reference/index.mdx?collection=docs"), });