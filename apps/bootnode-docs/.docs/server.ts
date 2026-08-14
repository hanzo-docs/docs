// @ts-nocheck
import { frontmatter as __fd_glob_13 } from "../content/docs/zap.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_12 } from "../content/docs/webhooks.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_11 } from "../content/docs/wallets.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_10 } from "../content/docs/tokens.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_9 } from "../content/docs/services.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_8 } from "../content/docs/sdks.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_7 } from "../content/docs/rpc.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_6 } from "../content/docs/observability.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_5 } from "../content/docs/nfts.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_4 } from "../content/docs/index.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_3 } from "../content/docs/gas.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_2 } from "../content/docs/fleets.mdx?collection=docs&only=frontmatter"
import { frontmatter as __fd_glob_1 } from "../content/docs/billing.mdx?collection=docs&only=frontmatter"
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

export const docs = await create.docsLazy("docs", "content/docs", {"meta.json": __fd_glob_0, }, {"billing.mdx": __fd_glob_1, "fleets.mdx": __fd_glob_2, "gas.mdx": __fd_glob_3, "index.mdx": __fd_glob_4, "nfts.mdx": __fd_glob_5, "observability.mdx": __fd_glob_6, "rpc.mdx": __fd_glob_7, "sdks.mdx": __fd_glob_8, "services.mdx": __fd_glob_9, "tokens.mdx": __fd_glob_10, "wallets.mdx": __fd_glob_11, "webhooks.mdx": __fd_glob_12, "zap.mdx": __fd_glob_13, }, {"billing.mdx": () => import("../content/docs/billing.mdx?collection=docs"), "fleets.mdx": () => import("../content/docs/fleets.mdx?collection=docs"), "gas.mdx": () => import("../content/docs/gas.mdx?collection=docs"), "index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "nfts.mdx": () => import("../content/docs/nfts.mdx?collection=docs"), "observability.mdx": () => import("../content/docs/observability.mdx?collection=docs"), "rpc.mdx": () => import("../content/docs/rpc.mdx?collection=docs"), "sdks.mdx": () => import("../content/docs/sdks.mdx?collection=docs"), "services.mdx": () => import("../content/docs/services.mdx?collection=docs"), "tokens.mdx": () => import("../content/docs/tokens.mdx?collection=docs"), "wallets.mdx": () => import("../content/docs/wallets.mdx?collection=docs"), "webhooks.mdx": () => import("../content/docs/webhooks.mdx?collection=docs"), "zap.mdx": () => import("../content/docs/zap.mdx?collection=docs"), });