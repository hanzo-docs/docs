// @ts-nocheck
import { browser } from '@hanzo/docs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("@hanzo/docs-mdx/runtime/types").InternalTypeConfig & {
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
}>();
const browserCollections = {
  docs: create.doc("docs", {"billing.mdx": () => import("../content/docs/billing.mdx?collection=docs"), "fleets.mdx": () => import("../content/docs/fleets.mdx?collection=docs"), "gas.mdx": () => import("../content/docs/gas.mdx?collection=docs"), "index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "nfts.mdx": () => import("../content/docs/nfts.mdx?collection=docs"), "observability.mdx": () => import("../content/docs/observability.mdx?collection=docs"), "rpc.mdx": () => import("../content/docs/rpc.mdx?collection=docs"), "sdks.mdx": () => import("../content/docs/sdks.mdx?collection=docs"), "services.mdx": () => import("../content/docs/services.mdx?collection=docs"), "tokens.mdx": () => import("../content/docs/tokens.mdx?collection=docs"), "wallets.mdx": () => import("../content/docs/wallets.mdx?collection=docs"), "webhooks.mdx": () => import("../content/docs/webhooks.mdx?collection=docs"), "zap.mdx": () => import("../content/docs/zap.mdx?collection=docs"), }),
};
export default browserCollections;