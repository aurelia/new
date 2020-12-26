import { fusebox, sparky } from "fuse-box";
import { wrapContents } from 'fuse-box/plugins/pluginStrings';
import { parsePluginOptions } from 'fuse-box/plugins/pluginUtils';
import { preprocess, preprocessOptions } from '@aurelia/plugin-conventions';

function pluginFoo(a, b) {
  let [opts, matcher] = parsePluginOptions(a, b, {
    defaultShadowOptions: null,
    useCSSModule: false
  });
  const allOptions = preprocessOptions(opts);
  return (ctx) => {
    ctx.ict.on('bundle_resolve_module', (props) => {
      if (!props.module.captured) {
        const module = props.module;

        if (!matcher.test(module.props.absPath)) {
          return;
        }
        // read the contents
        module.read();

        const result = preprocess(
          {
            path: module.props.absPath,
            contents: module.contents,
          },
          allOptions
        );

        if (result) {
          if (allOptions.templateExtensions.includes(file.extname)) {
            // Rewrite foo.html to foo.html.js, or foo.md to foo.md.js
            module.props.absPath += '.js';
          }

          module.contents = result.code;
          if (module.props.sourceMap) {
            // ignore existing source map for now
            module.props.sourceMap = result.map;
          }
        }
      }
      return props;
    });
  };
}

class Context {
  runServer;
  getConfig() {
    return fusebox({
      target: "browser",
      entry: "src/main./* @if babel */js/* @endif *//* @if typescript */ts/* @endif */",
      webIndex: {
        template: "index.html"
      },
      cache : true,
      devServer: this.runServer,
      plugins: [
        // @if shadow-dom
        // The other possible Shadow DOM mode is "closed".
        // If you turn on "closed" mode, there will be difficulty to perform e2e
        // tests (such as Cypress). Because shadowRoot is not accessible through
        // standard DOM APIs in "closed" mode.
        pluginFoo({defaultShadowOptions: {mode: 'open'}})
        // @endif
        // @if css-module
        pluginFoo({useCSSModule: true})
        // @endif
        // @if !shadow-dom && !css-module
        pluginFoo()
        // @endif
      ]
    });
  }
}
const { task } = sparky(Context);

task("default", async ctx => {
  ctx.runServer = true;
  const fuse = ctx.getConfig();
  await fuse.runDev();
});

task("preview", async ctx => {
  ctx.runServer = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: false });
});

task("build", async ctx => {
  ctx.runServer = false;
  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: false });
});
