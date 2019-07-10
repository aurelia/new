const {
  FuseBox,
  HTMLPlugin,
  UglifyJSPlugin,
  QuantumPlugin,
  WebIndexPlugin,
  CSSPlugin/* @if babel */,
  Babel7Plugin/* @endif */ } = require("fuse-box");
const { src, task } = require("fuse-box/sparky");

let run = (production) => {
  const fuse = FuseBox.init({
    target: "browser@es5",
    homeDir: 'src',
    output: 'dist/$name.js',
    runAllMatchedPlugins: true,
    plugins: [
      production && UglifyJSPlugin(),
      production && QuantumPlugin(),
      // @if babel
      Babel7Plugin({configFile: '../.babelrc'}),
      HTMLPlugin({useDefault: false}),
      // @endif
      // @if typescript
      HTMLPlugin(),
      // @endif
      WebIndexPlugin({
        template: './index.html'
      }),
      CSSPlugin()
    ]
  });

  if (production) {
    fuse.bundle('app')
      // @if babel
      .instructions(">main.js");
      // @endif
      // @if typescript
      .instructions(">main.ts");
      // @endif
  } else {
    fuse.bundle("app")
      // @if babel
      .instructions(">main.js")
      // @endif
      // @if typescript
      .instructions(">main.ts")
      // @endif
      .hmr()
      .watch();
    fuse.dev({open: !process.env.CI});
  }

  return fuse.run();
};

task('clean', async () => await src('dist/*').clean('dist').exec());
task("dev", ['clean'], () => run(false));
task("prod", ['clean'], () => run(true));