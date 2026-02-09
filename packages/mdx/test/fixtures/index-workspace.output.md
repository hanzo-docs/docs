```ts title="server.ts"
// @ts-nocheck
import { server } from '@hanzo/docs-mdx/runtime/server';
import type * as Config from './config';

const create = server<typeof Config, import("@hanzo/docs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.doc("docs", "packages/mdx/test/fixtures/generate-index", {});
```

```ts title="dynamic.ts"
// @ts-nocheck
import { dynamic } from '@hanzo/docs-mdx/runtime/dynamic';
import * as Config from './config';

const create = await dynamic<typeof Config, import("@hanzo/docs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>(Config, {"configPath":"packages/mdx/test/fixtures/config.ts","environment":"test","outDir":"packages/mdx/test/fixtures"}, {"doc":{"passthroughs":["extractedReferences"]}});
```

```ts title="browser.ts"
// @ts-nocheck
import { browser } from '@hanzo/docs-mdx/runtime/browser';
import type * as Config from './config';

const create = browser<typeof Config, import("@hanzo/docs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {}),
};
export default browserCollections;
```

```ts title="test/server.ts"
// @ts-nocheck
import { server } from '@hanzo/docs-mdx/runtime/server';
import type * as Config from '../config';

const create = server<typeof Config, import("@hanzo/docs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docLazy("docs", "packages/mdx/test/fixtures/generate-index-2", {}, {});
```

```ts title="test/dynamic.ts"
// @ts-nocheck
import { dynamic } from '@hanzo/docs-mdx/runtime/dynamic';
import * as Config from '../config';

const create = await dynamic<typeof Config, import("@hanzo/docs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>(Config, {"configPath":"packages/mdx/test/fixtures/config.ts","environment":"test","outDir":"packages/mdx/test/fixtures/test"}, {"doc":{"passthroughs":["extractedReferences"]}});
```

```ts title="test/browser.ts"
// @ts-nocheck
import { browser } from '@hanzo/docs-mdx/runtime/browser';
import type * as Config from '../config';

const create = browser<typeof Config, import("@hanzo/docs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {}),
};
export default browserCollections;
```